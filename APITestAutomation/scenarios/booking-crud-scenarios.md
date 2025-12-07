# Booking CRUD Test Scenarios

## TC-001: API Health Check
**Endpoint:** `GET /ping`

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

## TC-002: Create a New Booking
**Endpoint:** `POST /booking`

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

## TC-003: Retrieve Booking by ID
**Endpoint:** `GET /booking/{id}`

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

## TC-004: List All Bookings
**Endpoint:** `GET /booking`

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

## TC-005: Filter Bookings by Name
**Endpoint:** `GET /booking?firstname={name}&lastname={name}`

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

## TC-006: Update Booking Information
**Endpoint:** `PUT /booking/{id}`  
**Authentication:** Required (Cookie: token={token} or Basic Auth)

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

## TC-007: Partial Update of Booking
**Endpoint:** `PATCH /booking/{id}`  
**Authentication:** Required (Cookie: token={token} or Basic Auth)

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

## TC-008: Delete a Booking
**Endpoint:** `DELETE /booking/{id}`  
**Authentication:** Required (Cookie: token={token} or Basic Auth)

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

## TC-009: Handle Non-Existent Booking
**Endpoint:** `GET /booking/{id}`

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

## TC-010: Prevent Unauthorized Updates
**Endpoint:** `PUT /booking/{id}`  
**Authentication:** None (testing rejection)

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

**Total Scenarios: 10**
**Test File:** `tests/booking-crud.spec.ts`
