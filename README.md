# Chasky Dojo - Frontend

Frontend Vue 3 para el portal de instructores de Chasky Dojo. Arquitectura escalable y modular.

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 4**
- **Pinia** (state management)
- **Vite 5**
- **Tailwind CSS 3**
- **Axios**

## Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── common/       # Botones, inputs, cards...
│   ├── layout/       # Sidebar, Header, layouts
│   └── dashboard/    # Componentes específicos del dashboard
├── composables/      # Lógica reutilizable (useApi, useAuth...)
├── layouts/          # AuthLayout, ShojiLayout, AppLayout
├── router/           # Configuración de rutas
├── services/         # API clients y servicios
│   └── api/
├── stores/           # Stores de Pinia
├── styles/           # CSS global
└── views/            # Vistas por módulo
    ├── auth/         # Login, Recuperar contraseña, etc.
    └── dashboard/
```

## Desarrollo

```bash
npm install
npm run dev
```

El frontend corre en `http://localhost:3000`. El proxy apunta a la API Laravel en `http://localhost:8000`.

## Build

```bash
npm run build
```

## Variables de entorno

Crear `.env` basado en `.env.example`:

```
VITE_API_URL=http://localhost:8000
```

## Rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/login` | Login | Inicio de sesión |
| `/recuperar-contrasena` | RecuperarContrasena | Recuperación por email |
| `/definir-credenciales` | DefinirCredenciales | Nueva contraseña |
| `/acceso-autorizado` | AccesoAutorizado | Página de redirección |
| `/` | Dashboard | Panel principal (requiere auth) |
