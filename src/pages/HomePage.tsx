import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home';
import HowItWorks from '../components/HowItWorks';
import AboutMe from '../components/AboutMe';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectSchool = (schoolName: string) => {
    navigate(`/school/${encodeURIComponent(schoolName)}`);
  };

  return (
    <>
      <Home onSelectSchool={handleSelectSchool} />
      <HowItWorks />
      <AboutMe />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;