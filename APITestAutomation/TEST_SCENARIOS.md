# Test Scenarios in Gherkin Format

## Booking Management Tests

### TC-001: API Health Check
```gherkin
Feature: API Health Monitoring
  As a system administrator
  I want to verify the API is operational
  So that I can ensure service availability

  Scenario: Check API health status
    Given the booking API is running
    When I send a health check request to /ping
    Then I should receive a 201 status code
    And the API should be responsive
```

### TC-002: Create a New Booking
```gherkin
Feature: Booking Creation
  As a customer
  I want to create a new booking
  So that I can reserve a room

  Scenario: Successfully create a booking with valid data
    Given I have valid booking information
      | firstname | John          |
      | lastname  | Doe           |
      | price     | 150           |
      | deposit   | true          |
      | checkin   | 2024-01-01    |
      | checkout  | 2024-01-05    |
    When I submit the booking request
    Then the booking should be created successfully
    And I should receive a booking ID
    And the booking details should match my input
```

### TC-003: Retrieve Booking by ID
```gherkin
Feature: Booking Retrieval
  As a customer
  I want to view my booking details
  So that I can confirm my reservation

  Scenario: Retrieve an existing booking
    Given I have created a booking
    When I request booking details using the booking ID
    Then I should see my booking information
    And all details should be accurate
```

### TC-004: List All Bookings
```gherkin
Feature: Booking List
  As a hotel staff member
  I want to view all bookings
  So that I can manage reservations

  Scenario: Get list of all booking IDs
    Given there are bookings in the system
    When I request the list of all bookings
    Then I should receive an array of booking IDs
    And the list should not be empty
```

### TC-005: Filter Bookings by Name
```gherkin
Feature: Booking Search
  As a hotel staff member
  I want to search bookings by guest name
  So that I can quickly find specific reservations

  Scenario: Search bookings by first and last name
    Given there is a booking for "TestFirstName TestLastName"
    When I search for bookings with firstname "TestFirstName" and lastname "TestLastName"
    Then I should receive matching booking results
```

### TC-006: Update Booking Information
```gherkin
Feature: Booking Update
  As a customer
  I want to modify my booking
  So that I can change my reservation details

  Scenario: Update booking with authentication
    Given I am authenticated with a valid token
    And I have an existing booking
    When I update the booking with new information
      | firstname | UpdatedFirst |
      | lastname  | UpdatedLast  |
    Then the booking should be updated successfully
    And the new information should be saved
```

### TC-007: Partial Update of Booking
```gherkin
Feature: Partial Booking Update
  As a customer
  I want to update only specific fields
  So that I don't have to resend all information

  Scenario: Update only name fields using PATCH
    Given I am authenticated with a valid token
    And I have an existing booking
    When I send a PATCH request with only name changes
      | firstname | PatchedName     |
      | lastname  | PatchedLastName |
    Then only the specified fields should be updated
    And other fields should remain unchanged
```

### TC-008: Delete a Booking
```gherkin
Feature: Booking Cancellation
  As a customer
  I want to cancel my booking
  So that I can free up the reservation

  Scenario: Successfully delete a booking
    Given I am authenticated with a valid token
    And I have an existing booking
    When I request to delete the booking
    Then the booking should be removed from the system
    And subsequent retrieval attempts should fail with 404
```

### TC-009: Handle Non-Existent Booking
```gherkin
Feature: Error Handling for Invalid Booking IDs
  As a system
  I want to handle invalid booking requests gracefully
  So that users receive appropriate error messages

  Scenario: Attempt to retrieve a non-existent booking
    Given there is no booking with ID 999999999
    When I try to retrieve this booking
    Then I should receive a 404 Not Found error
```

### TC-010: Prevent Unauthorized Updates
```gherkin
Feature: Authentication Enforcement
  As a system
  I want to prevent unauthorized modifications
  So that bookings are protected

  Scenario: Reject update without authentication token
    Given I have an existing booking
    And I am not authenticated
    When I attempt to update the booking
    Then the request should be rejected with 403 Forbidden
```

---

## Authentication & Authorization Tests

### TC-AUTH-001: Create Authentication Token
```gherkin
Feature: User Authentication
  As a user
  I want to authenticate with my credentials
  So that I can access protected features

  Scenario: Generate auth token with valid credentials
    Given I have valid credentials
      | username | admin        |
      | password | password123  |
    When I submit authentication request
    Then I should receive a valid auth token
```

### TC-AUTH-002: Reject Invalid Credentials
```gherkin
Feature: Authentication Security
  As a system
  I want to reject invalid login attempts
  So that unauthorized access is prevented

  Scenario: Login with wrong credentials
    Given I have invalid credentials
      | username | wronguser    |
      | password | wrongpass    |
    When I attempt to authenticate
    Then the system should reject my credentials
```

### TC-AUTH-003: Use Token for Updates
```gherkin
Feature: Token-Based Authorization
  As an authenticated user
  I want to use my token to update bookings
  So that my changes are authorized

  Scenario: Update booking using valid token
    Given I have a valid authentication token
    And there is an existing booking
    When I update the booking with the token
    Then the update should be successful
```

### TC-AUTH-004: Use Token for Deletion
```gherkin
Feature: Token-Based Deletion
  As an authenticated user
  I want to use my token to delete bookings
  So that I can cancel reservations

  Scenario: Delete booking using valid token
    Given I have a valid authentication token
    And there is an existing booking
    When I delete the booking with the token
    Then the deletion should be successful
```

### TC-AUTH-005: Block Updates Without Token
```gherkin
Feature: Update Authorization
  As a system
  I want to require authentication for updates
  So that only authorized users can modify data

  Scenario: Attempt update without token
    Given there is an existing booking
    And I have no authentication token
    When I try to update the booking
    Then the request should be rejected
```

