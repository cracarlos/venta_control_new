# AGENTS.md - Venta Control

Respondeme siempre en español.

Full-stack app: **Django REST Framework** (PostgreSQL) + **React + TypeScript** (Vite + Electron).

---

## Proyecto

- `Backend/` — Django 5.2, DRF 3.16, JWT (`djangorestframework_simplejwt`)
  - Apps: `core/` (BaseModel), `users/` (User personalizado), `products/`, `sales/`, `my_auth/` (login JWT personalizado), `tasa/` (tasas BCV vía Firebase)
- `Frontend/venta-control/` — React 19, Vite 7, SWC, TailwindCSS v4, shadcn/ui
  - También es app **Electron** (ver `electron/main.cjs`)

---

## Comandos

### Backend (Django)

```bash
cd Backend && source .venv/bin/activate
python manage.py runserver
python manage.py test                      # todos los tests
python manage.py test users.tests.tests_views  # archivo específico
python manage.py makemigrations && python manage.py migrate
python manage.py check
```

Base de datos: **SQLite por defecto** (local). **PostgreSQL** opcional configurando `DB_ENGINE=postgresql` en `.env`.

### Frontend (React + Vite + Electron)

```bash
cd Frontend/venta-control
npm install
npm run dev                                # Vite dev server
npm run build                              # tsc -b && vite build (typecheck + build)
npm run lint                               # ESLint
npm run build:backend                      # PyInstaller → ejecutable backend en Backend/dist/
npm run electron:dev                       # Vite + Electron dev (backend corre aparte)
npm run electron:build                     # build:backend + build + empaquetado .dmg (macOS)
npm run electron:build:win                 # build:backend + build + empaquetado .exe (Windows)
```

`npm run build` **siempre falla** si hay errores de TypeScript (`tsc -b` primero).

---

## Backend — particularidades

- **SQLite por defecto**, PostgreSQL opcional — el `settings.py` detecta `DB_ENGINE=postgresql` para usar PostgreSQL o `DB_ENGINE=sqlite` (o sin variable) para SQLite local. En modo empaquetado (Electron) siempre usa SQLite.
- **User model**: `users.User` (AbstractBaseUser), autentica por `email`.
- **JWT login** devuelve campos extra: `full_name`, `user_id`, `password_update`, `group_name`, `group_id`, `permissions[]` (ver `my_auth/serializers.py:MyTokenSerializer`).
- **BaseModel** en `core/models.py` — clase abstracta con `user_creation`, `user_update`, `created_at`, `updated_at`. Los modelos de negocio heredan de esta.
- **`crum` middleware** activo en settings (`CurrentRequestUserMiddleware`) pero **NO** está en `requirements.txt`. Usado en `products/models.py` para auto-asignar usuario en saves.
- **Firebase** para tasas BCV: `tasa/firebase.py` lee desde Firestore (`monedas/dolar`, `monedas/euro`). Endpoints públicos (`AllowAny`) en `api/v1/tasa/dolar/` y `api/v1/tasa/euro/`.
- **Reportes PDF** con ReportLab en `sales/views.py:SalesReportPdfView`.
- **Swagger** en `/api/docs/`, schema en `/api/schema/`.
- **Filtros** vía `django-filter`.
- **Locale**: `es-ve`, timezone `America/Caracas`.
- **API base**: `localhost:8000/api/v1/`.

### Endpoints clave

| Ruta | Descripción |
|---|---|
| `POST auth/login/` | Login JWT (devuelve access, refresh + user data) |
| `POST auth/logout/` | Blacklist refresh token |
| `GET/POST api/v1/users/` | CRUD usuarios (ViewSet) |
| `GET/POST api/v1/products/` | CRUD productos (ViewSet) |
| `GET/POST api/v1/sales/` | Ventas (APIView) — POST crea venta + descuenta stock |
| `GET api/v1/sales/dashboard/` | Estadísticas del dashboard |
| `GET api/v1/sales/report/pdf/` | PDF de reporte |
| `GET api/v1/tasa/dolar/` | Tasa BCV dólar (AllowAny) |
| `GET api/v1/tasa/euro/` | Tasa BCV euro (AllowAny) |

### Ojo: el endpoint `POST api/v1/sales/` tiene código muerto (líneas 86-116 inalcanzables tras el return en 81).

### Base de datos local (SQLite)

En modo empaquetado (Electron + PyInstaller):
- La BD se guarda en `app.getPath('userData')` → `~/Library/Application Support/Venta Control/venta-control.db`
- El backend se inicia automáticamente como `child_process` desde Electron
- Al cerrar la app, el backend se detiene (SIGTERM)
- Usuario por defecto: `admin@admin.com` / `admin`
- Backup/restore desde la UI en `/settings` (exporta/importa el archivo .db)

En desarrollo local con SQLite:
```bash
DB_ENGINE=sqlite python manage.py runserver
```

---

## Frontend — particularidades

- **Electron**: usa `HashRouter` (no BrowserRouter) y `base: './'` en vite.config porque Electron carga desde `file://`.
- **En producción, Electron lanza el backend** (`process.resourcesPath + '/backend/venta-control-backend'`) como `child_process` con `DB_PATH` apuntando a `userData`.
- **Electron** tiene `webSecurity: false` (llama a API localhost).
- **TypeScript strict**: `noUnusedLocals: true`, `noUnusedParameters: true`, `verbatimModuleSyntax: true` — importaciones de tipos requieren `import type`.
- **API client**: Axios con base URL hardcodeada `http://localhost:8000/api/v1/`. Token se inyecta desde `localStorage` via interceptor.
- **Redux Toolkit + redux-persist**: estado `auth` persiste en localStorage. Slice en `store/Auth/authSlice.ts`.
- **Store slices**: `auth`, `ui`, `user`, `product` — combinados en `store/rootReducer.tsx`.
- **shadcn/ui**: new-york style, slate base, CSS variables. Iconos con lucide-react.
- **`cn()`** de `@/lib/utils` para merge de clases Tailwind.
- **Notificaciones** con `sonner`.
- **Formularios** con `react-hook-form`.
- **Gráficos** con `recharts`.

### Convenciones de código

- Nombres: PascalCase para componentes, camelCase para hooks/servicios.
- Hooks con prefijo `use`.
- Tipos en `src/types/`, interfaces con `interface`, uniones con `type`.
- Import alias `@/` mapea a `src/`.

---

## Estado del repo

- README dice "En desarrollo".
- No hay CI/CD, no hay pre-commit hooks, no hay configuración OpenCode/Cursor.
- `.env` está versionado (incluye Firebase credenciales reales).
