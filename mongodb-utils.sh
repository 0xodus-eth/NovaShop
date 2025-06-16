#!/bin/bash

# MongoDB Utility Scripts for NovaShop
# Collection of helpful commands for MongoDB management

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Determine which MongoDB container is running
get_mongo_container() {
    if docker ps --format "table {{.Names}}" | grep -q "novashop-mongodb-dev"; then
        echo "novashop-mongodb-dev"
    elif docker ps --format "table {{.Names}}" | grep -q "novashop-mongodb"; then
        echo "novashop-mongodb"
    else
        print_error "No NovaShop MongoDB container is running"
        exit 1
    fi
}

# Connect to MongoDB shell
mongo_shell() {
    local container=$(get_mongo_container)
    print_info "Connecting to MongoDB shell in container: $container"
    docker exec -it $container mongosh
}

# Show database status
show_status() {
    local container=$(get_mongo_container)
    print_info "MongoDB Status for container: $container"
    
    echo -e "\n${BLUE}=== Server Status ===${NC}"
    docker exec $container mongosh --eval "
        print('MongoDB Version: ' + db.version());
        print('Server Status: ' + (db.runCommand('ping').ok ? 'Running' : 'Error'));
        print('Uptime: ' + db.runCommand('serverStatus').uptime + ' seconds');
    "
    
    echo -e "\n${BLUE}=== Databases ===${NC}"
    docker exec $container mongosh --eval "show dbs"
    
    echo -e "\n${BLUE}=== Collections ===${NC}"
    for db in productdb orderdb paymentdb; do
        echo -e "${YELLOW}Database: $db${NC}"
        docker exec $container mongosh $db --eval "
            db.getCollectionNames().forEach(function(collection) {
                var count = db[collection].countDocuments();
                print('  ' + collection + ': ' + count + ' documents');
            });
        "
    done
}

# Backup databases
backup_databases() {
    local container=$(get_mongo_container)
    local backup_dir="./mongodb-backup-$(date +%Y%m%d-%H%M%S)"
    
    print_info "Creating backup in: $backup_dir"
    
    # Create backup inside container
    docker exec $container mongodump --out /tmp/backup
    
    # Copy backup to host
    docker cp $container:/tmp/backup $backup_dir
    
    # Clean up container backup
    docker exec $container rm -rf /tmp/backup
    
    print_success "Backup created: $backup_dir"
}

# Restore databases
restore_databases() {
    if [ -z "$1" ]; then
        print_error "Please provide backup directory path"
        echo "Usage: $0 restore <backup_directory>"
        exit 1
    fi
    
    local backup_dir="$1"
    local container=$(get_mongo_container)
    
    if [ ! -d "$backup_dir" ]; then
        print_error "Backup directory not found: $backup_dir"
        exit 1
    fi
    
    print_warning "This will overwrite existing data. Continue? (y/N)"
    read -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    print_info "Restoring from: $backup_dir"
    
    # Copy backup to container
    docker cp $backup_dir $container:/tmp/restore
    
    # Restore databases
    docker exec $container mongorestore --drop /tmp/restore
    
    # Clean up
    docker exec $container rm -rf /tmp/restore
    
    print_success "Restore completed"
}

# Reset all data to initial state
reset_data() {
    local container=$(get_mongo_container)
    
    print_warning "This will DELETE ALL DATA and recreate with sample data. Continue? (y/N)"
    read -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    print_info "Resetting databases..."
    
    # Drop all databases except admin
    docker exec $container mongosh --eval "
        ['productdb', 'orderdb', 'paymentdb'].forEach(function(dbName) {
            print('Dropping database: ' + dbName);
            db.getSiblingDB(dbName).dropDatabase();
        });
    "
    
    # Re-run initialization script
    if [ -f "./infrastructure/docker/mongodb/init-scripts/init-mongo.sh" ]; then
        docker exec $container bash /docker-entrypoint-initdb.d/init-mongo.sh
        print_success "Data reset completed with sample data"
    else
        print_warning "Initialization script not found. Databases are empty."
    fi
}

# Show collection data
show_data() {
    local db="${1:-productdb}"
    local collection="${2:-products}"
    local container=$(get_mongo_container)
    
    print_info "Showing data from $db.$collection"
    
    docker exec $container mongosh $db --eval "
        print('Collection: $collection');
        print('Count: ' + db.$collection.countDocuments());
        print('Sample documents:');
        db.$collection.find().limit(5).pretty();
    "
}

# Create indexes for performance
create_indexes() {
    local container=$(get_mongo_container)
    
    print_info "Creating performance indexes..."
    
    docker exec $container mongosh --eval "
        // Product database indexes
        use productdb;
        db.products.createIndex({ 'category': 1 });
        db.products.createIndex({ 'name': 'text', 'description': 'text' });
        db.products.createIndex({ 'price': 1 });
        db.products.createIndex({ 'stock': 1 });
        
        // Order database indexes
        use orderdb;
        db.orders.createIndex({ 'userId': 1, 'createdAt': -1 });
        db.orders.createIndex({ 'status': 1 });
        db.orders.createIndex({ 'totalAmount': 1 });
        
        // Payment database indexes
        use paymentdb;
        db.payments.createIndex({ 'orderId': 1 });
        db.payments.createIndex({ 'status': 1 });
        db.payments.createIndex({ 'createdAt': -1 });
        
        print('Indexes created successfully');
    "
    
    print_success "Performance indexes created"
}

# Monitor MongoDB performance
monitor() {
    local container=$(get_mongo_container)
    
    print_info "MongoDB Performance Monitor (Press Ctrl+C to stop)"
    
    while true; do
        clear
        echo -e "${BLUE}NovaShop MongoDB Monitor - $(date)${NC}\n"
        
        docker exec $container mongosh --eval "
            var status = db.runCommand('serverStatus');
            print('=== Connections ===');
            print('Current: ' + status.connections.current);
            print('Available: ' + status.connections.available);
            print('');
            print('=== Memory Usage ===');
            print('Resident: ' + Math.round(status.mem.resident) + ' MB');
            print('Virtual: ' + Math.round(status.mem.virtual) + ' MB');
            print('');
            print('=== Operations ===');
            print('Inserts: ' + status.opcounters.insert);
            print('Queries: ' + status.opcounters.query);
            print('Updates: ' + status.opcounters.update);
            print('Deletes: ' + status.opcounters.delete);
        " 2>/dev/null
        
        sleep 5
    done
}

# Show usage
show_usage() {
    echo "MongoDB Utilities for NovaShop"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  shell                   Connect to MongoDB shell"
    echo "  status                  Show database status and statistics"
    echo "  backup                  Create backup of all databases"
    echo "  restore <dir>           Restore databases from backup directory"
    echo "  reset                   Reset all data to initial state (with sample data)"
    echo "  show <db> <collection>  Show data from specific collection"
    echo "  indexes                 Create performance indexes"
    echo "  monitor                 Real-time performance monitoring"
    echo "  help                    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status               # Show database status"
    echo "  $0 backup               # Create backup"
    echo "  $0 show productdb products  # Show products data"
    echo "  $0 restore ./backup-dir     # Restore from backup"
}

# Main function
main() {
    case "${1:-help}" in
        "shell")
            mongo_shell
            ;;
        "status")
            show_status
            ;;
        "backup")
            backup_databases
            ;;
        "restore")
            restore_databases "$2"
            ;;
        "reset")
            reset_data
            ;;
        "show")
            show_data "$2" "$3"
            ;;
        "indexes")
            create_indexes
            ;;
        "monitor")
            monitor
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run the script
main "$@"
