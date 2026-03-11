# Non-Functional Requirements (NFRs)
## Event Management SaaS MVP

Non-functional requirements define system qualities, performance targets, security standards, and operational constraints. These are tracked separately from functional user stories but are addressed throughout development.

---

# NFR SUMMARY

| NFR ID | Category | Priority | Story Points | Sprint(s) |
|--------|----------|----------|--------------|-----------|
| NFR-001 | Security | Must Have | 15 | Ongoing (1-8) |
| NFR-002 | Performance | Must Have | 10 | Ongoing (1-8) |
| NFR-003 | Scalability | Should Have | 5 | 7-8 |
| NFR-004 | Reliability & Availability | Must Have | 8 | 6-8 |
| NFR-005 | Usability & UX | Must Have | 12 | Ongoing (2-7) |
| NFR-006 | Maintainability | Should Have | 10 | Ongoing (1-8) |
| NFR-007 | Observability & Logging | Should Have | 5 | 7-8 |
| NFR-008 | Data Privacy & Compliance | Could Have | 13 | Post-MVP |
| NFR-009 | Backup & Recovery | Should Have | 5 | 8 |
| NFR-010 | Deployment & DevOps | Must Have | 8 | 8 |

**Total NFR Story Points:** 91 (distributed across sprints)

---

# NFR-001: Security

**Category:** Security  
**Priority:** Must Have  
**Story Points:** 15 (distributed)  
**Sprint(s):** Ongoing (Sprint 1-8)  

## Requirements

### Authentication & Authorization
- [ ] Implement JWT-based stateless authentication
- [ ] JWT tokens expire after 24 hours
- [ ] Passwords hashed using BCrypt (minimum cost factor: 10)
- [ ] Implement role-based access control (RBAC) with roles:
  - SYSTEM_ADMIN (platform administrator)
  - OWNER (organization owner)
  - ORGANIZER (event creator/manager)
  - CHECK_IN_OPERATOR (event staff)
