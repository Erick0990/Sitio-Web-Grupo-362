import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Sitio-Web-Grupo-362/",  // <--- ¡ESTA LÍNEA ES LA MAGIA! AGREGA ESTO.
})
