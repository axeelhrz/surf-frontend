import React, { useState, useEffect } from 'react';
import './Gallery.css';
import apiService, { Photo } from '../services/api';

interface GalleryProps {
  onAddToCart: (item: any) => void;
}

const PHOTOS_PER_PAGE = 12; // Mostrar 12 fotos por página

const Gallery: React.FC<GalleryProps> = ({ onAddToCart }) => {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPhotos = await apiService.getMarketplacePhotos();
        setAllPhotos(fetchedPhotos);
        // Mostrar las primeras fotos
        setDisplayedPhotos(fetchedPhotos.slice(0, PHOTOS_PER_PAGE));
        setCurrentPage(1);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar las fotos';
        setError(errorMessage);
        console.error('Error fetching photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * PHOTOS_PER_PAGE;
      const endIndex = startIndex + PHOTOS_PER_PAGE;
      const newPhotos = allPhotos.slice(0, endIndex);
      setDisplayedPhotos(newPhotos);
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  const hasMorePhotos = displayedPhotos.length < allPhotos.length;

  const handleAddToCart = (photo: Photo) => {
    const cartItem = {
      id: photo.id,
      name: `${photo.school} - ${photo.date}`,
      price: 29.99,
      image: photo.thumbnail,
    };
    onAddToCart(cartItem);
  };

  return (
    <section className="gallery" id="gallery">
      <div className="section-wrapper">
        <div className="section-header">
          <h2>Galería de Fotos</h2>
          <p>Explora nuestra colección de fotografías premium de surf</p>
        </div>

        {loading && (
          <div className="loading-message">
            Cargando fotos...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && displayedPhotos.length === 0 && !error && (
          <div className="no-photos-message">
            No hay fotos disponibles en este momento
          </div>
        )}

        {!loading && displayedPhotos.length > 0 && (
          <>
            <div className="gallery-grid">
              {displayedPhotos.map(photo => (
                <div key={photo.id} className="photo-card">
                  <div className="photo-image">
                    <img 
                      src={photo.thumbnail} 
                      alt={photo.filename}
                      className="photo-img"
                    />
                  </div>
                  <div className="photo-info">
                    <h4>{photo.school}</h4>
                    <p className="photo-date">{photo.date}</p>
                    <div className="photo-footer">
                      <span className="photo-price">$29.99</span>
                      <button 
                        className="btn btn-primary" 
                        style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}
                        onClick={() => handleAddToCart(photo)}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMorePhotos && (
              <div className="load-more-container">
                <button 
                  className="btn btn-primary load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Cargando...' : 'Ver más fotos'}
                </button>
                <p className="photos-count">
                  Mostrando {displayedPhotos.length} de {allPhotos.length} fotos
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Gallery;