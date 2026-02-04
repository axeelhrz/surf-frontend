import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import SchoolDays from '../components/SchoolDays';
import Footer from '../components/Footer';

const SchoolDaysPage: React.FC = () => {
  const { schoolName: paramSchool } = useParams<{ schoolName: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Soporta ambas rutas: /school/:schoolName y /school-days?school=...
  const schoolName = paramSchool || searchParams.get('school') || '';

  const handleBack = () => {
    navigate('/');
  };

  const handleSelectDay = (date: string) => {
    navigate(`/school/${encodeURIComponent(schoolName)}/day/${encodeURIComponent(date)}`);
  };

  useEffect(() => {
    if (!schoolName) {
      navigate('/', { replace: true });
    }
  }, [schoolName, navigate]);

  if (!schoolName) {
    return null;
  }

  return (
    <>
      <SchoolDays 
        schoolName={schoolName}
        onBack={handleBack}
        onSelectDay={handleSelectDay}
      />
      <Footer />
    </>
  );
};

export default SchoolDaysPage;