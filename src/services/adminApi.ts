// Configuración de la API Admin
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Debug: Mostrar la URL configurada
console.log('🔧 [AdminAPI] API_BASE_URL configurada:', API_BASE_URL);

// Tipos de datos para Admin
export interface DashboardStats {
  total_folders: number;
  total_photos: number;
  total_revenue: number;
  total_transactions: number;
  recent_transactions: number;
  revenue_change_percentage: number;
}

export interface Activity {
  type: string;
  description: string;
  date: string;
  status: string;
}

export interface Folder {
  name: string;
  photo_count: number;
  created_at: string;
  cover_image?: string;
  days?: string[];
}

export interface DayFolder {
  date: string;
  photo_count: number;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  items_count?: number;
}

export interface PaymentSummary {
  total_amount: number;
  total_transactions: number;
  average_transaction: number;
  by_status: Record<string, { count: number; amount: number }>;
  by_month: Record<string, { count: number; amount: number }>;
}

export interface PhotoReport {
  folder_name: string;
  photo_count: number;
  total_size_mb: number;
  created_at: string;
}

export interface RevenueReport {
  period: string;
  amount: number;
  transactions: number;
  items_sold: number;
}

export interface Settings {
  stripe_publishable_key: string;
  photo_price: number;
  tax_rate: number;
  frontend_url: string;
  backend_url: string;
}

// Servicio de API Admin
export const adminApiService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log('🔍 Intentando conectar a:', `${API_BASE_URL}/admin/dashboard/stats`);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Response no OK:', text);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`El servidor respondió con HTML en lugar de JSON. Verifica que REACT_APP_API_URL esté configurada correctamente. URL actual: ${API_BASE_URL}`);
      }
      
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Error en getDashboardStats:', error);
      console.error('🔧 API_BASE_URL configurada:', API_BASE_URL);
      throw error;
    }
  },

  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    try {
      console.log('🔍 Intentando conectar a:', `${API_BASE_URL}/admin/dashboard/activity?limit=${limit}`);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity?limit=${limit}`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('❌ Response no OK:', text);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Respuesta no es JSON:', text.substring(0, 200));
        throw new Error(`El servidor respondió con HTML en lugar de JSON. Verifica la URL del backend: ${API_BASE_URL}`);
      }
      
      const data = await response.json();
      return data.activities;
    } catch (error) {
      console.error('Error en getRecentActivity:', error);
      console.error('🔧 API_BASE_URL configurada:', API_BASE_URL);
      throw error;
    }
  },

  // Folders
  async getFolders(): Promise<Folder[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders`);
      if (!response.ok) throw new Error('Error obteniendo carpetas');
      const data = await response.json();
      return data.folders;
    } catch (error) {
      console.error('Error en getFolders:', error);
      throw error;
    }
  },

  async createFolder(folderName: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/create?folder_name=${encodeURIComponent(folderName)}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error creando carpeta');
      }
    } catch (error) {
      console.error('Error en createFolder:', error);
      throw error;
    }
  },

  async deleteFolder(folderName: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/delete?folder_name=${encodeURIComponent(folderName)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error eliminando carpeta');
      }
    } catch (error) {
      console.error('Error en deleteFolder:', error);
      throw error;
    }
  },

  async setFolderCover(folderName: string, coverImage: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('cover_image', coverImage);

      const response = await fetch(`${API_BASE_URL}/folders/set-cover?folder_name=${encodeURIComponent(folderName)}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error estableciendo portada');
      }
    } catch (error) {
      console.error('Error en setFolderCover:', error);
      throw error;
    }
  },

  async createDayFolder(folderName: string, dayDate: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/create-day?folder_name=${encodeURIComponent(folderName)}&day_date=${dayDate}`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error creando día');
      }
    } catch (error) {
      console.error('Error en createDayFolder:', error);
      throw error;
    }
  },

  async getFolderDays(folderName: string): Promise<DayFolder[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${encodeURIComponent(folderName)}/days`);
      if (!response.ok) throw new Error('Error obteniendo días');
      const data = await response.json();
      return data.days || [];
    } catch (error) {
      console.error('Error en getFolderDays:', error);
      throw error;
    }
  },

  // Photos
  async uploadPhotos(folderName: string, files: File[]): Promise<any> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await fetch(`${API_BASE_URL}/photos/upload?folder_name=${folderName}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error subiendo fotos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en uploadPhotos:', error);
      throw error;
    }
  },

  async getFolderPhotos(folderName: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/list?folder_name=${folderName}`);
      if (!response.ok) throw new Error('Error obteniendo fotos');
      const data = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Error en getFolderPhotos:', error);
      throw error;
    }
  },

  // Payments
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`);
      if (!response.ok) throw new Error('Error obteniendo pagos');
      const data = await response.json();
      return data.payments || [];
    } catch (error) {
      console.error('Error en getPayments:', error);
      throw error;
    }
  },

  async getPaymentSummary(startDate?: string, endDate?: string): Promise<PaymentSummary> {
    try {
      let url = `${API_BASE_URL}/admin/payments/summary`;
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error obteniendo resumen de pagos');
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error en getPaymentSummary:', error);
      throw error;
    }
  },

  // Reports
  async getPhotosByFolder(): Promise<PhotoReport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/photos-by-folder`);
      if (!response.ok) throw new Error('Error obteniendo reporte de fotos');
      const data = await response.json();
      return data.report;
    } catch (error) {
      console.error('Error en getPhotosByFolder:', error);
      throw error;
    }
  },

  async getRevenueByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<RevenueReport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reports/revenue-by-period?period=${period}`);
      if (!response.ok) throw new Error('Error obteniendo reporte de ingresos');
      const data = await response.json();
      return data.report;
    } catch (error) {
      console.error('Error en getRevenueByPeriod:', error);
      throw error;
    }
  },

  // Settings
  async getSettings(): Promise<Settings> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`);
      if (!response.ok) throw new Error('Error obteniendo configuración');
      const data = await response.json();
      return data.settings;
    } catch (error) {
      console.error('Error en getSettings:', error);
      throw error;
    }
  },

  // Utility
  getPhotoUrl(folderName: string, filename: string): string {
    return `${API_BASE_URL}/photos/view?folder_name=${folderName}&filename=${filename}`;
  },

  getPhotoPreviewUrl(folderName: string, filename: string, watermark: boolean = true): string {
    return `${API_BASE_URL}/photos/preview?folder_name=${folderName}&filename=${filename}&watermark=${watermark}`;
  },
};

export default adminApiService;