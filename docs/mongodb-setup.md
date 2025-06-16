# MongoDB Setup Documentation

## Overview

This document provides comprehensive instructions for setting up MongoDB for the NovaShop e-commerce application. The setup supports both development and production environments with proper security configurations.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of available disk space
- Port 27017 available (or configured differently)
- For Kubernetes: kubectl installed and cluster access

## Quick Start

### 1. Development Setup (Recommended for local development)

```bash
# Start MongoDB with web interface
./setup-mongodb.sh dev

# Access points:
# - MongoDB: mongodb://localhost:27017
# - Mongo Express: http://localhost:8081 (admin/admin123)
```

### 2. Standalone MongoDB

```bash
# Start only MongoDB without web interface
./setup-mongodb.sh standalone
```

### 3. Test Connection

```bash
# Verify MongoDB is working correctly
./setup-mongodb.sh test
```

## Detailed Configuration

### Database Architecture

NovaShop uses a multi-database approach for microservices:

```
MongoDB Instance (Port 27017)
├── productdb (Product Service)
├── orderdb (Order Service)
├── paymentdb (Payment Service)
└── admin (Administrative)
```

### User Accounts and Security

| Database | Username | Password | Permissions |
|----------|----------|----------|-------------|
| admin | admin | password123 | Root access |
| productdb | product_user | product_pass | ReadWrite |
| orderdb | order_user | order_pass | ReadWrite |
| paymentdb | payment_user | payment_pass | ReadWrite |

⚠️ **Security Warning**: Default passwords are for development only. Change them for production!

### Connection Strings for Microservices

```javascript
// Product Service (.env)
MONGODB_URI=mongodb://product_user:product_pass@localhost:27017/productdb

// Order Service (.env)
MONGODB_URI=mongodb://order_user:order_pass@localhost:27017/orderdb

// Payment Service (.env)
MONGODB_URI=mongodb://payment_user:payment_pass@localhost:27017/paymentdb
```

## Docker Configurations

### Development Configuration (`docker-compose.dev.yml`)
- MongoDB 7.0 with persistent storage
- Mongo Express web interface
- Automatic database initialization
- Health checks enabled

### Standalone Configuration (`docker-compose.mongodb.yml`)
- MongoDB only, no web interface
- Production-ready configuration
- Optimized for performance

### Full Stack (`docker-compose.yml`)
- Integrated with Kafka and microservices
- Network isolation
- Dependency management

## Kubernetes Deployment

### Apply Kubernetes Manifests

```bash
# Create namespace
kubectl apply -f infrastructure/kubernetes/namespace.yaml

# Deploy MongoDB
kubectl apply -f infrastructure/kubernetes/mongodb-secret.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-configmap.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-pvc.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-deployment.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-service.yaml

# Verify deployment
kubectl get pods -n novashop
kubectl get services -n novashop
```

### Access MongoDB in Kubernetes

```bash
# Port forwarding for external access
kubectl port-forward svc/mongodb-service 27017:27017 -n novashop

# Connect from within cluster
mongodb-service.novashop.svc.cluster.local:27017
```

## Sample Data

The initialization script creates sample products for testing:

```json
[
  {
    "name": "Laptop",
    "description": "High-performance laptop for developers",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 50
  },
  {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 29.99,
    "category": "Electronics", 
    "stock": 100
  },
  {
    "name": "Coffee Mug",
    "description": "Developer-themed coffee mug",
    "price": 12.99,
    "category": "Accessories",
    "stock": 200
  }
]
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check MongoDB status
docker exec novashop-mongodb-dev mongosh --eval "db.runCommand('ping')"

# View container logs
docker logs novashop-mongodb-dev

# Check database sizes
docker exec novashop-mongodb-dev mongosh --eval "
  db.runCommand('listCollections').cursor.firstBatch.forEach(
    function(collection) {
      print(collection.name + ': ' + db[collection.name].countDocuments() + ' documents');
    }
  )
"
```

