# Grupo Scout 362 - Plataforma Web

Esta es la plataforma web oficial del Grupo Scout 362, desarrollada con React, TypeScript, Vite y Tailwind CSS. Utiliza Supabase para la autenticación y base de datos.

## 🚀 Requisitos Previos

-   Node.js (v18+)
-   Cuenta en [Supabase](https://supabase.com/)

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repo>
cd Sitio-Web-Grupo-362
npm install
```

### 2. Configurar Supabase

1.  Crea un nuevo proyecto en Supabase.
2.  Ve a **Project Settings > API** y copia la `URL` y la `anon public key`.
3.  Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example` si existe, o crea uno nuevo) con el siguiente contenido:

```env
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Configurar la Base de Datos

El proyecto incluye un script SQL para configurar las tablas y políticas de seguridad necesarias.

1.  En el panel de Supabase, ve a **SQL Editor**.
2.  Crea una nueva consulta (New Query).
3.  Copia y pega el contenido del archivo `db_schema.sql` ubicado en la raíz de este proyecto.
4.  Ejecuta la consulta (**Run**).

Esto creará:
-   La tabla `profiles` vinculada a `auth.users`.
-   Políticas de seguridad (RLS) para proteger los datos.
-   Un trigger que asigna automáticamente el rol `parent` a nuevos usuarios.
-   Una lógica especial para asignar el rol `admin` al correo `erickgonzalezmatarrita@hotmail.com`.

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## 👥 Gestión de Usuarios (Auth & Roles)

El registro público está desactivado. Los usuarios deben ser invitados o creados desde el panel de Supabase.

### Cómo invitar usuarios:

1.  Ve a **Authentication > Users** en el panel de Supabase.
2.  Haz clic en **Invite User**.
3.  Ingresa el correo electrónico del padre o dirigente.
4.  El usuario recibirá un correo para establecer su contraseña.

### Asignación de Roles:

-   **Admin:** El usuario `erickgonzalezmatarrita@hotmail.com` se convertirá automáticamente en `admin` al registrarse/iniciar sesión por primera vez.
-   **Padres:** Cualquier otro usuario tendrá el rol `parent` por defecto.
-   **Cambio manual de rol:** Puedes cambiar el rol de un usuario editando la tabla `profiles` en el **Table Editor** de Supabase (columna `role`: 'admin' o 'parent').

## 📂 Estructura del Proyecto

-   `src/components`: Componentes reutilizables (Atomic Design).
-   `src/pages`: Vistas principales (Home, Login, Dashboards).
-   `src/context`: Manejo del estado global (AuthContext).
-   `src/supabaseClient.ts`: Cliente de conexión a Supabase.
-   `db_schema.sql`: Script de configuración de base de datos.
-   `legacy_prototype/`: Archivos HTML/CSS originales (referencia histórica).

## 📦 Despliegue

El proyecto está configurado para desplegarse en GitHub Pages u otros servicios estáticos.

Para construir la versión de producción:

```bash
npm run build
```
