import React from 'react';
import AboutMe from '../components/AboutMe';
import Partners from '../components/Partners';
import Footer from '../components/Footer';
import '../components/AboutMe.css';

const AboutMePage: React.FC = () => {
  return (
    <div className="page-container">
      <AboutMe />
      <Partners />
      <Footer />
    </div>
  );
};

export default AboutMePage;