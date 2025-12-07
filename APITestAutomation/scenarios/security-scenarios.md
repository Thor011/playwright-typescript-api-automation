# Security Test Scenarios

## TC-SEC-001: Unique Token Generation ⚠️ POTENTIAL BUG
**Endpoint:** `POST /auth` (called twice)

```gherkin
Feature: Session Security
  As a system
  I want to generate unique tokens per session
  So that session fixation attacks are prevented

  Scenario: Generate multiple auth tokens
    Given I authenticate twice with same credentials
    When I compare the two tokens
    Then they should be different tokens
    
  ⚠️ MAY FAIL - Token reuse is a security risk
```

## TC-SEC-002: Prevent Unauthorized Access
**Endpoint:** `GET /booking/{id}` (sequential IDs)

```gherkin
Feature: Access Control
  As a system
  I want to prevent users from accessing others' bookings
  So that privacy is protected

  Scenario: Attempt to access sequential booking IDs
    Given I create a booking with ID 100
    When I try to access bookings 99, 101, and 102
    Then the system should only allow access to authorized bookings
    
  ℹ️ NOTE: This API has no user-level access control (by design for demo)
```

## TC-SEC-003: Prevent Command Injection
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "; ls -la", "lastname": "`cat /etc/passwd`", ... }`

```gherkin
Feature: Command Injection Protection
  As a system
  I want to prevent command execution
  So that the server is not compromised

  Scenario: Attempt command injection in booking fields
    Given I have booking data with shell commands
      | firstname | ; ls -la           |
      | lastname  | `cat /etc/passwd`  |
    When I create the booking
    Then the commands should not be executed
    And data should be stored as plain text
```

## TC-SEC-004: Prevent Path Traversal
**Endpoint:** `POST /booking`  
**Request Body:** `{ "additionalneeds": "../../etc/passwd", ... }`

```gherkin
Feature: Path Traversal Protection
  As a system
  I want to prevent directory traversal attacks
  So that file system access is restricted

  Scenario: Attempt path traversal in booking fields
    Given I have booking data with path traversal
      | additionalneeds | ../../etc/passwd |
    When I create the booking
    Then the system should not access files
    And should treat input as regular text
```

## TC-SEC-005: Prevent LDAP Injection
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "*)(uid=*", ... }`

```gherkin
Feature: LDAP Injection Protection
  As a system
  I want to prevent LDAP injection
  So that directory services are protected

  Scenario: Attempt LDAP injection in booking fields
    Given I have booking data with LDAP injection
      | firstname | *)(uid=* |
    When I create the booking
    Then the LDAP code should not be executed
```

## TC-SEC-006: Prevent Mass Assignment
**Endpoint:** `POST /booking`  
**Request Body:** `{ ..., "isAdmin": true, "role": "admin" }` (unauthorized fields)

```gherkin
Feature: Mass Assignment Protection
  As a system
  I want to prevent unauthorized field injection
  So that users cannot elevate privileges

  Scenario: Attempt to inject admin privileges
    Given I have booking data with extra fields
      | isAdmin  | true  |
      | role     | admin |
    When I create the booking
    Then unauthorized fields should be ignored
    And should not be stored in the database
```

## TC-SEC-007: Protect Sensitive Data in Errors
**Endpoint:** `POST /auth`  
**Request Body:** Invalid credentials

```gherkin
Feature: Information Disclosure Prevention
  As a system
  I want to hide sensitive info in errors
  So that attackers cannot gather intelligence

  Scenario: Trigger authentication error
    Given I have invalid credentials
    When I attempt to authenticate
    Then the error should be generic
    And should not reveal database details or stack traces
```

## TC-SEC-008: Rate Limiting ⚠️ WARNING
**Endpoint:** `GET /booking`  
**Test:** 50 rapid consecutive requests

```gherkin
Feature: Rate Limiting
  As a system
  I want to limit request rates per user
  So that denial-of-service attacks are prevented

  Scenario: Send rapid burst of requests
    When I send 50 requests in quick succession
    Then some requests should be rate limited with 429 status
    
  ⚠️ FINDING: No rate limiting detected - potential DoS vulnerability
```

