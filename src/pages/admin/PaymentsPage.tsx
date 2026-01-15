import React, { useState, useEffect } from 'react';
import { adminApiService, Payment } from '../../services/adminApi';
import './AdminPage.css';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const data = await adminApiService.getPayments();
        setPayments(data);
      } catch (err) {
        console.error('Error loading payments:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error en fecha';
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Pagos y Transacciones</h1>
        </div>

        <div className="admin-content">
          {payments.length === 0 ? (
            <div className="empty-state">
              <p>No hay pagos registrados</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td><code>{payment.id.substring(0, 12)}...</code></td>
                    <td>{payment.customer_name}</td>
                    <td>{payment.customer_email}</td>
                    <td><strong>{formatCurrency(payment.amount)}</strong></td>
                    <td>
                      <span className={`activity-status ${
                        payment.status === 'completed' ? 'status-completed' : 'status-pending'
                      }`}>
                        {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td>{formatDate(payment.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;