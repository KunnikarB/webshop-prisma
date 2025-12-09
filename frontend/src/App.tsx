// ...existing code...
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
// @ts-expect-error No type declaration for CartContext.jsx
import { CartProvider } from './contexts/CartContext';
// @ts-expect-error No type declaration for FirebaseAuthContext.jsx
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';
// @ts-expect-error No type declaration for Navbar.jsx
import Navbar from './components/Navbar';
// @ts-expect-error No type declaration for Footer.jsx
import Footer from './components/Footer';
// @ts-expect-error No type declaration for HomePage.jsx
import HomePage from './pages/HomePage';
// @ts-expect-error No type declaration for ShopPage.jsx
import ShopPage from './pages/ShopPage';
// @ts-expect-error No type declaration for ProductPage.jsx
import ProductPage from './pages/ProductPage';
// @ts-expect-error No type declaration for CartPage.jsx
import CartPage from './pages/CartPage';
// @ts-expect-error No type declaration for CheckoutPage.jsx
import CheckoutPage from './pages/CheckoutPage';
// @ts-expect-error No type declaration for SuccessPage.jsx
import SuccessPage from './pages/SuccessPage';
// @ts-expect-error No type declaration for AboutPage.jsx
import AboutPage from './pages/AboutPage';
// @ts-expect-error No type declaration for ContactPage.jsx
import ContactPage from './pages/ContactPage';
// @ts-expect-error No type declaration for AdminPage.jsx
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <FirebaseAuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
            <Footer />
            <Toaster />
          </div>
        </CartProvider>
      </FirebaseAuthProvider>
    </Router>
  );
}

export default App;
