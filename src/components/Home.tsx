import React from 'react';
import './Home.css';

interface HomeProps {
  onSelectSchool: (schoolName: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelectSchool }) => {
  const schools = [
    {
      id: 1,
      name: 'JMC SURFTRAINING',
      image: '/JMC-SURFTRAINING.jpg',
    },
    {
      id: 2,
      name: 'LANZAROTE SURF SCHOOL',
      image: '/LANZAROTE.jpg',
    },
    {
      id: 3,
      name: 'MAURI SURF',
      image: '/MAURI-SURF.JPG',
    },
    {
      id: 4,
      name: 'OTRAS',
      image: '/OTRAS.jpg',
    },
    {
      id: 5,
      name: 'REDSTAR',
      image: '/REDSTAR.JPG',
    },
    {
      id: 6,
      name: 'SANTA SURF PROCENTER',
      image: '/SANTASURF-PROCENTER.JPG',
    },
    {
      id: 7,
      name: 'VOLCANO',
      image: '/VOLCANO.jpg',
    },
    {
      id: 8,
      name: 'ZOOPARK',
      image: '/ZOOPARK.jpg',
    },
  ];

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
          <p className="hero-subtitle">Selecciona tu escuela, el día de tu sesión y accede a tus fotos en segundos.</p>
          <button className="btn btn-primary btn-large" onClick={() => {
            const schoolsSection = document.querySelector('.schools-section');
            schoolsSection?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Buscar mis fotos
          </button>
        </div>
      </section>

      {/* Acceso Rápido a Escuelas */}
      <section className="schools-section" id="schools">
        <div className="section-wrapper">
          <div className="schools-header-content">
            <h2 className="schools-intro-title">Tu escuela, tu día, tus fotos.</h2>
            <div className="schools-description">
              <p className="description-main">Selecciona la escuela con la que hiciste tu clase de surf.</p>
              <p className="description-secondary">
                Cada escuela tiene su propio espacio dentro de la web, donde encontrarás tus fotos organizadas por fecha.
              </p>
            </div>
          </div>
          <div className="schools-grid">
            {schools.map((school) => (
              <div 
                key={school.id} 
                className="school-card"
                onClick={() => onSelectSchool(school.name)}
              >
                <div className="school-image-wrapper">
                  <img 
                    src={school.image} 
                    alt={school.name}
                    className="school-image"
                  />
                  <div className="school-overlay"></div>
                </div>
                <h3 className="school-name">{school.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mensaje de Valor */}
      <section className="value-section">
        <div className="value-content">
          <p className="value-text">
            <span className="value-item">Fotos en alta calidad</span>
            <span className="value-separator">·</span>
            <span className="value-item">Descarga inmediata</span>
            <span className="value-separator">·</span>
            <span className="value-item">Pago seguro</span>
          </p>
        </div>
      </section>

      {/* Banner de Escuelas Colaboradoras */}
      <section className="partners-section">
        <div className="section-wrapper">
          <h3 className="partners-title">Escuelas colaboradoras</h3>
          <div className="partners-grid">
            <div className="partner-logo">
              <div className="logo-placeholder">Escuela 1</div>
            </div>
            <div className="partner-logo">
              <div className="logo-placeholder">Escuela 2</div>
            </div>
            <div className="partner-logo">
              <div className="logo-placeholder">Escuela 3</div>
            </div>
            <div className="partner-logo">
              <div className="logo-placeholder">Escuela 4</div>
            </div>
            <div className="partner-logo">
              <div className="logo-placeholder">Escuela 5</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;