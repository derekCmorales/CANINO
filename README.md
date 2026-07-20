# Portal Canino 🐾

Plataforma web full-stack para gestionar el ciclo de vida completo de perros: salud, nutrición, crecimiento, memorias, memorial y más.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, React Query |
| Backend | NestJS 11, TypeORM, Passport JWT |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker Compose |
| Documentación API | Swagger |

## Inicio rápido con Docker

```bash
# 1. Clonar y configurar
cp .env.example .env

# 2. Levantar stack completo (web + api + postgres)
docker compose up --build

# 3. Cargar datos de prueba (en otra terminal)
docker compose exec api npm run seed
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| Swagger | http://localhost:3001/api/docs |

## Desarrollo local (sin Docker)

### Requisitos

- Node.js 20+
- PostgreSQL 16

### Configuración

```bash
cp .env.example .env
# Editar DATABASE_URL si es necesario
npm install
```

### Base de datos

Crear la base de datos PostgreSQL:

```sql
CREATE DATABASE dogportal;
CREATE USER portal WITH PASSWORD 'portal';
GRANT ALL PRIVILEGES ON DATABASE dogportal TO portal;
```

### Ejecutar

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Frontend
npm run dev:web

# Terminal 3 — Seed (primera vez)
npm run seed
```

## Usuarios de prueba (seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Dueño | derek@email.com | Demo1234! |
| Veterinario | dr.smith@vet.com | Vet1234! |
| Super Admin | admin@portal.com | Admin1234! |
| Gestor catálogos | catalogos@portal.com | Catalog1234! |
| Operaciones | soporte@portal.com | Soporte1234! |

## Estructura del monorepo

```
/
├── apps/
│   ├── api/          # NestJS — REST API + Swagger
│   └── web/          # Next.js — UI en español
├── docker-compose.yml
├── PLAN_IMPLEMENTACION.md
└── README.md
```

## API — Endpoints principales

Base URL: `/api/v1`  
Formato: `{ success, data, error, meta }`

| Módulo | Endpoints |
|--------|-----------|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` |
| Perros | `CRUD /dogs`, `/dogs/:id/timeline`, `/dogs/:id/origin`, `/dogs/:id/baptism` |
| Salud | `GET/POST /dogs/:id/health`, `PATCH /health/:recordId` |
| Nutrición | `/dogs/:id/nutrition/plans`, `/dogs/:id/nutrition/meals` |
| Crecimiento | `/dogs/:id/growth/weight`, `/dogs/:id/growth/exercise` |
| Memorias | `CRUD /dogs/:id/memories` |
| Memorial | `PUT/GET /dogs/:id/memorial` |
| Notificaciones | `GET /notifications`, `PATCH /notifications/:id/read` |
| Admin | `/admin/stats`, `/admin/audit-logs`, `/admin/breeds`, `/admin/vaccine-types` |
| Archivos | `POST /files/upload`, `GET /files/:filename` |

Documentación interactiva completa: **http://localhost:3001/api/docs**

## Pantallas del frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública |
| `/login`, `/register` | Autenticación |
| `/dashboard` | Panel del dueño |
| `/dogs`, `/dogs/new`, `/dogs/[id]/*` | Gestión de perros y módulos |
| `/notifications` | Centro de notificaciones |
| `/vet/*` | Panel veterinario |
| `/admin/*` | Paneles administrativos por sub-rol |

## Roles y permisos

- **Dueño (`owner`)**: CRUD de sus perros y todo su historial
- **Veterinario (`veterinarian`)**: Lectura global + registro de salud
- **Admin (`admin`)**: Lectura global + permisos según sub-rol:
  - `super_admin` → Panel general, usuarios, catálogos, auditoría
  - `catalog_manager` → Catálogos (razas, vacunas)
  - `operations` → Usuarios y auditoría

## Variables de entorno

Ver `.env.example` para la lista completa. Las más importantes:

```env
DATABASE_URL=postgresql://portal:portal@localhost:5432/dogportal
JWT_SECRET=change-me-in-production
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
WHATSAPP_MOCK=true
```

## Scripts

```bash
npm run dev:api      # API en modo desarrollo
npm run dev:web      # Frontend en modo desarrollo
npm run build:api    # Compilar API
npm run build:web    # Compilar frontend
npm run seed         # Cargar datos de prueba
npm run docker:up    # Docker Compose up --build
```

## Licencia

Proyecto académico — Sexto Semestre Web.
