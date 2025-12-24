import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">
          Bienvenido a Surf Photo Lanzarote
        </div>
        <h1 className="hero-title">Captura Tu Momento Perfecto</h1>
        <p className="hero-description">
          Descubre y compra fotografías premium de surf con tecnología de reconocimiento facial avanzada
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => document.getElementById('recognition')?.scrollIntoView({behavior: 'smooth'})}>
            Encuentra Tus Fotos
          </button>
          <button className="btn btn-secondary" onClick={() => document.getElementById('gallery')?.scrollIntoView({behavior: 'smooth'})}>
            Explorar Galería
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">500+</div>
            <div className="stat-label">Fotos Premium</div>
          </div>
          <div className="stat">
            <div className="stat-number">98%</div>
            <div className="stat-label">Precisión IA</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Disponible</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;