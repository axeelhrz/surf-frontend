import React, { useState, useEffect } from 'react';
import './SchoolDays.css';
import { apiService } from '../services/api';

interface SchoolDaysProps {
  schoolName: string;
  onBack: () => void;
  onSelectDay: (date: string) => void;
}

interface DayData {
  date: string;
  photo_count: number;
}

const SchoolDays: React.FC<SchoolDaysProps> = ({ schoolName, onBack, onSelectDay }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar imagen de hero
  useEffect(() => {
    const schoolImages: { [key: string]: string } = {
      'SANTA SURF PROCENTER': '/SANTASURF-PROCENTER.JPG',
      'MAURI SURF': '/MAURI-SURF.JPG',
      'RED STAR': '/REDSTAR.JPG',
      'REDSTAR': '/REDSTAR.JPG',
      'JMC SURF TRAINING': '/JMC-SURFTRAINING.jpg',
      'LANZAROTE': '/LANZAROTE.jpg',
      'VOLCANO': '/VOLCANO.jpg',
      'ZOOPARK': '/ZOOPARK.jpg',
      'OTRAS': '/OTRAS.jpg',
      'OTRAS ESCUELAS': '/OTRAS.jpg',
    };

    const imageUrl = schoolImages[schoolName.toUpperCase()] || schoolImages['OTRAS'];
    setHeroImage(imageUrl);
  }, [schoolName]);

  const [availableDays, setAvailableDays] = useState<Array<{
    date: string;
    displayDate: string;
    photoCount: number;
    thumbnailUrl: string;
  }>>([]);

  // Cargar días disponibles desde el backend
  useEffect(() => {
    const loadDays = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getFolderDays(schoolName);
        
        if (response.days && response.days.length > 0) {
          const formattedDays = response.days.map((day: DayData) => ({
            date: day.date,
            displayDate: formatDate(day.date),
            photoCount: day.photo_count,
            thumbnailUrl: getFirstPhotoThumbnail()
          }));
          
          setAvailableDays(formattedDays);
        } else {
          setAvailableDays([]);
        }
      } catch (err) {
        console.error('Error loading days:', err);
        setError('Error al cargar los días disponibles');
        setAvailableDays([]);
      } finally {
        setLoading(false);
      }
    };

    loadDays();
  }, [schoolName]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  const getFirstPhotoThumbnail = (): string => {
    // Retornar una imagen placeholder o la primera foto del día
    // Por ahora usamos un placeholder
    return heroImage;
  };

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
              disabled={!selectedDate || loading}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Listado de días */}
        <div className="days-section">
          <h2>Días disponibles</h2>
          <p className="days-subtitle">Selecciona un día para encontrar tus fotos</p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem', color: '#718096' }}>Cargando días disponibles...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error" style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          ) : availableDays.length === 0 ? (
            <div className="alert alert-info" style={{ 
              background: '#e3f2fd', 
              color: '#1976d2', 
              padding: '2rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                No hay días disponibles para esta escuela todavía.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Las fotos se organizan por día. Vuelve pronto para ver nuevas sesiones.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolDays;