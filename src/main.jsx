import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initResponsiveBehavior } from './utils/responsive'

if (localStorage.getItem("dark_mode") === "true") {
  document.documentElement.classList.add("dark")
}

// Incializa comportamento responsivo
initResponsiveBehavior()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)