- [ ] Method-level security annotations on all protected endpoints (@PreAuthorize)
- [ ] All API endpoints require valid JWT token (except public endpoints: /api/v1/public/*)
- [ ] Token refresh mechanism (optional for MVP, nice-to-have)

### Data Security
- [ ] PostgreSQL Row-Level Security (RLS) enabled on ALL organization-scoped tables:
  - events
  - ticket_categories
  - tickets
  - reservations
  - orders
  - attendees
- [ ] Organization context automatically set for every authenticated request
- [ ] Users can ONLY access data for their own organizations
- [ ] Stripe API keys encrypted in database using AES-256
- [ ] No sensitive data logged (passwords, credit card numbers, full API keys, JWT tokens)
- [ ] Database credentials stored in environment variables (never in code)

### API Security
- [ ] CORS configured to allow only trusted origins
- [ ] Input validation on all API endpoints using @Valid annotations and Bean Validation
- [ ] SQL injection prevention through parameterized queries ONLY (no string concatenation in SQL)
- [ ] XSS protection via Content Security Policy headers
- [ ] CSRF protection enabled for state-changing operations
- [ ] Rate limiting on authentication endpoints (max 5 login attempts per minute per IP)
- [ ] API response headers include security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block

### Payment Security
- [ ] NEVER store full credit card numbers in database
- [ ] Use Stripe tokenization for all card data
- [ ] Stripe handles all sensitive card information (PCI DSS compliant)
- [ ] All payment transactions logged for audit trail
- [ ] Stripe webhook signatures verified before processing
- [ ] Payment data transmitted over HTTPS ONLY (enforce in production)
- [ ] PCI DSS compliance considerations documented

## Acceptance Criteria
- Security audit completed (self-assessment or peer review)
- Penetration testing performed (basic manual testing)
- No high or critical vulnerabilities in dependency scan (npm audit, OWASP Dependency-Check)
- OWASP Top 10 protections verified:
  - Injection (SQL, XSS)
  - Broken Authentication
  - Sensitive Data Exposure
  - XML External Entities (not applicable)
  - Broken Access Control
  - Security Misconfiguration
  - Cross-Site Scripting (XSS)
  - Insecure Deserialization
  - Using Components with Known Vulnerabilities
  - Insufficient Logging & Monitoring

## Testing
- Manual security testing of authentication flows
- Automated dependency vulnerability scanning
- SQL injection attempts (should be blocked)
- XSS attempts (should be sanitized)
- Cross-organization data access attempts (should be denied by RLS)
- Unauthorized API access attempts (should return 401/403)

---

# NFR-002: Performance

**Category:** Performance  
**Priority:** Must Have  
**Story Points:** 10  
**Sprint(s):** Ongoing (Sprint 1-8)  

## Requirements

### API Response Times
- [ ] 95% of API requests complete within **2 seconds** under normal load
- [ ] 99% of API requests complete within **5 seconds** under normal load
- [ ] Database queries optimized with appropriate indexes
- [ ] N+1 query problems eliminated using JOIN FETCH or batch loading
- [ ] Pagination implemented on all list endpoints (default page size: 20-50)

### Page Load Times
- [ ] Public event pages load within **3 seconds** (initial page load)
- [ ] Admin pages load within **3 seconds** (initial page load)
- [ ] Subsequent page navigations < 1 second (SPA routing)
- [ ] Images optimized and compressed (< 500 KB per image)
- [ ] Lazy loading implemented for images below the fold
- [ ] Minified CSS and JavaScript in production build

### Concurrent Users
- [ ] System handles **50 concurrent ticket purchases** without errors
- [ ] System handles **100 concurrent API requests** without degradation
- [ ] No overselling occurs under concurrent load (verified through load testing)
- [ ] Reservation system handles race conditions correctly using database locks
- [ ] Database connection pool sized appropriately (HikariCP: max 10-20 connections)

### Database Performance
- [ ] Indexes created on ALL foreign keys
- [ ] Indexes created on frequently queried columns:
  - users.email
  - tickets.ticket_code
  - events.organization_id
  - reservations.status
  - orders.payment_status
- [ ] Query execution plans reviewed for slow queries (EXPLAIN ANALYZE)
- [ ] Connection pooling configured with HikariCP
- [ ] No queries with full table scans on large tables

## Acceptance Criteria
- Load testing completed using JMeter or Gatling
- Performance benchmarks documented (response times, throughput)
- No performance degradation under expected load (50 users)
- All database queries execute in < 100ms (simple queries) or < 500ms (complex aggregations)

## Testing
- JMeter load test script: 50 concurrent users purchasing tickets
- Monitor database query performance during load test
- Profile application using Spring Boot Actuator metrics
- Measure frontend page load times using Lighthouse

---

# NFR-003: Scalability

**Category:** Scalability  
**Priority:** Should Have  
**Story Points:** 5  
**Sprint(s):** Sprint 7-8  

## Requirements

### Horizontal Scalability
- [ ] Application is stateless (can run multiple instances without session affinity)
- [ ] JWT tokens enable distributed authentication (no server-side session storage)
- [ ] Database connection pooling supports multiple application instances
- [ ] File uploads stored in shared location or cloud storage (not local disk per instance)
- [ ] No in-memory caching that can't be shared (use Redis for shared cache if needed - optional)

### Database Scalability
- [ ] Database queries optimized for growth (efficient even with 10,000+ events)
- [ ] Pagination implemented on ALL list endpoints (prevents loading entire tables)
- [ ] Soft deletes used instead of hard deletes (for audit and recovery)
- [ ] Archive strategy documented for old/completed events (post-MVP implementation)
- [ ] Database indexes tuned for common query patterns

### Future Growth Support
- [ ] Architecture supports adding new microservices (modular design)
- [ ] API versioning strategy in place (/api/v1/, /api/v2/ for future changes)
- [ ] Database schema is extensible (can add new columns/tables without breaking existing code)

## Acceptance Criteria
- Application successfully runs with 2 instances behind a load balancer
- Load balancer distributes requests evenly between instances
- No session affinity required (any instance can handle any request)
- Database can handle multiple application instances connecting concurrently

## Testing
- Deploy 2 application instances
- Use Nginx or cloud load balancer to distribute traffic
- Verify session-less operation (user can hit different instances across requests)

---

# NFR-004: Reliability & Availability

**Category:** Reliability  
**Priority:** Must Have  
**Story Points:** 8  
**Sprint(s):** Sprint 6-8  

## Requirements

### Error Handling
- [ ] Global exception handler implemented (@ControllerAdvice)
- [ ] All exceptions logged with full stack traces
- [ ] User-friendly error messages returned (no stack traces exposed to users)
- [ ] Proper HTTP status codes used consistently:
  - 200 OK (successful GET)
  - 201 Created (successful POST)
  - 400 Bad Request (validation error)
  - 401 Unauthorized (missing/invalid token)
  - 403 Forbidden (insufficient permissions)
  - 404 Not Found (resource doesn't exist)
  - 500 Internal Server Error (unexpected server error)
- [ ] Transaction rollbacks occur automatically on errors

### Data Integrity
- [ ] Database constraints enforce data rules:
  - NOT NULL constraints on required fields
  - UNIQUE constraints prevent duplicates (email, organization name)
  - CHECK constraints validate data ranges (quantity >= 0, price >= 0)
  - DEFAULT values set for timestamps (created_at, updated_at)
- [ ] Foreign key constraints prevent orphaned records
- [ ] Unique constraints prevent duplicate data
- [ ] Transactions ensure atomicity (all-or-nothing operations)
- [ ] Optimistic locking prevents lost updates on concurrent modifications

### Email Reliability
- [ ] Email failures logged with full error details
- [ ] Failed emails automatically retry (up to 3 attempts with exponential backoff)
- [ ] Email queue prevents blocking user requests (asynchronous sending using @Async)
- [ ] Email sending status tracked (sent, failed, pending)

### System Monitoring
- [ ] Application health check endpoint available (/actuator/health)
- [ ] Key metrics exposed via Spring Boot Actuator:
  - Number of orders created
  - Number of payments processed
  - Number of emails sent
- [ ] Error rates tracked and logged
- [ ] Logs centralized and searchable (log aggregation with ELK or cloud logging - optional)

## Acceptance Criteria
- Zero data loss under normal operations
- Failed transactions roll back correctly (verified through testing)
- All errors logged and traceable to root cause
- System recovers gracefully from transient failures (database connection loss, email service down)
- Health check endpoint returns 200 OK when system is healthy

## Testing
- Simulate database connection failure (verify graceful handling)
- Simulate email service failure (verify retry logic)
- Test transaction rollback on error
- Verify orphaned data cleanup

---

# NFR-005: Usability & User Experience

**Category:** Usability  
**Priority:** Must Have  
**Story Points:** 12  
**Sprint(s):** Ongoing (Sprint 2-7)  

## Requirements

### Responsive Design
- [ ] All pages work on mobile devices (375px width minimum)
- [ ] All pages work on tablets (768px width)
- [ ] All pages work on desktops (1200px+ width)
- [ ] Touch-friendly buttons and inputs (minimum 44x44px tap targets)
- [ ] Mobile-first CSS approach (responsive breakpoints)

### User Feedback
- [ ] Loading indicators displayed during API calls (spinners, progress bars)
- [ ] Success/error toast notifications appear for user actions
- [ ] Form validation with helpful, specific error messages
- [ ] Confirmation dialogs for destructive actions (delete event, cancel order)
- [ ] Disabled buttons during processing (prevent double-submit)
- [ ] Clear feedback when actions succeed or fail

### Accessibility
- [ ] Semantic HTML elements used (<header>, <nav>, <main>, <article>)
- [ ] Alt text provided on all images
- [ ] ARIA labels added where needed (icon buttons, screen reader text)
- [ ] Keyboard navigation supported (tab order, focus states)
- [ ] Color contrast meets WCAG 2.1 Level A standards (4.5:1 for normal text)
- [ ] Forms have associated labels (for screen readers)

### Intuitive Design
- [ ] Clear navigation structure (breadcrumbs, consistent menu)
- [ ] Consistent UI patterns across all pages (buttons, forms, cards)
- [ ] Helpful placeholder text in form inputs
- [ ] Logical information architecture (related actions grouped together)
- [ ] Empty states handled gracefully (e.g., "No events yet" with call-to-action)

## Acceptance Criteria
- Mobile responsiveness tested on real devices (iPhone, Android)
- Accessibility tested with screen reader (NVDA, VoiceOver)
- User testing completed with 5+ users (feedback incorporated)
- No major usability issues identified
- All interactive elements keyboard accessible

## Testing
- Responsive design testing on multiple devices and browsers
- Accessibility audit using Lighthouse or axe DevTools
- User testing sessions with real users
- Usability scoring (System Usability Scale - optional)

---

# NFR-006: Maintainability

**Category:** Maintainability  
**Priority:** Should Have  
**Story Points:** 10  
**Sprint(s):** Ongoing (Sprint 1-8)  

## Requirements

### Code Quality
- [ ] Code follows consistent style guide (Google Java Style Guide, Angular Style Guide)
- [ ] Code is modular and follows SOLID principles
- [ ] Business logic separated from presentation layer (service layer pattern)
- [ ] Service layer handles business rules and validation
- [ ] Repository layer handles data access (Spring Data JPA)
- [ ] DTOs used for API contracts (no direct entity exposure)
- [ ] No magic numbers or hardcoded values (use constants or configuration)

### Documentation
- [ ] README with comprehensive setup instructions
- [ ] Inline code comments for complex logic
- [ ] API documentation complete (Swagger/OpenAPI)
- [ ] Database schema documented (ER diagram with relationships)
- [ ] Architecture diagram created (system components and interactions)
- [ ] Technical decisions documented (ADRs - Architecture Decision Records - optional)

### Testing
- [ ] Unit tests for business logic (>60% code coverage)
- [ ] Integration tests for APIs and database interactions
- [ ] Test data setup/teardown automated (@BeforeEach, @AfterEach)
- [ ] Continuous Integration running tests automatically on every commit
- [ ] Tests are independent (no test dependencies on execution order)

### Version Control
- [ ] Meaningful, descriptive commit messages
- [ ] Feature branch workflow (main branch protected)
- [ ] Code reviews required before merge (pull request approval)
- [ ] No large binary files committed (use .gitignore for uploads, build artifacts)
- [ ] .gitignore properly configured (node_modules, target, .env, uploads)

## Acceptance Criteria
- New developer can set up project in <30 minutes following README
- Code coverage >60% (verified by Jacoco or similar tool)
- All documentation up to date and accurate
- Code review process enforced (no direct commits to main)

## Testing
- Onboard a new team member and time setup process
- Run code coverage reports
- Review documentation for accuracy

---

# NFR-007: Observability & Logging

**Category:** Observability  
**Priority:** Should Have  
**Story Points:** 5  
**Sprint(s):** Sprint 7-8  

## Requirements

### Logging
- [ ] All API requests logged (HTTP method, endpoint, user, timestamp, duration)
- [ ] All errors logged with full stack traces
- [ ] Business events logged (order created, payment processed, ticket checked-in)
- [ ] Log levels configured appropriately:
  - DEBUG: Detailed diagnostic information
  - INFO: General informational messages
  - WARN: Warning messages (potential issues)
  - ERROR: Error events (application errors)
- [ ] Logs include correlation IDs for request tracing (UUID per request)
- [ ] Sensitive data NOT logged (passwords, credit cards, API keys)

### Monitoring
- [ ] Application health check endpoint (/actuator/health)
- [ ] Key business metrics exposed:
  - Total orders created (counter)
  - Total revenue (gauge)
  - Failed payments (counter)
  - API response times (histogram)
- [ ] Database connection pool metrics available
- [ ] JVM metrics exposed (heap usage, thread count)

### Debugging
- [ ] Detailed error responses in development mode (stack traces visible)
- [ ] Generic error responses in production (stack traces hidden from users)
- [ ] Request/response logging configurable via property (logging.level.org.springframework.web=DEBUG)

## Acceptance Criteria
- Logs are structured and easily searchable
- Key business events are tracked and logged
- Errors can be traced to root cause using correlation IDs
- Health check endpoint returns meaningful status

## Testing
- Review log output for completeness
- Verify correlation IDs present in logs
- Test health check endpoint

---

# NFR-008: Data Privacy & Compliance (Post-MVP)

**Category:** Compliance  
**Priority:** Could Have (Deferred to Post-MVP)  
**Story Points:** 13  
**Sprint(s):** Post-MVP  

## Requirements (Future)

### GDPR Compliance
- [ ] User data export functionality (attendees can download their data)
- [ ] User data deletion (right to be forgotten)
- [ ] Data anonymization after event ends (PII removed after X days)
- [ ] Cookie consent management (EU visitors)
- [ ] Privacy policy acceptance tracking
- [ ] Data processing agreement templates

### Data Retention
- [ ] Old events archived after configurable period
- [ ] Personal data retention policy documented and enforced
- [ ] Audit logs retained for compliance (minimum 1 year)

**Note:** Basic privacy considerations are implemented in MVP (terms acceptance, consent checkboxes), but full GDPR compliance is deferred to post-MVP phase.

---

# NFR-009: Backup & Recovery

**Category:** Reliability  
**Priority:** Should Have  
**Story Points:** 5  
**Sprint(s):** Sprint 8  

## Requirements

### Database Backups
- [ ] Daily automated database backups configured
- [ ] Backup retention policy: minimum 7 days
- [ ] Backup restoration tested successfully
- [ ] Point-in-time recovery capability available (if supported by database service)
- [ ] Backups stored in separate location from primary database (different cloud region)

### Application State
- [ ] All configuration externalized to environment variables
- [ ] No hardcoded credentials or secrets in codebase
- [ ] Application can be redeployed without data loss (stateless)
- [ ] Uploaded files backed up (event images, ticket PDFs)

### Disaster Recovery
- [ ] Recovery Time Objective (RTO) documented (target: < 4 hours)
- [ ] Recovery Point Objective (RPO) documented (target: < 24 hours)
- [ ] Disaster recovery plan documented (step-by-step recovery process)
- [ ] Contact information for emergency situations

## Acceptance Criteria
- Backup restoration tested successfully (restore to new database)
- Zero data loss in backup/restore cycle
- RTO and RPO documented and achievable
- Disaster recovery plan exists and is accessible

## Testing
- Perform full database restore from backup
- Verify all data intact after restore
- Document restore time

---

# NFR-010: Deployment & DevOps

**Category:** DevOps  
**Priority:** Must Have  
**Story Points:** 8  
**Sprint(s):** Sprint 8  

## Requirements

### Containerization
- [ ] Application containerized using Docker
- [ ] Dockerfile optimized (multi-stage build to reduce image size)
- [ ] Docker Compose configuration for local development (app + database + email)
- [ ] Environment-specific configurations (dev, staging, production)
- [ ] Container runs as non-root user (security best practice)

### CI/CD Pipeline
- [ ] Automated build triggered on every commit (GitHub Actions, Jenkins, or GitLab CI)
- [ ] Automated tests run on every build
- [ ] Build fails if any tests fail
- [ ] Automated deployment to staging environment (optional)
- [ ] Build artifacts published to container registry

### Cloud Deployment
- [ ] Application deployed to cloud platform:
  - Heroku (easiest for MVP)
  - AWS (EC2, ECS, or Elastic Beanstalk)
  - Google Cloud Platform (Cloud Run or App Engine)
  - Azure (App Service)
- [ ] Environment variables configured securely
- [ ] HTTPS enabled and enforced (SSL certificate)
- [ ] Database hosted separately (managed database service)
- [ ] Static files served efficiently (CDN or object storage - optional)
- [ ] Domain name configured (if available)

### Configuration Management
- [ ] Separate configurations for dev, staging, production
- [ ] Secrets managed securely:
  - Environment variables (not in repository)
  - Secret management service (AWS Secrets Manager, Heroku Config Vars, etc.)
- [ ] Database credentials NEVER in codebase
- [ ] .env.example file provided (template for local setup)

## Acceptance Criteria
- Application runs successfully in Docker container locally
- Deployment process documented with step-by-step instructions
- Application successfully deployed to cloud platform
- Application accessible via public URL (HTTPS)
- Zero downtime deployment possible (blue-green or rolling update - optional)

## Testing
- Build Docker image and run locally
- Deploy to cloud platform following documentation
- Verify all features working in deployed environment
- Test with real payment (Stripe test mode)

---

# NFR TRACKING TEMPLATE

Use this template to track NFR implementation across sprints:

| NFR ID | Category | Sprint | Status | Notes |
|--------|----------|--------|--------|-------|
| NFR-001 | Security | 1-8 | In Progress | RLS implemented in Sprint 1 |
| NFR-002 | Performance | 1-8 | In Progress | Load testing scheduled for Sprint 5 |
| NFR-003 | Scalability | 7-8 | Not Started | Planned for Sprint 7 |
| NFR-004 | Reliability | 6-8 | Not Started | Error handling started Sprint 3 |
| NFR-005 | Usability | 2-7 | In Progress | Responsive design ongoing |
| NFR-006 | Maintainability | 1-8 | In Progress | Code reviews in place |
| NFR-007 | Observability | 7-8 | Not Started | Logging added incrementally |
| NFR-008 | Privacy | Post-MVP | Deferred | Basic privacy in MVP |
| NFR-009 | Backup | 8 | Not Started | Planned for Sprint 8 |
| NFR-010 | DevOps | 8 | Not Started | Docker setup in Sprint 8 |

---

**Non-functional requirements are as important as functional features. Allocate time in each sprint to address NFRs alongside user stories.**

