const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const http = require('http')

const isDev = !app.isPackaged || process.env.NODE_ENV === 'development'

const BACKEND_PORT = 8000
const BACKEND_HOST = '127.0.0.1'

let backendProcess = null
let splashWindow = null

function getBackendPath() {
    if (process.platform === 'win32') {
        return path.join(process.resourcesPath, 'backend', 'venta-control-backend.exe')
    }
    return path.join(process.resourcesPath, 'backend', 'venta-control-backend')
}

function getUserDataPath() {
    return app.getPath('userData')
}

function createSplashWindow() {
    const splash = new BrowserWindow({
        width: 420,
        height: 240,
        frame: false,
        resizable: false,
        center: true,
        show: false,
        backgroundColor: '#0a1c16',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #0a1c16 0%, #0f2b22 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    color: #d1fae5;
    padding: 40px 48px 32px;
    user-select: none;
}
.logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(245,158,11,0.3);
}
.logo-icon svg { width: 22px; height: 22px; }
.logo { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 2px; }
.subtitle { font-size: 12px; opacity: 0.55; margin-bottom: 28px; }
.progress-track {
    width: 100%;
    background: rgba(255,255,255,0.08);
    border-radius: 50px;
    height: 5px;
    overflow: hidden;
}
.progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #10b981, #f59e0b);
    border-radius: 50px;
    transition: width 0.35s ease-out;
}
.status {
    margin-top: 14px;
    font-size: 11.5px;
    opacity: 0.65;
    letter-spacing: 0.2px;
}
</style>
</head>
<body>
<div class="logo-icon">
<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
</svg>
</div>
<div class="logo">Venta Control</div>
<div class="subtitle">Sistema de control de ventas</div>
<div class="progress-track">
<div class="progress-fill" id="bar"></div>
</div>
<div class="status" id="status">Iniciando...</div>
</body>
</html>`

    splash.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    splash.once('ready-to-show', () => splash.show())

    return splash
}

function updateSplash(splash, percent, text) {
    if (splash && !splash.isDestroyed()) {
        splash.webContents.executeJavaScript(
            `document.getElementById('bar').style.width='${percent}%';` +
            `document.getElementById('status').textContent='${text}'`
        ).catch(() => {})
    }
}

function closeSplash() {
    if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close()
        splashWindow = null
    }
}

function showFatalError(splash, title, message) {
    closeSplash()
    setTimeout(() => {
        dialog.showErrorBox(title, message)
        stopBackend()
        app.quit()
    }, 200)
}

function waitForBackend(retries = 180, delay = 1000) {
    return new Promise((resolve, reject) => {
        function check(attempt) {
            const req = http.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/api/schema/`, (res) => {
                resolve()
            })
            req.on('error', () => {
                if (attempt >= retries) {
                    reject(new Error(`Backend no respondió después de ${retries} intentos (${Math.round(retries * delay / 1000)}s)`))
                } else {
                    setTimeout(() => check(attempt + 1), delay)
                }
            })
            req.setTimeout(3000, () => {
                req.destroy()
                if (attempt >= retries) {
                    reject(new Error(`Backend timeout después de ${retries} intentos`))
                } else {
                    setTimeout(() => check(attempt + 1), delay)
                }
            })
        }
        check(1)
    })
}

