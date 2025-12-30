import React from 'react';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import '../components/FAQ.css';

const FAQPage: React.FC = () => {
  return (
    <div className="page-container">
      <FAQ />
      <Footer />
    </div>
  );
};

export default FAQPage;