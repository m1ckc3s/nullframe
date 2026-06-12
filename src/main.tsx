import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { bus } from './system/telemetry'
import './styles.css'

bus.start()
if (import.meta.hot) import.meta.hot.dispose(() => bus.stop())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
