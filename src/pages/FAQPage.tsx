import React from 'react';
import FAQ from '../components/FAQ';
import Partners from '../components/Partners';
import Footer from '../components/Footer';
import '../components/FAQ.css';

const FAQPage: React.FC = () => {
  return (
    <div className="page-container">
      <FAQ />
      <Partners />
      <Footer />
    </div>
  );
};

export default FAQPage;