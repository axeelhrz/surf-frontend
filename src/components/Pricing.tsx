import React, { useState } from 'react';
import './Pricing.css';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingPlan {
  id: number;
  title: string;
  price: number;
  description: string;
  featured?: boolean;
  details: string[];
}

const Pricing: React.FC = () => {
  const { t } = useLanguage();
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const pricingPlans: PricingPlan[] = [
    {
      id: 1,
      title: t.pricing.plan1.title,
      price: t.pricing.plan1.price,
      description: t.pricing.plan1.description,
      details: t.pricing.plan1.details,
    },
    {
      id: 2,
      title: t.pricing.plan2.title,
      price: t.pricing.plan2.price,
      description: t.pricing.plan2.description,
      featured: true,
      details: t.pricing.plan2.details,
    },
    {
      id: 3,
      title: t.pricing.plan3.title,
      price: t.pricing.plan3.price,
      description: t.pricing.plan3.description,
      details: t.pricing.plan3.details,
    },
    {
      id: 4,
      title: t.pricing.plan4.title,
      price: t.pricing.plan4.price,
      description: t.pricing.plan4.description,
      details: t.pricing.plan4.details,
    },
  ];

  const togglePlan = (id: number) => {
    setExpandedPlan(expandedPlan === id ? null : id);
  };

  return (
    <section className="pricing" id="pricing">
      <div className="pricing-wrapper">
        <div className="pricing-header">
          <h2 className="pricing-title">{t.pricing.title}</h2>
          <p className="pricing-subtitle">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`pricing-card-item ${plan.featured ? 'featured' : ''}`}>
              <div
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
                  <span className="pricing-card-toggle" aria-expanded={expandedPlan === plan.id}>
                    {expandedPlan === plan.id ? '−' : '+'}
                  </span>
                </div>
              </div>
              {/* Descripción e INCLUDES debajo de cada tarjeta (estilo FAQ) */}
              <div className={`pricing-card-details ${expandedPlan === plan.id ? 'expanded' : ''}`}>
                <h4 className="pricing-card-details-title">{t.pricing.includes}</h4>
                <ul className="pricing-card-details-list">
                  {plan.details.map((detail, index) => (
                    <li key={index} className="pricing-card-details-item">
                      <span className="pricing-card-details-icon"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>{t.pricing.note}</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;