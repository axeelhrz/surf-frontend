import React, { useState, useEffect, useCallback } from 'react';
import './MatchPhotosViewer.css';

export interface MatchPhoto {
  file: string;
  similarity: number;
}

interface MatchPhotosViewerProps {
  photos: MatchPhoto[];
  getImageUrl: (filename: string) => string;
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

const MatchPhotosViewer: React.FC<MatchPhotosViewerProps> = ({
  photos,
  getImageUrl,
  isOpen,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen && photos.length > 0) {
      const idx = Math.max(0, Math.min(initialIndex, photos.length - 1));
      setCurrentIndex(idx);
    }
  }, [isOpen, initialIndex, photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? photos.length - 1 : i - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= photos.length - 1 ? 0 : i + 1));
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || photos.length === 0) return null;

  const current = photos[currentIndex];

  return (
    <div
      className="match-photos-viewer-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Visor de fotos"
    >
      <button
        type="button"
        className="match-photos-viewer-close"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      {photos.length > 1 && (
        <button
          type="button"
          className="match-photos-viewer-arrow match-photos-viewer-arrow-prev"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Foto anterior"
        >
          ‹
        </button>
      )}

      <div className="match-photos-viewer-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={getImageUrl(current.file)}
          alt={current.file}
          className="match-photos-viewer-image"
        />
        <div className="match-photos-viewer-caption">
          <span className="match-photos-viewer-filename">{current.file}</span>
          <span className="match-photos-viewer-similarity">
            Similitud: {current.similarity.toFixed(1)}%
          </span>
          {photos.length > 1 && (
            <span className="match-photos-viewer-counter">
              {currentIndex + 1} / {photos.length}
            </span>
          )}
        </div>
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          className="match-photos-viewer-arrow match-photos-viewer-arrow-next"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Foto siguiente"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default MatchPhotosViewer;
