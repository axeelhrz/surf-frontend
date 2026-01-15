import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-wrapper">
        <Link to="/admin" className="admin-navbar-brand">
          <img 
            src={`${process.env.PUBLIC_URL}/image.png`}
            alt="SurfShot Logo" 
            className="admin-brand-logo"
          />
        </Link>
        
        <ul className="admin-navbar-menu">
          <li>
            <Link
              to="/admin"
              className={`admin-nav-link ${isActive('/admin') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/folders"
              className={`admin-nav-link ${isActive('/admin/folders') ? 'active' : ''}`}
            >
              Carpetas
            </Link>
          </li>
          <li>
            <Link
              to="/admin/photos"
              className={`admin-nav-link ${isActive('/admin/photos') ? 'active' : ''}`}
            >
              Fotos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/payments"
              className={`admin-nav-link ${isActive('/admin/payments') ? 'active' : ''}`}
            >
              Pagos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/reports"
              className={`admin-nav-link ${isActive('/admin/reports') ? 'active' : ''}`}
            >
              Reportes
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
            >
              Configuración
            </Link>
          </li>
        </ul>

        <div className="admin-navbar-actions">
          <Link to="/" className="admin-back-button">
            Volver al Sitio
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;