#!/bin/bash

# NovaShop MongoDB Native Setup Script
# This script sets up MongoDB databases and users without Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} NovaShop MongoDB Native Setup${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if MongoDB is installed and running
check_mongodb() {
    print_info "Checking MongoDB installation..."
    
    # Check if mongosh is available
    if ! command -v mongosh &> /dev/null; then
        if ! command -v mongo &> /dev/null; then
            print_error "MongoDB shell (mongosh or mongo) is not installed."
            print_info "Please install MongoDB first. See docs/mongodb-native-setup.md for instructions."
            exit 1
        else
            print_warning "Using legacy 'mongo' shell. Consider upgrading to 'mongosh'."
            MONGO_CMD="mongo"
        fi
    else
        MONGO_CMD="mongosh"
    fi
    
    print_success "MongoDB shell found: $MONGO_CMD"
    
    # Check if MongoDB is running
    if ! $MONGO_CMD --eval "db.runCommand('ping')" &> /dev/null; then
        print_error "MongoDB is not running or not accessible."
        print_info "Please start MongoDB service:"
        print_info "  - Linux: sudo systemctl start mongod"
        print_info "  - macOS: brew services start mongodb/brew/mongodb-community"
        print_info "  - Windows: Start MongoDB service from Services panel"
        exit 1
    fi
    
    print_success "MongoDB is running and accessible"
}

# Setup NovaShop databases and users
setup_databases() {
    print_info "Setting up NovaShop databases and users..."
    
    # Create a temporary script file
    local setup_script=$(mktemp)
    
    cat > "$setup_script" << 'EOF'
try {
    // Create admin user if not exists
    use admin;
    if (!db.getUser('admin')) {
        db.createUser({
            user: 'admin',
            pwd: 'password123',
            roles: ['root']
        });
        print('✓ Admin user created');
    } else {
        print('ℹ Admin user already exists');
    }

    // Authenticate as admin
    db.auth('admin', 'password123');

    // Setup product database
    use productdb;
    if (!db.getUser('product_user')) {
        db.createUser({
            user: 'product_user',
            pwd: 'product_pass',
            roles: [{ role: 'readWrite', db: 'productdb' }]
        });
        print('✓ Product user created');
    } else {
        print('ℹ Product user already exists');
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
        print('✓ Sample products inserted');
    } else {
        print('ℹ Sample products already exist');
    }

    // Setup order database
    use orderdb;
    if (!db.getUser('order_user')) {
        db.createUser({
            user: 'order_user',
            pwd: 'order_pass',
            roles: [{ role: 'readWrite', db: 'orderdb' }]
        });
        print('✓ Order user created');
    } else {
        print('ℹ Order user already exists');
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
        print('✓ Payment user created');
    } else {
        print('ℹ Payment user already exists');
    }
    db.createCollection('payments');

    print('\n🎉 NovaShop MongoDB setup completed successfully!');
    
} catch (error) {
    print('❌ Error during setup:', error.message);
    quit(1);
}
EOF

    # Run the setup script
    if $MONGO_CMD "$setup_script"; then
        print_success "Database setup completed successfully"
    else
        print_error "Database setup failed"
        rm -f "$setup_script"
        exit 1
    fi
    
    # Clean up
    rm -f "$setup_script"
}

# Test the setup
test_setup() {
    print_info "Testing the setup..."
    
    # Test admin connection
    if $MONGO_CMD -u admin -p password123 --authenticationDatabase admin --eval "print('Admin connection: OK')" &> /dev/null; then
        print_success "Admin authentication works"
    else
        print_error "Admin authentication failed"
        return 1
    fi
    
    # Test product database
    if $MONGO_CMD -u product_user -p product_pass --authenticationDatabase productdb --eval "use productdb; print('Product DB connection: OK, Products:', db.products.countDocuments())" &> /dev/null; then
        print_success "Product database connection works"
    else
        print_error "Product database connection failed"
        return 1
    fi
    
    # Test order database
    if $MONGO_CMD -u order_user -p order_pass --authenticationDatabase orderdb --eval "use orderdb; print('Order DB connection: OK')" &> /dev/null; then
        print_success "Order database connection works"
    else
        print_error "Order database connection failed"
        return 1
    fi
    
    # Test payment database
    if $MONGO_CMD -u payment_user -p payment_pass --authenticationDatabase paymentdb --eval "use paymentdb; print('Payment DB connection: OK')" &> /dev/null; then
        print_success "Payment database connection works"
    else
        print_error "Payment database connection failed"
        return 1
    fi
    
    print_success "All database connections are working!"
}

