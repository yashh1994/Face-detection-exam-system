import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './Pages/Components/Header.jsx'
import { AuthProvider } from './Auth/AuthContext.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider />
    <App />
    <AuthProvider />
  </StrictMode>,
)
