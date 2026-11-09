import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The boot loader from index.html: on the plain homepage AgencyHero turns it into the intro animation.
// Everywhere else (admin, policy pages, links straight to a section like /#work, reduced motion)
// fade it out once the app has painted.
const loader = document.getElementById('boot-loader')
const heroIntro = !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (loader && heroIntro) loader.dataset.intro = '1'
if (loader && !heroIntro) {
  const wait = Math.max(0, 700 - performance.now())
  setTimeout(() => requestAnimationFrame(() => {
    loader.classList.add('done')
    setTimeout(() => loader.remove(), 500)
  }), wait)
}
