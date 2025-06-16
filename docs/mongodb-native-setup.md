# MongoDB Native Installation Guide for NovaShop

This guide helps you install and configure MongoDB natively on your system without Docker.

## Table of Contents
- [Installation by Operating System](#installation-by-operating-system)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Testing the Setup](#testing-the-setup)
- [Connection Strings](#connection-strings)
- [Troubleshooting](#troubleshooting)

## Installation by Operating System

### Ubuntu/Debian Linux

1. **Import the public key**:
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Create the list file**:
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Update package database**:
   ```bash
   sudo apt-get update
   ```

4. **Install MongoDB**:
   ```bash
   sudo apt-get install -y mongodb-org
   ```

5. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### CentOS/RHEL/Fedora

1. **Create repository file**:
   ```bash
   sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo << 'EOF'
   [mongodb-org-7.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://pgp.mongodb.com/server-7.0.asc
   EOF
   ```

2. **Install MongoDB**:
   ```bash
   sudo yum install -y mongodb-org
   ```

3. **Start MongoDB**:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### macOS

1. **Install Homebrew** (if not installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Tap MongoDB Homebrew Tap**:
   ```bash
   brew tap mongodb/brew
   ```

3. **Install MongoDB**:
   ```bash
   brew install mongodb-community@7.0
   ```

4. **Start MongoDB**:
   ```bash
   brew services start mongodb/brew/mongodb-community@7.0
   ```

### Windows

1. **Download MongoDB**: Go to https://www.mongodb.com/try/download/community
2. **Run the installer**: Choose "Complete" installation
3. **Install as Windows Service**: Check this option during installation
4. **Install MongoDB Compass**: Optional GUI tool
5. **Start MongoDB**: It should start automatically as a service

### WSL (Windows Subsystem for Linux)

Follow the Ubuntu/Debian instructions above, but note:
- MongoDB may not auto-start in WSL
- You might need to start it manually: `sudo service mongod start`

## Configuration

### Create MongoDB Configuration File

Create a custom configuration file for NovaShop:

```bash
sudo mkdir -p /etc/mongod
sudo tee /etc/mongod/novashop.conf << 'EOF'
# MongoDB configuration for NovaShop
storage:
  dbPath: /var/lib/mongodb/novashop
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/novashop.log

net:
  port: 27017
  bindIp: 127.0.0.1,::1

processManagement:
  timeZoneInfo: /usr/share/zoneinfo

security:
  authorization: enabled
EOF
```

### Create Data Directory

```bash
sudo mkdir -p /var/lib/mongodb/novashop
sudo chown mongodb:mongodb /var/lib/mongodb/novashop
```

### Start MongoDB with Custom Config

```bash
sudo mongod --config /etc/mongod/novashop.conf --fork
```

Or create a systemd service:

```bash
sudo tee /etc/systemd/system/mongodb-novashop.service << 'EOF'
[Unit]
Description=MongoDB NovaShop Instance
After=network.target

[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --config /etc/mongod/novashop.conf
Type=forking
PIDFile=/var/lib/mongodb/novashop/mongod.lock

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable mongodb-novashop
sudo systemctl start mongodb-novashop
```

## Database Setup

### Initialize NovaShop Databases

Run this script to set up the databases and users:

```bash
# Connect to MongoDB
mongosh

# In MongoDB shell, run:
```

```javascript
// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: ["root"]
})

// Authenticate as admin
db.auth("admin", "password123")

// Create product database and user
use productdb
db.createUser({
  user: "product_user",
  pwd: "product_pass",
  roles: [{ role: "readWrite", db: "productdb" }]
})

// Create collections and sample data
db.createCollection("products")
db.products.insertMany([
  {
    name: "Laptop",
    description: "High-performance laptop for developers",
    price: 1299.99,
    category: "Electronics",
    stock: 50,
    createdAt: new Date()
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    price: 29.99,
    category: "Electronics",
    stock: 100,
    createdAt: new Date()
  },
  {
    name: "Coffee Mug",
    description: "Developer-themed coffee mug",
    price: 12.99,
    category: "Accessories",
    stock: 200,
    createdAt: new Date()
  }
])

// Create order database and user
use orderdb
db.createUser({
  user: "order_user",
  pwd: "order_pass",
  roles: [{ role: "readWrite", db: "orderdb" }]
})
db.createCollection("orders")

// Create payment database and user
use paymentdb
db.createUser({
  user: "payment_user",
  pwd: "payment_pass",
  roles: [{ role: "readWrite", db: "paymentdb" }]
})
db.createCollection("payments")

print("NovaShop MongoDB setup completed!")
exit
```

### Automated Setup Script

I'll create a script to automate this process:

```bash
#!/bin/bash
# Save as: setup-mongodb-native.sh

echo "Setting up NovaShop databases..."

mongosh --eval "
// Create admin user
use admin;
if (!db.getUser('admin')) {
    db.createUser({
        user: 'admin',
        pwd: 'password123',
        roles: ['root']
    });
    print('Admin user created');
} else {
    print('Admin user already exists');
}

// Authenticate
db.auth('admin', 'password123');

// Setup product database
use productdb;
if (!db.getUser('product_user')) {
    db.createUser({
        user: 'product_user',
        pwd: 'product_pass',
        roles: [{ role: 'readWrite', db: 'productdb' }]
    });
    print('Product user created');
}

db.createCollection('products');
if (db.products.countDocuments() === 0) {
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
    print('Sample products inserted');
}

// Setup order database
use orderdb;
if (!db.getUser('order_user')) {
    db.createUser({
        user: 'order_user',
        pwd: 'order_pass',
        roles: [{ role: 'readWrite', db: 'orderdb' }]
    });
    print('Order user created');
}
db.createCollection('orders');

// Setup payment database
use paymentdb;
if (!db.getUser('payment_user')) {
    db.createUser({
        user: 'payment_user',
        pwd: 'payment_pass',
        roles: [{ role: 'readWrite', db: 'paymentdb' }]
    });
    print('Payment user created');
}
db.createCollection('payments');

print('NovaShop MongoDB setup completed successfully!');
"

echo "Setup complete!"
echo ""
echo "Connection strings for your microservices:"
echo "Product Service: mongodb://product_user:product_pass@localhost:27017/productdb"
echo "Order Service: mongodb://order_user:order_pass@localhost:27017/orderdb"
echo "Payment Service: mongodb://payment_user:payment_pass@localhost:27017/paymentdb"
```

## Testing the Setup

### Basic Connection Test

```bash
# Test MongoDB connection
mongosh --eval "db.runCommand('ping')"
```

### Test Authentication

```bash
# Test admin access
mongosh -u admin -p password123 --authenticationDatabase admin --eval "show dbs"

# Test product database access
mongosh -u product_user -p product_pass --authenticationDatabase productdb --eval "use productdb; db.products.find().limit(1)"
```

### Test Sample Data

```bash
mongosh -u product_user -p product_pass --authenticationDatabase productdb --eval "
use productdb;
print('Product count:', db.products.countDocuments());
db.products.find({}, {name: 1, price: 1}).forEach(printjson);
"
```

## Connection Strings

Use these connection strings in your NovaShop microservices:

### Environment Variables
```bash
# Product Service
MONGODB_URI=mongodb://product_user:product_pass@localhost:27017/productdb

# Order Service  
MONGODB_URI=mongodb://order_user:order_pass@localhost:27017/orderdb

# Payment Service
MONGODB_URI=mongodb://payment_user:payment_pass@localhost:27017/paymentdb
```

### Node.js Connection Example
```javascript
const mongoose = require('mongoose');

// For Product Service
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://product_user:product_pass@localhost:27017/productdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for Product Service');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

## Troubleshooting

### Common Issues

1. **MongoDB won't start**
   ```bash
   # Check status
   sudo systemctl status mongod
   
   # Check logs
   sudo tail -f /var/log/mongodb/mongod.log
   
   # Check permissions
   sudo chown -R mongodb:mongodb /var/lib/mongodb
   sudo chown mongodb:mongodb /tmp/mongodb-27017.sock
   ```

2. **Authentication failed**
   ```bash
   # Reset admin user (if needed)
   sudo systemctl stop mongod
   sudo mongod --noauth --dbpath /var/lib/mongodb
   # In another terminal: mongosh and recreate users
   ```

3. **Port 27017 in use**
   ```bash
   # Check what's using the port
   sudo netstat -tlnp | grep :27017
   sudo lsof -i :27017
   ```

4. **Permission denied**
   ```bash
   # Fix data directory permissions
   sudo chown -R mongodb:mongodb /var/lib/mongodb
   sudo chmod 755 /var/lib/mongodb
   ```

### Useful Commands

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect as admin
mongosh -u admin -p password123 --authenticationDatabase admin
```

## Next Steps

1. Install MongoDB using the instructions for your OS
2. Run the automated setup script
3. Test the connections
4. Configure your microservices with the connection strings
5. Start developing your NovaShop application!

For Docker-based setup (when you have Docker installed), refer to the main MongoDB setup documentation in `infrastructure/docker/mongodb/README.md`.
