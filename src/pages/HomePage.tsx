import React from 'react';
import Home from '../components/Home';
import HowItWorks from '../components/HowItWorks';
import AboutMe from '../components/AboutMe';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Partners from '../components/Partners';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Home />
      <HowItWorks />
      <AboutMe />
      <Pricing />
      <FAQ />
      <Partners />
      <Footer />
    </>
  );
};

export default HomePage;