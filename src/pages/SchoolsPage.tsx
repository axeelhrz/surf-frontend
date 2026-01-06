import React from 'react';
import { useNavigate } from 'react-router-dom';
import Schools from '../components/Schools';
import Partners from '../components/Partners';
import Footer from '../components/Footer';

const SchoolsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectSchool = (schoolName: string) => {
    navigate(`/school/${encodeURIComponent(schoolName)}`);
  };

  return (
    <div>
      <Schools onSelectSchool={handleSelectSchool} />
      <Partners />
      <Footer />
    </div>
  );
};

export default SchoolsPage;