import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SchoolDays from '../components/SchoolDays';
import Footer from '../components/Footer';

const SchoolDaysPage: React.FC = () => {
  const { schoolName } = useParams<{ schoolName: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectDay = (date: string) => {
    navigate(`/school/${encodeURIComponent(schoolName!)}/day/${encodeURIComponent(date)}`);
  };

  if (!schoolName) {
    navigate('/');
    return null;
  }

  return (
    <>
      <SchoolDays 
        schoolName={decodeURIComponent(schoolName)}
        onBack={handleBack}
        onSelectDay={handleSelectDay}
      />
      <Footer />
    </>
  );
};

export default SchoolDaysPage;