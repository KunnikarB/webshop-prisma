import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart as ShoppingCartIcon,
  X,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    navigate('/checkout');
  }, [navigate, setIsCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-primary to-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-primary hover:bg-pink-50"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCartIcon size={40} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500">
                    Looks like you haven't added anything yet.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.variant.id}
                    className="flex gap-4 bg-white p-4 rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-20 h-20 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={
                          item.product.image ||
                          'https://images.unsplash.com/photo-1595872018818-97555653a011'
                        }
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 truncate pr-2">
                          {item.product.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.variant.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.variant.title}
                      </p>

                      <div className="flex justify-between items-end">
                        <p className="font-bold text-primary">
                          {item.variant.sale_price_formatted ||
                            item.variant.price_formatted}
                        </p>

                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.variant.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variant.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-pink-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {getCartTotal()}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg shadow-lg shadow-pink-200"
                >
                  Proceed to Checkout
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Shipping and taxes calculated at next step
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
