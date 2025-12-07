# API Test Automation Suite

Comprehensive API testing framework built with Playwright and TypeScript for automated testing of REST APIs.

## 📋 Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Test Execution](#test-execution)
- [Test Strategy](#test-strategy)
- [Test Cases](#test-cases)
- [Tool Justification](#tool-justification)
- [Reporting](#reporting)
- [CI/CD Integration](#cicd-integration)

## 🎯 Overview

This project provides a robust, scalable test automation framework for API testing. It implements comprehensive test coverage including CRUD operations, authentication flows, error handling, and performance validation.

## 🛠 Technology Stack

- **Test Framework**: Playwright Test (v1.40+)
- **Language**: TypeScript
- **Runtime**: Node.js (v18+)
- **Reporting**: HTML, JSON, JUnit
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
APITestAutomation/
├── tests/                          # Test specifications
│   ├── user-crud.spec.ts          # User CRUD operations tests
│   ├── authentication.spec.ts      # Authentication & authorization tests
│   └── performance-errors.spec.ts  # Performance & error handling tests
├── utils/                          # Utility functions
│   ├── api-helper.ts              # API request wrapper
│   └── test-data.ts               # Test data generators
├── config/                         # Configuration files
│   └── test.config.ts             # Test configuration
├── test-results/                   # Test execution results
│   ├── html-report/               # HTML test report
│   ├── test-results.json          # JSON results
│   └── junit.xml                  # JUnit XML report
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd APITestAutomation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (if needed for UI tests)
   ```bash
   npx playwright install
   ```

4. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` file with your API configuration:
   ```
   API_BASE_URL=https://your-api-endpoint.com
   API_KEY=your_api_key
   TIMEOUT=60000
   ```

5. **Verify installation**
   ```bash
   npm test -- --list
   ```

## ▶️ Test Execution

### Run all tests
```bash
npm test
```

### Run specific test suite
```bash
npx playwright test tests/user-crud.spec.ts
```

### Run tests in headed mode (with browser UI)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

### Run tests by tag/grep
```bash
npx playwright test --grep "TC-001"
```

### Parallel execution
```bash
npx playwright test --workers=4
```

## 📊 Test Strategy

### Approach
The test strategy follows a **risk-based testing approach** combined with **functional coverage** to ensure comprehensive validation of API endpoints.

### Test Levels

#### 1. **Functional Testing** (60%)
- CRUD operations validation
- Data integrity checks
- Business logic verification
- Input validation

#### 2. **Security Testing** (20%)
- Authentication & authorization
- SQL injection prevention
- XSS attack prevention
- Input sanitization

#### 3. **Performance Testing** (10%)
- Response time validation
- Concurrent request handling
- Load testing (basic)

#### 4. **Error Handling** (10%)
- Invalid input handling
- Error message validation
- HTTP status code verification
- Edge case scenarios

### Test Design Principles

1. **Independent Tests**: Each test is self-contained and can run independently
2. **Data-Driven**: Uses test data generators for dynamic test data
3. **Reusability**: Common functions in utility classes
4. **Maintainability**: Clear naming conventions and documentation
5. **Scalability**: Modular structure for easy expansion

### Test Execution Strategy

- **Smoke Tests**: Run on every commit
- **Regression Tests**: Run daily
- **Full Suite**: Run before releases
- **Parallel Execution**: Maximize efficiency

### Test Data Management

- **Dynamic Generation**: Uses timestamps and random data
- **Cleanup**: Automatic cleanup after tests
- **Isolation**: Each test creates its own test data

## 📝 Test Cases

### User CRUD Operations Suite (10 Test Cases)

| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC-001 | Create user with valid data | High | Positive |
| TC-002 | Retrieve user by ID | High | Positive |
| TC-003 | Retrieve all users | Medium | Positive |
| TC-004 | Update user with valid data | High | Positive |
| TC-005 | Partial update using PATCH | Medium | Positive |
| TC-006 | Delete user successfully | High | Positive |
| TC-007 | Get non-existent user (404) | High | Negative |
| TC-008 | Create user with invalid data | High | Negative |
| TC-009 | Update non-existent user | Medium | Negative |
| TC-010 | Duplicate email validation | High | Negative |

#### Detailed Test Case Examples

**TC-001: Create User - Valid Data**
- **Objective**: Verify successful user creation
- **Steps**:
  1. Generate valid user data
  2. Send POST request to `/api/users`
  3. Validate response status (201)
  4. Verify response contains user ID
  5. Verify returned data matches input
- **Expected Result**: User created successfully with 201 status

**TC-007: Get Non-Existent User**
- **Objective**: Verify proper error handling
- **Steps**:
  1. Request user with non-existent ID
  2. Send GET request to `/api/users/{invalid-id}`
  3. Validate response status (404)
  4. Verify error message in response
- **Expected Result**: 404 Not Found with error message

### Authentication & Authorization Suite (7 Test Cases)

| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC-AUTH-001 | User registration | High | Positive |
| TC-AUTH-002 | Login with valid credentials | High | Positive |
| TC-AUTH-003 | Login with invalid credentials | High | Negative |
| TC-AUTH-004 | Access protected resource with token | High | Positive |
| TC-AUTH-005 | Access protected resource without token | High | Negative |
| TC-AUTH-006 | Token refresh | Medium | Positive |
| TC-AUTH-007 | User logout | Medium | Positive |

### Performance & Error Handling Suite (10 Test Cases)

| Test ID | Test Case | Priority | Type |
|---------|-----------|----------|------|
| TC-PERF-001 | Response time validation | Medium | Performance |
| TC-PERF-002 | Concurrent requests handling | Medium | Performance |
| TC-ERR-001 | Malformed JSON handling | High | Negative |
| TC-ERR-002 | Missing required fields | High | Negative |
| TC-ERR-003 | Invalid HTTP method | Medium | Negative |
| TC-ERR-004 | SQL injection prevention | High | Security |
| TC-ERR-005 | XSS attack prevention | High | Security |
| TC-ERR-006 | Large payload handling | Low | Negative |
| TC-ERR-007 | Rate limiting verification | Medium | Security |
| TC-ERR-008 | Content-Type validation | Low | Negative |
| TC-ERR-009 | Invalid endpoint (404) | Medium | Negative |
| TC-ERR-010 | Special characters handling | Medium | Positive |

**Total Test Cases: 27**

## 🎯 Tool Justification: Playwright

### Why Playwright?

After evaluating Selenium, Cypress, Playwright, and Pytest, **Playwright** was selected for the following reasons:

#### Advantages

1. **API Testing Native Support**
   - Built-in `APIRequestContext` for API testing
   - No need for external libraries (axios, fetch)
   - Seamless integration with UI testing if needed

2. **Modern Architecture**
   - TypeScript first-class support
   - Async/await native support
   - Fast execution with parallel test runs

3. **Rich Assertions**
   - Built-in expect library with web-first assertions
   - Custom matchers support
   - Detailed error messages

4. **Excellent Reporting**
   - Multiple built-in reporters (HTML, JSON, JUnit)
   - Beautiful, interactive HTML reports
   - Screenshots and traces for debugging

5. **CI/CD Ready**
   - Docker support out of the box
   - GitHub Actions integration
   - Parallel execution capabilities

6. **Developer Experience**
   - Auto-wait mechanisms
   - Codegen for quick test creation
   - VS Code extension
   - Excellent documentation

7. **Cross-Platform**
   - Runs on Windows, Linux, macOS
   - Consistent behavior across platforms

#### Comparison with Alternatives

| Feature | Playwright | Cypress | Selenium | Pytest |
|---------|-----------|---------|----------|---------|
| API Testing | ✅ Native | ✅ Plugin | ❌ Needs libraries | ✅ With requests |
| TypeScript | ✅ Excellent | ✅ Good | ⚠️ Moderate | ❌ N/A (Python) |
| Parallel Execution | ✅ Built-in | ⚠️ Limited | ✅ Grid needed | ✅ With plugins |
| Learning Curve | ⚠️ Moderate | ✅ Easy | ❌ Steep | ✅ Easy |
| Reporting | ✅ Excellent | ✅ Good | ⚠️ Needs setup | ✅ Good |
| CI/CD Integration | ✅ Excellent | ✅ Good | ⚠️ Moderate | ✅ Excellent |
| Community Support | ✅ Growing | ✅ Strong | ✅ Mature | ✅ Strong |

#### Relevance to This Task

- **Pure API Testing**: Playwright's API testing capabilities are ideal for this task
- **Modern Stack**: TypeScript provides type safety and better IDE support
- **Scalability**: Easy to add more test cases and suites
- **Reporting Requirements**: Built-in HTML reports satisfy bonus requirements
- **CI/CD**: Simple GitHub Actions integration for bonus task

## 📈 Reporting

### Available Report Formats

1. **HTML Report** (Interactive)
   - Location: `test-results/html-report/index.html`
   - Features: Test results, traces, screenshots, filtering
   - View: `npm run test:report`

2. **JSON Report**
   - Location: `test-results/test-results.json`
   - Features: Machine-readable, for custom processing

3. **JUnit XML Report**
   - Location: `test-results/junit.xml`
   - Features: CI/CD integration, standard format

### Report Contents

- Test execution summary
- Pass/fail statistics
- Execution time per test
- Error details and stack traces
- Request/response details
- Retry information

## 🔄 CI/CD Integration

### GitHub Actions Configuration

A GitHub Actions workflow is included (`.github/workflows/test.yml`) that:

- Triggers on push and pull requests
- Runs tests in parallel
- Generates and publishes test reports
- Supports scheduled runs
- Provides notifications on failure

### Running in CI

The configuration is optimized for CI with:
- Automatic retries for flaky tests
- Parallel execution
- Artifact storage for reports
- Environment variable support

### Setup CI

1. Push code to GitHub repository
2. GitHub Actions will automatically detect the workflow
3. Tests run on every push/PR
4. View results in Actions tab

## 🐛 Troubleshooting

### Common Issues

**Issue: Tests failing with timeout**
- Solution: Increase timeout in `playwright.config.ts`
- Check API endpoint availability

**Issue: Connection refused**
- Solution: Verify API_BASE_URL in `.env`
- Ensure API server is running

**Issue: TypeScript errors**
- Solution: Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review test execution logs
3. Consult Playwright documentation: https://playwright.dev

## 📄 License

This project is created for interview purposes.

---

**Author**: QA Engineering Candidate  
**Date**: December 2025  
**Version**: 1.0.0
