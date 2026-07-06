import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './store/store'
import { config } from './config/config'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/SocketContext'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
          <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
)
