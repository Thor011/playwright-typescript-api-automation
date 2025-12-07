# Authentication & Authorization Test Scenarios

## TC-AUTH-001: Create Authentication Token
**Endpoint:** `POST /auth`  
**Request Body:** `{ "username": "admin", "password": "password123" }`

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

## TC-AUTH-002: Reject Invalid Credentials
**Endpoint:** `POST /auth`  
**Request Body:** `{ "username": "wronguser", "password": "wrongpass" }`

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

## TC-AUTH-003: Use Token for Updates
**Endpoint:** `PUT /booking/{id}`  
**Headers:** `Cookie: token={authToken}`

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

## TC-AUTH-004: Use Token for Deletion
**Endpoint:** `DELETE /booking/{id}`  
**Headers:** `Cookie: token={authToken}`

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

## TC-AUTH-005: Block Updates Without Token
**Endpoint:** `PUT /booking/{id}`  
**Headers:** None (testing rejection)

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

## TC-AUTH-006: Block Deletion Without Token
**Endpoint:** `DELETE /booking/{id}`  
**Headers:** None (testing rejection)

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

## TC-AUTH-007: Support Basic Authentication
**Endpoint:** `PUT /booking/{id}`  
**Headers:** `Authorization: Basic base64(admin:password123)`

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

**Total Scenarios: 7**
**Test File:** `tests/auth.spec.ts`
