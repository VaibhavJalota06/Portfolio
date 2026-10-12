import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Fade out the boot loader from index.html once the app has painted (shown at least ~700ms so it doesn't flash).
const loader = document.getElementById('boot-loader')
if (loader) {
  const wait = Math.max(0, 700 - performance.now())
  setTimeout(() => requestAnimationFrame(() => {
    loader.classList.add('done')
    setTimeout(() => loader.remove(), 500)
  }), wait)
}
