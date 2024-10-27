import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CaptureFrame from './CaptureFrame.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptureFrame />
  </StrictMode>,
)
