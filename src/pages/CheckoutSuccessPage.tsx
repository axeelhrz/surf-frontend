import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './CheckoutSuccessPage.css';

interface DownloadItem {
  id: string;
  filename: string;
  school: string;
  date: string;
  price: number;
  thumbnail?: string | null;
}

interface SuccessData {
  payment: {
    id: string;
    customer_email?: string;
    customer_name?: string;
    amount: number;
    currency: string;
    status: string;
    items_count: number;
    created_at: string;
  };
  items: DownloadItem[];
  backend_url?: string;
}

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const test = searchParams.get('test');
  const [data, setData] = useState<SuccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchSuccessDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (test === '1') params.set('test', '1');
        else if (sessionId) params.set('session_id', sessionId);
        else {
          setError('Falta session_id o modo prueba (test=1).');
          setLoading(false);
          return;
        }
        const res = await fetch(`${apiUrl}/stripe/success-details?${params}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.detail || 'No se pudieron cargar los detalles del pago.');
          setLoading(false);
          return;
        }
        if (json.status === 'success' && (json.payment || json.items)) {
          setData({
            payment: json.payment,
            items: json.items || [],
            backend_url: json.backend_url,
          });
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (err) {
        setError('Error de conexión. Comprueba que el backend esté en marcha.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessDetails();
  }, [sessionId, test, apiUrl]);

  const buildDownloadUrl = (item: DownloadItem): string => {
    const base = apiUrl;
    const folder = encodeURIComponent(item.school);
    const file = encodeURIComponent(item.filename);
    const day = item.date ? `&day=${encodeURIComponent(item.date)}` : '';
    return `${base}/photos/preview?folder_name=${folder}&filename=${file}&watermark=false${day}`;
  };

  const handleDownload = (item: DownloadItem) => {
    const url = buildDownloadUrl(item);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadAll = () => {
    if (!data?.items.length) return;
    if (test === '1') {
      // Modo prueba: descargar cada foto individualmente (no hay ZIP real)
      data.items.forEach((item, i) => {
        setTimeout(() => handleDownload(item), i * 400);
      });
      return;
    }
    if (!sessionId) return;
    const url = `${apiUrl}/stripe/download-zip?session_id=${encodeURIComponent(sessionId)}`;
    window.location.href = url;
  };

  const formatPrice = (amount: number, currency: string) => {
    const sym = currency?.toUpperCase() === 'EUR' ? '€' : '$';
    return `${sym}${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-loading">
          <div className="checkout-success-spinner" />
          <p>Cargando tus descargas...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="checkout-success-page">
        <div className="checkout-success-error">
          <h1>No se encontró el pago</h1>
          <p>{error || 'No hay datos de descarga.'}</p>
          <p className="checkout-success-hint">
            Para probar la sección de descargas sin pagar, visita:{' '}
            <Link to="/checkout/success?test=1">/checkout/success?test=1</Link>
          </p>
          <Link to="/" className="btn-back-home">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const { payment, items } = data;

  return (
    <div className="checkout-success-page">
      <div className="checkout-success-wrapper">
        <header className="checkout-success-header">
          <div className="checkout-success-icon">✓</div>
          <h1>¡Pago completado!</h1>
          <p className="checkout-success-subtitle">
            Gracias por tu compra. Aquí tienes tus fotografías para descargar sin marca de agua.
          </p>
          {payment.customer_name && (
            <p className="checkout-success-customer">Hola, {payment.customer_name}</p>
          )}
        </header>

        <section className="checkout-downloads-section">
          <h2>Descargas</h2>
          <p className="checkout-downloads-intro">
            Puedes descargar cada foto en alta calidad haciendo clic en el botón o en la imagen.
          </p>

          <div className="checkout-download-actions">
            <button type="button" className="btn-download-all" onClick={handleDownloadAll}>
              Descargar todas las fotos
            </button>
          </div>

          <ul className="checkout-download-list">
            {items.map((item) => (
              <li key={item.id} className="checkout-download-item">
                <div className="checkout-download-preview">
                  <a
                    href={buildDownloadUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Descargar ${item.filename}`}
                  >
                    <img
                      src={buildDownloadUrl(item)}
                      alt={item.filename}
                      loading="lazy"
                    />
                  </a>
                </div>
                <div className="checkout-download-info">
                  <span className="checkout-download-name">{item.filename}</span>
                  <span className="checkout-download-meta">
                    {item.school}
                    {item.date ? ` · ${item.date}` : ''}
                  </span>
                  <button
                    type="button"
                    className="btn-download-one"
                    onClick={() => handleDownload(item)}
                  >
                    Descargar esta foto
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="checkout-success-summary">
          <p>
            Total: <strong>{formatPrice(payment.amount, payment.currency)}</strong>
            {' '}· {payment.items_count} {payment.items_count === 1 ? 'foto' : 'fotos'}
          </p>
        </div>

        <div className="checkout-success-footer-actions">
          <Link to="/" className="btn-back-home">Volver al inicio</Link>
          <Link to="/schools" className="btn-explore-more">Ver más escuelas</Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
