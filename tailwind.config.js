/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004a99',
          dark: '#003366',
        },
        secondary: {
          DEFAULT: '#4caf50',
          dark: '#388e3c',
        },
        accent: '#ffcc00',
        admin: {
          green: '#00e676',
          hover: '#00c853',
        },
        dark: '#1e293b',
        gray: '#64748b',
        light: '#f8fafc',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0,0,0,0.05)',
        md: '0 10px 30px rgba(0,0,0,0.08)',
        lg: '0 25px 50px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
