import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  try {
    const { worker } = await import('./api/mocks/browser')
    return await worker.start({
      onUnhandledRequest: 'bypass',
    })
  } catch (error) {
    console.error('Failed to enable mocking:', error)
    return Promise.resolve() 
  }
}

enableMocking().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
