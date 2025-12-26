import React from 'react';
import './Pricing.css';

const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      id: 1,
      title: 'Foto suelta',
      price: 15,
      description: 'Una imagen individual en alta calidad',
    },
    {
      id: 2,
      title: 'Pack completo',
      price: 35,
      description: 'Todas las fotos de tu sesión, mismo día y persona',
      featured: true,
    },
    {
      id: 3,
      title: 'Día adicional',
      price: 20,
      description: 'Añade otro día a tu pack',
    },
    {
      id: 4,
      title: 'Persona adicional',
      price: 20,
      description: 'Incluye otra persona en el mismo día',
    },
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-wrapper">
        <div className="pricing-header">
          <h2 className="pricing-title">Precios</h2>
          <p className="pricing-subtitle">
            Elige la opción que mejor se adapte a ti
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
              <div className="pricing-card-content">
                <h3 className="pricing-card-title">{plan.title}</h3>
                
                <div className="pricing-card-price">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-currency">€</span>
                </div>
                
                <p className="pricing-card-description">{plan.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>Todos los precios incluyen descarga inmediata sin marca de agua</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;