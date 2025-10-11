import { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { AddProductForm } from './components/ProductForm';
import ProductsList from './components/ProductsList';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  category: { name: string };
  orderItems: string[];
}

const API_URL = 'http://localhost:3000/products';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get<Product[]>(API_URL);
        setProducts(res.data);
      } catch {
        toast.error('Failed to fetch products');
      }
    }
    fetchProducts();
  }, []);


  const addProduct = async (data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post<Product>(API_URL, data);
      const newProduct = res.data;

      setProducts((prev) => [...prev, newProduct]);

      toast.success('Product added successfully!');
    } catch {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 font-sans">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-primary mb-6">
        Product Dashboard
      </h1>

      <AddProductForm addProduct={addProduct} loading={loading} />

      <ProductsList products={products} />
    </div>
  );
}
