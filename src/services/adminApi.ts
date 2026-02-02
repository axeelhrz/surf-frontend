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
      const response = await fetch(`${API_BASE_URL}/folders`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) throw new Error('Error obteniendo carpetas');
      const data = await response.json();
      console.log('🔍 [AdminAPI] Respuesta completa del backend:', data);
      console.log('🔍 [AdminAPI] data.folders:', data.folders);
      
      // Log detallado de cada carpeta
      data.folders.forEach((folder: any) => {
        console.log(`📁 Carpeta "${folder.name}":`, JSON.stringify(folder, null, 2));
      });
      
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

  async setDayCover(folderName: string, dayDate: string, coverImage: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('cover_image', coverImage);

      const response = await fetch(`${API_BASE_URL}/folders/set-day-cover?folder_name=${encodeURIComponent(folderName)}&day_date=${dayDate}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error estableciendo portada del día');
      }
    } catch (error) {
      console.error('Error en setDayCover:', error);
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
  async uploadPhotos(
    folderName: string, 
    files: File[], 
    onProgress?: (progress: { uploaded: number; total: number; percentage: number }) => void
  ): Promise<any> {
    try {
      // Lotes más pequeños evitan requests gigantes que “se quedan pensando”
      // (sobre todo en Vercel ↔ Railway y redes móviles).
      const BATCH_SIZE = 20;
      const totalFiles = files.length;
      let uploadedCount = 0;
      const allResults: any[] = [];
      const allErrors: string[] = [];
      const allUploadedFilenames: string[] = [];

      console.log(`📤 Iniciando subida de ${totalFiles} fotos en lotes de ${BATCH_SIZE}`);

      // Compatibilidad: si viene "carpeta/día", separar para usar query params del backend
      let folder = folderName;
      let day: string | null = null;
      if (folderName.includes('/')) {
        const parts = folderName.split('/').filter(Boolean);
        if (parts.length >= 2) {
          folder = parts[0];
          day = parts[1];
        }
      }

      // Dividir archivos en lotes
      for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(totalFiles / BATCH_SIZE);

        console.log(`📦 Procesando lote ${batchNumber}/${totalBatches} (${batch.length} fotos)`);

        const formData = new FormData();
        batch.forEach((file) => {
          formData.append('photos', file);
          allUploadedFilenames.push(file.name);
        });

        try {
          // Importante: NO indexar en cada lote -> hace la subida lentísima.
          // Subimos rápido y luego lanzamos el indexado una sola vez al final.
          const qs = new URLSearchParams();
          qs.set('folder_name', folder);
          if (day) qs.set('day', day);
          qs.set('index', 'false');

          const response = await fetch(`${API_BASE_URL}/photos/upload?${qs.toString()}`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error subiendo fotos');
          }

          const result = await response.json();
          allResults.push(...(result.photos || []));
          if (result.errors && result.errors.length > 0) {
            allErrors.push(...result.errors);
          }

          uploadedCount += batch.length;

          // Reportar progreso
          if (onProgress) {
            onProgress({
              uploaded: uploadedCount,
              total: totalFiles,
              percentage: Math.round((uploadedCount / totalFiles) * 100)
            });
          }

          console.log(`✅ Lote ${batchNumber}/${totalBatches} completado (${uploadedCount}/${totalFiles} fotos)`);

          // Pequeña pausa entre lotes para no saturar el servidor
          if (i + BATCH_SIZE < totalFiles) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }

        } catch (error) {
          console.error(`❌ Error en lote ${batchNumber}:`, error);
          // Continuar con el siguiente lote incluso si este falla
          allErrors.push(`Lote ${batchNumber}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }

      // Lanzar indexado UNA sola vez al terminar la subida
      try {
        const qsIndex = new URLSearchParams();
        qsIndex.set('folder_name', folder);
        if (day) qsIndex.set('day', day);

        await fetch(`${API_BASE_URL}/indexing/start?${qsIndex.toString()}`, {
          method: 'POST',
        });
        console.log('🧠 Indexado encolado correctamente');
      } catch (e) {
        console.warn('⚠️ No se pudo encolar el indexado (no bloqueante):', e);
      }

      return {
        status: 'success',
        uploaded: allResults.length,
        photos: allResults,
        errors: allErrors,
        message: `${allResults.length} de ${totalFiles} fotos subidas correctamente`
      };

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