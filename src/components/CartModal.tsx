import React, { useState } from 'react';
import './CartModal.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  /** Número de fotos cuando es Pack Completo */
  photoCount?: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  totalPrice: number;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onRemoveItem, totalPrice }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsProcessing(true);
    // Aquí iría la lógica de pago
    setTimeout(() => {
      setIsProcessing(false);
      alert('Procesando pago...');
    }, 1500);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const getItemCount = () => {
    return items.length;
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-modal-header">
          <div className="cart-header-title">
            <svg className="cart-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <div>
              <h2>Tus Recuerdos</h2>
              <p className="cart-subtitle">{getItemCount()} {getItemCount() === 1 ? 'artículo' : 'artículos'}</p>
            </div>
          </div>
          <button className="cart-modal-close" onClick={onClose} aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Body */}
        <div className="cart-modal-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3>Tu carrito está vacío</h3>
              <p>Explora nuestras fotos y añade tus recuerdos favoritos</p>
              <button className="btn-explore" onClick={onClose}>
                Explorar Fotos
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  {/* Imagen del producto */}
                  <div className="cart-item-image-wrapper">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="cart-item-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="cart-item-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-meta">
                      {item.photoCount != null && item.photoCount > 0 ? (
                        <span className="cart-item-format">Pack completo · {item.photoCount} {item.photoCount === 1 ? 'foto' : 'fotos'}</span>
                      ) : (
                        <>
                          <span className="cart-item-format">Formato Digital</span>
                          <span className="cart-item-quality">Alta Resolución</span>
                        </>
                      )}
                    </div>
                    <div className="cart-item-price-section">
                      <span className="cart-item-price">${formatPrice(item.price)}</span>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button 
                    className="cart-item-remove"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Eliminar artículo"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-modal-footer">
            {/* Resumen de precios */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Descuento</span>
                <span className="discount-text">-$0.00</span>
              </div>
              <div className="cart-summary-divider"></div>
              <div className="cart-summary-row cart-total">
                <span>Total</span>
                <span className="total-price">${formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="cart-actions">
              <button 
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="btn-spinner"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Proceder al Pago
                  </>
                )}
              </button>
              <button className="btn-continue-shopping" onClick={onClose}>
                Seguir Comprando
              </button>
            </div>

            {/* Información adicional */}
            <div className="cart-info-badges">
              <div className="info-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Pago Seguro</span>
              </div>
              <div className="info-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Descarga Instantánea</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;