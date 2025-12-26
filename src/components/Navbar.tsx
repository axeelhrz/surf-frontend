import React from 'react';
import './Navbar.css';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar-brand">
          <img src="/image.png" alt="Logo" className="brand-logo" />
          <span className="brand-text">Surf Photo</span>
        </div>
        
        <ul className="navbar-menu">
          <li><a href="#home" className="nav-link">Inicio</a></li>
          <li><a href="#how-it-works" className="nav-link">Cómo funciona</a></li>
          <li><a href="#pricing" className="nav-link">Precios</a></li>
          <li><a href="#schools" className="nav-link">Escuelas</a></li>
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