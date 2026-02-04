import React, { useState, useRef, useEffect } from 'react';
import MatchPhotosViewer from './MatchPhotosViewer';
import './SchoolDetail.css';

interface SchoolDetailProps {
  schoolName: string;
  onBack: () => void;
  onAddToCart: (item: any) => void;
}

interface AnalysisResult {
  status?: string;
  selfie?: string;
  folder?: string;
  matches: Array<{ file: string; similarity: number }>;
  non_matches?: Array<{ file: string; similarity: number }>;
  statistics?: {
    total_photos?: number;
    matches_count?: number;
    match_percentage?: number;
    threshold_used?: number;
  };
}

const SchoolDetail: React.FC<SchoolDetailProps> = ({ schoolName, onBack, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string>('');
  const [folderMeta, setFolderMeta] = useState<{ date?: string; text?: string }>({});
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

  // Hero: usar portada de la carpeta del API; si no existe, foto aleatoria o estática
  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const coverUrl = `${apiUrl}/folders/cover/${encodeURIComponent(schoolName)}`;
        const coverCheck = await fetch(coverUrl, { method: 'HEAD' });
        if (coverCheck.ok) {
          setHeroImage(`${coverUrl}?t=${Date.now()}`);
          return;
        }
        const listRes = await fetch(`${apiUrl}/photos/list?folder_name=${encodeURIComponent(schoolName)}`);
        if (listRes.ok) {
          const data = await listRes.json();
          if (data.photos && data.photos.length > 0) {
            const randomPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
            setHeroImage(`${apiUrl}/photos/preview?folder_name=${encodeURIComponent(schoolName)}&filename=${encodeURIComponent(randomPhoto.filename)}&watermark=false`);
            return;
          }
        }
        const fallback = staticHeroFallback[schoolName.toUpperCase()] || staticHeroFallback['OTRAS'] || '/OTRAS.jpg';
        setHeroImage(fallback);
      } catch (err) {
        console.error('Error cargando imagen del hero:', err);
        setHeroImage(staticHeroFallback[schoolName.toUpperCase()] || '/OTRAS.jpg');
      }
    };

    fetchHeroImage();
  }, [schoolName, apiUrl]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const { apiService } = await import('../services/api');
        const meta = await apiService.getFolderDisplayMetadata();
        setFolderMeta(meta[schoolName] || {});
      } catch {
        setFolderMeta({});
      }
    };
    loadMeta();
  }, [schoolName]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzePhoto = async () => {
    if (!uploadedFile) {
      setError('Por favor, selecciona una foto primero');
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowResults(false);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('selfie', uploadedFile);
    const url = `${apiUrl}/compare-faces-folder?search_folder=${encodeURIComponent(schoolName)}&stream=1`;

    try {
      const response = await fetch(url, { method: 'POST', body: formData });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated: Array<{ file: string; similarity: number }> = [];

      if (!reader) {
        throw new Error('No se pudo leer la respuesta');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === 'match') {
              const currentMatches: Array<{ file: string; similarity: number }> = [
                ...accumulated,
                { file: event.file, similarity: event.similarity },
              ];
              accumulated = currentMatches;
              setAnalysisResult((prev) => ({
                ...prev,
                status: 'success',
                selfie: prev?.selfie ?? uploadedFile.name,
                folder: prev?.folder ?? schoolName,
                matches: currentMatches,
                non_matches: prev?.non_matches ?? [],
                statistics: prev?.statistics ?? {
                  total_photos: 0,
                  matches_count: currentMatches.length,
                  match_percentage: 0,
                  threshold_used: 0,
                },
              }));
              setShowResults(true);
            } else if (event.type === 'done') {
              setAnalysisResult({
                status: event.status,
                selfie: event.selfie,
                folder: event.folder,
                matches: event.matches ?? accumulated,
                non_matches: event.non_matches ?? [],
                statistics: event.statistics ?? {},
              });
              setShowResults(true);
            } else if (event.type === 'error' || event.status === 'error') {
              throw new Error(event.detail || 'Error en el servidor');
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al analizar la foto. Verifica que el servidor esté corriendo.';
      setError(errorMessage);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = (filename: string) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const cartItem = {
      id: `${schoolName}_${filename}`,
      name: `${schoolName} - ${filename}`,
      price: 29.99,
      image: `${apiUrl}/photos/preview?folder_name=${schoolName}&filename=${filename}&watermark=true`,
    };
    onAddToCart(cartItem);
  };

  const handleAddAllToCart = () => {
    if (analysisResult?.matches?.length) {
      analysisResult.matches.forEach((match) => handleAddToCart(match.file));
    }
  };

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const getMatchImageUrl = (filename: string) =>
    `${apiUrl}/photos/preview?folder_name=${schoolName}&filename=${filename}&watermark=true`;

  return (
    <div className="school-detail">
      {/* Hero Section con imagen de fondo */}
      <div className="school-hero" style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none' }}>
        <div className="school-hero-overlay"></div>
        <div className="school-hero-content">
          <button className="btn-back-hero" onClick={onBack}>
            ← Volver
          </button>
          <h1 className="school-hero-title">{schoolName}</h1>
          {(folderMeta.date || folderMeta.text) && (
            <div className="school-hero-meta">
              {folderMeta.date && <span className="school-hero-date">{folderMeta.date}</span>}
              {folderMeta.date && folderMeta.text && <span className="school-hero-meta-sep"> · </span>}
              {folderMeta.text && <span className="school-hero-text">{folderMeta.text}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="school-detail-content">
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="date-filter">Filtrar por día:</label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="recognition-section">
          <div className="section-header">
            <h2>Encuentra tus fotos</h2>
            <p>Sube una foto de tu rostro para identificar todas tus fotos en {schoolName}</p>
          </div>

          <div className="recognition-container">
            <div className="camera-panel">
              <div className="tab-buttons">
                <button 
                  className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`}
                  onClick={() => setActiveTab('camera')}
                >
                  Cámara
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Subir Foto
                </button>
              </div>

              {activeTab === 'camera' && (
                <div className="tab-content">
                  <h3>Captura Tu Rostro</h3>
                  <div className="camera-feed">
                    <video id="video" autoPlay playsInline></video>
                  </div>
                  <div className="button-group">
                    <button className="btn btn-dark">Iniciar</button>
                    <button className="btn btn-success">Capturar</button>
                    <button className="btn btn-danger">Detener</button>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="tab-content">
                  <h3>Sube Tu Foto</h3>
                  <div className="upload-area">
                    {uploadedImage ? (
                      <div className="uploaded-image-container">
                        <img src={uploadedImage} alt="Foto subida" className="uploaded-image" />
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setUploadedImage(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          Cambiar Foto
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder" onClick={handleUploadClick}>
                        <div className="upload-icon">↑</div>
                        <p>Haz clic para seleccionar una foto</p>
                        <span>o arrastra una imagen aquí</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  {uploadedImage && (
                    <div className="button-group">
                      <button 
                        className="btn btn-success"
                        onClick={handleAnalyzePhoto}
                        disabled={isSearching}
                      >
                        {isSearching ? 'Analizando...' : 'Buscar mis fotos'}
                      </button>
                      <button 
                        className="btn btn-dark"
                        onClick={() => {
                          setUploadedImage(null);
                          setUploadedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="loading-modal-overlay">
            <div className="loading-modal">
              <div className="spinner"></div>
              <h3>Analizando tu rostro...</h3>
              <p>Buscando coincidencias en {schoolName}</p>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        )}

        {showResults && analysisResult && (
          <div className="results-section">
            <div className="results-header">
              <h3>Resultados del Análisis</h3>
              <div className="statistics">
                <div className="stat-card">
                  <div className="stat-value">{analysisResult.statistics.matches_count}</div>
                  <div className="stat-label">Coincidencias</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{analysisResult.statistics.total_photos}</div>
                  <div className="stat-label">Fotos Analizadas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{analysisResult.statistics.match_percentage}%</div>
                  <div className="stat-label">Porcentaje</div>
                </div>
              </div>
            </div>

            {analysisResult.matches.length > 0 && (
              <div className="matches-container">
                <div className="matches-container-header">
                  <h4>Fotos Encontradas</h4>
                  <button
                    type="button"
                    className="btn btn-add-all-records"
                    onClick={handleAddAllToCart}
                  >
                    Añadir todas tus recuerdos
                  </button>
                </div>
                <div className="matches-grid">
                  {analysisResult.matches.map((match, index) => (
                    <div key={match.file} className="match-card">
                      <div
                        className="match-image-wrapper"
                        onClick={() => {
                          setViewerIndex(index);
                          setViewerOpen(true);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setViewerIndex(index);
                            setViewerOpen(true);
                          }
                        }}
                        aria-label="Ver foto en grande"
                      >
                        <img
                          src={getMatchImageUrl(match.file)}
                          alt={match.file}
                          className="match-image"
                        />
                        <span className="match-image-hint">Ver en grande</span>
                      </div>
                      <div className="match-info">
                          <p className="match-file">{match.file}</p>
                          <p className="match-similarity">
                            Similitud: {match.similarity.toFixed(1)}%
                          </p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(match.file)}
                            style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}
                          >
                            Comprar
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
                <div className="matches-container-footer">
                  <button
                    type="button"
                    className="btn btn-add-all-records"
                    onClick={handleAddAllToCart}
                  >
                    Añadir todas tus recuerdos
                  </button>
                </div>
              </div>
            )}

            {analysisResult.matches.length > 0 && (
              <MatchPhotosViewer
                photos={analysisResult.matches}
                getImageUrl={getMatchImageUrl}
                isOpen={viewerOpen}
                initialIndex={viewerIndex}
                onClose={() => setViewerOpen(false)}
              />
            )}

            {analysisResult.non_matches.length > 0 && (
              <div className="non-matches-container">
                <h4>Fotos sin Coincidencia ({analysisResult.non_matches.length})</h4>
                <div className="non-matches-list">
                  {analysisResult.non_matches.slice(0, 5).map((match) => (
                    <div key={match.file} className="non-match-item">
                      <span>{match.file}</span>
                      <span className="similarity-badge">{match.similarity.toFixed(1)}%</span>
                    </div>
                  ))}
                  {analysisResult.non_matches.length > 5 && (
                    <p className="more-items">+{analysisResult.non_matches.length - 5} más</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolDetail;