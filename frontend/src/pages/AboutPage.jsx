import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description:
        'We use only premium materials and state-of-the-art printing technology to ensure every product meets our high standards.',
    },
    {
      icon: Target,
      title: 'Customer Focused',
      description:
        'Your satisfaction is our priority. We work tirelessly to exceed your expectations with every order.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'We believe in building lasting relationships with our customers and supporting creative communities.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description:
        'We continuously improve our processes and offerings to bring you the best print-on-demand experience.',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              About PrintShop
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg opacity-90 max-w-2xl"
            >
              Creating custom products with passion and precision since 2020
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  PrintShop was founded with a simple mission: to make
                  high-quality custom products accessible to everyone. What
                  started as a small operation in a garage has grown into a
                  thriving business serving thousands of satisfied customers
                  worldwide.
                </p>
                <p>
                  We believe that everyone should have the opportunity to bring
                  their creative visions to life. Whether you're designing
                  merchandise for your brand, creating unique gifts, or
                  expressing your artistic side, we're here to help you every
                  step of the way.
                </p>
                <p>
                  Our state-of-the-art printing facilities and dedicated team
                  ensure that every product we create meets our rigorous quality
                  standards. We're not just a print-on-demand service—we're your
                  creative partner.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                alt="Our printing facility"
                className="rounded-2xl shadow-xl w-full"
                src="https://images.unsplash.com/photo-1693478921503-4291ea819baa"
              />
            </motion.div>
          </div>

          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 text-center mb-12"
            >
              Our Values
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary/5 to-white rounded-xl p-6 border border-pink-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-12 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Become part of thousands of creators who trust PrintShop for their
              custom products. Let's create something amazing together.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div>
                <div className="text-4xl font-bold mb-1">10,000+</div>
                <div className="text-primary-foreground/80">
                  Happy Customers
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">50,000+</div>
                <div className="text-primary-foreground/80">
                  Products Created
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">99%</div>
                <div className="text-primary-foreground/80">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
