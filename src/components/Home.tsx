import React from 'react';
import './Home.css';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();

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
          <h1 className="hero-title">{t.home.title}</h1>
          <h2 className="hero-subtitle">
            {t.home.subtitle}
          </h2>
          <button className="btn btn-primary btn-large" onClick={() => {
            window.location.href = '/schools';
          }}>
            {t.home.cta}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;