#!/bin/bash

# MongoDB Setup Script for NovaShop
# This script helps you set up MongoDB for development or production

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
    echo -e "${BLUE} NovaShop MongoDB Setup${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Check if Docker is installed
check_docker() {
    # Check multiple possible Docker locations
    local docker_cmd=""
    
    # Try different Docker command variations
    for cmd in docker /usr/bin/docker /usr/local/bin/docker docker.exe; do
        if command -v $cmd &> /dev/null; then
            docker_cmd=$cmd
            break
        fi
    done
    
    if [ -z "$docker_cmd" ]; then
        print_error "Docker is not installed or not in PATH."
        print_info "Please install Docker first: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check for Docker Compose
    if docker compose version &> /dev/null; then
        print_success "Docker and Docker Compose are available"
        print_info "Using: docker and docker compose"
    elif command -v docker-compose &> /dev/null; then
        print_success "Docker and Docker Compose are available"
        print_info "Using: docker and docker-compose"
    else
        print_error "Docker Compose is not installed or not in PATH."
        print_info "Please install Docker Compose first: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Test Docker daemon
    if ! $docker_cmd ps &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker daemon is running"
}

# Check if port 27017 is available
check_port() {
    if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 27017 is already in use. You may need to stop existing MongoDB service."
        read -p "Do you want to continue anyway? [y/N]: " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        print_success "Port 27017 is available"
    fi
}

# Setup MongoDB for development
setup_dev() {
    print_info "Setting up MongoDB for development..."
    
    cd infrastructure/docker/mongodb
    
    print_info "Starting MongoDB with Mongo Express..."
    if docker compose version &> /dev/null; then
        docker compose -f docker-compose.dev.yml up -d
    else
        docker-compose -f docker-compose.dev.yml up -d
    fi
    
    print_info "Waiting for MongoDB to be ready..."
    sleep 15
    
    # Check if MongoDB is running
    if docker exec novashop-mongodb-dev mongosh --eval 'db.runCommand("ping")' &>/dev/null; then
        print_success "MongoDB is running successfully!"
        print_info "MongoDB URL: mongodb://localhost:27017"
        print_info "Mongo Express: http://localhost:8081 [admin/admin123]"
        print_info ""
        print_info "Database connections:"
        print_info "  Product DB: mongodb://product_user:product_pass@localhost:27017/productdb"
        print_info "  Order DB: mongodb://order_user:order_pass@localhost:27017/orderdb"
        print_info "  Payment DB: mongodb://payment_user:payment_pass@localhost:27017/paymentdb"
    else
        print_error "Failed to start MongoDB"
        exit 1
    fi
}

# Setup MongoDB standalone
setup_standalone() {
    print_info "Setting up standalone MongoDB..."
    
    cd infrastructure/docker/mongodb
    
    print_info "Starting MongoDB..."
    if docker compose version &> /dev/null; then
        docker compose -f docker-compose.mongodb.yml up -d
    else
        docker-compose -f docker-compose.mongodb.yml up -d
    fi
    
    print_info "Waiting for MongoDB to be ready..."
    sleep 15
    
    # Check if MongoDB is running
    if docker exec novashop-mongodb mongosh --eval 'db.runCommand("ping")' &>/dev/null; then
        print_success "MongoDB is running successfully!"
        print_info "MongoDB URL: mongodb://localhost:27017"
    else
        print_error "Failed to start MongoDB"
        exit 1
    fi
}

# Test MongoDB connection
test_connection() {
    print_info "Testing MongoDB connection..."
    
    # Test basic connection
    if docker exec novashop-mongodb mongosh --eval 'db.runCommand("ping")' &>/dev/null ||
       docker exec novashop-mongodb-dev mongosh --eval 'db.runCommand("ping")' &>/dev/null; then
        print_success "MongoDB connection successful!"
        
        # Test databases
        print_info "Checking databases..."
        if docker exec novashop-mongodb mongosh --eval "show dbs" 2>/dev/null ||
           docker exec novashop-mongodb-dev mongosh --eval "show dbs" 2>/dev/null; then
            print_success "Databases are accessible"
        fi
    else
        print_error "Cannot connect to MongoDB"
        exit 1
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev         Setup MongoDB for development [with Mongo Express]"
    echo "  standalone  Setup standalone MongoDB"
    echo "  test        Test MongoDB connection"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start MongoDB with web interface"
    echo "  $0 test     # Test if MongoDB is working"
}

# Main script
main() {
    print_header
    
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi
    
    case $1 in
        "dev")
            check_docker
            check_port
            setup_dev
            ;;
        "standalone")
            check_docker
            check_port
            setup_standalone
            ;;
        "test")
            test_connection
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
