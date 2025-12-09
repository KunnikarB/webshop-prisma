import React from 'react';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductList';

const ShopPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-black dark:to-zinc-950 transition-colors duration-300">
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Shop All Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg opacity-90"
            >
              Discover our full collection of customizable products
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 
            Note: Client-side filtering removed as EcommerceApi doesn't support category filtering in getProducts.
            Showing all products instead.
          */}
          <ProductsList />
        </div>
      </div>
    </>
  );
};

export default ShopPage;
