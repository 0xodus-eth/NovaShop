# NovaShop

NovaShop is a modern e-commerce application built with a microservices architecture using Next.js frontend and Node.js/TypeScript backend services. It allows users to browse products, create orders, and process payments. The project demonstrates software engineering concepts like microservices, event-driven communication with Apache Kafka, containerization with Docker, and modern web development practices.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Project Overview

NovaShop consists of a Next.js frontend and three Node.js/TypeScript microservices (Product, Order, and Payment) that communicate via Apache Kafka. The system is containerized with Docker, with MongoDB serving as the database. Currently, the Order Service is fully functional and implemented in TypeScript, while Product and Payment services are placeholder services for future development.

## Tech Stack

### Frontend

- **Next.js 15**, **React 19**, **TypeScript**, **Tailwind CSS**

### Microservices

- **Order Service**: Node.js, TypeScript, Express, MongoDB (Mongoose), Kafka (fully implemented)
- **Product Service**: Placeholder service (not active)
- **Payment Service**: Placeholder service (not active)

### Infrastructure

- **Docker**, Docker Compose, MongoDB, Apache Kafka, Zookeeper, Mongo Express (Web UI)

## Folder Structure

The repository is organized to separate frontend, microservices, and infrastructure for modularity and collaboration. Below is the folder structure:

```
NovaShop/
├── frontend/                    # React-based frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/             # ProductList, OrderForm, OrderStatus pages
│   │   ├── services/          # API call logic (e.g., axios)
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies and scripts
│   └── README.md              # Frontend setup
├── services/                    # Backend microservices
│   ├── product-service/         # Product Service
│   │   ├── src/
│   │   │   ├── models/         # Mongoose schemas
│   │   │   ├── routes/         # API routes
│   │   │   └── server.js       # Express server
│   │   ├── tests/              # Unit tests
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── order-service/           # Order Service (similar structure)
│   └── payment-service/         # Payment Service (similar structure)
├── infrastructure/              # DevOps and infrastructure
│   ├── docker/                  # Docker configurations
│   │   ├── docker-compose.yml
│   │   ├── mongodb/
│   │   └── kafka/
│   ├── kubernetes/              # Kubernetes manifests
│   │   ├── product-deployment.yaml
│   │   ├── product-service.yaml
│   │   ├── order-deployment.yaml
│   │   ├── order-service.yaml
│   │   ├── payment-deployment.yaml
│   │   └── payment-service.yaml
│   ├── kafka/                   # Kafka configurations
│   │   └── kafka-config.yaml
│   └── monitoring/              # Prometheus and Grafana configs
│       ├── prometheus.yml
│       └── grafana/
├── docs/                        # Documentation
│   ├── setup.md                # Installation guide
│   ├── api-specs.md           # API documentation
│   └── architecture.md         # Architecture overview
├── tests/                       # Shared test utilities
│   ├── integration/            # Cross-service tests
│   └── utils/                 # Shared test utilities
├── .gitignore                   # Git ignore file
├── README.md                    # This file
├── docker-compose.yml           # Local development environment
└── package.json                 # Optional root-level scripts
```

### Folder Descriptions

- **`frontend/`**: React app for the user interface (product browsing, order creation, order status)
- **`services/`**: Contains three microservices (product-service, order-service, payment-service), each with its own Node.js/Express codebase, MongoDB models, and Dockerfile
- **`infrastructure/`**: DevOps configurations for Docker, Kubernetes, Kafka, and monitoring
- **`docs/`**: Project documentation, including setup guides and API specs
- **`tests/`**: Shared or integration test utilities

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **Docker** and Docker Compose
- **Git**

