import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SchoolsPage from './pages/SchoolsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutMePage from './pages/AboutMePage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import SchoolDaysPage from './pages/SchoolDaysPage';
import DayPhotosPage from './pages/DayPhotosPage';
import LegalNoticePage from './pages/LegalNoticePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import CartModal from './components/CartModal';
import ScrollToTop from './components/ScrollToTop';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  /** Número de fotos cuando es un pack (Pack Completo) */
  photoCount?: number;
}

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Si es un pack, quitar antes cualquier pack con el mismo id (evitar duplicados)
      const next = item.id.startsWith('pack_')
        ? prevItems.filter((i) => i.id !== item.id)
        : prevItems;
      // Primer pack = 35 € (Pack completo), packs siguientes = 20 € (Día adicional)
      const isPack = item.id.startsWith('pack_');
      const hasExistingPack = next.some((i) => i.id.startsWith('pack_'));
      const price = isPack && hasExistingPack ? 20 : item.price;
      const itemToAdd = { ...item, price };
      return [...next, itemToAdd];
    });
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navbar 
            cartCount={cartItems.length} 
            onCartClick={() => setShowCart(true)} 
          />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/school-days" element={<SchoolDaysPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about-me" element={<AboutMePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/school/:schoolName" element={<SchoolDaysPage />} />
          <Route 
            path="/school/:schoolName/day/:date" 
            element={<DayPhotosPage onAddToCart={addToCart} />} 
          />
          <Route path="/legal-notice" element={<LegalNoticePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
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
    </LanguageProvider>
  );
};

export default App;