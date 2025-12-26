import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import SchoolDays from './components/SchoolDays';
import DayPhotos from './components/DayPhotos';
import Footer from './components/Footer';
import CartModal from './components/CartModal';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

type NavigationState = 'home' | 'days' | 'photos';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavigationState>('home');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const addToCart = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleSelectSchool = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setCurrentPage('days');
  };

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
    setCurrentPage('photos');
  };

  const handleBackFromDays = () => {
    setSelectedSchool(null);
    setCurrentPage('home');
  };

  const handleBackFromPhotos = () => {
    setSelectedDate(null);
    setCurrentPage('days');
  };

  return (
    <div className="App">
      <Navbar 
        cartCount={cartItems.length} 
        onCartClick={() => setShowCart(true)} 
      />
      
      {currentPage === 'home' && (
        <>
          <Home onSelectSchool={handleSelectSchool} />
          <HowItWorks />
          <Pricing />
          <Footer />
        </>
      )}

      {currentPage === 'days' && selectedSchool && (
        <>
          <SchoolDays 
            schoolName={selectedSchool}
            onBack={handleBackFromDays}
            onSelectDay={handleSelectDay}
          />
          <Footer />
        </>
      )}

      {currentPage === 'photos' && selectedSchool && selectedDate && (
        <>
          <DayPhotos 
            schoolName={selectedSchool}
            date={selectedDate}
            onBack={handleBackFromPhotos}
            onAddToCart={addToCart}
          />
          <Footer />
        </>
      )}

      <CartModal 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
      />
    </div>
  );
};

export default App;