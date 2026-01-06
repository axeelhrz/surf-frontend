import React from 'react';
import './Schools.css';

interface SchoolsProps {
  onSelectSchool: (schoolName: string) => void;
}

const Schools: React.FC<SchoolsProps> = ({ onSelectSchool }) => {
  const schools = [
    {
      id: 1,
      name: 'REDSTAR',
      image: '/REDSTAR.JPG',
      location: 'Lanzarote',
    },
    {
      id: 2,
      name: 'SANTA SURF PROCENTER',
      image: '/SANTASURF-PROCENTER.JPG',
      location: 'Lanzarote',
    },
    {
      id: 3,
      name: 'LANZAROTE SURF SCHOOL',
      image: '/LANZAROTE.jpg',
      location: 'Lanzarote',
    },
    {
      id: 4,
      name: 'ZOOPARK',
      image: '/ZOOPARK.jpg',
      location: 'Lanzarote',
    },
    {
      id: 5,
      name: 'MAURI SURF',
      image: '/MAURI-SURF.JPG',
      location: 'Lanzarote',
    },
    {
      id: 6,
      name: 'JMC SURFTRAINING',
      image: '/JMC-SURFTRAINING.jpg',
      location: 'Lanzarote',
    },
    {
      id: 7,
      name: 'VOLCANO',
      image: '/VOLCANO.jpg',
      location: 'Lanzarote',
    },
    {
      id: 8,
      name: 'OTRAS ESCUELAS',
      image: '/OTRAS.jpg',
      location: 'Varias',
      isOtras: true,
    },
  ];

  return (
    <div className="schools-page">
      {/* Sección de Escuelas */}
      <section className="schools-section-main">
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
                className={`school-card ${school.isOtras ? 'school-card-otras' : ''}`}
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
                {school.isOtras ? (
                  <h3 className="school-name school-name-otras">
                    <span className="otras-line">OTRAS</span>
                    <span className="otras-line">ESCUELAS</span>
                  </h3>
                ) : (
                  <h3 className="school-name">{school.name}</h3>
                )}
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
    </div>
  );
};

export default Schools;