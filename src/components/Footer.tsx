import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Surf Photo Lanzarote</h4>
          <p>Marketplace premium de fotografía de surf en Lanzarote</p>
        </div>
        <div className="footer-section">
          <h4>Navegación</h4>
          <ul>
            <li><a href="#home">Inicio</a></li>
            <li><a href="#recognition">Reconocimiento</a></li>
            <li><a href="#gallery">Galería</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>hola@surfshot.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="https://instagram.com" title="Instagram">Instagram</a>
            <a href="https://facebook.com" title="Facebook">Facebook</a>
            <a href="https://twitter.com" title="Twitter">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Surf Photo Lanzarote. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;