# Bug Report Template

---

## 🐛 Bug Report #001: XSS Vulnerability - No Input Sanitization

### Summary
The restful-booker API accepts and stores malicious JavaScript payloads without sanitization, creating a Cross-Site Scripting (XSS) vulnerability.

### Environment
- **API Endpoint**: https://restful-booker.herokuapp.com/booking
- **Environment**: Production
- **Date Found**: 2025-12-06
- **Tester**: QA Automation Team

### Severity
- [x] Critical - System crash, data loss, **security vulnerability**
- [ ] High - Major functionality broken
- [ ] Medium - Functionality impaired
- [ ] Low - Minor issue, cosmetic

### Priority
- [x] P1 - Fix immediately
- [ ] P2 - Fix in current sprint
- [ ] P3 - Fix in next release
- [ ] P4 - Fix when time permits

### Test Case Reference
TC-ERR-004: XSS Prevention Test

### Steps to Reproduce
1. Send POST request to `/booking` endpoint
2. Include malicious script tags in `firstname` field: `<script>alert("XSS")</script>`
3. Include malicious image tags in `additionalneeds` field: `<img src=x onerror=alert(1)>`
4. Observe that the API accepts the payload with status 200
5. Retrieve the booking and verify script tags are stored unchanged

### Expected Result
The API should either:
- Reject requests containing HTML/JavaScript tags (return 400 Bad Request)
- Sanitize the input by encoding special characters (`<` → `&lt;`, `>` → `&gt;`)
- Strip potentially malicious tags from the input

### Actual Result
The API accepts and stores the malicious payloads without any sanitization:
- Script tags remain intact: `<script>alert("XSS")</script>`
- Image event handlers remain intact: `<img src=x onerror=alert(1)>`

### Request Details
```json
POST /booking
Headers: {
  "Content-Type": "application/json",
  "Accept": "application/json"
}
Body: {
  "firstname": "<script>alert(\"XSS\")</script>",
  "lastname": "Test",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2024-01-01",
    "checkout": "2024-01-05"
  },
  "additionalneeds": "<img src=x onerror=alert(1)>"
}
```

### Response Details
```json
Status: 200
Body: {
  "bookingid": 123,
  "booking": {
    "firstname": "<script>alert(\"XSS\")</script>",
    "lastname": "Test",
    "totalprice": 100,
    "depositpaid": true,
    "bookingdates": {
      "checkin": "2024-01-01",
      "checkout": "2024-01-05"
    },
    "additionalneeds": "<img src=x onerror=alert(1)>"
  }
}
```

### Impact
**CRITICAL SECURITY RISK**: This vulnerability allows attackers to:
- Execute arbitrary JavaScript in users' browsers (Stored XSS)
- Steal user session tokens and credentials
- Perform actions on behalf of legitimate users
- Deface the application interface
- Redirect users to malicious websites

### Recommendation
1. **Immediate**: Implement server-side input validation to reject HTML/script tags
2. **Short-term**: Add output encoding when displaying user-generated content
3. **Long-term**: Implement Content Security Policy (CSP) headers
4. **Testing**: Add XSS test cases to regression suite

---

## 🐛 Bug Report Template

### Summary
Brief description of the issue

### Environment
- **API Endpoint**: https://api.example.com
- **Environment**: Production/Staging/Development
- **Date Found**: YYYY-MM-DD
- **Tester**: [Your Name]

### Severity
- [ ] Critical - System crash, data loss
- [ ] High - Major functionality broken
- [ ] Medium - Functionality impaired
- [ ] Low - Minor issue, cosmetic

### Priority
- [ ] P1 - Fix immediately
- [ ] P2 - Fix in current sprint
- [ ] P3 - Fix in next release
- [ ] P4 - Fix when time permits

### Test Case Reference
TC-XXX: [Test case that found the bug]

### Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

### Expected Result
What should happen according to requirements/specifications

### Actual Result
What actually happened

### Request Details
```json
POST /api/endpoint
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer token"
}
Body: {
  "field": "value"
}
```

### Response Details
```json
Status: 500
Body: {
  "error": "Internal Server Error"
}
```

### Screenshots/Logs
Attach relevant screenshots, error logs, or stack traces

### Additional Information
- Reproducibility: Always/Sometimes/Rarely
- Impact: Number of users affected
- Workaround: Available workaround if any

### Related Issues
- Related to Bug #XXX
- Duplicate of Bug #XXX

