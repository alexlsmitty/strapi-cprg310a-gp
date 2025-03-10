// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './AuthContext';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a0e7e5', // Match your mint green variable
    },
    secondary: {
      main: '#ffb6c1', // Match your pink variable
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
