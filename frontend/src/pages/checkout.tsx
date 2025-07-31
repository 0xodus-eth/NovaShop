
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { user } = useUser();
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!items.length) {
      router.replace('/'); // or '/cart'
      return;
    }
    if (!user) {
      router.replace('/signin?redirect=/checkout');
    }
  }, [user, items, router]);

  if (!user || !items.length) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
      <div className="mb-4">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span>${item.price} x {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
        Place Order
      </button>
    </div>
  );
};

export default Checkout;


/*

Modified 1 code for checkout page


import React from 'react';
import { useUser } from '@/context/UserContext';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { user } = useUser();
  const { items } = useCart();

  if (!user) {
    return <div className="text-center mt-12">Please sign in to checkout.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
      <div className="mb-4">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item: CartItem, idx: number) => (
            <li key={idx} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span>${item.price} x {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

*/

/*

 Original code for checkout page

import React from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { user } = useUser();
  const { items } = useCart(); // <-- use 'items' not 'cart'

  if (!user) {
    return <div className="text-center mt-12">Please sign in to checkout.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
      <div className="mb-4">
        <div><strong>Name:</strong> {user.name}</div>
        <div><strong>Email:</strong> {user.email}</div>
      </div>
      <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
      {items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((item: CartItem, idx: number) => (
            <li key={idx} className="flex justify-between border-b py-2">
              <span>{item.name}</span>
              <span>${item.price} x {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

*/