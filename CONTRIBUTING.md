# Contributing to NovaShop

Welcome to the NovaShop project! This document provides comprehensive guidelines for contributing to our microservices e-commerce application. Please read this carefully before making your first contribution.

## Table of Contents

- [Project Overview](#project-overview)
- [Team Assignments](#team-assignments)
- [Development Workflow](#development-workflow)
- [Git Conventions](#git-conventions)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Convention](#commit-message-convention)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Development Environment Setup](#development-environment-setup)
- [API Guidelines](#api-guidelines)
- [Database Guidelines](#database-guidelines)
- [Communication Guidelines](#communication-guidelines)

## Project Overview

NovaShop is a microservices-based e-commerce application with:
- **Frontend**: React-based user interface
- **Backend**: Three Node.js/Express microservices
- **Database**: MongoDB with separate databases per service
- **Communication**: Apache Kafka for event-driven messaging
- **Infrastructure**: Docker, Kubernetes, monitoring with Prometheus/Grafana

## Team Assignments

| Team Member | Responsibility | Focus Area |
|-------------|---------------|------------|
| **Person 1** | Product Service | `services/product-service/` |
| **Person 2** | Order Service | `services/order-service/` |
| **Person 3** | Payment Service | `services/payment-service/` |
| **Person 4** | Frontend | `frontend/` |
| **Person 5** | DevOps | `infrastructure/`, CI/CD, monitoring |

## Development Workflow

### 1. Project Board Management
- Use **Taiga** for task tracking
- Each task should be linked to a user story
- Update task status regularly: `To Do` → `In Progress` → `Review` → `Done`

### 2. Branch Strategy
We follow **GitFlow** with these main branches:
- `main`: Production-ready code
- `develop`: Integration branch for development
- `feature/*`: Feature development branches
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation branches

## Git Conventions

### Branch Naming Convention

Based on the [simplified Git convention](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4), use this format:

```
<type>/<scope>-<description>
```

#### Branch Types:
- `feature/` - New features or enhancements
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `release/` - Release preparation
- `chore/` - Maintenance tasks (docs, deps, etc.)
- `refactor/` - Code refactoring without functionality changes
- `test/` - Adding or updating tests

#### Scope (Service Areas):
- `product` - Product Service related
- `order` - Order Service related
- `payment` - Payment Service related
- `frontend` - Frontend/UI related
- `infra` - Infrastructure/DevOps related
- `docs` - Documentation changes
- `config` - Configuration changes

#### Examples:
```bash
feature/product-get-all-products
feature/order-create-order-endpoint
feature/frontend-product-listing-page
bugfix/payment-validation-error
hotfix/order-memory-leak
chore/infra-update-docker-compose
refactor/product-database-queries
test/order-integration-tests
```

### Commit Message Convention

Follow this structure:
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Commit Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD related changes

#### Examples:
```bash
feat(product): add product search endpoint

Implement search functionality with filters for category, price range, and name.
Includes pagination and sorting options.

Closes #123

fix(order): resolve order total calculation bug

Fixed issue where tax calculation was applied twice for international orders.
Added unit tests to prevent regression.

Fixes #145

docs(readme): update setup instructions

Added detailed MongoDB setup steps and troubleshooting section.
Included links to additional resources.

chore(deps): update express to v4.18.2

Security update to address vulnerability CVE-2023-XXXX
```

## Code Standards

### JavaScript/Node.js Standards

#### 1. Code Style
- Use **ESLint** with Airbnb configuration
- Use **Prettier** for code formatting
- Use **2 spaces** for indentation
- Maximum line length: **100 characters**

#### 2. File Structure
```javascript
// 1. Node.js imports
const express = require('express');
const mongoose = require('mongoose');

// 2. Local imports
const Product = require('../models/Product');
const { validateProduct } = require('../middleware/validation');

// 3. Constants
const DEFAULT_PAGE_SIZE = 10;

// 4. Implementation
```

#### 3. Naming Conventions
- **Variables/Functions**: camelCase (`getUserById`, `productList`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Classes**: PascalCase (`ProductService`, `OrderController`)
- **Files**: kebab-case (`user-controller.js`, `product-model.js`)

#### 4. Function Documentation
```javascript
/**
 * Retrieves a product by its ID
 * @param {string} productId - The unique identifier for the product
 * @param {Object} options - Optional parameters
 * @param {boolean} options.includeInactive - Include inactive products
 * @returns {Promise<Object|null>} The product object or null if not found
 * @throws {ValidationError} When productId is invalid
 */
async function getProductById(productId, options = {}) {
  // Implementation
}
```

### React/Frontend Standards

#### 1. Component Structure
```jsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party imports
import axios from 'axios';

// 3. Local imports
import './ProductList.css';
import ProductCard from '../ProductCard/ProductCard';

// 4. Component
const ProductList = () => {
  // Implementation
};

export default ProductList;
```

#### 2. Naming Conventions
- **Components**: PascalCase (`ProductList`, `OrderForm`)
- **Files**: PascalCase for components (`ProductList.jsx`)
- **CSS Classes**: kebab-case (`product-card`, `order-form-container`)

## Testing Requirements

### 1. Unit Tests
- **Coverage**: Minimum 80% code coverage
- **Framework**: Mocha/Chai for backend, Jest for frontend
- **Location**: `tests/` directory in each service
- **Naming**: `*.test.js` for test files

### 2. Integration Tests
- **Location**: `tests/integration/`
- **Database**: Use test databases (`*_test`)
- **Environment**: Separate test environment variables

### 3. Test Structure
```javascript
describe('Product Service', () => {
  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Setup test data
    });

    afterEach(async () => {
      // Cleanup test data
    });

    it('should return all products when no filters applied', async () => {
      // Test implementation
    });

    it('should filter products by category', async () => {
      // Test implementation
    });
  });
});
```

## Pull Request Process

### 1. Before Creating a PR

#### Pre-PR Checklist:
- [ ] Code follows style guidelines
- [ ] Unit tests pass locally
- [ ] Integration tests pass locally
- [ ] Documentation updated if needed
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] API changes documented in `docs/api-specs.md`

#### Commands to Run:
```bash
# Run tests
npm test

# Check code style
npm run lint

# Check test coverage
npm run test:coverage

# Build the service
npm run build
```

### 2. PR Title and Description

#### PR Title Format:
```
<type>(<scope>): <description>
```

#### PR Description Template:
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #[issue-number]
Related to #[issue-number]

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### 3. Review Process

#### Reviewers:
- **Product Service**: Person 1 (required) + 1 other team member
- **Order Service**: Person 2 (required) + 1 other team member
- **Payment Service**: Person 3 (required) + 1 other team member
- **Frontend**: Person 4 (required) + 1 other team member
- **Infrastructure**: Person 5 (required) + 1 other team member

#### Review Criteria:
- [ ] Code quality and readability
- [ ] Performance considerations
- [ ] Security implications
- [ ] Test coverage
- [ ] Documentation completeness
- [ ] API consistency

### 4. Merge Requirements
- [ ] At least 2 approvals (including service owner)
- [ ] All CI/CD checks pass
- [ ] No merge conflicts
- [ ] Up-to-date with target branch

## Development Environment Setup

### 1. Prerequisites
```bash
# Node.js (v18 or later)
node --version

# Docker and Docker Compose
docker --version
docker-compose --version

# Git
git --version
```

### 2. Initial Setup
```bash
# Clone repository
git clone https://github.com/your-username/NovaShop.git
cd NovaShop

# Set up MongoDB
./setup-mongodb.sh dev

# Set up your service (example: product-service)
cd services/product-service
npm install
cp .env.example .env
# Edit .env with your configuration

# Run tests
npm test

# Start development server
npm run dev
```

### 3. Environment Variables

#### Product Service (`.env`):
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://product_user:product_pass@localhost:27017/productdb
JWT_SECRET=your-jwt-secret
LOG_LEVEL=debug
```

#### Order Service (`.env`):
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://order_user:order_pass@localhost:27017/orderdb
KAFKA_BROKER=localhost:9092
PRODUCT_SERVICE_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
LOG_LEVEL=debug
```

#### Payment Service (`.env`):
```bash
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://payment_user:payment_pass@localhost:27017/paymentdb
KAFKA_BROKER=localhost:9092
ORDER_SERVICE_URL=http://localhost:3001
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-jwt-secret
LOG_LEVEL=debug
```

#### Frontend (`.env`):
```bash
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_ORDER_SERVICE_URL=http://localhost:3001
REACT_APP_PAYMENT_SERVICE_URL=http://localhost:3002
REACT_APP_ENVIRONMENT=development
```

## API Guidelines

### 1. RESTful Conventions
```bash
# Products
GET    /api/products           # Get all products
GET    /api/products/:id       # Get specific product
POST   /api/products           # Create new product
PUT    /api/products/:id       # Update entire product
PATCH  /api/products/:id       # Partial update
DELETE /api/products/:id       # Delete product

# Orders
GET    /api/orders             # Get user's orders
POST   /api/orders             # Create new order
GET    /api/orders/:id         # Get specific order
PATCH  /api/orders/:id/status  # Update order status

# Payments
POST   /api/payments           # Process payment
GET    /api/payments/:id       # Get payment details
```

### 2. Response Format
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Product Name",
    "price": 29.99
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2025-06-16T10:30:00Z"
}
```

### 3. Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Product name is required",
    "details": {
      "field": "name",
      "value": "",
      "constraint": "required"
    }
  },
  "timestamp": "2025-06-16T10:30:00Z"
}
```

## Database Guidelines

### 1. Schema Design
```javascript
// Product Schema
const productSchema = {
  name: { type: String, required: true, maxLength: 200 },
  description: { type: String, maxLength: 1000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};
```

### 2. Data Validation
- Use Mongoose validators
- Validate on both client and server
- Sanitize user inputs
- Use schema-based validation

### 3. Indexing Strategy
```javascript
// Product indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });
```

## Communication Guidelines

### 1. Daily Standup
- **Time**: 9:00 AM daily
- **Duration**: 15 minutes max
- **Format**: What did I do yesterday? What will I do today? Any blockers?

### 2. Code Review Communication
- Be constructive and respectful
- Explain the "why" behind suggestions
- Acknowledge good practices
- Use GitHub review features effectively

### 3. Issue Reporting
```markdown
**Bug Report:**
- Service: [Product/Order/Payment/Frontend/Infrastructure]
- Environment: [Development/Staging/Production]
- Browser/OS: [if applicable]
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs

**Feature Request:**
- Service: [Product/Order/Payment/Frontend/Infrastructure]
- User story: As a [user type], I want [goal] so that [benefit]
- Acceptance criteria
- Priority: [High/Medium/Low]
```

### 4. Documentation Updates
- Update relevant documentation with code changes
- Use clear, concise language
- Include examples where helpful
- Keep API documentation current

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues
```bash
# Check MongoDB status
docker ps | grep mongo

# View MongoDB logs
docker logs novashop-mongodb

# Test connection
mongosh mongodb://admin:password123@localhost:27017/admin
```

#### 2. Port Conflicts
```bash
# Check what's using a port
lsof -i :3000

# Kill process using port
kill -9 $(lsof -t -i:3000)
```

#### 3. Docker Issues
```bash
# Clean up containers
docker-compose down
docker system prune -f

# Rebuild containers
docker-compose build --no-cache
```

### Getting Help
1. Check this contributing guide
2. Search existing GitHub issues
3. Ask in team chat
4. Create a new issue with detailed description
5. Schedule a pair programming session

## Resources

- [Project README](./README.md)
- [API Documentation](./docs/api-specs.md)
- [Architecture Overview](./docs/architecture.md)
- [MongoDB Setup Guide](./docs/mongodb-setup.md)
- [CI/CD Pipeline Documentation](./docs/ci-cd-pipeline.md)

---

Thank you for contributing to NovaShop! 🚀

For questions about this guide, please create an issue or contact the project maintainers.
