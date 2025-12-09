import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Truck, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/ProductList';
const HomePage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Unique Designs',
      description: 'Create unique designs',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Quick delivery to your doorstep',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Premium materials and printing',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Each product crafted with care',
    },
  ];
  return (
    <>
      <div className="min-h-screen bg-background">
        <section className="relative bg-gradient-to-br from-pink-100 via-pink-50 to-white dark:from-black dark:via-zinc-900 dark:to-black overflow-hidden transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{
                  opacity: 0,
                  x: -50,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Create Custom Products That{' '}
                  <span className="text-primary">Stand Out</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Turn your ideas into reality with our high-quality
                  print-on-demand products. No minimum orders, fast shipping,
                  and premium quality guaranteed.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/shop">
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                      Start Shopping
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/20 px-8 py-6 text-lg"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: 50,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
                className="relative"
              >
                <img
                  alt="Custom print products showcase"
                  className="rounded-2xl shadow-2xl w-full border-4 border-white dark:border-zinc-800"
                  src="https://horizons-cdn.hostinger.com/b80ee886-f713-4148-8cba-f6f748067c6d/tolebag-mog-lyIJc.jpeg"
                />
              </motion.div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 dark:bg-pink-900/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 dark:bg-pink-800/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        </section>

        <section className="py-16 bg-white dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-pink-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-transparent dark:border-pink-900/30">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-pink-50 dark:from-black dark:to-zinc-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              viewport={{
                once: true,
              }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover our most popular items and start creating your custom
                products today
              </p>
            </motion.div>

            <div className="mb-12">
              <ProductsList limit={4} />
            </div>

            <div className="text-center">
              <Link to="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              viewport={{
                once: true,
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-lg mb-8 opacity-90 text-white">
                Join thousands of satisfied customers who trust us with their
                custom products
              </p>
              <Link to="/shop">
                <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};
export default HomePage;
