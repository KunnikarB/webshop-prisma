import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Customer = { id: number; name: string };
type Product = { id: number; name: string; price: number };
type OrderItemInput = { productId: number; quantity: number };

type Order = {
  id: number;
  customerId: number;
  orderDate: string;
  orderItems: { productId: number; quantity: number }[];
};

const API_BASE = 'http://localhost:3000'; 

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const [orderItems, setOrderItems] = useState<OrderItemInput[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch customers & products
  useEffect(() => {
    axios.get(`${API_BASE}/customers`).then((res) => setCustomers(res.data));
    axios.get(`${API_BASE}/products`).then((res) => setProducts(res.data));
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${API_BASE}/orders`);
    setOrders(res.data);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: 0, quantity: 1 }]);
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updated = [...orderItems];
    (updated[index] as any)[field] = Number(value);
    setOrderItems(updated);
  };

  const submitOrder = async () => {
    if (!selectedCustomer || orderItems.length === 0)
      return alert('Select customer & items!');
    try {
      await axios.post(`${API_BASE}/orders`, {
        customerId: selectedCustomer,
        items: orderItems,
      });
      alert('Order created!');
      setOrderItems([]);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Customer</label>
        <select
          className="border p-2 w-full"
          value={selectedCustomer || ''}
          onChange={(e) => setSelectedCustomer(Number(e.target.value))}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Order Items</h2>
        {orderItems.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <select
              className="border p-2 flex-1"
              value={item.productId}
              onChange={(e) =>
                updateOrderItem(idx, 'productId', e.target.value)
              }
            >
              <option value={0}>Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price})
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border p-2 w-20"
              value={item.quantity}
              min={1}
              onChange={(e) => updateOrderItem(idx, 'quantity', e.target.value)}
            />
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={addOrderItem}
        >
          Add Item
        </button>
      </div>

      <button
        className="bg-green-500 text-white px-6 py-2 rounded"
        onClick={submitOrder}
      >
        Submit Order
      </button>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id} className="border p-2 mb-2">
            <div>Order ID: {o.id}</div>
            <div>Customer ID: {o.customerId}</div>
            <div>Order Date: {new Date(o.orderDate).toLocaleString()}</div>
            <div>
              Items:
              <ul className="ml-4">
                {o.orderItems.map((oi, idx) => (
                  <li key={idx}>
                    Product {oi.productId} × {oi.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
