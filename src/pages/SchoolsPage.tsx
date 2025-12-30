import React from 'react';
import { useNavigate } from 'react-router-dom';
import Schools from '../components/Schools';
import Footer from '../components/Footer';

const SchoolsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectSchool = (schoolName: string) => {
    navigate(`/school/${encodeURIComponent(schoolName)}`);
  };

  return (
    <div>
      <Schools onSelectSchool={handleSelectSchool} />
      <Footer />
    </div>
  );
};

export default SchoolsPage;