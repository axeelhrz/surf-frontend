import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SchoolsPage from './pages/SchoolsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutMePage from './pages/AboutMePage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import SchoolDaysPage from './pages/SchoolDaysPage';
import DayPhotosPage from './pages/DayPhotosPage';
import CartModal from './components/CartModal';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          cartCount={cartItems.length} 
          onCartClick={() => setShowCart(true)} 
        />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about-me" element={<AboutMePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/school/:schoolName" element={<SchoolDaysPage />} />
          <Route 
            path="/school/:schoolName/day/:date" 
            element={<DayPhotosPage onAddToCart={addToCart} />} 
          />
        </Routes>

        <CartModal 
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          items={cartItems}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
        />
      </div>
    </Router>
  );
};

export default App;