import React from 'react';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import '../components/HowItWorks.css';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="page-container">
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default HowItWorksPage;