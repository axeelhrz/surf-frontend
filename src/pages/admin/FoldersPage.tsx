import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApiService, Folder } from '../../services/adminApi';
import './AdminPage.css';

const FoldersPage: React.FC = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaFolder, setMetaFolder] = useState<string | null>(null);
  const [metaDate, setMetaDate] = useState('');
  const [metaText, setMetaText] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getFolders();
      const list: Folder[] = Array.isArray(data) ? data : [];
      let displayMeta: Record<string, { date?: string; text?: string }> = {};
      try {
        displayMeta = await adminApiService.getFolderDisplayMetadata();
        if (!displayMeta || typeof displayMeta !== 'object') displayMeta = {};
      } catch {
        // Backend puede no tener aún /folders/display-metadata; la página carga igual
        displayMeta = {};
      }
      for (const key of Object.keys(displayMeta)) {
        // Solo añadir carpetas con metadata que no existan en disco; OTRAS ESCUELAS se crea como las demás
        if (key !== 'OTRAS ESCUELAS' && !list.some((f) => f.name === key)) {
          const meta = displayMeta[key];
          list.push({
            name: key,
            photo_count: 0,
            created_at: '',
            cover_image: undefined,
            custom_date: meta?.date ?? '',
            custom_text: meta?.text ?? '',
            isVirtual: true,
          });
        }
      }
      setFolders(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando carpetas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMetaModal = (folderName: string) => {
    const folder = folders.find((f) => f.name === folderName);
    setMetaFolder(folderName);
    setMetaDate(folder?.custom_date ?? '');
    setMetaText(folder?.custom_text ?? '');
    setShowMetaModal(true);
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaFolder) return;
    try {
      setSavingMeta(true);
      await adminApiService.setFolderDisplayMetadata(metaFolder, { date: metaDate, text: metaText });
      setShowMetaModal(false);
      setMetaFolder(null);
      setMetaDate('');
      setMetaText('');
      await loadFolders();
      setSuccessMessage(`Fecha y texto de "${metaFolder}" guardados correctamente`);
      setShowSuccessModal(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error guardando');
    } finally {
      setSavingMeta(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      setCreating(true);
      await adminApiService.createFolder(newFolderName);
      setShowCreateModal(false);
      setNewFolderName('');
      await loadFolders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creando carpeta');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!window.confirm(`¿Eliminar la carpeta «${folderName}» y todas sus fotos?\n\nEsta acción no se puede deshacer.`)) return;

    try {
      await adminApiService.deleteFolder(folderName);
      await loadFolders();
      setSuccessMessage(`Carpeta «${folderName}» eliminada correctamente`);
      setShowSuccessModal(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando carpeta');
    }
  };

  const handleRemoveVirtualFolder = async (folderName: string) => {
    if (!window.confirm(`¿Quitar «${folderName}» de la lista?\n\nSolo se borrará la fecha y el texto; la carpeta no existe en el servidor.`)) return;

    try {
      await adminApiService.removeFolderDisplayMetadata(folderName);
      await loadFolders();
      setSuccessMessage(`«${folderName}» quitado de la lista`);
      setShowSuccessModal(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleOpenCoverModal = (folderName: string) => {
    setSelectedFolder(folderName);
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
    if (!coverFile || !selectedFolder) return;

    try {
      setUploading(true);
      console.log('📤 Subiendo portada para:', selectedFolder);
      console.log('📤 Archivo:', coverFile.name, coverFile.size, 'bytes');
      
      await adminApiService.setFolderCover(selectedFolder, coverFile);
      
      console.log('✅ Portada subida exitosamente');
      
      // Cerrar modal
      setShowCoverModal(false);
      setCoverFile(null);
      const uploadedFolder = selectedFolder;
      setSelectedFolder(null);
      
      // IMPORTANTE: Esperar un momento antes de recargar para asegurar que el backend terminó
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Forzar recarga de imágenes ANTES de recargar carpetas
      const newRefreshKey = Date.now();
      setImageRefreshKey(newRefreshKey);
      console.log('🔄 Nuevo refresh key:', newRefreshKey);
      
      // Recargar carpetas
      console.log('🔄 Recargando carpetas...');
      await loadFolders();
      
      // Mostrar modal de éxito
      setSuccessMessage(`Portada de "${uploadedFolder}" actualizada correctamente`);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('❌ Error subiendo portada:', err);
      alert(err instanceof Error ? err.message : 'Error subiendo portada');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando carpetas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Gestión de Carpetas</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Las carpetas creadas aquí aparecerán como escuelas en <a href="/schools" target="_blank" rel="noopener noreferrer" style={{ color: '#B24A3B', textDecoration: 'underline' }}>la página de escuelas</a>
            </p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            + Nueva Carpeta
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="admin-content">
          {folders.length === 0 ? (
            <div className="empty-state">
              <p>No hay carpetas creadas</p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Crear primera carpeta
              </button>
            </div>
          ) : (
            <div className="folders-grid">
              {folders.map((folder) => {
                console.log(`🔍 Renderizando carpeta "${folder.name}":`, {
                  cover_image: folder.cover_image,
                  tiene_portada: !!folder.cover_image
                });
                return (
                <div key={folder.name} className="folder-card">
                  <div 
                    className="folder-card-cover"
                    onClick={() => navigate(`/admin/folders/${encodeURIComponent(folder.name)}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {folder.cover_image ? (
                      <img 
                        key={`${folder.name}-${imageRefreshKey}`}
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/folders/cover/${encodeURIComponent(folder.name)}?t=${imageRefreshKey}`}
                        alt={folder.name}
                        className="folder-cover-image"
                        onLoad={() => console.log('✅ Imagen cargada:', folder.name)}
                        onError={(e) => {
                          console.error('❌ Error cargando imagen de portada:', folder.name);
                          console.error('URL:', e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="folder-cover-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <p>Sin portada</p>
                      </div>
                    )}
                  </div>
                  <div className="folder-card-body">
                    <h3 className="folder-card-title">{folder.name}</h3>
                    <div className="folder-card-stats">
                      <span className="folder-stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        {folder.photo_count} fotos
                      </span>
                      <span className="folder-stat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(folder.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="folder-card-actions">
                    <button
                      onClick={() => navigate(`/admin/folders/${encodeURIComponent(folder.name)}`)}
                      className="btn-primary"
                    >
                      Ver Días
                    </button>
                    <button
                      onClick={() => handleOpenCoverModal(folder.name)}
                      className="btn-secondary"
                    >
                      {folder.cover_image ? 'Cambiar Portada' : 'Asignar Portada'}
                    </button>
                    <button
                      onClick={() => handleOpenMetaModal(folder.name)}
                      className="btn-secondary"
                      title="Fecha y texto para mostrar en la web"
                    >
                      Fecha y texto
                    </button>
                    <button
                      onClick={() => folder.isVirtual ? handleRemoveVirtualFolder(folder.name) : handleDeleteFolder(folder.name)}
                      className="btn-danger"
                      title={folder.isVirtual ? 'Quitar de la lista' : 'Eliminar carpeta y todas sus fotos'}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Cover Modal */}
        {showCoverModal && (
          <div className="modal-overlay" onClick={() => setShowCoverModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h2 className="modal-title">Asignar Portada</h2>
                <button className="modal-close" onClick={() => setShowCoverModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUploadCover}>
                <div className="form-group">
                  <label className="form-label">Carpeta: {selectedFolder}</label>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                    Esta imagen se mostrará como portada de la escuela en la página principal
                  </p>
                  
                  {/* Mostrar portada actual si existe */}
                  {folders.find(f => f.name === selectedFolder)?.cover_image && (
                    <div style={{ marginBottom: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Portada actual:</label>
                      <img 
                        key={`modal-${selectedFolder}-${imageRefreshKey}`}
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/folders/cover/${encodeURIComponent(selectedFolder || '')}?t=${imageRefreshKey}`}
                        alt="Portada actual" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '2px solid #e0e0e0'
                        }}
                        onError={(e) => {
                          console.error('❌ Error cargando portada actual en modal');
                          console.error('URL:', e.currentTarget.src);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    required
                  />
                  {coverFile && (
                    <div style={{ marginTop: '1rem' }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Nueva portada:</label>
                      <img 
                        src={URL.createObjectURL(coverFile)} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '2px solid var(--primary)'
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

        {/* Modal Fecha y texto */}
        {showMetaModal && metaFolder && (
          <div className="modal-overlay" onClick={() => setShowMetaModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2 className="modal-title">Fecha y texto de la carpeta</h2>
                <button className="modal-close" onClick={() => setShowMetaModal(false)}>×</button>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Se mostrarán en la web al entrar en esta escuela.
              </p>
              <form onSubmit={handleSaveMeta}>
                <div className="form-group">
                  <label className="form-label">Carpeta</label>
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{metaFolder}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: 4 febrero 2026"
                    value={metaDate}
                    onChange={(e) => setMetaDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Texto</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Ej: Fotos de varias escuelas en Lanzarote"
                    value={metaText}
                    onChange={(e) => setMetaText(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowMetaModal(false)} className="btn-secondary" disabled={savingMeta}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={savingMeta}>
                    {savingMeta ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
            <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#10b981', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                  ¡Éxito!
                </h2>
                <p style={{ color: '#666', fontSize: '1rem' }}>
                  {successMessage}
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessModal(false)} 
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Nueva Carpeta</h2>
                <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateFolder}>
                <div className="form-group">
                  <label className="form-label">Nombre de la carpeta</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Ej: Surf-2024-01-15"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary"
                    disabled={creating}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={creating}>
                    {creating ? 'Creando...' : 'Crear Carpeta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .folders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .folder-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .folder-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        .folder-card-cover {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .folder-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .folder-card:hover .folder-cover-image {
          transform: scale(1.05);
        }

        .folder-cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .folder-cover-placeholder svg {
          margin-bottom: 0.5rem;
          opacity: 0.5;
        }

        .folder-cover-placeholder p {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .folder-card-body {
          padding: 1.5rem;
        }

        .folder-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem;
          font-family: var(--font-display);
        }

        .folder-card-stats {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .folder-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .folder-stat svg {
          flex-shrink: 0;
        }

        .folder-card-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .folder-card-actions button {
          width: 100%;
          padding: 0.75rem;
          font-size: 0.9rem;
        }

        .success-modal {
          animation: successPop 0.3s ease-out;
        }

        @keyframes successPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .folders-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FoldersPage;