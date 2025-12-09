import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { fetchProducts } from '@/lib/supabaseApi';

const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzM0LnJvZy8yMDAwL3N2ZyI+CgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNGQ0U3RjMiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjREIyNzcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Use the first mocked variant
      const defaultVariant = product.variants[0];

      try {
        await addToCart(
          product,
          defaultVariant,
          1,
          defaultVariant.inventory_quantity
        );
        toast({
          title: 'Added to Cart! 🛒',
          description: `${product.title} has been added to your cart.`,
        });
      } catch (error) {
        toast({
          title: 'Error adding to cart',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
    [product, addToCart, toast]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="group bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-pink-50">
            <img
              src={product.image || placeholderImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-pink-100">
              <span className="text-primary">${product.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
              {product.description || 'Premium quality product'}
            </p>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all"
              disabled={!product.stock || product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProductsList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(limit ? data.slice(0, limit) : data);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-red-50 p-8 rounded-xl border border-red-100">
        <p className="text-red-600">Error loading products: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center bg-gray-50 p-12 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500">
          No products available. Add some in the Admin Dashboard!
        </p>
        <Link to="/admin">
          <Button variant="link" className="mt-2">
            Go to Admin
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductsList;
