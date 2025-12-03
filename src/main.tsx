import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const { worker } = await import('./api/mocks/browser')
    
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
      quiet: false,
    })
    
    console.log('🎭 MSW Started - Mock API is active')
    console.log('📍 Environment:', import.meta.env.MODE)
  } catch (error) {
    console.error('❌ Failed to start MSW:', error)
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
