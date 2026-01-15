import React, { useState, useEffect } from 'react';
import { adminApiService, Folder } from '../../services/adminApi';
import './AdminPage.css';

const FoldersPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApiService.getFolders();
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando carpetas');
    } finally {
      setLoading(false);
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
    if (!window.confirm(`¿Estás seguro de eliminar la carpeta "${folderName}"?`)) return;

    try {
      await adminApiService.deleteFolder(folderName);
      await loadFolders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando carpeta');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fotos</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {folders.map((folder) => (
                  <tr key={folder.name} style={{ cursor: 'pointer' }}>
                    <td onClick={() => window.location.href = `/admin/folders/${encodeURIComponent(folder.name)}`}>
                      <strong>{folder.name}</strong>
                    </td>
                    <td onClick={() => window.location.href = `/admin/folders/${encodeURIComponent(folder.name)}`}>
                      {folder.photo_count} fotos
                    </td>
                    <td onClick={() => window.location.href = `/admin/folders/${encodeURIComponent(folder.name)}`}>
                      {formatDate(folder.created_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => window.location.href = `/admin/folders/${encodeURIComponent(folder.name)}`}
                          className="btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Ver Días
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder.name)}
                          className="btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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
    </div>
  );
};

export default FoldersPage;