### TC-AUTH-006: Block Deletion Without Token
```gherkin
Feature: Delete Authorization
  As a system
  I want to require authentication for deletion
  So that only authorized users can cancel bookings

  Scenario: Attempt deletion without token
    Given there is an existing booking
    And I have no authentication token
    When I try to delete the booking
    Then the request should be rejected
```

### TC-AUTH-007: Support Basic Authentication
```gherkin
Feature: Alternative Authentication Methods
  As a user
  I want to use Basic Auth as an alternative
  So that I have flexible authentication options

  Scenario: Update using Basic Authentication
    Given I have valid username and password
    When I send an update request with Basic Auth header
    Then the update should be authorized and successful
```

---

## Performance & Error Handling Tests

### TC-PERF-001: Response Time Check
```gherkin
Feature: API Performance
  As a user
  I want the API to respond quickly
  So that I have a good user experience

  Scenario: API responds within acceptable time
    When I send a GET request to list bookings
    Then the response should arrive within 5 seconds
```

### TC-PERF-002: Handle Concurrent Requests
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

### TC-ERR-001: Validate Required Fields
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

### TC-ERR-002: Validate Data Types
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

### TC-ERR-003: Handle Invalid ID Format
```gherkin
Feature: ID Format Validation
  As a system
  I want to handle invalid ID formats gracefully
  So that users get helpful error messages

  Scenario: Request booking with invalid ID format
    When I try to get a booking with ID "invalid-id-format"
    Then the system should return 404 Not Found
```

### TC-ERR-004: Prevent XSS Attacks (KNOWN BUG)
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
    # CURRENTLY FAILS - XSS VULNERABILITY DETECTED
```

### TC-ERR-005: Prevent SQL Injection
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

### TC-ERR-006: Handle Large Payloads
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

### TC-ERR-007: Validate Date Formats
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

### TC-ERR-008: Validate Negative Prices
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

### TC-ERR-009: Handle Special Characters
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

### TC-ERR-010: Validate Business Logic
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

## Security Tests

### TC-SEC-001: Unique Token Generation (POTENTIAL BUG)
```gherkin
Feature: Session Security
  As a system
  I want to generate unique tokens per session
  So that session fixation attacks are prevented

  Scenario: Generate multiple auth tokens
    Given I authenticate twice with same credentials
    When I compare the two tokens
    Then they should be different tokens
    # MAY FAIL - Token reuse is a security risk
```

### TC-SEC-002: Prevent Unauthorized Access
```gherkin
Feature: Access Control
  As a system
  I want to prevent users from accessing others' bookings
  So that privacy is protected

  Scenario: Attempt to access sequential booking IDs
    Given I create a booking with ID 100
    When I try to access bookings 99, 101, and 102
    Then the system should only allow access to authorized bookings
    # NOTE: This API has no user-level access control
```

### TC-SEC-003: Prevent Command Injection
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

### TC-SEC-004: Prevent Path Traversal
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

### TC-SEC-005: Prevent LDAP Injection
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

### TC-SEC-006: Prevent Mass Assignment
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

### TC-SEC-007: Protect Sensitive Data in Errors
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

### TC-SEC-008: Rate Limiting (POTENTIAL BUG)
```gherkin
Feature: Rate Limiting
  As a system
  I want to limit request rates per user
  So that denial-of-service attacks are prevented

  Scenario: Send rapid burst of requests
    When I send 50 requests in quick succession
    Then some requests should be rate limited with 429 status
    # MAY FAIL - No rate limiting is a DoS vulnerability
```

### TC-SEC-009: Security Headers (FINDING)
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
    # Logs warnings for missing headers
```

### TC-SEC-010: CORS Policy Check
```gherkin
Feature: CORS Configuration
  As a system
  I want to restrict cross-origin access
  So that unauthorized sites cannot access the API

  Scenario: Check CORS policy
    When I send a request from a different origin
    Then the CORS policy should be appropriately restrictive
    # Logs info if CORS is wide open (*)
```

### TC-SEC-011: Reject Oversized Requests (POTENTIAL BUG)
```gherkin
Feature: Request Size Limits
  As a system
  I want to reject oversized payloads
  So that memory exhaustion attacks are prevented

  Scenario: Send extremely large booking data
    Given I have booking with 1MB of text
    When I try to create the booking
    Then the system should reject or truncate the data
    # Logs warning if large payloads are accepted
```

### TC-SEC-012: Prevent Negative Price Exploit
```gherkin
Feature: Business Logic Security
  As a system
  I want to prevent negative prices
  So that financial logic cannot be exploited

  Scenario: Attempt to create booking with negative price
    Given I have a booking with price -999999
    When I try to create the booking
    Then the system should reject negative amounts
```

### TC-SEC-013: Handle Integer Overflow
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

### TC-SEC-014: Prevent Null Byte Injection
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

### TC-SEC-015: Support Unicode Characters
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

## Summary

**Total Test Scenarios: 42**

- **Booking CRUD**: 10 scenarios
- **Authentication**: 7 scenarios  
- **Performance & Errors**: 10 scenarios
- **Security**: 15 scenarios

**Known Bugs/Vulnerabilities Found:**
1. ❌ **TC-ERR-004**: XSS vulnerability (Critical)
2. ⚠️ **TC-SEC-001**: Potential token reuse issue
3. ⚠️ **TC-SEC-008**: No rate limiting detected
4. ⚠️ **TC-SEC-009**: Missing security headers
5. ⚠️ **TC-SEC-011**: Accepts very large payloads