### Backup and Restore

```bash
# Backup all databases
docker exec novashop-mongodb-dev mongodump --out /tmp/backup
docker cp novashop-mongodb-dev:/tmp/backup ./mongodb-backup-$(date +%Y%m%d)

# Restore from backup
docker cp ./mongodb-backup-20241216 novashop-mongodb-dev:/tmp/restore
docker exec novashop-mongodb-dev mongorestore /tmp/restore
```

### Performance Tuning

MongoDB configuration optimizations in `mongod.conf`:
- Journal enabled for durability
- Connection pooling configured
- Index optimization enabled
- Memory usage optimized

## Troubleshooting

### Common Issues

1. **Port 27017 already in use**
   ```bash
   # Stop local MongoDB service
   sudo systemctl stop mongod
   
   # Or change port in docker-compose.yml
   ports: ["27018:27017"]
   ```

2. **Authentication failures**
   ```bash
   # Reset MongoDB data
   docker-compose down -v
   docker-compose up -d
   ```

3. **Connection timeouts**
   ```bash
   # Check network connectivity
   docker network ls
   docker network inspect novashop_novashop-network
   ```

4. **Initialization script not running**
   ```bash
   # Check init script permissions
   ls -la infrastructure/docker/mongodb/init-scripts/
   chmod +x infrastructure/docker/mongodb/init-scripts/init-mongo.sh
   ```

### Debug Commands

```bash
# View MongoDB logs
docker logs -f novashop-mongodb-dev

# Connect to MongoDB shell
docker exec -it novashop-mongodb-dev mongosh

# Check running processes
docker ps | grep mongo

# Inspect container configuration
docker inspect novashop-mongodb-dev
```

## Production Considerations

### Security Hardening

1. **Change default passwords**
   ```bash
   # Update in docker-compose files and secrets
   # Use strong, unique passwords
   ```

2. **Enable SSL/TLS**
   ```yaml
   # Add to mongod.conf
   net:
     ssl:
       mode: requireSSL
       PEMKeyFile: /etc/ssl/mongodb.pem
   ```

3. **Network security**
   ```yaml
   # Restrict binding
   net:
     bindIp: 127.0.0.1,10.0.0.0/8
   ```

4. **Enable audit logging**
   ```yaml
   auditLog:
     destination: file
     format: JSON
     path: /var/log/mongodb/audit.json
   ```

### Performance Optimization

1. **Resource allocation**
   ```yaml
   # Docker resource limits
   deploy:
     resources:
       limits:
         memory: 2G
         cpus: '1.0'
   ```

2. **Index strategy**
   ```javascript
   // Create indexes for performance
   db.products.createIndex({ "category": 1 })
   db.orders.createIndex({ "userId": 1, "createdAt": -1 })
   ```

3. **Connection pooling**
   ```javascript
   // In microservice configuration
   const mongoOptions = {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   }
   ```

## Integration with Microservices

### Environment Variables

Each microservice should use these environment variables:

```bash
# Common variables
NODE_ENV=development
MONGODB_URI=mongodb://[user]:[pass]@mongodb:27017/[database]
MONGODB_OPTIONS={"maxPoolSize":10,"serverSelectionTimeoutMS":5000}

# Service-specific
PORT=3000  # Product Service
PORT=3001  # Order Service  
PORT=3002  # Payment Service
```

### Mongoose Configuration

```javascript
// Example connection setup for microservices
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

## Next Steps

1. **Test the setup**: Run `./setup-mongodb.sh dev` and verify all services start correctly
2. **Configure microservices**: Update each service's database connection
3. **Set up monitoring**: Configure Prometheus metrics collection
4. **Implement backup strategy**: Set up automated backups
5. **Security review**: Change default passwords and enable SSL

For microservice-specific integration, refer to the README files in each service directory under `services/`.