function startBackend(splash) {
    const backendPath = getBackendPath()
    const userDataPath = getUserDataPath()
    const dbPath = path.join(userDataPath, 'venta-control.db')
    const mediaPath = path.join(userDataPath, 'media')

    if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath, { recursive: true })
    }

    console.log('[Electron] Starting backend:', backendPath)
    console.log('[Electron] DB path:', dbPath)
    console.log('[Electron] Media path:', mediaPath)

    updateSplash(splash, 5, 'Verificando entorno...')

    if (!fs.existsSync(backendPath)) {
        console.error('[Electron] Backend not found at:', backendPath)
        showFatalError(splash, 'Error de instalación',
            `No se encontró el servidor backend en:\n${backendPath}\n\nReinstala la aplicación.`)
        return
    }

    if (process.platform !== 'win32') {
        try {
            fs.chmodSync(backendPath, 0o755)
        } catch (e) {
            console.error('[Electron] chmod failed:', e.message)
        }
    }

    updateSplash(splash, 10, 'Lanzando servidor...')

    backendProcess = spawn(backendPath, [], {
        env: {
            ...process.env,
            PYTHONUNBUFFERED: '1',
            ...(process.platform === 'win32' && { PYTHONLEGACYWINDOWSSTDIO: '1' }),
            DB_PATH: dbPath,
            MEDIA_ROOT: mediaPath,
            BACKEND_PORT: String(BACKEND_PORT),
            DB_ENGINE: 'sqlite',
        },
        stdio: ['pipe', 'pipe', 'pipe'],
    })

    updateSplash(splash, 15, 'Inicializando...')

    backendProcess.stdout.on('data', (data) => {
        const text = data.toString().trim()
        console.log(`[Backend] ${text}`)

        if (text.includes('migrations')) {
            updateSplash(splash, 35, 'Ejecutando migraciones de base de datos...')
        } else if (text.includes('admin')) {
            updateSplash(splash, 55, 'Creando usuario administrador...')
        } else if (text.includes('sales types')) {
            updateSplash(splash, 75, 'Configurando tipos de venta...')
        } else if (text.includes('Starting server')) {
            updateSplash(splash, 90, 'Iniciando servidor...')
        }
    })

    backendProcess.stderr.on('data', (data) => {
        const text = data.toString().trim()
        console.error(`[Backend] ${text}`)
        updateSplash(splash, 5, `Error: ${text.substring(0, 60)}`)
    })

    backendProcess.on('error', (err) => {
        console.error('[Electron] Failed to start backend:', err.message)
        showFatalError(splash, 'Error al iniciar backend',
            `No se pudo ejecutar el servidor backend.\n${err.message}`)
    })

    backendProcess.on('exit', (code) => {
        console.log(`[Electron] Backend exited with code ${code}`)
        backendProcess = null
        if (code !== 0 && splashWindow) {
            showFatalError(splash, 'Error en backend',
                `El servidor backend terminó inesperadamente (código ${code}).\nRevisa los permisos e intenta de nuevo.`)
        }
    })
}

function stopBackend() {
    if (backendProcess) {
        console.log('[Electron] Stopping backend...')
        if (process.platform === 'win32') {
            try {
                require('child_process').execSync(
                    `taskkill /pid ${backendProcess.pid} /f /t`,
                    { timeout: 5000 }
                )
            } catch (e) {
                try {
                    require('child_process').execSync(
                        'taskkill /f /im venta-control-backend.exe',
                        { timeout: 5000 }
                    )
                } catch (_) {}
            }
        } else {
            backendProcess.kill('SIGTERM')
            setTimeout(() => {
                if (backendProcess) {
                    backendProcess.kill('SIGKILL')
                }
            }, 5000)
        }
        backendProcess = null
    }
}

const iconPath = isDev
    ? path.join(__dirname, '../src/assets/logo-iniciales.png')
    : path.join(process.resourcesPath, 'app/dist/assets/logo-iniciales.png')

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
        },
        icon: iconPath,
        show: false,
    })

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html')
        console.log('Loading:', indexPath)
        win.loadFile(indexPath, { baseURL: 'file://' + path.join(__dirname, '../dist') })
    }

    win.once('ready-to-show', () => win.show())

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorCode, errorDescription)
    })

    win.webContents.on('did-finish-load', () => {
        console.log('Page loaded successfully')
    })
}

app.whenReady().then(async () => {
    if (!isDev) {
        splashWindow = createSplashWindow()
        await new Promise(resolve => setTimeout(resolve, 300))

        startBackend(splashWindow)

        try {
            console.log('[Electron] Waiting for backend...')
            await waitForBackend(180)
            console.log('[Electron] Backend is ready')
            updateSplash(splashWindow, 100, 'Listo')
            await new Promise(resolve => setTimeout(resolve, 400))
            closeSplash()
        } catch (err) {
            console.error('[Electron] Backend failed to start:', err.message)
            showFatalError(splashWindow, 'Error de inicio',
                `No se pudo iniciar el servidor backend de Venta Control.\n\n${err.message}\n\nVerifica que:\n• No haya otro programa usando el puerto ${BACKEND_PORT}\n• La aplicación tenga permisos de ejecución\n• No haya algún antivirus bloqueando la ejecución`)
            return
        }
    }
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('before-quit', () => {
    stopBackend()
})

process.on('exit', () => {
    stopBackend()
})
