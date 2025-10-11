import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  addProduct: (data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
  }) => Promise<void>;
  loading: boolean;
}


export function AddProductForm({ addProduct, loading }: Props) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',

  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
    };

    await addProduct(payload);
    setForm({ name: '', price: '', stock: '', categoryId: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col gap-3 max-w-md"
    >
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <input
        type="number"
        placeholder="Category ID"
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-400 text-white p-2 rounded-md hover:bg-pink-600 transition"
      >
        Add User
      </button>
    </form>
  );
}