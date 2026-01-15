import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApiService, DashboardStats, Activity } from '../../services/adminApi';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, activitiesData] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getRecentActivity(10)
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completado':
      case 'completed':
        return 'status-completed';
      case 'pendiente':
      case 'pending':
        return 'status-pending';
      case 'error':
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <h3>Error al cargar el dashboard</h3>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Carpetas</span>
            <div className="stat-card-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats?.total_folders || 0}</div>
          <div className="stat-card-change">Total de carpetas</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Fotos</span>
            <div className="stat-card-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats?.total_photos || 0}</div>
          <div className="stat-card-change">Total de fotos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Ingresos</span>
            <div className="stat-card-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{formatCurrency(stats?.total_revenue || 0)}</div>
          {stats?.revenue_change_percentage !== undefined && (
            <div className={`stat-card-change ${stats.revenue_change_percentage >= 0 ? '' : 'negative'}`}>
              {stats.revenue_change_percentage >= 0 ? '+' : ''}{stats.revenue_change_percentage.toFixed(1)}% vs semana anterior
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Transacciones</span>
            <div className="stat-card-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{stats?.total_transactions || 0}</div>
          <div className="stat-card-change">{stats?.recent_transactions || 0} esta semana</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Actividad Reciente</h2>
          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="empty-state">
                <p>No hay actividad reciente</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-header">
                    <p className="activity-description">{activity.description}</p>
                    <span className={`activity-status ${getStatusClass(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <span className="activity-date">{formatDate(activity.date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Acciones Rápidas</h2>
          <div className="quick-actions">
            <Link to="/admin/folders" className="quick-action-btn">
              <span className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              Gestionar Carpetas
            </Link>
            <Link to="/admin/photos" className="quick-action-btn">
              <span className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              Subir Fotos
            </Link>
            <Link to="/admin/payments" className="quick-action-btn">
              <span className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </span>
              Ver Pagos
            </Link>
            <Link to="/admin/reports" className="quick-action-btn">
              <span className="quick-action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </span>
              Ver Reportes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;