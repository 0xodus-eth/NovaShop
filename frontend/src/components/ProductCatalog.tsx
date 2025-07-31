'use client'
import React from 'react';
import { useCart } from '../context/CartContext';
import { useProducts, Product } from '../hooks/useProducts';

// ---- Normalizer Function (real version) ----
function normalizeProduct(product: Product) {
  return {
    _id: product._id !== undefined ? String(product._id) : product.id ? String(product.id) : 'NO_ID',
    name: product.name ?? product.title ?? 'Unnamed Product',
    description: product.description ?? '',
    price: product.price ?? 0,
    category: product.category ?? '',
    stock: typeof product.stock === 'number' ? product.stock : 100,
    image: product.image ?? '',
    rating:
      typeof product.rating === 'object'
        ? product.rating.rate ?? 0
        : product.rating ?? 0,
    reviews:
      typeof product.rating === 'object'
        ? product.rating.count ?? 0
        : product.reviews ?? 0,
    features: Array.isArray(product.features) ? product.features : [],
  };
}

export default function ProductCatalog() {
  // === HOOKS ===
  const { addToCart } = useCart(); // <--- If this is undefined or throws, show me your provider imports!
  const { products, loading, error } = useProducts({ page: 1, limit: 12 });

  // === DEBUG: Confirm Cart Context Works ===
  // Remove these logs after debugging!
  console.log('addToCart:', typeof addToCart);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
        Product Catalog
      </h1>
      {/* -- MAP PRODUCTS -- */}
      {products.map((product) => {
        const p = normalizeProduct(product);

        // Log normalized product if needed (can be removed)
        console.log("Listing:", p.name, "Stock:", p.stock);

        return (
          <div key={p._id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #EEE',
            borderRadius: 8,
            padding: 18,
            marginBottom: 16
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: '#555', fontSize: 14 }}>{p.description}</div>
              <div style={{ color: '#222', fontWeight: 700, marginTop: 4 }}>${p.price.toFixed(2)}</div>
              {p.stock === 0 && <div style={{ color: 'red' }}>Out of stock</div>}
            </div>
            <button
              style={{
                marginLeft: 20,
                padding: '8px 20px',
                borderRadius: 6,
                border: 'none',
                color: '#fff',
                background: p.stock === 0 ? '#aaa' : '#6366f1', // indigo
                cursor: p.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: p.stock === 0 ? 0.6 : 1,
                fontWeight: 600
              }}
              disabled={p.stock === 0}
              onClick={() => {
                // DEBUG: show the Add to Cart click works
                alert("About to add to cart: " + p.name)
                // ---- REAL ADD TO CART ----
                addToCart({
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  quantity: 1
                });
                // Remove alert after confirming working!
              }}
            >
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
}


