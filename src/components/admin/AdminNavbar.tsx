import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/folders', label: 'Carpetas' },
    { path: '/admin/photos', label: 'Fotos' },
    { path: '/admin/payments', label: 'Pagos' },
  ];

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

        {/* Hamburger Menu Button */}
        <button 
          className="admin-mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
        
        <ul className={`admin-navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`admin-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={handleNavLinkClick}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Mobile Actions inside menu */}
          {mobileMenuOpen && (
            <div className="admin-navbar-actions mobile-actions">
              <a href="/" className="admin-back-button" onClick={handleNavLinkClick}>
                <svg className="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Volver al Sitio
              </a>
            </div>
          )}
        </ul>

        <div className="admin-navbar-actions desktop-actions">
          <a href="/" className="admin-back-button">
            <svg className="back-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al Sitio
          </a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="admin-mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default AdminNavbar;