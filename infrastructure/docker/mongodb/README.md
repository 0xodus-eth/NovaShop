# MongoDB Setup for NovaShop

This directory contains MongoDB configuration files for the NovaShop e-commerce application.

## Directory Structure

```
infrastructure/docker/mongodb/
├── docker-compose.mongodb.yml    # Standalone MongoDB service
├── docker-compose.dev.yml        # Development MongoDB with Mongo Express
├── mongod.conf                   # MongoDB configuration file
├── init-scripts/                 # Database initialization scripts
│   └── init-mongo.sh             # Creates databases and users
└── README.md                     # This file
```

## Quick Start

### Option 1: Run MongoDB Only (Standalone)
```bash
cd infrastructure/docker/mongodb
docker-compose -f docker-compose.mongodb.yml up -d
```

### Option 2: Run MongoDB with Mongo Express (Development)
```bash
cd infrastructure/docker/mongodb
docker-compose -f docker-compose.dev.yml up -d
```

Access Mongo Express at: http://localhost:8081
- Username: admin
- Password: admin123

### Option 3: Run Full NovaShop Stack
```bash
# From project root
docker-compose up -d
```

## Database Configuration

### Created Databases
- **productdb**: For Product Service
- **orderdb**: For Order Service  
- **paymentdb**: For Payment Service

### Users and Permissions
- **admin/password123**: Root user with full access
- **product_user/product_pass**: ReadWrite access to productdb
- **order_user/order_pass**: ReadWrite access to orderdb
- **payment_user/payment_pass**: ReadWrite access to paymentdb

### Connection Strings
```javascript
// Product Service
mongodb://product_user:product_pass@localhost:27017/productdb

// Order Service
mongodb://order_user:order_pass@localhost:27017/orderdb

// Payment Service
mongodb://payment_user:payment_pass@localhost:27017/paymentdb

// Admin access
mongodb://admin:password123@localhost:27017/admin
```

## Kubernetes Deployment

Deploy to Kubernetes using the manifests in `infrastructure/kubernetes/`:

```bash
# Create namespace
kubectl create namespace novashop

# Apply MongoDB configurations
kubectl apply -f infrastructure/kubernetes/mongodb-secret.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-configmap.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-pvc.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-deployment.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-service.yaml
```

### Kubernetes Access
- **Internal**: mongodb-service.novashop.svc.cluster.local:27017
- **External**: http://localhost:30017 (NodePort)

## Sample Data

The initialization script creates sample products:
- Laptop ($1299.99)
- Wireless Mouse ($29.99)
- Coffee Mug ($12.99)

## Development Commands

### Connect to MongoDB Shell
```bash
# Using Docker
docker exec -it novashop-mongodb mongosh

# Direct connection
mongosh mongodb://admin:password123@localhost:27017/admin
```

### View Logs
```bash
docker logs novashop-mongodb
```

### Backup Database
```bash
docker exec novashop-mongodb mongodump --out /tmp/backup
docker cp novashop-mongodb:/tmp/backup ./backup
```

### Restore Database
```bash
docker cp ./backup novashop-mongodb:/tmp/backup
docker exec novashop-mongodb mongorestore /tmp/backup
```

## Troubleshooting

### Common Issues

1. **Port 27017 already in use**
   - Stop local MongoDB: `sudo service mongod stop`
   - Or change port in docker-compose.yml

2. **Authentication failed**
   - Ensure you're using the correct credentials
   - Check if initialization script ran successfully

3. **Cannot connect from microservices**
   - Verify network configuration
   - Check container names and network connectivity

### Health Check
```bash
# Check if MongoDB is running
docker exec novashop-mongodb mongosh --eval "db.runCommand('ping')"

# Check created databases
docker exec novashop-mongodb mongosh --eval "show dbs"
```

## Security Notes

**⚠️ Warning**: The default passwords are for development only!

For production:
1. Use strong, unique passwords
2. Enable SSL/TLS
3. Configure proper network security
4. Regular security updates
5. Implement backup strategy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_INITDB_ROOT_USERNAME | Admin username | admin |
| MONGO_INITDB_ROOT_PASSWORD | Admin password | password123 |
| MONGO_INITDB_DATABASE | Initial database | novashop |

## Next Steps

1. Start the MongoDB service
2. Verify the databases and users were created
3. Configure your microservices to use the connection strings
4. Test the connectivity from each service

For microservice integration, refer to the individual service README files in the `services/` directory.
