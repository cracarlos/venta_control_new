import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// react-redux
import { Provider } from 'react-redux'
// redux-persist
import { PersistGate } from 'redux-persist/integration/react'
// App
import './index.css'
import App from './App.tsx'
import { persistor, store } from './store/store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Cargando...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
