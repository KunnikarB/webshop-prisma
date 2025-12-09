import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/customSupabaseClient';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { clearCart } = useCart();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [order, setOrder] = useState(null);

  const calculateSubtotal = (items) => {
    return (
      items
        ?.reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2) || '0.00'
    );
  };

  useEffect(() => {
    const completeOrder = async () => {
      // Get order from localStorage
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        try {
          setOrder(JSON.parse(lastOrder));
        } catch (err) {
          console.error('Error parsing order:', err);
        }
      }

      clearCart();
      setStatus('success');
    };

    completeOrder();
  }, [clearCart]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-pink-100 text-center">
          {status === 'verifying' && (
            <div className="py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900">
                Verifying Order...
              </h1>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thank You!
              </h1>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully. You will receive an
                email confirmation shortly.
              </p>

              {order && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Order ID:</span>{' '}
                      {order.id}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Email:</span>{' '}
                      {order.customer.email}
                    </p>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Items:</span>{' '}
                        {order.items.length} item(s)
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Subtotal:</span> $
                        {order.subtotal?.toFixed(2) ||
                          calculateSubtotal(order.items)}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Shipping:</span> $
                        {order.shippingCost?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Tax:</span> $
                        {order.tax?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-lg font-bold text-primary border-t border-gray-300 pt-2 mt-2">
                        Total: ${order.total?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link to="/shop">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>

                <Link to="/">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-primary hover:bg-pink-50"
                  >
                    Return to Home <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Received
              </h1>
              <p className="text-gray-600 mb-8">
                Your payment was successful, but we had trouble updating the
                order status in our system. Don't worry, our team has been
                notified.
              </p>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-primary"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
