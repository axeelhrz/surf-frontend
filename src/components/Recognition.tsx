import React, { useState, useRef } from 'react';
import MatchPhotosViewer from './MatchPhotosViewer';
import './Recognition.css';

interface RecognitionProps {
  onAddToCart: (item: any) => void;
}

interface AnalysisResult {
  status: string;
  matches: Array<{ file: string; similarity: number }>;
  non_matches: Array<{ file: string; similarity: number }>;
  statistics: {
    total_photos: number;
    matches_count: number;
    match_percentage: number;
    threshold_used: number;
  };
}

const Recognition: React.FC<RecognitionProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const formData = new FormData();
      formData.append('selfie', uploadedFile);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/compare-faces-folder?search_folder=Surf`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Error en la búsqueda';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
      setShowResults(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al analizar la foto. Verifica que el servidor esté corriendo.';
      setError(errorMessage);
      console.error('Error detallado:', err);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCart = (filename: string) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const cartItem = {
      id: `Surf_${filename}`,
      name: `Surf - ${filename}`,
      price: 29.99,
      image: `${apiUrl}/photos/preview?folder_name=Surf&filename=${filename}&watermark=true`,
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
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const getMatchImageUrl = (filename: string) =>
    `${apiUrl}/photos/preview?folder_name=Surf&filename=${filename}&watermark=true`;
  const getMatchThumbUrl = (filename: string) =>
    `${apiUrl}/photos/preview?folder_name=Surf&filename=${filename}&watermark=true&max_width=400`;

  return (
    <section className="recognition" id="recognition">
      <div className="section-wrapper">
        <div className="section-header">
          <h2>Reconocimiento Facial Inteligente</h2>
          <p>Captura tu rostro e identifica instantáneamente todas las fotos donde apareces</p>
        </div>
        <div className="recognition-grid">
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
                      {isSearching ? 'Analizando...' : 'Analizar Foto'}
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
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h4>Reconocimiento Avanzado</h4>
              <p>Tecnología de IA de última generación</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h4>Coincidencia Precisa</h4>
              <p>Filtra automáticamente tus fotos</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h4>Compra Instantánea</h4>
              <p>Compra en segundos</p>
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="loading-modal-overlay">
            <div className="loading-modal">
              <div className="spinner"></div>
              <h3>Analizando tu rostro...</h3>
              <p>Buscando coincidencias en la carpeta Surf</p>
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
                          src={getMatchThumbUrl(match.file)}
                          alt={match.file}
                          className="match-image"
                          loading="lazy"
                          decoding="async"
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
    </section>
  );
};

export default Recognition;