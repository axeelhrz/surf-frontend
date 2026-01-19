import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApiService, DayFolder } from '../../services/adminApi';
import './AdminPage.css';

const FolderDetailPage: React.FC = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const [days, setDays] = useState<DayFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDayModal, setShowCreateDayModal] = useState(false);
  const [newDayDate, setNewDayDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadDays = async () => {
    if (!folderName) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getFolderDays(decodeURIComponent(folderName));
      setDays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando días');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (folderName) {
      loadDays();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderName]);

  const handleCreateDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayDate.trim() || !folderName) return;

    try {
      setCreating(true);
      await adminApiService.createDayFolder(decodeURIComponent(folderName), newDayDate);
      setShowCreateDayModal(false);
      setNewDayDate('');
      await loadDays();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creando día');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenCoverModal = (dayDate: string) => {
    setSelectedDay(dayDate);
    setCoverFile(null);
    setShowCoverModal(true);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleUploadCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !selectedDay || !folderName) return;

    try {
      setUploading(true);
      await adminApiService.setDayCover(decodeURIComponent(folderName), selectedDay, coverFile);
      setShowCoverModal(false);
      setCoverFile(null);
      setSelectedDay(null);
      await loadDays();
      alert('Portada del día actualizada correctamente');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error subiendo portada');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando días...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <button 
              onClick={() => navigate('/admin/folders')} 
              className="btn-secondary"
              style={{ marginBottom: '1rem' }}
            >
              ← Volver a Carpetas
            </button>
            <h1>Días en {decodeURIComponent(folderName || '')}</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Gestiona los días y fotos de esta carpeta
            </p>
          </div>
          <button onClick={() => setShowCreateDayModal(true)} className="btn-primary">
            + Nuevo Día
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="admin-content">
          {days.length === 0 ? (
            <div className="empty-state">
              <p>No hay días creados en esta carpeta</p>
              <button onClick={() => setShowCreateDayModal(true)} className="btn-primary">
                Crear primer día
              </button>
            </div>
          ) : (
            <div className="days-grid">
              {days.map((day) => (
                <div key={day.date} className="day-card">
                  <div className="day-card-header">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="day-card-body">
                    <h3 className="day-card-date">{day.date}</h3>
                    <p className="day-card-formatted">{formatDate(day.date)}</p>
                    <div className="day-card-stats">
                      <span className="stat-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        {day.photo_count} fotos
                      </span>
                    </div>
                  </div>
                  <div className="day-card-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => navigate(`/admin/photos?folder=${encodeURIComponent(folderName || '')}&day=${day.date}`)}
                      style={{ flex: 1 }}
                    >
                      Ver Fotos
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleOpenCoverModal(day.date)}
                      style={{ flex: 1 }}
                    >
                      Portada
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cover Modal */}
        {showCoverModal && (
          <div className="modal-overlay" onClick={() => setShowCoverModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Asignar Portada al Día</h2>
                <button className="modal-close" onClick={() => setShowCoverModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUploadCover}>
                <div className="form-group">
                  <label className="form-label">Día: {selectedDay}</label>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                    Esta imagen se mostrará como portada del día en la galería
                  </p>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    required
                  />
                  {coverFile && (
                    <div style={{ marginTop: '1rem' }}>
                      <img 
                        src={URL.createObjectURL(coverFile)} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }} 
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCoverModal(false)}
                    className="btn-secondary"
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Subiendo...' : 'Subir Portada'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Day Modal */}
        {showCreateDayModal && (
          <div className="modal-overlay" onClick={() => setShowCreateDayModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Nuevo Día</h2>
                <button className="modal-close" onClick={() => setShowCreateDayModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateDay}>
                <div className="form-group">
                  <label className="form-label">Fecha del día</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDayDate}
                    onChange={(e) => setNewDayDate(e.target.value)}
                    required
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                    Selecciona la fecha para organizar las fotos de ese día
                  </small>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateDayModal(false)}
                    className="btn-secondary"
                    disabled={creating}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={creating}>
                    {creating ? 'Creando...' : 'Crear Día'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .day-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .day-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }

        .day-card-header {
          background: linear-gradient(135deg, #B24A3B 0%, #8a3a2d 100%);
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .day-card-body {
          padding: 1.5rem;
        }

        .day-card-date {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }

        .day-card-formatted {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 1rem;
          text-transform: capitalize;
        }

        .day-card-stats {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f5f5f5;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
        }

        .stat-badge svg {
          width: 16px;
          height: 16px;
        }

        .day-card-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e0e0e0;
          display: flex;
          gap: 0.5rem;
        }

        .day-card-actions .btn-primary {
          flex: 1;
          padding: 0.75rem;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #f9f9f9;
          border-radius: 8px;
          border: 2px dashed #e0e0e0;
        }

        .empty-state p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default FolderDetailPage;