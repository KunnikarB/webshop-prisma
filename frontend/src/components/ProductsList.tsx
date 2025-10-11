import type { Product } from '../App';


interface Props {
  products: Product[];
}

export default function ProductsList({ products }: Props) {
  return (
    
    <ul className="space-y-4">
      {products.map((p) => (
        <li
          key={p.id}
          className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
        >
          <span className="font-bold text-primary">{p.name}</span>
          <span>Name: {p.name}</span>
          <span>Price: {p.price}</span>
          <span>Stock: {p.stock}</span>
          <span>Category ID: {p.categoryId}</span>
          <span>Category: {p.category.name}</span>
          <span>Created At: {new Date(p.createdAt).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}