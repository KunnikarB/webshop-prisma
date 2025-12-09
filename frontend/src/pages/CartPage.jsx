import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
          <div className="text-center px-4">
            <ShoppingBag className="w-24 h-24 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some products to get started!
            </p>
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold">Shopping Cart</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.variant.id + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-pink-100 p-6"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-pink-50 rounded-lg flex-shrink-0">
                        <img
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-lg"
                          src={
                            item.product.image ||
                            'https://images.unsplash.com/photo-1595872018818-97555653a011'
                          }
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {item.product.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <p>Variant: {item.variant.title}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
                                  item.variant.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="h-8 w-8 border-pink-200 hover:bg-pink-50"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
                                  item.variant.id,
                                  item.quantity + 1
                                )
                              }
                              className="h-8 w-8 border-pink-200 hover:bg-pink-50"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <span className="font-bold text-primary">
                            {item.variant.sale_price_formatted ||
                              item.variant.price_formatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Calculated next step</span>
                  </div>
                  <div className="border-t border-pink-100 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{getCartTotal()}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 mb-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link to="/shop">
                  <Button
                    variant="outline"
                    className="w-full border-pink-200 text-primary hover:bg-pink-50"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
