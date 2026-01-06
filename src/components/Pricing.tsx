import React, { useState } from 'react';
import './Pricing.css';

interface PricingPlan {
  id: number;
  title: string;
  price: number;
  description: string;
  featured?: boolean;
  details: string[];
}

const Pricing: React.FC = () => {
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      id: 1,
      title: 'Foto suelta',
      price: 15,
      description: 'Una imagen individual en alta calidad',
      details: [
        'Descarga inmediata',
        'Alta resolución (300 DPI)',
        'Sin marca de agua',
        'Formato JPG',
        'Válido para impresión',
      ],
    },
    {
      id: 2,
      title: 'Pack completo',
      price: 35,
      description: 'Todas las fotos de tu sesión, mismo día y persona',
      featured: true,
      details: [
        'Todas las fotos del día',
        'Descarga inmediata',
        'Alta resolución (300 DPI)',
        'Sin marca de agua',
        'Formato JPG',
        'Ahorra hasta 50%',
      ],
    },
    {
      id: 3,
      title: 'Día adicional',
      price: 20,
      description: 'Añade otro día a tu pack',
      details: [
        'Todas las fotos del día extra',
        'Mismo precio por día adicional',
        'Descarga inmediata',
        'Alta resolución',
        'Sin marca de agua',
      ],
    },
    {
      id: 4,
      title: 'Persona adicional',
      price: 20,
      description: 'Incluye otra persona en el mismo día',
      details: [
        'Fotos de otra persona',
        'Mismo día de sesión',
        'Descarga inmediata',
        'Alta resolución',
        'Sin marca de agua',
      ],
    },
  ];

  const togglePlan = (id: number) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  const selectedPlanData = expandedPlan ? pricingPlans.find(p => p.id === expandedPlan) : null;

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
              className={`pricing-card ${plan.featured ? 'featured' : ''} ${expandedPlan === plan.id ? 'active' : ''}`}
              onClick={() => togglePlan(plan.id)}
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

        {/* Panel de detalles expandible - Debajo de todas las tarjetas */}
        <div className={`pricing-details-section ${expandedPlan ? 'expanded' : ''}`}>
          {selectedPlanData && (
            <div className="details-section-content">
              <div className="details-section-header">
                <h3 className="details-section-title">{selectedPlanData.title}</h3>
                <div className="details-section-price">
                  <span className="details-price-amount">{selectedPlanData.price}</span>
                  <span className="details-price-currency">€</span>
                </div>
              </div>
              
              <div className="details-section-body">
                <p className="details-section-description">{selectedPlanData.description}</p>
                
                <div className="details-divider"></div>
                
                <h4 className="details-list-title">Incluye</h4>
                <ul className="details-list">
                  {selectedPlanData.details.map((detail, index) => (
                    <li key={index} className="details-list-item">
                      <span className="details-list-icon"></span>
                      <span className="details-list-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="pricing-note">
          <p>Todos los precios incluyen descarga inmediata sin marca de agua</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;