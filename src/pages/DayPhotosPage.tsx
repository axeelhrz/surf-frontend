import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DayPhotos from '../components/DayPhotos';
import Partners from '../components/Partners';
import Footer from '../components/Footer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface DayPhotosPageProps {
  onAddToCart: (item: CartItem) => void;
}

const DayPhotosPage: React.FC<DayPhotosPageProps> = ({ onAddToCart }) => {
  const { schoolName, date } = useParams<{ schoolName: string; date: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/school/${encodeURIComponent(schoolName!)}`);
  };

  if (!schoolName || !date) {
    navigate('/');
    return null;
  }

  return (
    <>
      <DayPhotos 
        schoolName={decodeURIComponent(schoolName)}
        date={decodeURIComponent(date)}
        onBack={handleBack}
        onAddToCart={onAddToCart}
      />
      <Partners />
      <Footer />
    </>
  );
};

export default DayPhotosPage;