---

## 🐛 Sample Bug Reports

### Bug #001: User Creation Returns 500 Error for Valid Data

**Summary**: API returns Internal Server Error when creating user with email containing plus sign

**Environment**:
- API Endpoint: https://api.example.com
- Environment: Production
- Date Found: 2025-12-06
- Tester: QA Team

**Severity**: High ⚠️  
**Priority**: P1 🔴

**Test Case Reference**: TC-001 (Create user with valid data)

**Steps to Reproduce**:
1. Send POST request to `/api/users`
2. Include email with plus sign: `test+user@example.com`
3. Include all other required valid fields
4. Submit request

**Expected Result**:
- HTTP Status: 201 Created
- Response contains user object with generated ID
- Email field matches input

**Actual Result**:
- HTTP Status: 500 Internal Server Error
- Response: `{"error": "Internal Server Error"}`
- No user created in database

**Request Details**:
```json
POST /api/users
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "name": "Test User",
  "email": "test+user@example.com",
  "age": 25,
  "role": "user"
}
```

**Response Details**:
```json
Status: 500
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "error": "Internal Server Error",
  "timestamp": "2025-12-06T10:30:00Z"
}
```

**Additional Information**:
- Reproducibility: Always (100%)
- Impact: Users with plus-sign emails cannot register
- Workaround: Use email without plus sign
- Notes: Plus signs in emails are valid per RFC 5322

**Root Cause (If Known)**: Email validation regex doesn't account for plus signs

**Suggested Fix**: Update email validation to accept RFC-compliant email addresses

---

### Bug #002: Rate Limiting Not Implemented

**Summary**: API does not implement rate limiting, allowing unlimited requests

**Environment**:
- API Endpoint: https://api.example.com
- Environment: Production
- Date Found: 2025-12-06
- Tester: QA Team

**Severity**: Medium ⚠️  
**Priority**: P2 🟡

**Test Case Reference**: TC-ERR-007 (Rate limiting verification)

**Steps to Reproduce**:
1. Send 100+ rapid requests to `/api/users` endpoint
2. Monitor response status codes
3. Check for rate limiting (429 status)

**Expected Result**:
- After X requests within Y seconds, API should return 429 (Too Many Requests)
- Response should include `Retry-After` header
- Rate limit should be documented

**Actual Result**:
- All 100+ requests return 200 OK
- No rate limiting detected
- Server processes all requests

**Request Details**:
```bash
# Sent 100 requests in 5 seconds
for i in {1..100}; do
  curl -X GET https://api.example.com/api/users
done
```

**Response Details**:
```
All responses: 200 OK
No 429 status codes observed
Average response time: 150ms
```

**Additional Information**:
- Reproducibility: Always
- Impact: Potential for abuse, DDoS attacks
- Security Risk: High
- Workaround: None
- Industry Standard: Most APIs implement rate limiting (e.g., 100 req/hour)

**Suggested Fix**: Implement rate limiting middleware (e.g., 100 requests per hour per IP)

---

### Bug #003: DELETE Returns 200 Instead of 204

**Summary**: DELETE endpoint returns 200 with empty body instead of 204 No Content

**Environment**:
- API Endpoint: https://api.example.com
- Environment: Production
- Date Found: 2025-12-06
- Tester: QA Team

**Severity**: Low 📘  
**Priority**: P3 🟢

**Test Case Reference**: TC-006 (Delete user successfully)

**Steps to Reproduce**:
1. Create a user via POST `/api/users`
2. Delete the user via DELETE `/api/users/{id}`
3. Observe response status and body

**Expected Result**:
- HTTP Status: 204 No Content (per REST best practices)
- Empty response body
- User deleted from database

**Actual Result**:
- HTTP Status: 200 OK
- Response body: `{}`
- User deleted successfully (functional behavior correct)

**Request Details**:
```json
DELETE /api/users/12345
Headers: {
  "Content-Type": "application/json"
}
```

**Response Details**:
```json
Status: 200
Body: {}
```

**Additional Information**:
- Reproducibility: Always
- Impact: Low (functionality works, just non-standard status code)
- REST Standard: DELETE should return 204 No Content when successful
- Workaround: Accept 200 status in tests

**Suggested Fix**: Update DELETE endpoint to return 204 status with no body

---

### Bug #004: Missing CORS Headers

**Summary**: API does not include CORS headers, blocking cross-origin requests

