// Project Nullframe
// Copyright (c) 2026 Mick Cesanek, MIT License
// https://github.com/m1ckc3s/nullframe

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
