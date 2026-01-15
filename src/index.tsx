import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './AdminApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Determinar si estamos en la ruta de admin
const isAdminRoute = window.location.pathname.startsWith('/admin');

root.render(
  <React.StrictMode>
    {isAdminRoute ? <AdminApp /> : <App />}
  </React.StrictMode>
);