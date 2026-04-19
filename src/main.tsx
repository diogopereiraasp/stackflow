import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BankrollProvider } from './store/BankrollContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BankrollProvider>
      <App />
    </BankrollProvider>
  </React.StrictMode>,
)
