import React, { useState, useEffect, useCallback } from 'react';
import './Schools.css';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface SchoolsProps {
  onSelectSchool: (schoolName: string) => void;
}

interface School {
  id: number;
  name: string;
  image: string;
  location: string;
  isOtras?: boolean;
}

const Schools: React.FC<SchoolsProps> = ({ onSelectSchool }) => {
  const { t } = useLanguage();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const getSchoolImage = useCallback((folderName: string): string => {
    // Mapear nombres de carpetas a imágenes
    const imageMap: { [key: string]: string } = {
      'REDSTAR': '/REDSTAR.JPG',
      'SANTA SURF PROCENTER': '/SANTASURF-PROCENTER.JPG',
      'LANZAROTE SURF SCHOOL': '/LANZAROTE.jpg',
      'ZOOPARK': '/ZOOPARK.jpg',
      'MAURI SURF': '/MAURI-SURF.JPG',
      'JMC SURFTRAINING': '/JMC-SURFTRAINING.jpg',
      'VOLCANO': '/VOLCANO.jpg',
      'Surf': '/REDSTAR.JPG', // Carpeta de ejemplo
    };

    return imageMap[folderName] || '/OTRAS.jpg';
  }, []);

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true);
      const folders = await apiService.getFolders();
      const cacheBust = Date.now();

      // Mapear carpetas del backend a escuelas; usar portada del API si existe
      const schoolsFromFolders: School[] = folders.map((folder: any, index: number) => ({
        id: index + 1,
        name: folder.name,
        image: folder.cover_image
          ? `${apiBaseUrl}/folders/cover/${encodeURIComponent(folder.name)}?t=${cacheBust}`
          : getSchoolImage(folder.name),
        location: 'Lanzarote',
        isOtras: false
      }));

      // Agregar "OTRAS ESCUELAS" al final
      schoolsFromFolders.push({
        id: schoolsFromFolders.length + 1,
        name: t.schools.otherSchools,
        image: '/OTRAS.jpg',
        location: 'Varias',
        isOtras: true
      });

      setSchools(schoolsFromFolders);
    } catch (error) {
      console.error('Error loading schools:', error);
      // Fallback a escuelas estáticas si falla
      setSchools([
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
          name: t.schools.otherSchools,
          image: '/OTRAS.jpg',
          location: 'Varias',
          isOtras: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [getSchoolImage, t.schools.otherSchools, apiBaseUrl]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  if (loading) {
    return (
      <div className="schools-page">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading-spinner"></div>
          <p>{t.schools.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schools-page">
      {/* Sección de Escuelas */}
      <section className="schools-section-main">
        <div className="section-wrapper">
          <div className="schools-header-content">
            <h2 className="schools-intro-title">{t.schools.introTitle}</h2>
            <div className="schools-description">
              <p className="description-main">{t.schools.descriptionMain}</p>
              <p className="description-secondary">
                {t.schools.descriptionSecondary}
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
                <h3 className={`school-name ${school.isOtras ? 'school-name-otras' : ''}`}>
                  {school.isOtras ? (
                    <>
                      {school.name.split(' ').map((word, index) => (
                        <span key={index} className="otras-line">{word}</span>
                      ))}
                    </>
                  ) : (
                    school.name
                  )}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mensaje de Valor */}
      <section className="value-section">
        <div className="value-content">
          <p className="value-text">
            <span className="value-item">{t.schools.valueHighQuality}</span>
            <span className="value-separator">·</span>
            <span className="value-item">{t.schools.valueInstantDownload}</span>
            <span className="value-separator">·</span>
            <span className="value-item">{t.schools.valueSecurePayment}</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Schools;