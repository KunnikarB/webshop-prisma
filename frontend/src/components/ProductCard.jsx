import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-pink-50 overflow-hidden">
          <img
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            src="https://images.unsplash.com/photo-1635865165118-917ed9e20936"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>

          <Link to={`/product/${product.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
