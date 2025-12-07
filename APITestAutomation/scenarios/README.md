# Test Scenarios Index

This directory contains test scenarios organized by category, written in Gherkin format for non-technical stakeholders.

## 📁 Scenario Categories

### [Booking CRUD Scenarios](./booking-crud-scenarios.md)
**10 scenarios** covering basic booking operations
- Health check
- Create, read, update, delete bookings
- Search and filter
- Error handling for non-existent bookings

**Test Implementation:** `tests/booking-crud.spec.ts`

---

### [Authentication Scenarios](./authentication-scenarios.md)
**7 scenarios** covering authentication and authorization
- Token generation
- Credential validation
- Token-based authorization for updates/deletes
- Basic authentication support

**Test Implementation:** `tests/auth.spec.ts`

---

### [Performance & Error Handling Scenarios](./performance-error-scenarios.md)
**10 scenarios** covering performance and error cases
- Response time validation
- Concurrent request handling
- Input validation (required fields, data types, formats)
- ❌ **XSS vulnerability found** (TC-ERR-004)
- SQL injection prevention
- Special character handling

**Test Implementation:** `tests/errors.spec.ts`

**Critical Issue:** XSS vulnerability documented in `BUG_REPORTS.md`

---

### [Security Scenarios](./security-scenarios.md)
**15 scenarios** covering security testing
- Session security (token uniqueness)
- Injection attacks (command, path traversal, LDAP, null byte)
- Mass assignment prevention
- ⚠️ **Rate limiting missing** (TC-SEC-008)
- ⚠️ **Security headers missing** (TC-SEC-009)
- ⚠️ **Large payload acceptance** (TC-SEC-011)
- ⚠️ **Negative price acceptance** (TC-SEC-012)
- CORS policy validation
- Integer overflow handling
- Unicode support

**Test Implementation:** `tests/security.spec.ts`

**Warnings:** Multiple security findings documented as warnings

---

## 📊 Summary

| Category | Scenarios | Test File | Status |
|----------|-----------|-----------|--------|
| Booking CRUD | 10 | `booking-crud.spec.ts` | ✅ All pass |
| Authentication | 7 | `auth.spec.ts` | ✅ All pass |
| Performance & Errors | 10 | `errors.spec.ts` | ❌ 1 failure (XSS) |
| Security | 15 | `security.spec.ts` | ⚠️ Multiple warnings |
| **TOTAL** | **42** | - | - |

## 🐛 Bugs & Findings

### Critical Issues
1. ❌ **XSS Vulnerability** (TC-ERR-004) - API doesn't sanitize script tags
   - Severity: CRITICAL (P1)
   - Documented in: `BUG_REPORTS.md` - Bug #001

### Warnings
1. ⚠️ **No Rate Limiting** (TC-SEC-008) - DoS vulnerability
2. ⚠️ **Missing Security Headers** (TC-SEC-009) - Multiple headers absent
3. ⚠️ **Large Payload Acceptance** (TC-SEC-011) - Memory exhaustion risk
4. ⚠️ **Negative Price Acceptance** (TC-SEC-012) - Business logic flaw
5. ⚠️ **Token Reuse** (TC-SEC-001) - Potential session fixation

### Informational
- ℹ️ **CORS Wide Open** (TC-SEC-010) - Acceptable for public API

## 🎯 How to Use These Scenarios

### For Non-Technical Stakeholders
- Read scenarios in plain English
- Understand what's being tested and why
- Review findings and their business impact

### For Technical Team
- Map scenarios to test implementations
- Cross-reference with actual test files
- Use for test planning and coverage analysis

### For QA Interview
- Demonstrate test design skills
- Show business context understanding
- Present findings professionally

## 📝 Format

All scenarios follow the **Gherkin** format:
```gherkin
Feature: <What we're testing>
  As a <user type>
  I want to <action>
  So that <benefit>

  Scenario: <Test case description>
    Given <precondition>
    When <action>
    Then <expected result>
```

This format makes tests readable for both technical and non-technical audiences.
