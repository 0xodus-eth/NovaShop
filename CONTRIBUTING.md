# Contributing to NovaShop 🚀

Welcome to NovaShop! This guide will help you contribute effectively to our Next.js and TypeScript microservices e-commerce project.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Git Workflow](#git-workflow)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Development Environment](#development-environment)
- [Security Guidelines](#security-guidelines)

## 🚀 Quick Start

1. **Clone and setup:**

   ```bash
   git clone <repository-url>
   cd NovaShop
   docker compose up -d  # Start backend services
   ```

2. **Frontend development:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Service development:**
   ```bash
   cd services/order-service  # Only order-service is active
   npm install
   npm run dev
   ```

## 🏗️ Project Structure

### Current Status

- **✅ Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **✅ Order Service**: Fully functional TypeScript service
- **🚧 Product Service**: Placeholder (not active)
- **🚧 Payment Service**: Placeholder (not active)
- **✅ Infrastructure**: Docker, MongoDB, Kafka, Mongo Express

### Team Areas

- **Frontend**: `frontend/` - Next.js application
- **Order Service**: `services/order-service/` - Active TypeScript microservice
- **Product Service**: `services/product-service/` - Future development
- **Payment Service**: `services/payment-service/` - Future development
- **Infrastructure**: `infrastructure/`, `docker-compose.yml` - DevOps configuration

## 🌿 Git Workflow

Based on the [simplified Git convention](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)

### Branch Naming

```
<type>/<scope>-<description>
```

**Types:** `feature/`, `bugfix/`, `hotfix/`, `chore/`, `docs/`  
**Scopes:** `frontend`, `order`, `product`, `payment`, `infra`

**Examples:**

```bash
feature/frontend-order-form
feature/order-create-endpoint
bugfix/frontend-navigation
chore/infra-docker-update
docs/api-documentation
```

### Commit Messages

```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

**Examples:**

```bash
feat(frontend): add order creation form
fix(order): resolve database connection issue
docs(readme): update setup instructions
chore(deps): update typescript to 5.3.0
```

## 💻 Code Standards

### TypeScript (Backend Services)

```typescript
// Use TypeScript for all new backend code
interface OrderData {
  productId: string;
  quantity: number;
  userId: string;
}

export class OrderService {
  async createOrder(data: OrderData): Promise<Order> {
    // Implementation with proper error handling
  }
}
```

### Next.js/React (Frontend)

```tsx
// Use TypeScript components
interface OrderFormProps {
  onSubmit: (order: OrderData) => void;
  loading?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, loading }) => {
  // Component implementation
};
```

### Code Quality

- **ESLint + Prettier** for formatting
- **Descriptive variable names** and function names
- **Error handling** for all async operations
- **Type definitions** for all interfaces and functions

## 📝 Pull Request Process

### PR Template (Simplified)

- **Description**: What does this PR do?
- **Type**: Feature, bugfix, docs, etc.
- **Service**: Which part of the project?
- **Testing**: Unit tests, manual testing completed
- **Screenshots**: For UI changes

### Review Requirements

- **Self-review** completed
- **Tests pass** locally
- **No sensitive files** (.env, node_modules) committed
- **Documentation updated** if needed

## 🛠️ Development Environment

### Prerequisites

- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**

### Setup Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd NovaShop

# 2. Start backend services (RECOMMENDED)
docker compose up -d

# 3. Access services
# - MongoDB Web UI: http://localhost:8081 (admin/pass)
# - Order Service: http://localhost:3001
# - Frontend: http://localhost:3000 (after step 4)

# 4. Start frontend separately
cd frontend
npm install
npm run dev
```

### Environment Configuration

**Order Service** (`.env`):

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:password123@localhost:27017/orderdb?authSource=admin
KAFKA_BROKER=localhost:9092
```

**Docker vs Local Development:**

- **Recommended**: Use Docker for all backend services
- **Frontend**: Run locally for better development experience
- **Avoid**: Manual setup of MongoDB/Kafka (complex and error-prone)
  import './ProductList.css';
  import ProductCard from '../ProductCard/ProductCard';

// 4. Component
const ProductList = () => {
// Implementation
};

export default ProductList;

````

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
````

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

````markdown
## Description

Brief description of changes made.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues

## 🔒 Security Guidelines

### Critical Rules

> **⚠️ NEVER commit sensitive files!**

- **NEVER push `.env` files** - Contains credentials and secrets
- **NEVER push `node_modules/`** - Large generated dependencies
- **ALWAYS check `.gitignore`** before adding new services

### Current .gitignore Patterns

```gitignore
services/order-service/.env
services/order-service/node_modules/
frontend/.env*
frontend/node_modules/
```
````

### Adding New Services

1. **Check existing patterns** in root `.gitignore`
2. **Add your patterns:**
   ```gitignore
   services/your-service/.env
   services/your-service/node_modules/
   ```
3. **Use `.env.example`** files for documentation (no sensitive values)

### Pre-Commit Security Check

```bash
# Check what you're about to commit
git status
git diff --cached

# Verify no sensitive files
git ls-files | grep -E "\.(env|key|pem)$|node_modules"
```

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Order service tests
cd services/order-service
npm test

# Run all tests
npm run test:all
```

### Test Requirements

- **Unit tests** for new functions/components
- **Integration tests** for API endpoints
- **Manual testing** for UI changes
- **All tests pass** before PR submission

## 🐛 Troubleshooting

### Common Issues

**Container won't start:**

```bash
docker compose logs <service-name>
docker compose restart <service-name>
```

**Port conflicts:**

```bash
sudo netstat -tlnp | grep <port>
sudo kill -9 <pid>
```

**MongoDB connection issues:**

```bash
# Check container health
docker compose ps
# View logs
docker compose logs mongodb
```

**Clean restart:**

```bash
docker compose down -v
docker compose up -d --build
```

## 📚 Resources

- **MongoDB Web UI**: http://localhost:8081 (admin/pass)
- **Order Service API**: http://localhost:3001
- **Project README**: [README.md](./README.md)
- **API Documentation**: `docs/` folder

## 🤝 Getting Help

1. **Check existing issues** on GitHub
2. **Review this guide** and README
3. **Ask in team discussions**
4. **Create detailed issue** with logs and screenshots

---

**Thank you for contributing to NovaShop!** 🎉

For questions about this guide, please create an issue or reach out to the maintainers.

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
  updatedAt: { type: Date, default: Date.now },
};
```

### 2. Data Validation

- Use Mongoose validators
