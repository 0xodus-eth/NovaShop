# CI/CD Pipeline Documentation

This document describes the GitHub Actions workflows for the NovaShop project.

## Workflows Overview

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

The primary workflow that runs on pushes and pull requests to `main` and `develop` branches.

#### Jobs:

1. **MongoDB Setup & Validation**
   - Sets up MongoDB service
   - Creates databases and users
   - Validates database connectivity
   - Tests basic CRUD operations

2. **Configuration Validation**
   - Validates Docker Compose files
   - Validates Kubernetes manifests
   - Checks MongoDB configuration syntax

3. **Scripts Testing**
   - Tests setup script syntax
   - Validates help functions work correctly

4. **Microservices Build & Test**
   - Builds each microservice (when they exist)
   - Runs unit tests
   - Matrix strategy for parallel builds

5. **Frontend Build & Test**
   - Builds React frontend (when it exists)
   - Runs frontend tests

6. **Docker Build & Push**
   - Builds Docker images for each service
   - Pushes to GitHub Container Registry
   - Only runs on main branch

7. **Integration Tests**
   - Runs cross-service tests
   - Tests with real MongoDB instance

8. **Security Scanning**
   - Scans for vulnerabilities using Trivy
   - Uploads results to GitHub Security tab

9. **Deployment**
   - Deploys to staging environment
   - Only runs on main branch pushes

### 2. MongoDB Validation (`mongodb-validation.yml`)

Specialized workflow that runs when MongoDB-related files change.

#### Triggers:
- Changes to `infrastructure/docker/mongodb/**`
- Changes to MongoDB Kubernetes manifests
- Changes to setup scripts

#### Jobs:

1. **Validate MongoDB Config**
   - Docker Compose validation
   - Kubernetes manifest validation
   - Setup script syntax testing

2. **Test MongoDB Deployment**
   - Live MongoDB testing
   - Database initialization
   - Connection validation
   - CRUD operations testing

3. **Security Configuration Check**
   - Checks for default passwords
   - Validates security settings
   - Generates security report

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_VERSION` | Node.js version for builds | `18` |
| `MONGODB_VERSION` | MongoDB version for testing | `7.0` |
| `DOCKER_REGISTRY` | Container registry | `ghcr.io` |
| `IMAGE_NAME` | Base image name | `${{ github.repository }}` |

## Secrets Required

### For Production Deployment:
- `GITHUB_TOKEN` - Automatically provided
- Additional secrets for production environments (to be added)

## Workflow Features

### Smart Service Detection
The workflows automatically detect which services exist and only run relevant jobs:
- Skips microservice builds if directories don't exist
- Skips frontend builds if no React app is present
- Skips Docker builds if no Dockerfiles exist

### Matrix Builds
Uses GitHub Actions matrix strategy for parallel builds:
```yaml
strategy:
  matrix:
    service: [product-service, order-service, payment-service]
```

### Conditional Execution
- Docker builds only run on main branch
- Deployment only runs on successful builds
- Security scans run on all branches

### Health Checks
MongoDB services include comprehensive health checks:
```yaml
options: >-
  --health-cmd "mongosh --eval 'db.runCommand(\"ping\")'"
  --health-interval 10s
  --health-timeout 5s
  --health-retries 5
```

## Test Database Configuration

Integration tests use separate test databases:
- `productdb_test`
- `orderdb_test`
- `paymentdb_test`

All with dedicated test user: `test_user:test_pass`

## Security Features

1. **Vulnerability Scanning**
   - Trivy scanner for filesystem vulnerabilities
   - Results uploaded to GitHub Security tab

2. **Configuration Security Checks**
   - Default password detection
   - Security setting validation
   - Network configuration review

3. **SARIF Integration**
   - Security results in SARIF format
   - Integration with GitHub Security tab

## Artifacts

The workflows generate the following artifacts:
- **Security Report**: MongoDB security configuration analysis
- **Build Outputs**: Compiled services and frontend
- **Test Results**: Unit and integration test reports

## Local Testing

To test the workflows locally, you can use:

```bash
# Test MongoDB setup
./setup-mongodb.sh dev

# Test configuration validation
docker-compose -f docker-compose.yml config --quiet

# Test Kubernetes manifests
kubectl --dry-run=client apply -f infrastructure/kubernetes/
```

## Future Enhancements

### Planned Additions:
1. **Performance Testing**
   - Load testing for APIs
   - Database performance benchmarks

2. **Advanced Security**
   - Container image scanning
   - Dependency vulnerability checks
   - SAST (Static Application Security Testing)

3. **Multi-Environment Deployment**
   - Staging and production environments
   - Environment-specific configurations

4. **Monitoring Integration**
   - Deployment health checks
   - Performance monitoring setup

5. **Release Management**
   - Semantic versioning
   - Automated changelog generation
   - Release notes

### Environment-Specific Workflows:
- **Development**: Continuous deployment to dev environment
- **Staging**: Manual approval for staging deployment
- **Production**: Protected branch deployment with approvals

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Timeout**
   - Increase health check timeout
   - Check network configuration

2. **Service Build Failures**
   - Verify package.json exists
   - Check Node.js version compatibility

3. **Docker Build Issues**
   - Ensure Dockerfile exists
   - Check base image availability

4. **Security Scan Failures**
   - Review Trivy scan results
   - Update vulnerable dependencies

### Debug Steps:

1. Check workflow logs in GitHub Actions tab
2. Verify environment variables are set correctly
3. Ensure all required files exist
4. Test configurations locally first

## Monitoring and Alerts

The workflows include status checks that will:
- ✅ Pass on successful builds and tests
- ❌ Fail on any errors or security issues
- ⚠️ Warn on configuration issues

Branch protection rules should be configured to:
- Require status checks to pass
- Require up-to-date branches
- Require review from code owners

## Performance Considerations

- **Parallel Execution**: Matrix builds run in parallel
- **Caching**: npm packages are cached between runs
- **Selective Triggers**: MongoDB workflow only runs on relevant changes
- **Efficient Testing**: Uses GitHub's hosted MongoDB service

The workflows are designed to be fast, reliable, and comprehensive while maintaining security and quality standards.
