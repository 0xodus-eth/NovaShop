## Description
Brief description of changes made in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement
- [ ] CI/CD improvement

## Service/Component Affected
- [ ] Product Service (`services/product-service/`)
- [ ] Order Service (`services/order-service/`)
- [ ] Payment Service (`services/payment-service/`)
- [ ] Frontend (`frontend/`)
- [ ] Infrastructure (`infrastructure/`)
- [ ] Documentation (`docs/`)
- [ ] CI/CD (`.github/workflows/`)

## Related Issues
- Closes #[issue-number]
- Related to #[issue-number]
- Fixes #[issue-number]

## Changes Made
### Backend Changes (if applicable)
- [ ] New API endpoints added
- [ ] Database schema changes
- [ ] Business logic updates
- [ ] Error handling improvements
- [ ] Performance optimizations

### Frontend Changes (if applicable)
- [ ] New components/pages added
- [ ] UI/UX improvements
- [ ] State management updates
- [ ] API integration changes
- [ ] Styling updates

### Infrastructure Changes (if applicable)
- [ ] Docker configuration updates
- [ ] Kubernetes manifest changes
- [ ] CI/CD pipeline improvements
- [ ] Monitoring/logging enhancements
- [ ] Security improvements

## Testing
### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

### Test Results
```bash
# Paste test output here
npm test
```

### Test Coverage Report
- **Overall Coverage**: X%
- **Statements**: X%
- **Branches**: X%
- **Functions**: X%
- **Lines**: X%

## API Changes (if applicable)
### New Endpoints
```
POST /api/new-endpoint
GET /api/another-endpoint/:id
```

### Modified Endpoints
```
PATCH /api/existing-endpoint/:id
```

### Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes (details below)

**Breaking Change Details:**
```
Explain what breaks and how to migrate
```

## Database Changes (if applicable)
- [ ] New collections/tables
- [ ] Schema modifications
- [ ] Data migrations required
- [ ] Index changes

**Migration Instructions:**
```bash
# Commands to run for migration
```

## Environment Variables
### New Variables Added
```env
NEW_VARIABLE=default_value
ANOTHER_VARIABLE=example_value
```

### Modified Variables
```env
EXISTING_VARIABLE=new_default_value
```

## Screenshots (if applicable)
### Before
![Before Screenshot](url)

### After
![After Screenshot](url)

## Performance Impact
- [ ] No performance impact
- [ ] Performance improvement
- [ ] Potential performance impact (details below)

**Performance Details:**
- Metric 1: Before X, After Y
- Metric 2: Before X, After Y

## Security Considerations
- [ ] No security implications
- [ ] Security improvement
- [ ] Potential security impact (reviewed and approved)

**Security Details:**
- Authentication/Authorization changes
- Data validation improvements
- Security vulnerability fixes

## Deployment Notes
### Pre-deployment Steps
- [ ] Database migrations
- [ ] Environment variable updates
- [ ] Infrastructure changes

### Post-deployment Steps
- [ ] Health checks
- [ ] Monitoring verification
- [ ] Feature flag updates

### Rollback Plan
1. Step 1 to rollback
2. Step 2 to rollback
3. Step 3 to rollback

## Documentation
- [ ] Code comments updated
- [ ] API documentation updated (`docs/api-specs.md`)
- [ ] README updated
- [ ] Architecture documentation updated
- [ ] CONTRIBUTING.md updated (if process changes)

## Checklist
### Code Quality
- [ ] Code follows style guidelines (ESLint/Prettier)
- [ ] Self-review completed
- [ ] Complex code is commented
- [ ] No debug statements (console.log, etc.)
- [ ] Error handling is comprehensive
- [ ] Input validation is implemented

### Testing
- [ ] All existing tests pass
- [ ] New tests cover edge cases
- [ ] Integration tests cover new functionality
- [ ] Manual testing scenarios documented

### Dependencies
- [ ] No new security vulnerabilities introduced
- [ ] Dependencies are up to date
- [ ] License compatibility checked

### Git
- [ ] Meaningful commit messages
- [ ] Branch follows naming convention
- [ ] No merge conflicts
- [ ] Up to date with target branch

## Reviewer Notes
**Areas to focus on during review:**
- Critical logic in `file.js:line-range`
- Performance implications of `feature`
- Security considerations for `endpoint`

**Questions for reviewers:**
1. Question 1?
2. Question 2?

## Additional Context
Add any other context about the pull request here.

---

**For Reviewers:**
- [ ] Code review completed
- [ ] Functionality tested locally
- [ ] Documentation reviewed
- [ ] Security implications considered
- [ ] Performance impact assessed
