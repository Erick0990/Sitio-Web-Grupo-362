//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.tsx'
import Login from './pages/Login/login.jsx'
import RegisterPage from './pages/Register/RegisterPage.jsx'
import AdminDashboard from './pages/AdminsScreens/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>,
)
