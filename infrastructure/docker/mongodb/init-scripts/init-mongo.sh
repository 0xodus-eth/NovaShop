#!/bin/bash
# MongoDB initialization script
# This script creates databases and users for the NovaShop microservices

echo "Starting MongoDB initialization..."

# Wait for MongoDB to be ready
until mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; do
    echo "Waiting for MongoDB to start..."
    sleep 2
done

echo "MongoDB is ready. Creating databases and users..."

# Connect to MongoDB and create databases and users
mongosh --eval "
// Create admin user (if not exists)
use admin;
if (!db.getUser('admin')) {
    db.createUser({
        user: 'admin',
        pwd: 'password123',
        roles: ['root']
    });
}

// Create product database and user
use productdb;
if (!db.getUser('product_user')) {
    db.createUser({
        user: 'product_user',
        pwd: 'product_pass',
        roles: [
            { role: 'readWrite', db: 'productdb' }
        ]
    });
}
db.createCollection('products');

// Create order database and user
use orderdb;
if (!db.getUser('order_user')) {
    db.createUser({
        user: 'order_user',
        pwd: 'order_pass',
        roles: [
            { role: 'readWrite', db: 'orderdb' }
        ]
    });
}
db.createCollection('orders');

// Create payment database and user
use paymentdb;
if (!db.getUser('payment_user')) {
    db.createUser({
        user: 'payment_user',
        pwd: 'payment_pass',
        roles: [
            { role: 'readWrite', db: 'paymentdb' }
        ]
    });
}
db.createCollection('payments');

// Insert sample data for development
use productdb;
db.products.insertMany([
    {
        name: 'Laptop',
        description: 'High-performance laptop for developers',
        price: 1299.99,
        category: 'Electronics',
        stock: 50,
        createdAt: new Date()
    },
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 29.99,
        category: 'Electronics',
        stock: 100,
        createdAt: new Date()
    },
    {
        name: 'Coffee Mug',
        description: 'Developer-themed coffee mug',
        price: 12.99,
        category: 'Accessories',
        stock: 200,
        createdAt: new Date()
    }
]);

print('MongoDB initialization completed successfully!');
"

echo "MongoDB initialization script completed."
