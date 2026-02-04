import React from 'react';
import Home from '../components/Home';
import Schools from '../components/Schools';
import Partners from '../components/Partners';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectSchool = (schoolName: string) => {
    navigate(`/school-days?school=${encodeURIComponent(schoolName)}`);
  };

  return (
    <>
      <Home />
      <Schools onSelectSchool={handleSelectSchool} />
      <Partners />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;