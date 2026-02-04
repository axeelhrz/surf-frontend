import React from 'react';
import { Link } from 'react-router-dom';
import './CheckoutCancelPage.css';

const CheckoutCancelPage: React.FC = () => {
  return (
    <div className="checkout-cancel-page">
      <div className="checkout-cancel-wrapper">
        <div className="checkout-cancel-icon">✕</div>
        <h1>Pago cancelado</h1>
        <p>No se ha realizado ningún cargo. Puedes volver al carrito o seguir navegando.</p>
        <div className="checkout-cancel-actions">
          <Link to="/" className="btn-cancel-home">Volver al inicio</Link>
          <Link to="/schools" className="btn-cancel-schools">Ver escuelas</Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
