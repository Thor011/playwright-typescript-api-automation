# Contributing to API Test Automation

Thank you for your interest in contributing to this project!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Adding New Tests

### Test File Structure
```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/api-helper';

test.describe('Feature Name', () => {
  let apiHelper: ApiHelper;

  test.beforeAll(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('TC-XXX: Test description', async () => {
    // Test implementation
  });
});
```

### Test Naming Convention
- Use descriptive test names
- Include test case ID: `TC-XXX: Description`
- Follow pattern: `Should [expected behavior] when [condition]`

### Test Categories
- **Positive Tests**: Valid inputs, expected success
- **Negative Tests**: Invalid inputs, expected failures
- **Edge Cases**: Boundary conditions
- **Security Tests**: Authentication, authorization, injection
- **Performance Tests**: Response time, load handling

## Code Style

- Use TypeScript
- Follow existing code structure
- Add comments for complex logic
- Use async/await for asynchronous operations
- Handle errors appropriately

## Documentation

- Update README.md if adding new features
- Document test cases in test files
- Update BUG_REPORTS.md if finding issues

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add test coverage for new features
4. Request review from maintainers
5. Address review comments

## Questions?

Open an issue for any questions or concerns.
