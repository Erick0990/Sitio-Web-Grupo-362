# Proyecto Grupo Scout 362 - Refactorización React

Este proyecto ha sido refactorizado desde un prototipo estático HTML/CSS a una aplicación web moderna utilizando React, TypeScript y Vite.

## Estructura del Proyecto

El proyecto sigue una arquitectura de diseño atómico (Atomic Design):

```
src/
├── components/
│   ├── atoms/       # Componentes básicos (Button, Input)
│   ├── molecules/   # Componentes compuestos (SectionCard, NavLink)
│   ├── organisms/   # Bloques complejos (Navbar, Footer)
│   └── templates/   # Layouts de página (MainLayout)
├── pages/           # Páginas completas (Home, Login, Dashboard)
├── context/         # Estado global (AuthContext)
├── assets/          # Imágenes y recursos estáticos
└── main.tsx         # Punto de entrada
```

## Tecnologías

-   **Framework:** Vite + React
-   **Lenguaje:** TypeScript
-   **Estilos:** Tailwind CSS (configurado con los tokens de diseño originales)
-   **Animaciones:** Framer Motion
-   **Enrutamiento:** React Router DOM

## Comandos

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm run preview
```

## Notas de Migración

-   Los archivos originales (HTML/CSS) se han movido a la carpeta `legacy_prototype/` para referencia.
-   Se han extraído los tokens de diseño de `style.css` y se han configurado en `tailwind.config.js`.
-   La autenticación es simulada (mock) en `AuthContext`.
