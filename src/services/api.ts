// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Tipos de datos
export interface Photo {
  id: string;
  filename: string;
  school: string;
  date: string;
  similarity?: number;
  thumbnail: string;
  image: string;
  price?: number;
}

export interface SearchResult {
  status: string;
  photos: Photo[];
  matches: Photo[];
  matches_count: number;
  total_photos: number;
  threshold_used: number;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  model: string;
  model_loaded: boolean;
}

// Servicio de API
export const apiService = {
  // Convertir URL relativa a absoluta
  getAbsoluteUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_BASE_URL}${url}`;
  },

  // Health check
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('Error en health check:', error);
      throw error;
    }
  },

  // Búsqueda de fotos similares en el marketplace
  async searchSimilarPhotos(imageFile: File): Promise<SearchResult> {
    try {
      const formData = new FormData();
      formData.append('selfie', imageFile);

      const response = await fetch(`${API_BASE_URL}/marketplace/search-similar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error en la búsqueda');
      }

      const data = await response.json();
      
      // Convertir URLs relativas a absolutas
      const photosWithAbsoluteUrls = (data.photos || []).map((photo: Photo) => ({
        ...photo,
        thumbnail: this.getAbsoluteUrl(photo.thumbnail),
        image: this.getAbsoluteUrl(photo.image),
      }));
      
      const matchesWithAbsoluteUrls = (data.matches || []).map((photo: Photo) => ({
        ...photo,
        thumbnail: this.getAbsoluteUrl(photo.thumbnail),
        image: this.getAbsoluteUrl(photo.image),
      }));
      
      return {
        ...data,
        photos: photosWithAbsoluteUrls,
        matches: matchesWithAbsoluteUrls,
      };
    } catch (error) {
      console.error('Error buscando fotos similares:', error);
      throw error;
    }
  },

  // Obtener todas las fotos del marketplace
  async getMarketplacePhotos(): Promise<Photo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/photos`);
      if (!response.ok) throw new Error('Error obteniendo fotos');
      const data = await response.json();
      
      // Convertir URLs relativas a absolutas
      const photosWithAbsoluteUrls = (data.photos || []).map((photo: Photo) => ({
        ...photo,
        thumbnail: this.getAbsoluteUrl(photo.thumbnail),
        image: this.getAbsoluteUrl(photo.image),
      }));
      
      return photosWithAbsoluteUrls;
    } catch (error) {
      console.error('Error obteniendo fotos del marketplace:', error);
      throw error;
    }
  },

  // Obtener filtros disponibles
  async getMarketplaceFilters() {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/filters`);
      if (!response.ok) throw new Error('Error obteniendo filtros');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo filtros:', error);
      throw error;
    }
  },

  // Obtener preview de una foto
  getPhotoPreviewUrl(folderName: string, filename: string, watermark: boolean = true): string {
    return `${API_BASE_URL}/photos/preview?folder_name=${folderName}&filename=${filename}&watermark=${watermark}`;
  },

  // Obtener foto original
  getPhotoViewUrl(folderName: string, filename: string): string {
    return `${API_BASE_URL}/photos/view?folder_name=${folderName}&filename=${filename}`;
  },
};

export default apiService;