import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

const Signin: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Get redirect path from query string
  const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill all fields');
      return;
    }
    setUser({ name, email });
    router.push(redirect || '/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 border rounded-xl"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;




/*

Original code for signin page


import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext'; // adjust the import path as needed

const Signin: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // If you want password, include this field:
  // const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill all fields');
      return;
    }
    setUser({ name, email });
    router.push('/checkout'); // or wherever you want to redirect after sign in
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 border rounded-xl"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {/* Uncomment for password field
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-xl"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /> *//*}*/ /*
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
*/