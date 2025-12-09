import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { fetchProduct } from '@/lib/supabaseApi';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Use the shimmed variant from supabaseApi
      const variant = product.variants[0];
      await addToCart(product, variant, quantity, variant.inventory_quantity);

      toast({
        title: 'Added to Cart!',
        description: `${quantity}x ${product.title} added to your cart.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
            View Cart
          </Button>
        ),
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <Button onClick={() => navigate('/shop')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="mb-8 hover:bg-transparent hover:text-primary -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="bg-pink-50 aspect-square md:aspect-auto md:h-full relative overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/600'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {product.category || 'Product'}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h1>
                  <div className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="prose prose-gray mb-8">
                  <p>{product.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-8 mt-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="px-3 py-2 font-medium min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock || 99, quantity + 1)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.stock > 0 ? (
                        <span className="flex items-center text-green-600">
                          <Check className="w-4 h-4 mr-1" /> {product.stock} In
                          Stock
                        </span>
                      ) : (
                        <span className="text-red-500">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full md:w-auto min-w-[200px]"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
