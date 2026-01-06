import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Principal */}
      <section className="hero-section">
        <div className="hero-background">
          <img 
            src="/home.jpg" 
            alt="Surf en Lanzarote" 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Encuentra tus fotos de surf en Lanzarote</h1>
          <p className="hero-subtitle">
            Usa reconocimiento facial para encontrar tus fotos de surf en segundos. 
            Selecciona tu escuela, sube un selfie y descarga tus recuerdos al instante.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => {
            window.location.href = '/schools';
          }}>
            Buscar mis fotos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;