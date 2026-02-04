import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApiService, Folder, DayFolder } from '../../services/adminApi';
import './AdminPage.css';

interface Photo {
  filename: string;
  size: number;
  created_at: string;
}

const PhotosPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [days, setDays] = useState<DayFolder[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>(searchParams.get('folder') || '');
  const [selectedDay, setSelectedDay] = useState<string>(searchParams.get('day') || '');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingDays, setLoadingDays] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const photosBeforeUploadRef = useRef<Photo[]>([]);

  const loadFolders = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApiService.getFolders();
      setFolders(data);
      
      // Si hay folder en URL, usarlo
      const folderParam = searchParams.get('folder');
      if (folderParam && data.some(f => f.name === folderParam)) {
        setSelectedFolder(folderParam);
      } else if (data.length > 0 && !selectedFolder) {
        setSelectedFolder(data[0].name);
      }
    } catch (err) {
      console.error('Error loading folders:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, selectedFolder]);

  const loadDays = React.useCallback(async () => {
    if (!selectedFolder) return;
    
    try {
      setLoadingDays(true);
      const data = await adminApiService.getFolderDays(selectedFolder);
      setDays(data);
      
      // Si hay day en URL, usarlo
      const dayParam = searchParams.get('day');
      if (dayParam && data.some(d => d.date === dayParam)) {
        setSelectedDay(dayParam);
      } else if (data.length > 0 && !selectedDay) {
        setSelectedDay(data[0].date);
      }
    } catch (err) {
      console.error('Error loading days:', err);
      setDays([]);
    } finally {
      setLoadingDays(false);
    }
  }, [selectedFolder, selectedDay, searchParams]);

  const folderPath = selectedFolder && selectedDay ? `${selectedFolder}/${selectedDay}` : '';

  const loadPhotos = React.useCallback(async () => {
    if (!selectedFolder || !selectedDay) return;
    
    try {
      setLoadingPhotos(true);
      const path = `${selectedFolder}/${selectedDay}`;
      const data = await adminApiService.getFolderPhotos(path);
      setPhotos(data);
    } catch (err) {
      console.error('Error loading photos:', err);
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  }, [selectedFolder, selectedDay]);

  const handleDeletePhoto = async (filename: string) => {
    if (!folderPath) return;
    if (!window.confirm(`¿Eliminar la foto «${filename}»?\n\nEsta acción no se puede deshacer.`)) return;
    try {
      await adminApiService.deletePhoto(folderPath, filename);
      await loadPhotos();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando foto');
    }
  };

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    if (selectedFolder) {
      loadDays();
    } else {
      setDays([]);
      setSelectedDay('');
    }
  }, [selectedFolder, loadDays]);

  useEffect(() => {
    if (selectedFolder && selectedDay) {
      loadPhotos();
    } else {
      setPhotos([]);
    }
  }, [selectedFolder, selectedDay, loadPhotos]);

  const handleFolderChange = (folder: string) => {
    setSelectedFolder(folder);
    setSelectedDay('');
    setPhotos([]);
    setSearchParams({ folder });
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    if (selectedFolder) {
      setSearchParams({ folder: selectedFolder, day });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (!selectedFolder || !selectedDay || files.length === 0) {
      alert('Selecciona una carpeta, un día y archivos para subir');
      return;
    }

    const folderPath = `${selectedFolder}/${selectedDay}`;
    const filesToUpload = [...files];

    setUploading(true);
    setUploadProgress(`Subiendo ${filesToUpload.length} fotos...`);
    setFiles([]);
    photosBeforeUploadRef.current = photos;

    adminApiService
      .uploadPhotos(folderPath, filesToUpload, (progress) => {
        setUploadProgress(
          `Subiendo: ${progress.uploaded}/${progress.total} fotos (${progress.percentage}%)`
        );
        if (progress.photos && progress.photos.length > 0) {
          const existing = photosBeforeUploadRef.current;
          const merged = [...existing];
          const existingFilenames = new Set(existing.map((p) => p.filename));
          progress.photos.forEach((p: Photo) => {
            if (!existingFilenames.has(p.filename)) {
              existingFilenames.add(p.filename);
              merged.push(p);
            }
          });
          setPhotos(merged);
        }
      })
      .then((result) => {
        if (result.errors && result.errors.length > 0) {
          setUploadProgress(
            `✅ ${result.uploaded} fotos subidas. ⚠️ ${result.errors.length} errores.`
          );
          console.warn('Errores durante la subida:', result.errors);
        } else {
          setUploadProgress(`✅ ${result.uploaded} fotos subidas.`);
        }
        loadPhotos();
        setTimeout(() => setUploadProgress(''), 5000);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Error subiendo fotos';
        setUploadProgress(`❌ ${msg}`);
        setTimeout(() => setUploadProgress(''), 8000);
        console.error('Error en handleUpload:', err);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Gestión de Fotos</h1>
          <p style={{ color: '#718096', marginTop: '0.5rem' }}>
            Sube y gestiona fotos por carpeta y día
          </p>
        </div>

        <div className="admin-content">
          {folders.length === 0 ? (
            <div className="alert alert-warning">
              No hay carpetas disponibles. Crea una carpeta primero.
            </div>
          ) : (
            <>
              {/* Selectores de Carpeta y Día */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label className="form-label">Seleccionar Carpeta</label>
                  <select
                    className="form-select"
                    value={selectedFolder}
                    onChange={(e) => handleFolderChange(e.target.value)}
                  >
                    <option value="">-- Selecciona una carpeta --</option>
                    {folders.map((folder) => (
                      <option key={folder.name} value={folder.name}>
                        {folder.name} ({folder.photo_count} fotos)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seleccionar Día</label>
                  <select
                    className="form-select"
                    value={selectedDay}
                    onChange={(e) => handleDayChange(e.target.value)}
                    disabled={!selectedFolder || loadingDays}
                  >
                    <option value="">-- Selecciona un día --</option>
                    {days.map((day) => (
                      <option key={day.date} value={day.date}>
                        {day.date} ({day.photo_count} fotos)
                      </option>
                    ))}
                  </select>
                  {loadingDays && (
                    <p style={{ marginTop: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                      Cargando días...
                    </p>
                  )}
                </div>
              </div>

              {/* Sección de Subida de Fotos */}
              {selectedFolder && selectedDay && (
                <div style={{ 
                  background: '#f7fafc', 
                  padding: '1.5rem', 
                  borderRadius: '8px',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
                    Subir Fotos a {selectedFolder} / {selectedDay}
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label">Seleccionar Fotos</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-input"
                    />
                    {files.length > 0 && (
                      <p style={{ marginTop: '0.5rem', color: '#718096' }}>
                        {files.length} archivo(s) seleccionado(s)
                      </p>
                    )}
                  </div>

                  {uploadProgress && (
                    <div className="alert alert-info">
                      {uploadProgress}
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className="btn-primary"
                  >
                    {uploading ? 'Subiendo...' : 'Subir Fotos'}
                  </button>
                </div>
              )}

              {/* Lista de Fotos Existentes */}
              {selectedFolder && selectedDay && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                      Fotos en {selectedFolder} / {selectedDay}
                    </h3>
                    {loadingPhotos && (
                      <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                        Cargando...
                      </span>
                    )}
                  </div>

                  {photos.length === 0 && !loadingPhotos ? (
                    <div className="alert alert-info">
                      No hay fotos en este día. Sube algunas fotos para comenzar.
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      {photos.map((photo) => (
                        <div 
                          key={photo.filename}
                          style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <div style={{ 
                            aspectRatio: '1',
                            background: '#f7fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={adminApiService.getPhotoPreviewUrl(
                                `${selectedFolder}/${selectedDay}`, 
                                photo.filename,
                                false
                              )}
                              alt={photo.filename}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <div style={{ padding: '0.75rem', flex: 1 }}>
                            <p style={{ 
                              fontSize: '0.875rem', 
                              fontWeight: '500',
                              marginBottom: '0.25rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {photo.filename}
                            </p>
                            <p style={{ 
                              fontSize: '0.75rem', 
                              color: '#718096',
                              marginBottom: '0.25rem'
                            }}>
                              {formatFileSize(photo.size)}
                            </p>
                            <p style={{ 
                              fontSize: '0.75rem', 
                              color: '#a0aec0',
                              marginBottom: '0.5rem'
                            }}>
                              {formatDate(photo.created_at)}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.filename)}
                              className="btn-danger"
                              style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Mensaje cuando no hay selección */}
              {(!selectedFolder || !selectedDay) && (
                <div className="alert alert-info">
                  Selecciona una carpeta y un día para ver y gestionar las fotos.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;