**Environment**:
- API Endpoint: https://api.example.com
- Environment: Production
- Date Found: 2025-12-06
- Tester: QA Team

**Severity**: High ⚠️  
**Priority**: P1 🔴

**Test Case Reference**: Integration testing from browser

**Steps to Reproduce**:
1. Make API request from browser on different domain
2. Check browser console for CORS errors
3. Inspect response headers

**Expected Result**:
- Response includes `Access-Control-Allow-Origin` header
- Response includes `Access-Control-Allow-Methods` header
- Cross-origin requests succeed

**Actual Result**:
- No CORS headers in response
- Browser blocks request with CORS error
- Error: "No 'Access-Control-Allow-Origin' header is present"

**Request Details**:
```javascript
fetch('https://api.example.com/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

**Response Details**:
```
Status: 200
Headers: {
  "Content-Type": "application/json"
  // Missing: Access-Control-Allow-Origin
  // Missing: Access-Control-Allow-Methods
  // Missing: Access-Control-Allow-Headers
}

Console Error:
"Access to fetch at 'https://api.example.com/api/users' from origin 
'http://localhost:3000' has been blocked by CORS policy"
```

**Additional Information**:
- Reproducibility: Always (from browser)
- Impact: Frontend applications cannot consume API
- Blocking Issue: Yes (prevents frontend integration)
- Workaround: Use server-side proxy

**Suggested Fix**: 
- Add CORS middleware
- Configure allowed origins
- Set appropriate CORS headers

---

### Bug #005: Inconsistent Error Response Format

**Summary**: Error responses have inconsistent JSON structure across endpoints

**Environment**:
- API Endpoint: https://api.example.com
- Environment: Production
- Date Found: 2025-12-06
- Tester: QA Team

**Severity**: Medium ⚠️  
**Priority**: P2 🟡

**Test Case Reference**: Multiple test cases (TC-007, TC-008, TC-009)

**Steps to Reproduce**:
1. Trigger various error scenarios (404, 400, 422)
2. Compare error response structures
3. Document inconsistencies

**Expected Result**:
- Consistent error response format across all endpoints
- All errors include: `error`, `message`, `statusCode`, `timestamp`
- Format matches API documentation

**Actual Result**:
- 404 errors: `{"error": "Not Found"}`
- 400 errors: `{"message": "Bad Request", "errors": []}`
- 422 errors: `{"error": "Validation failed", "details": {}}`
- No consistent structure

**Examples**:

**404 Response**:
```json
{
  "error": "Not Found"
}
```

**400 Response**:
```json
{
  "message": "Bad Request",
  "errors": [
    {"field": "email", "issue": "invalid format"}
  ]
}
```

**422 Response**:
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Email is required"
  }
}
```

**Additional Information**:
- Reproducibility: Always
- Impact: Difficult for clients to parse errors uniformly
- Affects: Error handling on frontend

**Suggested Fix**: 
Standardize error format:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {},
  "timestamp": "2025-12-06T10:30:00Z"
}
```

---

## 📋 Bug Tracking Summary

| Bug ID | Title | Severity | Priority | Status |
|--------|-------|----------|----------|--------|
| #001 | Email with plus sign returns 500 | High | P1 | Open |
| #002 | Rate limiting not implemented | Medium | P2 | Open |
| #003 | DELETE returns 200 instead of 204 | Low | P3 | Open |
| #004 | Missing CORS headers | High | P1 | Open |
| #005 | Inconsistent error response format | Medium | P2 | Open |

**Total Bugs Found**: 5  
**Critical/High Severity**: 2  
**Medium Severity**: 2  
**Low Severity**: 1

---

## 📊 Bug Metrics

- **Bug Detection Rate**: 5 bugs found in 27 test cases (18.5%)
- **Most Common Issue**: Error handling and validation
- **Most Critical Area**: Security (CORS, Rate Limiting)

## 🔍 Testing Recommendations

1. **Immediate Actions**:
   - Fix CORS headers (Bug #004)
   - Fix email validation (Bug #001)

2. **Short-term**:
   - Implement rate limiting (Bug #002)
   - Standardize error formats (Bug #005)

3. **Long-term**:
   - Review REST API standards compliance
   - Implement comprehensive API validation
   - Add API versioning strategy

---

**Note**: This bug report document demonstrates professional bug documentation practices. In a real scenario, bugs would be logged in a bug tracking system (JIRA, Azure DevOps, GitHub Issues, etc.).
