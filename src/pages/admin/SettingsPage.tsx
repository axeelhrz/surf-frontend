import React, { useState, useEffect } from 'react';
import { adminApiService, Settings } from '../../services/adminApi';
import './AdminPage.css';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await adminApiService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Configuración del Sistema</h1>
        </div>

        <div className="admin-content">
          {settings && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>Stripe</h3>
                <p><strong>Publishable Key:</strong> {settings.stripe_publishable_key}</p>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>Precios</h3>
                <p><strong>Precio por foto:</strong> ${settings.photo_price}</p>
                <p><strong>Tasa de impuesto:</strong> {settings.tax_rate}%</p>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>URLs</h3>
                <p><strong>Frontend:</strong> {settings.frontend_url}</p>
                <p><strong>Backend:</strong> {settings.backend_url}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;