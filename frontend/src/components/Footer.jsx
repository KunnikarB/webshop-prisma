import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Success!',
        description: 'Thank you for subscribing to our newsletter!',
      });
      setEmail('');
    }
  };
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-white dark:from-zinc-950 dark:to-black border-t border-pink-100 dark:border-pink-900/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/90 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">KB</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Creative
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Create custom print-on-demand products with high-quality materials
              and fast shipping.
            </p>

            <div className="mb-6">
              <span className="font-semibold text-gray-900 dark:text-white block mb-3">
                Subscribe to our newsletter
              </span>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex gap-2 max-w-md"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 border-pink-200 dark:border-pink-900/50 dark:bg-zinc-900 focus:border-pink-400 focus:ring-pink-400"
                />
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div>
            <span className="font-semibold text-gray-900 dark:text-white block mb-4">
              Quick Links
            </span>
            <div className="space-y-2">
              <Link
                to="/shop"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-gray-900 dark:text-white block mb-4">
              Follow Us
            </span>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
              >
                <Mail className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-100 dark:border-pink-900/30 pt-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} PrintShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
