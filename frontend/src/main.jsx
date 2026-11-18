import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/index.css';

// Auto-seed development mock user session for browser testing if unauthenticated
if (typeof window !== 'undefined' && !localStorage.getItem('sparkomind_token')) {
  localStorage.setItem('sparkomind_token', 'mock_token');
  localStorage.setItem('sparkomind_user', JSON.stringify({ id: 1, name: 'Jagadeesh Pinniboina', demographic: 'adults' }));
  localStorage.setItem('sparkomind_remember_session', 'true');
  sessionStorage.setItem('sparkomind_session_active', 'true');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