## TC-SEC-009: Security Headers ⚠️ WARNING
**Endpoint:** `GET /booking`  
**Check:** Response headers for security best practices

```gherkin
Feature: HTTP Security Headers
  As a system
  I want to include security headers
  So that common web attacks are mitigated

  Scenario: Check for security headers
    When I request the booking list
    Then the response should include security headers
      | X-Content-Type-Options    |
      | X-Frame-Options           |
      | Strict-Transport-Security |
      | Content-Security-Policy   |
      
  ⚠️ FINDING: Missing all recommended security headers
  
  Missing Headers:
    - x-content-type-options (prevents MIME sniffing)
    - x-frame-options (prevents clickjacking)
    - strict-transport-security (enforces HTTPS)
    - content-security-policy (prevents XSS)
```

## TC-SEC-010: CORS Policy Check ℹ️ INFO
**Endpoint:** `GET /booking`  
**Headers:** `Origin: https://malicious-site.com`

```gherkin
Feature: CORS Configuration
  As a system
  I want to restrict cross-origin access
  So that unauthorized sites cannot access the API

  Scenario: Check CORS policy
    When I send a request from a different origin
    Then the CORS policy should be appropriately restrictive
    
  ℹ️ FINDING: CORS allows all origins (*) - acceptable for public API
```

## TC-SEC-011: Reject Oversized Requests ⚠️ WARNING
**Endpoint:** `POST /booking`  
**Request Body:** Booking with 1MB text payload

```gherkin
Feature: Request Size Limits
  As a system
  I want to reject oversized payloads
  So that memory exhaustion attacks are prevented

  Scenario: Send extremely large booking data
    Given I have booking with 1MB of text
    When I try to create the booking
    Then the system should reject or truncate the data
    
  ⚠️ FINDING: API accepts 1MB payload - potential DoS via memory exhaustion
```

## TC-SEC-012: Prevent Negative Price Exploit ⚠️ WARNING
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "John", "lastname": "Doe", "totalprice": -999999, ... }`

```gherkin
Feature: Business Logic Security
  As a system
  I want to prevent negative prices
  So that financial logic cannot be exploited

  Scenario: Attempt to create booking with negative price
    Given I have a booking with price -999999
    When I try to create the booking
    Then the system should reject negative amounts
    
  ⚠️ FINDING: API accepts negative prices - business logic vulnerability
```

## TC-SEC-013: Handle Integer Overflow
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "John", "lastname": "Doe", "totalprice": 2147483647, ... }`

```gherkin
Feature: Numeric Overflow Protection
  As a system
  I want to handle large numbers safely
  So that integer overflow doesn't occur

  Scenario: Submit maximum integer value
    Given I have a booking with price 2147483647
    When I create the booking
    Then the system should handle the large number correctly
```

## TC-SEC-014: Prevent Null Byte Injection
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "test\0.jpg", ... }`

```gherkin
Feature: Null Byte Injection Protection
  As a system
  I want to prevent null byte attacks
  So that file extension bypasses are blocked

  Scenario: Inject null bytes in booking fields
    Given I have booking data with null bytes
      | firstname | test\0.jpg |
    When I create the booking
    Then null bytes should be safely handled
```

## TC-SEC-015: Support Unicode Characters
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "🔥👍😀", "lastname": "中文测试", ... }`

```gherkin
Feature: Unicode Support
  As an international user
  I want to use my native language characters
  So that my name is stored correctly

  Scenario: Create booking with Unicode and emoji
    Given I have booking data with international characters
      | firstname | 🔥👍😀    |
      | lastname  | 中文测试  |
    When I create the booking
    Then Unicode should be preserved correctly
```

---

**Total Scenarios: 15**
**Test File:** `tests/security.spec.ts`

**Security Findings:**
- ⚠️ TC-SEC-008: No rate limiting (DoS risk)
- ⚠️ TC-SEC-009: Missing security headers
- ⚠️ TC-SEC-011: Accepts large payloads
- ⚠️ TC-SEC-012: Accepts negative prices
- ⚠️ TC-SEC-001: May reuse tokens
- ℹ️ TC-SEC-010: CORS allows all origins
