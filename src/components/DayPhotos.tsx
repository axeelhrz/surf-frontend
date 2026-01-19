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
      console.log('📁 Archivo seleccionado:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Guardar el archivo original
      setUploadedFile(file);
      
      // Leer el archivo para preview (esto NO consume el archivo original)
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.onerror = (e) => {
        console.error('❌ Error leyendo archivo:', e);
        setError('Error al leer el archivo. Por favor, intenta con otra imagen.');
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

    // Validar que el archivo tenga contenido
    if (uploadedFile.size === 0) {
      setError('El archivo seleccionado está vacío. Por favor, selecciona otra imagen.');
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowResults(false);

    try {
      // Crear FormData y agregar el archivo
      const formData = new FormData();
      formData.append('selfie', uploadedFile, uploadedFile.name);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      console.log('📤 Preparando envío:', {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          valueType: value instanceof File ? 'File' : typeof value,
          fileName: value instanceof File ? value.name : 'N/A',
          fileSize: value instanceof File ? value.size : 'N/A'
        }))
      });

      // Buscar en carpeta y día específicos
      const url = `${apiUrl}/compare-faces-folder?search_folder=${encodeURIComponent(schoolName)}&search_day=${encodeURIComponent(date)}`;
      console.log('🌐 URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // NO incluir headers - dejar que el navegador maneje todo automáticamente
      });

      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
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
      image: `${apiUrl}/photos/preview?folder_name=${schoolName}&day=${date}&filename=${filename}&watermark=true`,
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
              <div className="uploaded-image-preview">
                <div className="image-preview-wrapper">
                  <img src={uploadedImage} alt="Tu selfie" className="uploaded-image" />
                  <button 
                    className="btn-change-photo"
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    title="Cambiar foto"
                  >
                    <span className="change-icon">↻</span>
                    Cambiar foto
                  </button>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="btn btn-search"
                    onClick={handleAnalyzePhoto}
                    disabled={isSearching}
                  >
                    <span className="btn-icon">⌕</span>
                    {isSearching ? 'Analizando...' : 'Buscar mis fotos'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder" onClick={handleUploadClick}>
                <div className="upload-icon">+</div>
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

            {error && (
              <div className="error-message">
                <span className="error-icon">!</span>
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
              <p>Buscando coincidencias en {schoolName} - {formatDate(date)}</p>
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
                          src={`${apiUrl}/photos/preview?folder_name=${schoolName}&day=${date}&filename=${match.file}&watermark=true`}
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