# Show connection information
show_connection_info() {
    print_info "NovaShop MongoDB Connection Information:"
    echo ""
    echo "📊 Databases created:"
    echo "  • productdb  - For Product Service"
    echo "  • orderdb    - For Order Service"
    echo "  • paymentdb  - For Payment Service"
    echo ""
    echo "🔐 Connection strings for your microservices:"
    echo "  Product Service:"
    echo "    mongodb://product_user:product_pass@localhost:27017/productdb"
    echo ""
    echo "  Order Service:"
    echo "    mongodb://order_user:order_pass@localhost:27017/orderdb"
    echo ""
    echo "  Payment Service:"
    echo "    mongodb://payment_user:payment_pass@localhost:27017/paymentdb"
    echo ""
    echo "👑 Admin access:"
    echo "    mongodb://admin:password123@localhost:27017/admin"
    echo ""
    echo "🚀 Quick test commands:"
    echo "  # Connect as admin"
    echo "  $MONGO_CMD -u admin -p password123 --authenticationDatabase admin"
    echo ""
    echo "  # View products"
    echo "  $MONGO_CMD -u product_user -p product_pass --authenticationDatabase productdb --eval \"use productdb; db.products.find()\""
}

# Create environment files
create_env_files() {
    print_info "Creating environment template files..."
    
    # Product service env
    cat > "services/product-service/.env.example" << 'EOF'
# Product Service Environment Variables
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://product_user:product_pass@localhost:27017/productdb

# Optional: JWT Secret
JWT_SECRET=your-jwt-secret-here

# Optional: CORS origins
CORS_ORIGINS=http://localhost:3000,http://localhost:3003
EOF

    # Order service env
    cat > "services/order-service/.env.example" << 'EOF'
# Order Service Environment Variables
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://order_user:order_pass@localhost:27017/orderdb

# Kafka configuration
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=order-service
KAFKA_GROUP_ID=order-service-group

# Other services URLs
PRODUCT_SERVICE_URL=http://localhost:3000
PAYMENT_SERVICE_URL=http://localhost:3002

# Optional: JWT Secret
JWT_SECRET=your-jwt-secret-here
EOF

    # Payment service env
    cat > "services/payment-service/.env.example" << 'EOF'
# Payment Service Environment Variables
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://payment_user:payment_pass@localhost:27017/paymentdb

# Kafka configuration
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=payment-service
KAFKA_GROUP_ID=payment-service-group

# Payment provider settings (mock for development)
PAYMENT_PROVIDER=mock
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Optional: JWT Secret
JWT_SECRET=your-jwt-secret-here
EOF

    print_success "Environment template files created in services directories"
    print_info "Copy .env.example to .env in each service directory and modify as needed"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  setup       Setup NovaShop databases and users"
    echo "  test        Test database connections"
    echo "  info        Show connection information"
    echo "  env         Create environment template files"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Set up databases and users"
    echo "  $0 test     # Test all connections"
    echo "  $0 info     # Show connection strings"
}

# Main script
main() {
    print_header
    
    case "${1:-setup}" in
        "setup")
            check_mongodb
            setup_databases
            test_setup
            create_env_files
            echo ""
            show_connection_info
            ;;
        "test")
            check_mongodb
            test_setup
            ;;
        "info")
            show_connection_info
            ;;
        "env")
            create_env_files
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run the script
main "$@"
