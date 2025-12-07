# Performance & Error Handling Test Scenarios

## TC-PERF-001: Response Time Check
**Endpoint:** `GET /booking`

```gherkin
Feature: API Performance
  As a user
  I want the API to respond quickly
  So that I have a good user experience

  Scenario: API responds within acceptable time
    When I send a GET request to list bookings
    Then the response should arrive within 5 seconds
```

## TC-PERF-002: Handle Concurrent Requests
**Endpoint:** `GET /booking` (5 simultaneous requests)

```gherkin
Feature: Load Handling
  As a system
  I want to handle multiple simultaneous requests
  So that multiple users can access the API

  Scenario: Process concurrent booking requests
    When I send 5 simultaneous requests to the API
    Then all requests should complete successfully
    And all should return 200 status code
```

## TC-ERR-001: Validate Required Fields
**Endpoint:** `POST /booking`  
**Request Body:** Missing required field (firstname)

```gherkin
Feature: Input Validation
  As a system
  I want to validate booking data
  So that incomplete bookings are rejected

  Scenario: Submit booking with missing required fields
    Given I have a booking with missing firstname
    When I try to create the booking
    Then the system should indicate the validation error
```

## TC-ERR-002: Validate Data Types
**Endpoint:** `POST /booking`  
**Request Body:** Invalid data type (totalprice: "not-a-number")

```gherkin
Feature: Type Validation
  As a system
  I want to enforce correct data types
  So that data integrity is maintained

  Scenario: Submit booking with invalid price type
    Given I have a booking with text instead of number for price
    When I try to create the booking
    Then the system should reject invalid data types
```

## TC-ERR-003: Handle Invalid ID Format
**Endpoint:** `GET /booking/invalid-id-format`

```gherkin
Feature: ID Format Validation
  As a system
  I want to handle invalid ID formats gracefully
  So that users get helpful error messages

  Scenario: Request booking with invalid ID format
    When I try to get a booking with ID "invalid-id-format"
    Then the system should return 404 Not Found
```

## TC-ERR-004: Prevent XSS Attacks ❌ CRITICAL BUG FOUND
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "<script>alert('XSS')</script>", ... }`

```gherkin
Feature: Cross-Site Scripting Protection
  As a system
  I want to sanitize user input
  So that malicious scripts cannot be injected

  Scenario: Attempt to inject JavaScript code
    Given I have booking data with malicious script
      | firstname | <script>alert("XSS")</script> |
    When I create the booking
    Then the script tags should be removed or escaped
    
  ❌ TEST FAILS - CRITICAL SECURITY VULNERABILITY DETECTED
  
  Current Behavior:
    - API accepts malicious JavaScript without sanitization
    - Script tags stored unchanged: <script>alert("XSS")</script>
    - Allows stored XSS attacks
    
  Security Impact:
    - Attackers can execute JavaScript in users' browsers
    - Session hijacking possible
    - Credential theft possible
    - Website defacement possible
    
  Documented in: BUG_REPORTS.md - Bug #001
  Severity: CRITICAL (P1)
```

## TC-ERR-005: Prevent SQL Injection
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "' OR '1'='1", ... }`

```gherkin
Feature: SQL Injection Protection
  As a system
  I want to protect against SQL injection
  So that the database cannot be compromised

  Scenario: Attempt SQL injection in booking fields
    Given I have booking data with SQL injection attempt
      | firstname | ' OR '1'='1 |
    When I create the booking
    Then the SQL code should not be executed
    And the data should be safely stored
```

## TC-ERR-006: Handle Large Payloads
**Endpoint:** `POST /booking`  
**Request Body:** 500KB of text in additionalneeds field

```gherkin
Feature: Payload Size Limits
  As a system
  I want to limit request sizes
  So that the API is protected from abuse

  Scenario: Submit very large booking data
    Given I have a booking with 500KB of text
    When I try to create the booking
    Then the system should handle it appropriately
```

## TC-ERR-007: Validate Date Formats
**Endpoint:** `POST /booking`  
**Request Body:** Invalid date formats (checkin: "not-a-date", checkout: "99/99/9999")

```gherkin
Feature: Date Validation
  As a system
  I want to validate date formats
  So that only valid dates are accepted

  Scenario: Submit booking with invalid date format
    Given I have booking dates in wrong format
      | checkin  | not-a-date |
      | checkout | 99/99/9999 |
    When I try to create the booking
    Then the system should reject invalid dates
```

## TC-ERR-008: Validate Negative Prices
**Endpoint:** `POST /booking`  
**Request Body:** `{ "totalprice": -100, ... }`

```gherkin
Feature: Price Validation
  As a system
  I want to prevent negative prices
  So that business logic is enforced

  Scenario: Submit booking with negative price
    Given I have a booking with price -100
    When I try to create the booking
    Then the system should reject negative values
```

## TC-ERR-009: Handle Special Characters
**Endpoint:** `POST /booking`  
**Request Body:** `{ "firstname": "José", "lastname": "O'Brien-Smith", ... }`

```gherkin
Feature: Special Character Handling
  As a user
  I want to use special characters in names
  So that international names are supported

  Scenario: Create booking with accents and special chars
    Given I have booking data with special characters
      | firstname | José         |
      | lastname  | O'Brien-Smith |
    When I create the booking
    Then the special characters should be preserved
```

## TC-ERR-010: Validate Business Logic
**Endpoint:** `POST /booking`  
**Request Body:** Illogical dates (checkin: "2024-01-10", checkout: "2024-01-05")

```gherkin
Feature: Date Logic Validation
  As a system
  I want to ensure checkout is after checkin
  So that bookings make logical sense

  Scenario: Submit booking with checkout before checkin
    Given I have booking with illogical dates
      | checkin  | 2024-01-10 |
      | checkout | 2024-01-05 |
    When I try to create the booking
    Then the system should reject the invalid date range
```

---

**Total Scenarios: 10**
**Test File:** `tests/errors.spec.ts`

**Critical Issues Found:**
- ❌ TC-ERR-004: XSS vulnerability (See BUG_REPORTS.md)
