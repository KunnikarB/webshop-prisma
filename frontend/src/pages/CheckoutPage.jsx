import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity } =
    useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateNumericTotal = () => {
    return cartItems.reduce((total, item) => {
      const price =
        item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
      // Convert cents to dollars for DB storage
      return total + (price / 100) * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    if (!formData.country) return 0;
    const country = formData.country.toLowerCase();
    return country === 'united states' || country === 'usa' ? 10 : 15;
  };

  const calculateTax = () => {
    const subtotal = calculateNumericTotal();
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotalWithShipping = () => {
    const subtotal = calculateNumericTotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    return subtotal + shipping + tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create order data for backend
      const orderData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.variant.price_in_cents / 100,
        })),
      };

      // Send order to backend
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const createdOrder = await response.json();

      // Store order in localStorage for the success page with calculated pricing
      const displayOrder = {
        id: createdOrder.id,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cartItems.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.variant.price_in_cents / 100,
        })),
        subtotal: createdOrder.subtotal,
        shippingCost: createdOrder.shippingCost,
        tax: createdOrder.tax,
        total: createdOrder.totalPrice,
      };

      localStorage.setItem('lastOrder', JSON.stringify(displayOrder));

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate('/success');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: 'Failed to process order. Please try again.',
      });
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="border-pink-200"
                        style={{ '--tw-ring-color': 'hsl(var(--primary))' }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="border-pink-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Proceed to Payment - {getCartTotal()}
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start text-sm py-3 border-b border-pink-50 last:border-0 gap-2"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {item.product.title}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {item.variant?.title || 'Default'}
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          $
                          {(
                            (item.variant.sale_price_in_cents ||
                              item.variant.price_in_cents) / 100
                          ).toFixed(2)}
                          each
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-medium text-gray-900">
                          $
                          {(
                            ((item.variant.sale_price_in_cents ||
                              item.variant.price_in_cents) /
                              100) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.variant.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 hover:bg-gray-200 rounded transition"
                            title="Decrease quantity"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.variant.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-200 rounded transition"
                            title="Increase quantity"
                          >
                            <Plus className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variant.id)}
                          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1"
                          title="Remove from cart"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-pink-100 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${calculateNumericTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">
                      {formData.country
                        ? `$${calculateShipping().toFixed(2)}`
                        : 'Enter country'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-pink-100 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        ${calculateTotalWithShipping().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
