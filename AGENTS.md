# AGENTS.md - Venta Control Development Guide

Full-stack app with **Django REST Framework backend** + **React + TypeScript frontend** (Vite).

---

## 1. Project Structure

```
/Backend/               # Django REST API
  manage.py           # Django management script
  requirements.txt    # Python dependencies
  venta_control/     # Django project settings
  core/, users/, products/, sales/, my_auth/  # Django apps

/Frontend/venta-control/  # React + TypeScript + Vite
  src/
    api/            # Axios API client
    components/    # React components (UI + feature)
    hooks/         # Custom React hooks
    lib/           # Utilities (utils.ts)
    pages/         # Page components
    routes/        # Router configuration
    services/      # API service functions
    store/         # Redux store (auth, users, UI slices)
    types/         # TypeScript type definitions
```

---

## 2. Build / Lint / Test Commands

### Backend (Django)

```bash
cd Backend && source .venv/bin/activate

python manage.py runserver          # Run development server
python manage.py test               # Run all tests
python manage.py test users         # Run tests for specific app
python manage.py test users.tests.tests_views  # Run specific test file
python manage.py makemigrations     # Create migrations
python manage.py migrate            # Apply migrations
python manage.py check              # Check for issues
```

### Frontend (React + TypeScript + Vite)

```bash
cd Frontend/venta-control

npm install        # Install dependencies
npm run dev        # Run development server
npm run build      # Build for production
npm run lint       # Lint code
npm run preview    # Preview production build
```

---

## 3. Code Style Guidelines

### Frontend (TypeScript + React)

#### Imports
- Use absolute imports with `@/` prefix
- Order: external libs → internal modules → local components
  ```typescript
  import { useState } from 'react'
  import { useNavigate } from 'react-router'
  import api from '@/api/Api'
  import { type AuthLogin } from '@/types/auth'
  import { useAuthStore } from '@/hooks/useAuthStore'
  import { Button } from '@/components/ui/button'
  ```

#### Naming
- **Files**: PascalCase (components), camelCase (hooks, services)
- **Components**: PascalCase (`AuthPage`)
- **Hooks**: `use` prefix (`useAuthStore`)
- **Types/Interfaces**: PascalCase with type suffix (`interface AuthState`)

#### Types
- Avoid `any` - use strict typing
- Define types in `/src/types/`
- Use `type` for unions, `interface` for objects

#### Error Handling
```typescript
try {
  const resp = await api.post<AuthApi>('auth/login/', authDate)
  return resp.data
} catch (error: any) {
  if (error.response) throw error.response.data
  throw new Error("Error de red o servidor no disponible")
}
```

#### State Management
- Use Redux Toolkit with slices in `/src/store/[Feature]/[featureSlice].ts`
- Export selectors with `select` prefix

#### UI Components
- Use shadcn/ui patterns with `cva` for variants
- Use `cn()` from `@/lib/utils` for class merging

#### Formatting
- 2 spaces indentation, no semicolons, single quotes, trailing commas

---

### Backend (Django)

#### Python
- PEP 8, 4 spaces indentation
- Descriptive variable names (English or Spanish)

#### Models (models.py)
```python
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### Tests
```python
class UsersIntegrataionsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(email="test@example.com", ...)
        self.client.force_authenticate(user=self.user)

    def test_get_list_users(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

---

## 4. API Endpoints

Backend: `http://localhost:8000/api/v1/`
- `POST auth/login/` - Login
- `POST auth/logout/` - Logout
- `GET/POST users/` - User CRUD
- `GET/POST products/` - Product management
- `GET/POST sales/` - Sales management

---

## 5. Notes

- Frontend: **TailwindCSS v4** + `@tailwindcss/vite`
- Backend: **JWT** via `djangorestframework_simplejwt`
- Venezuelan context: uses `cedula_rif` for identification
- No existing Cursor/Copilot rules found
