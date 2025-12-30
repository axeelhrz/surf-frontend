import React from 'react';
import './CartModal.css';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onRemoveItem: (id: string) => void;
  totalPrice: number;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, items, onRemoveItem, totalPrice }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tus Recuerdos</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {items.length === 0 ? (
            <p style={{textAlign: 'center', color: '#999'}}>Tus recuerdos están vacíos</p>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  <button onClick={() => onRemoveItem(item.id)}>Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;