# Test Execution Guide

Quick reference for running tests in different scenarios.

## Basic Execution

### Run all tests
```bash
npm test
```

### Run specific suite
```bash
npx playwright test tests/user-crud.spec.ts
npx playwright test tests/authentication.spec.ts
npx playwright test tests/performance-errors.spec.ts
```

### Run specific test case
```bash
npx playwright test --grep "TC-001"
npx playwright test --grep "Create user"
```

## Debug Mode

### Debug all tests
```bash
npm run test:debug
```

### Debug specific test
```bash
npx playwright test tests/user-crud.spec.ts --debug
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

## Execution Options

### Headed mode (visible browser)
```bash
npm run test:headed
```

### Parallel execution
```bash
npx playwright test --workers=4
```

### Single worker (sequential)
```bash
npx playwright test --workers=1
```

### Retry failed tests
```bash
npx playwright test --retries=2
```

## Filtering

### By tag
```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

### By file pattern
```bash
npx playwright test tests/user-*
```

### Exclude tests
```bash
npx playwright test --grep-invert @skip
```

## Reporting

### View HTML report
```bash
npm run test:report
```

### Generate report without opening
```bash
npx playwright show-report --port 9323
```

## Environment Configuration

### Using different environment
```bash
API_BASE_URL=https://staging-api.example.com npm test
```

### Using .env file
```bash
# Create .env file
cp .env.example .env

# Edit .env with your values
# Then run tests
npm test
```

## CI/CD Execution

### Simulate CI environment
```bash
CI=true npm test
```

### Generate all report formats
```bash
npx playwright test --reporter=html,json,junit
```

## Common Scenarios

### Quick smoke test
```bash
npx playwright test --grep @smoke --workers=4
```

### Full regression with retries
```bash
npx playwright test --retries=2 --reporter=html
```

### Debug failing test
```bash
npx playwright test --grep "TC-005" --debug
```

### Performance test only
```bash
npx playwright test tests/performance-errors.spec.ts
```

## Tips

- Use `--headed` to see browser actions
- Use `--debug` to step through tests
- Use `--ui` for interactive test exploration
- Check `test-results/` folder for detailed logs
- Use `--trace on` to capture traces for debugging
