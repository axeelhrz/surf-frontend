import React, { useState, useEffect, useCallback } from 'react';
import './SchoolDays.css';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface SchoolDaysProps {
  schoolName: string;
  onBack: () => void;
  onSelectDay: (date: string) => void;
}

interface DayData {
  date: string;
  photo_count: number;
}

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const staticHeroFallback: Record<string, string> = {
  'SANTA SURF PROCENTER': '/SANTASURF-PROCENTER.JPG',
  'MAURI SURF': '/MAURI-SURF.JPG',
  'RED STAR': '/REDSTAR.JPG',
  REDSTAR: '/REDSTAR.JPG',
  'JMC SURF TRAINING': '/JMC-SURFTRAINING.jpg',
  LANZAROTE: '/LANZAROTE.jpg',
  VOLCANO: '/VOLCANO.jpg',
  ZOOPARK: '/ZOOPARK.jpg',
  OTRAS: '/OTRAS.jpg',
  'OTRAS ESCUELAS': '/OTRAS.jpg',
};

const SchoolDays: React.FC<SchoolDaysProps> = ({ schoolName, onBack, onSelectDay }) => {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hero: portada del API (GET es más fiable que HEAD); si falla, foto aleatoria de la carpeta; OTRAS.jpg solo para "OTRAS ESCUELAS"
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const coverUrl = `${apiBaseUrl}/folders/cover/${encodeURIComponent(schoolName)}`;
        const res = await fetch(coverUrl, { method: 'GET' });
        if (res.ok) {
          setHeroImage(`${coverUrl}?t=${Date.now()}`);
          return;
        }
        const listRes = await fetch(`${apiBaseUrl}/photos/list?folder_name=${encodeURIComponent(schoolName)}`);
        if (listRes.ok) {
          const data = await listRes.json();
          if (data.photos && data.photos.length > 0) {
            const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
            setHeroImage(`${apiBaseUrl}/photos/preview?folder_name=${encodeURIComponent(schoolName)}&filename=${encodeURIComponent(randomPhoto.filename)}&watermark=false`);
            return;
          }
        }
        const upper = schoolName.toUpperCase();
        const fallback = (upper === 'OTRAS ESCUELAS' || upper === 'OTRAS')
          ? '/OTRAS.jpg'
          : (staticHeroFallback[upper] || '/OTRAS.jpg');
        setHeroImage(fallback);
      } catch {
        const upper = schoolName.toUpperCase();
        setHeroImage((upper === 'OTRAS ESCUELAS' || upper === 'OTRAS') ? '/OTRAS.jpg' : (staticHeroFallback[upper] || '/OTRAS.jpg'));
      }
    };
    fetchHeroImage();
  }, [schoolName]);

  const [availableDays, setAvailableDays] = useState<Array<{
    date: string;
    displayDate: string;
    photoCount: number;
    thumbnailUrl: string;
  }>>([]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const locale = language === 'es' ? 'es-ES' : 'en-GB';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [language]);

  // Cargar días disponibles desde el backend; thumbnailUrl = portada del día (API)
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
            thumbnailUrl: `${apiBaseUrl}/folders/${encodeURIComponent(schoolName)}/day-cover/${encodeURIComponent(day.date)}`,
          }));

          setAvailableDays(formattedDays);
        } else {
          setAvailableDays([]);
        }
      } catch (err) {
        console.error('Error loading days:', err);
        setError(t.schoolDays.errorLoadingDays);
        setAvailableDays([]);
      } finally {
        setLoading(false);
      }
    };

    loadDays();
  }, [schoolName, formatDate, t.schoolDays.errorLoadingDays]);

  const handleDateSearch = () => {
    if (selectedDate) {
      const found = availableDays.find(day => day.date === selectedDate);
      if (found) {
        onSelectDay(selectedDate);
      } else {
        alert(t.schoolDays.noPhotosForDate);
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
            ← {t.schoolDays.back}
          </button>
          <h1 className="school-hero-title">{schoolName}</h1>
        </div>
      </div>

      <div className="school-days-content">
        {/* Búsqueda por fecha */}
        <div className="date-search-section">
          <h2>{t.schoolDays.searchByDate}</h2>
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
              {t.schoolDays.search}
            </button>
          </div>
        </div>

        {/* Listado de días */}
        <div className="days-section">
          <h2>{t.schoolDays.availableDays}</h2>
          <p className="days-subtitle">{t.schoolDays.selectDaySubtitle}</p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem', color: '#718096' }}>{t.schoolDays.loadingDays}</p>
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
                {t.schoolDays.noDaysYet}
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {t.schoolDays.noDaysDesc}
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
                  <div className="day-image-wrapper">
                    <img
                      src={day.thumbnailUrl}
                      alt=""
                      className="day-card-cover-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = heroImage || '/OTRAS.jpg';
                      }}
                    />
                    <div className="day-image-overlay"></div>
                    <div className="day-image-info">
                      <span className="photo-count">{day.photoCount}</span>
                      <span className="photo-label">{t.schoolDays.photos}</span>
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