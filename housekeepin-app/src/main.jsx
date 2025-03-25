// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProviderComponent } from './components/Theme/themeContext';
import { AuthProvider } from './auth/AuthContext';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ThemeProviderComponent>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProviderComponent>
</React.StrictMode>,
document.getElementById('root')
);
