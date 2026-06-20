import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css'
import './personal-os/theme/fonts.css'
import './personal-os/theme/personal-os.css'
import './index.css'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
