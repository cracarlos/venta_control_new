const { app, BrowserWindow } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

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
    })

    if (isDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        const indexPath = path.join(__dirname, '../dist/index.html')
        console.log('Loading:', indexPath)
        win.loadFile(indexPath, { baseURL: 'file://' + path.join(__dirname, '../dist') })
    }

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Failed to load:', errorCode, errorDescription)
    })

    win.webContents.on('did-finish-load', () => {
        console.log('Page loaded successfully')
    })
}

app.whenReady().then(createWindow)

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