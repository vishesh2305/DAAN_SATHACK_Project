// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider.jsx';
import { NotificationProvider } from './contexts/NotificationProvider.jsx'; // 1. IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <NotificationProvider> {/* 2. WRAP YOUR APP */}
          <App />
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)