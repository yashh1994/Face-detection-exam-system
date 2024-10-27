import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CaptureFrame from './CaptureFrame.jsx'
import SignIn from './Pages/SigninPage/SigninPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SignIn />
  </StrictMode>,
)
