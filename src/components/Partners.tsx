import React from 'react';
import './Partners.css';
import { useLanguage } from '../contexts/LanguageContext';

const Partners: React.FC = () => {
  const { t } = useLanguage();
  
  const partners = [
    { id: 1, name: 'Kalufa Surf', logo: '/KALUFA-SURF-600x202.png' },
    { id: 2, name: 'Lanzasurf', logo: '/Logo black with text Lanzasurf.jpg' },
    { id: 3, name: 'Volcano Surf School', logo: '/LogoVolcano2024.png' },
    { id: 4, name: 'Famara Surf Club', logo: '/logo_famara_surf_club2.svg' },
    { id: 5, name: 'Surf School Lanzarote', logo: '/Logotipo SSL.png' },
    { id: 6, name: 'Zoopark Surf School', logo: '/ZOOPARK surf school_negativo.svg' },
    { id: 7, name: 'Santa Surf School', logo: '/SSJ_con dirección.svg' },
    { id: 8, name: 'Red Star Surf', logo: '/Sin título-2.jpg' },
    { id: 9, name: 'Pro Center', logo: '/LOGO-PROCENTER-VERTICAL-w.png' },
    { id: 10, name: 'Cabra Naranja School', logo: '/LOGO_CABRA_NARANJA_SCHOOL.png' },
  ];

  return (
    <section className="partners">
      <div className="partners-container">
        <div className="partners-header">
          <h3 className="partners-title">{t.partners.title}</h3>
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