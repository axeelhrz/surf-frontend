import React, { useState, useRef } from 'react';
import './DayPhotos.css';

interface DayPhotosProps {
  schoolName: string;
  date: string;
  onBack: () => void;
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

const DayPhotos: React.FC<DayPhotosProps> = ({ schoolName, date, onBack, onAddToCart }) => {
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
      const response = await fetch(`${apiUrl}/compare-faces-folder?search_folder=${schoolName}`, {
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
      id: `${schoolName}_${date}_${filename}`,
      name: `${schoolName} - ${date} - ${filename}`,
      price: 29.99,
      image: `${apiUrl}/photos/preview?folder_name=${schoolName}&filename=${filename}&watermark=true`,
    };
    onAddToCart(cartItem);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="day-photos">
      <div className="day-photos-header">
        <button className="btn-back" onClick={onBack}>
          ← Volver
        </button>
        <div className="header-info">
          <h1>{schoolName}</h1>
          <p className="date-display">{formatDate(date)}</p>
        </div>
      </div>

      <div className="day-photos-content">
        {/* Panel de búsqueda por IA */}
        <div className="ai-search-section">
          <div className="ai-search-header">
            <h2>Encuentra tus fotos</h2>
            <p>Sube un selfie y encuentra tus fotos automáticamente</p>
          </div>

          <div className="ai-search-container">
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
                <div className="upload-icon">📸</div>
                <p>Haz clic para seleccionar un selfie</p>
                <span>o arrastra una imagen aquí</span>
              </div>
            )}
            
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
                <h4>Fotos Encontradas</h4>
                <div className="matches-grid">
                  {analysisResult.matches.map((match) => {
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
                    return (
                      <div key={match.file} className="match-card">
                        <img 
                          src={`${apiUrl}/photos/preview?folder_name=${schoolName}&filename=${match.file}&watermark=true`}
                          alt={match.file}
                          className="match-image"
                        />
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
                    );
                  })}
                </div>
              </div>
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

export default DayPhotos;