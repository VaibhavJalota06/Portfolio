import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The boot loader from index.html: on the homepage AgencyHero turns it into the intro animation.
// Everywhere else (admin, policy pages, reduced motion) fade it out once the app has painted.
const loader = document.getElementById('boot-loader')
const NOT_HOME = ['#cutframe-admin', '#privacy', '#terms', '#refund', '#grievance']
const heroIntro = !NOT_HOME.includes(window.location.hash) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (loader && heroIntro) loader.dataset.intro = '1'
if (loader && !heroIntro) {
  const wait = Math.max(0, 700 - performance.now())
  setTimeout(() => requestAnimationFrame(() => {
    loader.classList.add('done')
    setTimeout(() => loader.remove(), 500)
  }), wait)
}
