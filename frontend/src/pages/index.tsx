import React, { useState } from 'react';
import { ShoppingCart, Package, Home, User, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import ProductCatalog from '../components/ProductCatalog';
import HomePage from '../components/HomePage';
import CreateOrder from '../components/CreateOrder';
import Cart from '../components/Cart';

type ViewType = 'home' | 'products' | 'cart' | 'orders' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'cart', name: 'Cart', icon: ShoppingCart },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  // Add auth and cart context!
  const { user } = useUser();
  const { items } = useCart();
  const router = useRouter();

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'products':
        return <ProductCatalog />;
      case 'cart':
        return <Cart />;
      case 'orders':
        return <CreateOrder />;
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h2>
              <p className="text-gray-600">Profile management coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  // Checkout navigation handler for desktop/mobile
  const handleCheckout = () => {
    if (!items.length) {
      alert('You must add products to your cart before checking out!');
      router.push('/products');
      return;
    }
    if (!user) {
      router.push('/signin?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NovaShop
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as ViewType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}

              <Link
                href="/signup"
                className="ml-3 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
              {/* Smart Checkout Button */}
              <button
                onClick={handleCheckout}
                className="ml-1 px-4 py-2 rounded-xl text-sm font-semibold text-green-600 hover:bg-green-50 border border-green-200 transition"
              >
                Checkout
              </button>
            </div>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-xl px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as ViewType);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                >
                  Sign Up
                </Link>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                >
                  Sign In
                </Link>
                {/* Smart Checkout Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleCheckout();
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-green-600 hover:bg-green-50 border border-green-200 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* Footer... */}
      {/* ...no changes to your footer! */}
      <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">NovaShop</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  A modern microservices-based e-commerce platform built for scalability and performance.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">GH</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">TW</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">LI</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Products</a></li>
                  <li><a href="#" className="hover:text-gray-900">Orders</a></li>
                  <li><a href="#" className="hover:text-gray-900">Analytics</a></li>
                  <li><a href="#" className="hover:text-gray-900">API</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                  <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                  <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                  <li><a href="#" className="hover:text-gray-900">Status</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2025 NovaShop. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}

export default App;
