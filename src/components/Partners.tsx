import React from 'react';
import './Partners.css';

const Partners: React.FC = () => {
  const partners = [
    { id: 1, name: 'Santa Surf Pro Center', logo: '/SANTASURF-PROCENTER.JPG' },
    { id: 2, name: 'Mauri Surf', logo: '/MAURI-SURF.JPG' },
    { id: 3, name: 'Red Star', logo: '/REDSTAR.JPG' },
    { id: 4, name: 'Calima Surf', logo: '/CALIMA.JPG' },
    // Agregar más escuelas según sea necesario
  ];

  return (
    <section className="partners">
      <div className="partners-container">
        <div className="partners-header">
          <h3 className="partners-title">Escuelas Colaboradoras</h3>
        </div>
        
        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <div className="partner-logo-wrapper">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="partner-logo"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;