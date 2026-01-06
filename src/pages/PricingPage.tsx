import React from 'react';
import Pricing from '../components/Pricing';
import Partners from '../components/Partners';
import Footer from '../components/Footer';
import '../components/Pricing.css';

const PricingPage: React.FC = () => {
  return (
    <div className="page-container">
      <Pricing />
      <Partners />
      <Footer />
    </div>
  );
};

export default PricingPage;