import React, { useState, useEffect } from 'react';
import './SchoolDays.css';

interface SchoolDaysProps {
  schoolName: string;
  onBack: () => void;
  onSelectDay: (date: string) => void;
}

const SchoolDays: React.FC<SchoolDaysProps> = ({ schoolName, onBack, onSelectDay }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('');
  
  // Mock data - en producción esto vendría del backend
  // Cargar una foto aleatoria de la escuela para el hero desde /public
  useEffect(() => {
    // Mapeo de nombres de escuelas a sus imágenes en /public
    const schoolImages: { [key: string]: string } = {
      'SANTA SURF PROCENTER': '/SANTASURF-PROCENTER.JPG',
      'MAURI SURF': '/MAURI-SURF.JPG',
      'RED STAR': '/REDSTAR.JPG',
      'JMC SURF TRAINING': '/JMC-SURFTRAINING.jpg',
      'LANZAROTE': '/LANZAROTE.jpg',
      'VOLCANO': '/VOLCANO.jpg',
      'ZOOPARK': '/ZOOPARK.jpg',
      'OTRAS': '/OTRAS.jpg',
    };

    // Buscar la imagen correspondiente a la escuela
    const imageUrl = schoolImages[schoolName] || schoolImages['OTRAS'];
    setHeroImage(imageUrl);
  }, [schoolName]);

  const [availableDays, setAvailableDays] = useState<Array<{
    date: string;
    displayDate: string;
    photoCount: number;
    thumbnailUrl: string;
  }>>([]);

  // Cargar días disponibles con fotos desde /public
  useEffect(() => {
    // Fotos disponibles en /public
    const publicPhotos = [
      '7N5A0084.jpg', '7N5A0210.jpg', '7N5A0291.jpg', '7N5A0474.jpg',
      '7N5A0508.jpg', '7N5A0698.jpg', '7N5A0773.jpg', '7N5A0879.jpg',
      '7N5A0896.jpg', '7N5A1324.jpg', '7N5A1361.jpg', '7N5A1974 2.jpg',
      '7N5A2536.jpg', '7N5A2664 3.jpg', '7N5A2753.jpg', '7N5A3893.jpg',
      '7N5A4158.jpg', '7N5A4172.jpg', '7N5A4862.jpg', '7N5A6137.jpg',
      '7N5A6375.jpg', '7N5A6400.jpg', '7N5A6981.jpg', '7N5A7096.jpg',
      '7N5A7254.jpg', '7N5A7532.jpg', '7N5A7986.jpg', '7N5A8030.jpg',
      '7N5A8280.jpg', '7N5A8516 2.jpg', '7N5A8540.jpg', '7N5A8618.jpg',
      '7N5A8633.jpg', '7N5A9209.jpg', '7N5A9778.jpg', '7N5A9881.jpg',
      '_DSC9090-2.jpg', '_DSC9513.jpg', '_DSC9536.jpg'
    ];

    // Crear días mock con fotos reales
    const mockDays = [
      { 
        date: '2024-01-15', 
        displayDate: '15 de Enero, 2024', 
        photoCount: 45,
        thumbnailUrl: `/${publicPhotos[0]}`
      },
      { 
        date: '2024-01-14', 
        displayDate: '14 de Enero, 2024', 
        photoCount: 38,
        thumbnailUrl: `/${publicPhotos[5]}`
      },
      { 
        date: '2024-01-13', 
        displayDate: '13 de Enero, 2024', 
        photoCount: 52,
        thumbnailUrl: `/${publicPhotos[10]}`
      },
      { 
        date: '2024-01-12', 
        displayDate: '12 de Enero, 2024', 
        photoCount: 41,
        thumbnailUrl: `/${publicPhotos[15]}`
      },
      { 
        date: '2024-01-11', 
        displayDate: '11 de Enero, 2024', 
        photoCount: 36,
        thumbnailUrl: `/${publicPhotos[20]}`
      },
      { 
        date: '2024-01-10', 
        displayDate: '10 de Enero, 2024', 
        photoCount: 48,
        thumbnailUrl: `/${publicPhotos[25]}`
      },
    ];

    setAvailableDays(mockDays);
  }, [schoolName]);

  const handleDateSearch = () => {
    if (selectedDate) {
      const found = availableDays.find(day => day.date === selectedDate);
      if (found) {
        onSelectDay(selectedDate);
      } else {
        alert('No hay fotos disponibles para esa fecha');
      }
    }
  };

  return (
    <div className="school-days">
      {/* Hero Section con imagen de fondo */}
      <div className="school-hero" style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none' }}>
        <div className="school-hero-overlay"></div>
        <div className="school-hero-content">
          <button className="btn-back-hero" onClick={onBack}>
            ← Volver
          </button>
          <h1 className="school-hero-title">{schoolName}</h1>
        </div>
      </div>

      <div className="school-days-content">
        {/* Búsqueda por fecha */}
        <div className="date-search-section">
          <h2>Buscar por fecha</h2>
          <div className="date-search-container">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <button 
              className="btn btn-primary"
              onClick={handleDateSearch}
              disabled={!selectedDate}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Listado de días */}
        <div className="days-section">
          <h2>Días disponibles</h2>
          <p className="days-subtitle">Selecciona un día para ver todas las fotos</p>
          
          <div className="days-grid">
            {availableDays.map((day) => (
              <div 
                key={day.date}
                className="day-card"
                onClick={() => onSelectDay(day.date)}
              >
                <div 
                  className="day-image-wrapper"
                  style={{ 
                    backgroundImage: day.thumbnailUrl ? `url(${day.thumbnailUrl})` : 'none'
                  }}
                >
                  <div className="day-image-overlay"></div>
                  <div className="day-image-info">
                    <span className="photo-count">{day.photoCount}</span>
                    <span className="photo-label">fotos</span>
                  </div>
                </div>
                <div className="day-info">
                  <h3 className="day-date">{day.displayDate}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDays;