import React, { useState, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'how-it-works', 'pricing', 'schools'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'schools', label: 'Escuelas', href: '#schools' },
    { id: 'how-it-works', label: 'Cómo funciona', href: '#how-it-works' },
    { id: 'pricing', label: 'Precios', href: '#pricing' },
    { id: 'about', label: 'Sobre mí', href: '#about' },
    { id: 'faqs', label: 'FAQs', href: '#faqs' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar-brand">
          <img src="/image.png" alt="Logo" className="brand-logo" />
          <span className="brand-text">Surf Photo</span>
        </div>
        
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.id}>
              <a 
                href={item.href} 
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        
        <button className="cart-button" onClick={onCartClick}>
          Carrito
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;