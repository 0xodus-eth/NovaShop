# NovaShop

NovaShop is a simple e-commerce application built with a microservices architecture. It allows users to browse products, create orders, and process payments. The project demonstrates software engineering concepts like microservices, event-driven communication, containerization, and DevOps practices, developed using Agile methodology.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Contributing](#contributing)
- [Team](#team)0xodus.hardware395@passinbox.com
- [License](#license)
## Project Overview

NovaShop consists of a React-based frontend and three Node.js/Express microservices (Product, Order, and Payment) that communicate via Apache Kafka. The system is containerized with Docker, orchestrated with Kubernetes, and monitored using Prometheus and Grafana. MongoDB serves as the database, and the project follows Test-Driven Development (TDD) with Mocha/Chai.

## Tech Stack

### Frontend
- **React**, Axios, React Router, CSS/Styled-Components, Node.js/NPM

### Microservices
- **Product Service**: Node.js, Express, MongoDB (Mongoose), Mocha/Chai
- **Order Service**: Node.js, Express, MongoDB (Mongoose), Kafka (node-rdkafka), Mocha/Chai
- **Payment Service**: Node.js, Express, MongoDB (Mongoose), Kafka (node-rdkafka), Mocha/Chai

### Infrastructure
- **Docker**, Docker Compose, Kubernetes, Apache Kafka, Zookeeper, Prometheus, Grafana

### CI/CD
- **Gitea** (version control), Drone CI

### Testing
- **Mocha/Chai** (backend), Jest (optional for frontend)

### Documentation
- **Markdown**
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

- **Node.js** (v14 or later)
- **Docker** and Docker Compose
- **MongoDB** (local or Dockerized)
- **Apache Kafka** (Dockerized)
- **Kubernetes** (e.g., Minikube for local development)
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/NovaShop.git
   cd NovaShop
   ```

2. Install root-level dependencies (if any):
   ```bash
   npm install
   ```
## Running Locally

### Using Docker Compose

1. Start MongoDB, Kafka, and microservices:
   ```bash
   docker-compose up -d
   ```
   
   This starts:
   - MongoDB (port 27017)
   - Kafka/Zookeeper (ports 9092/2181)
   - Product Service (port 3000)
   - Order Service (port 3001)
   - Payment Service (port 3002)

2. Install and run the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   
   The frontend runs on http://localhost:3003.

3. Access the app at http://localhost:3003 to browse products and create orders.

### Manual Setup (Without Docker)

1. Start MongoDB and Kafka locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 mongo
   docker run -d -p 2181:2181 -p 9092:9092 confluentinc/cp-kafka
   ```

2. For each microservice (product-service, order-service, payment-service):
   ```bash
   cd services/product-service
   npm install
   npm start
   ```

3. Start the frontend as described above.
## Contributing

### Development Workflow

- **Branching**: Create feature branches (e.g., `feature/product-get-endpoint`) from `main`
- **Pull Requests**: Submit PRs with clear descriptions and link to Taiga user stories
- **Code Review**: At least one team member must approve PRs
- **Testing**: Write unit tests with Mocha/Chai for microservices. Run tests with:
  ```bash
  cd services/product-service
  npm test
  ```
- **CI/CD**: Drone CI automatically builds, tests, and deploys on pushes to `main`

### Task Assignments

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
- **Local Development**: Use `docker-compose.yml` for a quick setup. Ensure ports 3000–3003, 27017, 9092, and 2181 are free
- **Kubernetes**: For production-like deployment, apply manifests in `infrastructure/kubernetes/` using `kubectl`

---
