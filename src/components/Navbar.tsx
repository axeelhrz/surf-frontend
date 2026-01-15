import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determinar la sección activa basada en la ruta actual
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/schools') return 'schools';
    if (path === '/how-it-works') return 'how-it-works';
    if (path === '/about-me') return 'sobre-mi';
    if (path === '/pricing') return 'pricing';
    if (path === '/faqs') return 'faqs';
    return '';
  };

  const activeSection = getActiveSection();

  // Cerrar menú de idiomas al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLanguageMenu]);

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    setMobileMenuOpen(false);
    onCartClick();
  };

  const navItems = [
    { id: 'schools', label: t.navbar.schools, path: '/schools' },
    { id: 'how-it-works', label: t.navbar.howItWorks, path: '/how-it-works' },
    { id: 'sobre-mi', label: t.navbar.aboutMe, path: '/about-me' },
    { id: 'pricing', label: t.navbar.pricing, path: '/pricing' },
    { id: 'faqs', label: t.navbar.faqs, path: '/faqs' },
  ];

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-brand">
          <img src="/image.png" alt="Logo" className="brand-logo" />
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className="mobile-menu-button"
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
        
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <Link 
                to={item.path} 
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={handleNavLinkClick}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Mobile Actions inside menu */}
          {mobileMenuOpen && (
            <div className="navbar-actions">
              {/* Selector de idiomas */}
              <div className="language-selector">
                <button 
                  className="language-button"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <span className="language-flag">
                    {languages.find(lang => lang.code === language)?.flag}
                  </span>
                  <span className="language-code">{language.toUpperCase()}</span>
                  <svg 
                    className={`language-arrow ${showLanguageMenu ? 'open' : ''}`}
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none"
                  >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                {showLanguageMenu && (
                  <div className="language-menu">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`language-option ${language === lang.code ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(lang.code as 'es' | 'en')}
                      >
                        <span className="language-flag">{lang.flag}</span>
                        <span className="language-label">{lang.label}</span>
                        {language === lang.code && (
                          <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="cart-button" onClick={handleCartClick}>
                <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {t.navbar.memories}
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            </div>
          )}
        </ul>

        <div className={`navbar-actions desktop-actions ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Selector de idiomas */}
          <div className="language-selector">
            <button 
              className="language-button"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <span className="language-flag">
                {languages.find(lang => lang.code === language)?.flag}
              </span>
              <span className="language-code">{language.toUpperCase()}</span>
              <svg 
                className={`language-arrow ${showLanguageMenu ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {showLanguageMenu && (
              <div className="language-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code as 'es' | 'en')}
                  >
                    <span className="language-flag">{lang.flag}</span>
                    <span className="language-label">{lang.label}</span>
                    {language === lang.code && (
                      <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6 11L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="cart-button" onClick={handleCartClick}>
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {t.navbar.memories}
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;