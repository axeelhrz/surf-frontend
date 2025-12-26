import React, { useState } from 'react';
import './SchoolDays.css';

interface SchoolDaysProps {
  schoolName: string;
  onBack: () => void;
  onSelectDay: (date: string) => void;
}

const SchoolDays: React.FC<SchoolDaysProps> = ({ schoolName, onBack, onSelectDay }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Mock data - en producción esto vendría del backend
  const availableDays = [
    { date: '2024-01-15', displayDate: '15 de Enero, 2024', photoCount: 45 },
    { date: '2024-01-14', displayDate: '14 de Enero, 2024', photoCount: 38 },
    { date: '2024-01-13', displayDate: '13 de Enero, 2024', photoCount: 52 },
    { date: '2024-01-12', displayDate: '12 de Enero, 2024', photoCount: 41 },
    { date: '2024-01-11', displayDate: '11 de Enero, 2024', photoCount: 36 },
    { date: '2024-01-10', displayDate: '10 de Enero, 2024', photoCount: 48 },
  ];

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
      <div className="school-days-header">
        <button className="btn-back" onClick={onBack}>
          ← Volver
        </button>
        <h1>{schoolName}</h1>
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
                <div className="day-image-wrapper">
                  <div className="day-image-placeholder">
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