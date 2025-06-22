'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/products'); // 🔁 Replace with actual Product Service URL if different
        if (!res.ok) {
          throw new Error('Failed to load products');
        }
        const data = await res.json();
        setProducts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🛒 Product List</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      <ul className="mt-4 space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-3 border rounded shadow-sm flex justify-between"
          >
            <span>{product.name}</span>
            <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
