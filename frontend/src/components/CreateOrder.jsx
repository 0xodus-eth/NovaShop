'use client';

import { useState, useEffect } from 'react';

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock products - replace with actual API call
  useEffect(() => {
    // Simulate fetching products from Product Service
    const mockProducts = [
      { id: '1', name: 'Laptop', price: 999.99, stock: 10 },
      { id: '2', name: 'Smartphone', price: 699.99, stock: 15 },
      { id: '3', name: 'Headphones', price: 199.99, stock: 20 },
      { id: '4', name: 'Tablet', price: 499.99, stock: 8 },
      { id: '5', name: 'Smart Watch', price: 299.99, stock: 12 }
    ];
    setProducts(mockProducts);
  }, []);

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateSelectedProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;

    // Update price when product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        updated[index].price = product.price;
      }
    }

    setSelectedProducts(updated);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate form
    if (selectedProducts.length === 0) {
      setMessage('Please select at least one product');
      setLoading(false);
      return;
    }

    const invalidProducts = selectedProducts.some(item => 
      !item.productId || item.quantity <= 0
    );

    if (invalidProducts) {
      setMessage('Please select valid products and quantities');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        products: selectedProducts.map(item => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          price: item.price
        })),
        totalAmount: parseFloat(calculateTotal()),
        customerInfo: {
          // Add customer info as needed
          customerId: 'user123', // Replace with actual user ID
          email: 'user@example.com'
        }
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Order created successfully! Order ID: ${result.orderId}`);
        setSelectedProducts([]);
      } else {
        setMessage(`Error: ${result.error || 'Failed to create order'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Order</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Select Products</h3>
            <button
              type="button"
              onClick={addProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Add Product
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products selected. Click "Add Product" to start.</p>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => updateSelectedProduct(index, 'productId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option 
                          key={product.id} 
                          value={product.id}
                          disabled={product.stock === 0}
                        >
                          {product.name} - ${product.price} (Stock: {product.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateSelectedProduct(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Qty"
                      required
                    />
                  </div>
                  
                  <div className="w-24 text-right font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedProducts.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">${calculateTotal()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedProducts.length === 0}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-semibold"
        >
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>

        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateOrder;