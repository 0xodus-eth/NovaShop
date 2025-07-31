import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

const Signup: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Get redirect path from query string
  const redirect = typeof router.query.redirect === 'string' ? router.query.redirect : '/';

  const handleSubmit = async (e: React.FormEvent) => {
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
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" className="w-full px-4 py-3 border rounded-xl" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;





/*

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext'; // adjust as needed

const Signup: React.FC = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Password is not strictly needed if you're not doing authentication
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email /*|| !password*/ /*) {
      setError('Please fill all fields');
      return;
    }
    // For guest checkout, omit password
    setUser({ name, email });
    // Redirect - adjust as desired
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" className="w-full px-4 py-3 border rounded-xl" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
        {/* Hide this input if guests don't need passwords */ /*}
        {/* <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl" value={password} onChange={e => setPassword(e.target.value)} /> */ /*}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;

*/