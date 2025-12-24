import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Recognition from './components/Recognition';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
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
    <div className="App">
      <Navbar 
        cartCount={cartItems.length} 
        onCartClick={() => setShowCart(true)} 
      />
      <Hero />
      <Recognition onAddToCart={addToCart} />
      <Gallery onAddToCart={addToCart} />
      <CartModal 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
      />
      <Footer />
    </div>
  );
};

export default App;