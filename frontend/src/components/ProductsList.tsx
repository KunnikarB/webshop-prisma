import { useState } from 'react';
import type { Product } from '../App';

interface Props {
  products: Product[];
  onUpdate: (
    id: number,
    data: Partial<{
      name: string;
      price: number;
      stock: number;
      categoryId: number;
    }>
  ) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function ProductsList({ products, onUpdate, onDelete, loading }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
  });

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId.toString(),
    });
  };

  const submitEdit = async (id: number) => {
    try {
      await onUpdate(id, {
        name: editForm.name,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        categoryId: Number(editForm.categoryId),
      });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  return (
    <ul className="space-y-4">
      {products.map((p) => (
        <li
          key={p.id}
          className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
        >
          {editingId === p.id ? (
            <>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="border p-1 rounded"
              />
              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="border p-1 rounded"
              />
              <input
                type="number"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: e.target.value })
                }
                className="border p-1 rounded"
              />
              <input
                type="number"
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
                className="border p-1 rounded"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => submitEdit(p.id)}
                  className="bg-green-400 p-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 p-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="font-bold text-primary">{p.name}</span>
              <span>Price: {p.price}</span>
              <span>Stock: {p.stock}</span>
              <span>Category: {p.category.name}</span>
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startEdit(p)}
                  className="bg-green-400 p-1 rounded"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="bg-pink-600 p-1 rounded text-white"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
