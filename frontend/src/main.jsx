import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './contexts/auth.context.jsx'
import { UserCardContextProvider } from './contexts/user.card.context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <UserCardContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </UserCardContextProvider>
  // </React.StrictMode>
)
