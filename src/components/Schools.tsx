import React from 'react';
import './Schools.css';

interface SchoolsProps {
  onSelectSchool: (schoolName: string) => void;
}

const Schools: React.FC<SchoolsProps> = ({ onSelectSchool }) => {
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
    <div className="schools-page">
      <div className="schools-header">
        <h1 className="schools-title">Tu escuela, tu día, tus fotos.</h1>
        <div className="schools-description">
          <p className="description-main">Selecciona la escuela con la que hiciste tu clase de surf.</p>
          <p className="description-secondary">
            Cada escuela tiene su propio espacio dentro de la web, donde encontrarás tus fotos organizadas por fecha.
          </p>
        </div>
      </div>

      <div className="schools-container">
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
    </div>
  );
};

export default Schools;