> **⚠️ Important**: It is **highly recommended** to run the backend services (MongoDB, Kafka, Order Service) using **Docker Compose** to avoid configuration and dependency issues. Run the frontend separately for development.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd NovaShop
   ```

2. **Recommended Setup**: Use Docker for backend services:

   ```bash
   # Start infrastructure and backend services
   docker compose up -d
   ```

3. **Frontend Setup** (run separately):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Running Locally

> **🐳 Recommended Approach**: Use Docker Compose for all backend services to avoid dependency conflicts and setup issues.

### Using Docker Compose (Recommended)

1. **Start backend services with Docker:**

   ```bash
   docker compose up -d
   ```

   This starts:

   - MongoDB (port 27017) with authentication
   - Mongo Express Web UI (port 8081) - Login: `admin` / `pass`
   - Kafka/Zookeeper (ports 9092/2181)
   - Order Service (port 3001) - Fully functional TypeScript service

2. **Start the frontend separately:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend runs on **http://localhost:3000**.

3. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Order Service API**: http://localhost:3001
   - **MongoDB Web UI**: http://localhost:8081 (admin/pass)

### Alternative: Manual Setup (Not Recommended)

⚠️ **Warning**: Manual setup may cause dependency conflicts and configuration issues. Use Docker Compose instead.

1. Start MongoDB and Kafka manually:

   ```bash
   ./setup-mongodb.sh dev  # For MongoDB setup
   # Additional Kafka setup required
   ```

2. For the Order Service only (others are placeholders):

   ```bash
   cd services/order-service
   npm install
   npm run dev
   ```

3. Start the frontend as described above.

## Contributing

We welcome contributions to NovaShop! Please see **[CONTRIBUTING.md](CONTRIBUTING.md)** for comprehensive guidelines including:

- **Git conventions** and branch naming
- **Code standards** and testing requirements
- **Pull request process** and review guidelines
- **Development environment setup**
- **Team assignments** and responsibilities

### Quick Start for Contributors

1. **Choose your area**: Each team member has a specific service assignment
2. **Set up environment**: Follow the setup guide in [CONTRIBUTING.md](CONTRIBUTING.md)
3. **Create feature branch**: Use format `type/scope-description`
4. **Make changes**: Follow coding standards and add tests
5. **Submit PR**: Use the provided PR template and request reviews

### 🚨 Important: Git Security Practices

> **⚠️ NEVER commit sensitive files to Git!**

**Critical Guidelines:**

- **NEVER push `.env` files** - These contain sensitive credentials and API keys
- **NEVER push `node_modules/`** - These are generated dependencies and should be excluded
- **Always check `.gitignore`** before adding new services or environment files

**Current .gitignore locations:**

```
services/order-service/.env
services/order-service/node_modules/
frontend/node_modules/
frontend/.env*
```

**When adding new services:**

1. **Check the root `.gitignore`** file to see existing patterns
2. **Add your service's sensitive files** to `.gitignore`:
   ```gitignore
   services/your-service/.env
   services/your-service/node_modules/
   ```
3. **Update the root `.gitignore`** if you add new directories or file types
4. **Use `.env.example`** files to document required environment variables (without values)

**Before every commit:**

```bash
# Check what files you're about to commit
git status
git diff --cached

# Verify no sensitive files are staged
git ls-files | grep -E "\.(env|key|pem)$|node_modules"
```

### Team Assignments

- **Product Service**: Person 1 (`services/product-service`)
- **Order Service**: Person 2 (`services/order-service`)
- **Payment Service**: Person 3 (`services/payment-service`)
- **Frontend**: Person 4 (`frontend`)
- **DevOps**: Person 5 (`infrastructure`)

## Team

- **Person 1**: Product Service development
- **Person 2**: Order Service development
- **Person 3**: Payment Service development
- **Person 4**: Frontend development
- **Person 5**: DevOps (Docker, Kubernetes, CI/CD, monitoring)

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## Notes for Developers

### Important Resources

- **API Documentation**: Refer to `docs/api-specs.md` for endpoint details
- **Setup Issues**: Check `docs/setup.md` for troubleshooting
- **Taiga**: Track user stories and tasks in Taiga

### Development Tips

- **Docker Development**: Use `docker compose up -d` for backend services. Run frontend separately with `npm run dev`
- **MongoDB Access**: Use Mongo Express at http://localhost:8081 (admin/pass) for database management
- **Port Requirements**: Ensure ports 3000 (frontend), 3001 (order-service), 8081 (mongo-express), 27017 (mongodb), and 9092 (kafka) are available
- **Service Status**: Only Order Service is fully implemented. Product and Payment services are placeholders
- **TypeScript**: All new backend development should use TypeScript for better type safety
- **🔒 Security**: Always check `.gitignore` before committing. Never push `.env` files or `node_modules/` to Git
- **Environment Files**: Use `.env.example` files to document required variables without exposing sensitive values

---
