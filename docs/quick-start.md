# Quick Start Guide for NovaShop Contributors

Welcome to NovaShop! This guide will get you up and running in 15 minutes.

## 🚀 Quick Setup (5 minutes)

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/your-username/NovaShop.git
cd NovaShop

# Install MongoDB and dependencies
./setup-mongodb.sh dev

# Choose your service area
cd services/[your-service]  # product-service, order-service, or payment-service
# OR
cd frontend  # for frontend development
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings (use any text editor)
nano .env  # or code .env, vim .env, etc.
```

### 3. Install Dependencies
```bash
# For backend services
npm install

# For frontend (if working on UI)
cd frontend && npm install
```

## 🏃‍♂️ Start Development (2 minutes)

### Backend Service
```bash
# Start your service
npm run dev

# In another terminal, run tests
npm test
```

### Frontend
```bash
cd frontend
npm start
```

## 📝 Make Your First Contribution (8 minutes)

### 1. Create a Branch
```bash
# Format: type/scope-description
git checkout -b feature/product-add-search-endpoint
git checkout -b bugfix/order-validation-error
git checkout -b chore/frontend-update-dependencies
```

### 2. Make Changes
- Edit files in your assigned service area
- Follow the coding standards in [CONTRIBUTING.md](./CONTRIBUTING.md)
- Add tests for new functionality

### 3. Test Your Changes
```bash
# Run tests
npm test

# Check code style
npm run lint  # (if available)

# Test manually
curl http://localhost:3000/api/health  # or test in browser
```

### 4. Commit and Push
```bash
# Stage your changes
git add .

# Commit with conventional format
git commit -m "feat(product): add search endpoint with filters

Implemented product search with category, price, and name filters.
Includes pagination and sorting options.

Closes #123"

# Push to GitHub
git push origin feature/product-add-search-endpoint
```

### 5. Create Pull Request
1. Go to GitHub repository
2. Click "New Pull Request"
3. Fill out the PR template
4. Request review from your team member

## 🎯 Team Assignments

| Who | What | Where |
|-----|------|-------|
| **Person 1** | Product Service | `services/product-service/` |
| **Person 2** | Order Service | `services/order-service/` |
| **Person 3** | Payment Service | `services/payment-service/` |
| **Person 4** | Frontend | `frontend/` |
| **Person 5** | DevOps | `infrastructure/` |

## 🔧 Common Commands

```bash
# MongoDB
./setup-mongodb.sh dev          # Start MongoDB for development
./setup-mongodb.sh test          # Test MongoDB connection
docker logs novashop-mongodb     # View MongoDB logs

# Development
npm run dev                      # Start development server
npm test                         # Run tests
npm run test:watch              # Run tests in watch mode
npm run lint                     # Check code style

# Docker (if using)
docker-compose up -d            # Start all services
docker-compose logs [service]   # View service logs
docker-compose down             # Stop all services
```

## 📚 Essential Reading

1. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Complete contribution guidelines
2. **[README.md](./README.md)** - Project overview and setup
3. **[docs/api-specs.md](./docs/api-specs.md)** - API documentation
4. **Your service README** - Service-specific documentation

## 🆘 Need Help?

### Quick Fixes
```bash
# Port already in use
lsof -i :3000                   # Find what's using port 3000
kill -9 $(lsof -t -i:3000)     # Kill the process

# MongoDB connection issues
docker ps | grep mongo          # Check if MongoDB is running
docker restart novashop-mongodb # Restart MongoDB

# Git issues
git status                      # Check current state
git stash                       # Temporarily save changes
git pull origin develop        # Get latest changes
git stash pop                   # Restore your changes
```

### Get Support
1. **Check existing issues**: Search GitHub issues first
2. **Ask the team**: Use team chat for quick questions
3. **Create an issue**: Use issue templates for bugs/features
4. **Pair programming**: Schedule time with a team member

## 🎉 You're Ready!

That's it! You're now ready to contribute to NovaShop. Remember:

- ✅ Follow the branch naming convention
- ✅ Write meaningful commit messages
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Be respectful in code reviews

Happy coding! 🚀

---

**Next Steps:**
1. Read the full [CONTRIBUTING.md](./CONTRIBUTING.md) when you have time
2. Set up your IDE with the recommended extensions
3. Join the team communication channels
4. Pick your first issue from the project board
