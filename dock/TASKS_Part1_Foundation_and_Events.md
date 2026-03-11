# TASK BREAKDOWN - PART 1
## Foundation & Events (Epics 1-2)

**Epics Covered:** 
- Epic 1: Multi-Tenant Foundation & Authentication (8 stories)
- Epic 2: Event Management Core (7 stories)

**Total User Stories:** 15  
**Total Tasks:** ~165 tasks  
**Total Estimated Hours:** ~450-500 hours  

---

# EPIC 1: MULTI-TENANT FOUNDATION & AUTHENTICATION

---

## EM-AUTH-001: Register Organization

**User Story:** As a system administrator, I want to register a new organization, so that event companies can start using the platform.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 1  
**Dependencies:** None

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-001-T1 | Create database migration for `organizations` table with columns: id, name, created_at, updated_at | Database Engineer | 1 | None |
| EM-AUTH-001-T2 | Add unique constraint on organization name and test migration | Database Engineer | 0.5 | T1 |
| EM-AUTH-001-T3 | Create database migration for `users` table with columns: id, email, password_hash, created_at, updated_at | Database Engineer | 1 | None |
| EM-AUTH-001-T4 | Add unique constraint on user email and test migration | Database Engineer | 0.5 | T3 |
| EM-AUTH-001-T5 | Create database migration for `user_organization` junction table with user_id, organization_id, role | Database Engineer | 1 | T1, T3 |
| EM-AUTH-001-T6 | Add foreign key constraints and indexes on junction table | Database Engineer | 0.5 | T5 |
| EM-AUTH-001-T7 | Create Organization JPA entity with proper annotations | Backend Developer | 1.5 | T1 |
| EM-AUTH-001-T8 | Create User JPA entity with proper annotations and relationships | Backend Developer | 2 | T3 |
| EM-AUTH-001-T9 | Create UserOrganization JPA entity for many-to-many relationship | Backend Developer | 1.5 | T5 |
| EM-AUTH-001-T10 | Create OrganizationRepository interface extending JpaRepository | Backend Developer | 0.5 | T7 |
| EM-AUTH-001-T11 | Create UserRepository interface with findByEmail method | Backend Developer | 0.5 | T8 |
| EM-AUTH-001-T12 | Configure BCrypt password encoder bean in SecurityConfig | Backend Developer | 1 | None |
| EM-AUTH-001-T13 | Create RegisterRequest DTO with validation annotations (@NotBlank, @Email) | Backend Developer | 1 | None |
| EM-AUTH-001-T14 | Create RegisterResponse DTO with organization and user IDs | Backend Developer | 0.5 | None |
| EM-AUTH-001-T15 | Implement OrganizationService.registerOrganization() method | Backend Developer | 4 | T10, T11, T12 |
| EM-AUTH-001-T16 | Add transactional logic to create organization, user, and association atomically | Backend Developer | 2 | T15 |
| EM-AUTH-001-T17 | Implement password hashing with BCrypt in registration service | Backend Developer | 1 | T15 |
| EM-AUTH-001-T18 | Add validation for unique organization name and email | Backend Developer | 1.5 | T15 |
| EM-AUTH-001-T19 | Create POST /api/v1/auth/register REST endpoint in AuthController | Backend Developer | 2 | T15 |
| EM-AUTH-001-T20 | Add request validation with @Valid annotation | Backend Developer | 0.5 | T19 |
| EM-AUTH-001-T21 | Implement error handling for duplicate name/email | Backend Developer | 1.5 | T19 |
| EM-AUTH-001-T22 | Create organization registration page component in Angular | Frontend Developer | 3 | None |
| EM-AUTH-001-T23 | Design registration form with fields: org name, owner email, password | Frontend Developer | 2 | T22 |
| EM-AUTH-001-T24 | Add form validation (required fields, email format, password strength) | Frontend Developer | 2 | T23 |
| EM-AUTH-001-T25 | Implement registration service to call backend API | Frontend Developer | 1.5 | T19 |
| EM-AUTH-001-T26 | Handle success response and redirect to login page | Frontend Developer | 1 | T25 |
| EM-AUTH-001-T27 | Handle error responses and display validation messages | Frontend Developer | 1.5 | T25 |
| EM-AUTH-001-T28 | Add toast notifications for success/error | Frontend Developer | 1 | T26, T27 |
| EM-AUTH-001-T29 | Write unit tests for OrganizationService (5 test cases) | QA Engineer | 3 | T15 |
| EM-AUTH-001-T30 | Write unit tests for password hashing | QA Engineer | 1 | T17 |
| EM-AUTH-001-T31 | Write integration test for registration API endpoint | QA Engineer | 2 | T19 |
| EM-AUTH-001-T32 | Test duplicate organization name scenario | QA Engineer | 1 | T31 |
| EM-AUTH-001-T33 | Test duplicate email scenario | QA Engineer | 1 | T31 |
| EM-AUTH-001-T34 | Write E2E test for registration flow (Cypress) | QA Engineer | 2 | T22 |
| EM-AUTH-001-T35 | Manual testing of complete registration flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~50 hours

---

## EM-AUTH-002: User Login with JWT

**User Story:** As a user, I want to log in with email and password, so that I can access my organization's events.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 1  
**Dependencies:** EM-AUTH-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-002-T1 | Add Spring Security JWT dependency to build.gradle | Backend Developer | 0.5 | None |
| EM-AUTH-002-T2 | Create JwtTokenProvider utility class | Backend Developer | 3 | T1 |
| EM-AUTH-002-T3 | Implement generateToken() method with user claims (userId, email, orgIds, roles) | Backend Developer | 2 | T2 |
| EM-AUTH-002-T4 | Implement validateToken() method with signature verification | Backend Developer | 2 | T2 |
| EM-AUTH-002-T5 | Implement getClaimsFromToken() method to extract user info | Backend Developer | 1.5 | T2 |
| EM-AUTH-002-T6 | Configure JWT secret key in application.properties | Backend Developer | 0.5 | T2 |
| EM-AUTH-002-T7 | Set token expiration to 24 hours | Backend Developer | 0.5 | T3 |
| EM-AUTH-002-T8 | Create LoginRequest DTO with email and password fields | Backend Developer | 0.5 | None |
| EM-AUTH-002-T9 | Create LoginResponse DTO with token, userId, and organizationIds | Backend Developer | 0.5 | None |
| EM-AUTH-002-T10 | Implement AuthService.login() method | Backend Developer | 3 | EM-AUTH-001-T11 |
| EM-AUTH-002-T11 | Add user authentication logic with email and password verification | Backend Developer | 2 | T10 |
| EM-AUTH-002-T12 | Verify password using BCrypt matches() | Backend Developer | 1 | T11 |
| EM-AUTH-002-T13 | Generate JWT token on successful authentication | Backend Developer | 1 | T11, T3 |
| EM-AUTH-002-T14 | Fetch user's organization IDs and roles for token claims | Backend Developer | 1.5 | T11 |
| EM-AUTH-002-T15 | Create POST /api/v1/auth/login REST endpoint | Backend Developer | 1.5 | T10 |
| EM-AUTH-002-T16 | Return token in response body on successful login | Backend Developer | 1 | T15 |
| EM-AUTH-002-T17 | Return 401 Unauthorized with message for invalid credentials | Backend Developer | 1 | T15 |
| EM-AUTH-002-T18 | Create login page component in Angular | Frontend Developer | 3 | None |
| EM-AUTH-002-T19 | Design login form with email and password fields | Frontend Developer | 2 | T18 |
| EM-AUTH-002-T20 | Add client-side form validation | Frontend Developer | 1.5 | T19 |
| EM-AUTH-002-T21 | Create AuthService in Angular to handle login API call | Frontend Developer | 2 | T15 |
| EM-AUTH-002-T22 | Store JWT token in localStorage on successful login | Frontend Developer | 1 | T21 |
| EM-AUTH-002-T23 | Redirect to dashboard after successful login | Frontend Developer | 1 | T22 |
| EM-AUTH-002-T24 | Display error message for invalid credentials | Frontend Developer | 1.5 | T21 |
| EM-AUTH-002-T25 | Create AuthInterceptor to attach JWT token to API requests | Frontend Developer | 2.5 | T22 |
| EM-AUTH-002-T26 | Add Authorization header with Bearer token | Frontend Developer | 1 | T25 |
| EM-AUTH-002-T27 | Write unit tests for JwtTokenProvider (token generation, validation) | QA Engineer | 3 | T2 |
| EM-AUTH-002-T28 | Write unit tests for AuthService.login() | QA Engineer | 2 | T10 |
| EM-AUTH-002-T29 | Write integration test for login API with valid credentials | QA Engineer | 1.5 | T15 |
| EM-AUTH-002-T30 | Write integration test for login API with invalid credentials | QA Engineer | 1 | T15 |
| EM-AUTH-002-T31 | Test JWT token expiration (24 hours) | QA Engineer | 1.5 | T7 |
| EM-AUTH-002-T32 | Write E2E test for login flow | QA Engineer | 2 | T18 |
| EM-AUTH-002-T33 | Manual testing of complete login flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~52 hours

---

## EM-AUTH-003: Enforce Row-Level Security

**User Story:** As a system, I want to enforce Row-Level Security on all organization-scoped tables, so that data isolation between organizations is automatic.

**Priority:** Must Have  
**Story Points:** 8  
**Sprint:** 1  
**Dependencies:** EM-AUTH-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-003-T1 | Research PostgreSQL Row-Level Security (RLS) documentation | Database Engineer | 2 | None |
| EM-AUTH-003-T2 | Create migration to enable RLS on `events` table | Database Engineer | 1 | None |
| EM-AUTH-003-T3 | Create RLS policy for `events`: org_isolation_policy | Database Engineer | 2 | T2 |
| EM-AUTH-003-T4 | Write policy SQL: USING (organization_id = current_setting('app.current_org')::int) | Database Engineer | 1.5 | T3 |
| EM-AUTH-003-T5 | Test RLS policy on events table with multiple organizations | Database Engineer | 2 | T4 |
| EM-AUTH-003-T6 | Create migration to enable RLS on `ticket_categories` table | Database Engineer | 0.5 | None |
| EM-AUTH-003-T7 | Create RLS policy for `ticket_categories` table | Database Engineer | 1 | T6 |
| EM-AUTH-003-T8 | Create migration to enable RLS on `tickets` table | Database Engineer | 0.5 | None |
| EM-AUTH-003-T9 | Create RLS policy for `tickets` table | Database Engineer | 1 | T8 |
| EM-AUTH-003-T10 | Create migration to enable RLS on `reservations` table | Database Engineer | 0.5 | None |
| EM-AUTH-003-T11 | Create RLS policy for `reservations` table | Database Engineer | 1 | T10 |
| EM-AUTH-003-T12 | Create migration to enable RLS on `orders` table | Database Engineer | 0.5 | None |
| EM-AUTH-003-T13 | Create RLS policy for `orders` table | Database Engineer | 1 | T12 |
| EM-AUTH-003-T14 | Create migration to enable RLS on `attendees` table | Database Engineer | 0.5 | None |
| EM-AUTH-003-T15 | Create RLS policy for `attendees` table | Database Engineer | 1 | T14 |
| EM-AUTH-003-T16 | Document RLS implementation in technical docs | Database Engineer | 2 | All RLS tasks |
| EM-AUTH-003-T17 | Create test script to verify cross-org data isolation | Database Engineer | 3 | T5 |
| EM-AUTH-003-T18 | Test querying with different organization contexts | Database Engineer | 2 | T17 |
| EM-AUTH-003-T19 | Create OrganizationContextHolder utility class | Backend Developer | 2 | None |
| EM-AUTH-003-T20 | Implement setOrganizationId() and getOrganizationId() methods | Backend Developer | 1 | T19 |
| EM-AUTH-003-T21 | Create database session configuration component | Backend Developer | 2.5 | T19 |
| EM-AUTH-003-T22 | Implement logic to execute SET LOCAL app.current_org before queries | Backend Developer | 3 | T21 |
| EM-AUTH-003-T23 | Use JdbcTemplate to set session variable | Backend Developer | 2 | T22 |
| EM-AUTH-003-T24 | Test session variable setting in transaction | Backend Developer | 2 | T23 |
| EM-AUTH-003-T25 | Write integration test with 2 organizations to verify data isolation | QA Engineer | 4 | T22 |
| EM-AUTH-003-T26 | Insert test data for org A and org B | QA Engineer | 1.5 | T25 |
| EM-AUTH-003-T27 | Query as org A and verify only org A data returned | QA Engineer | 1.5 | T26 |
| EM-AUTH-003-T28 | Query as org B and verify only org B data returned | QA Engineer | 1.5 | T26 |
| EM-AUTH-003-T29 | Attempt direct SQL query without RLS and verify it's blocked | QA Engineer | 2 | T25 |
| EM-AUTH-003-T30 | Write automated integration tests for RLS | QA Engineer | 4 | T25 |
| EM-AUTH-003-T31 | Manual testing of RLS with multiple organizations | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~56 hours

---

## EM-AUTH-004: View Organization Profile

**User Story:** As an organization owner, I want to view my organization profile, so that I can verify organization details.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 2  
**Dependencies:** EM-AUTH-001, EM-AUTH-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-004-T1 | Create OrganizationDTO with id, name, createdAt fields | Backend Developer | 0.5 | None |
| EM-AUTH-004-T2 | Create UserDTO for user list in organization | Backend Developer | 0.5 | None |
| EM-AUTH-004-T3 | Implement OrganizationService.getOrganizationById() method | Backend Developer | 2 | EM-AUTH-001-T10 |
| EM-AUTH-004-T4 | Fetch organization with associated users | Backend Developer | 2 | T3 |
| EM-AUTH-004-T5 | Map entities to DTOs | Backend Developer | 1 | T3 |
| EM-AUTH-004-T6 | Create GET /api/v1/organizations/{orgId} endpoint | Backend Developer | 1.5 | T3 |
| EM-AUTH-004-T7 | Add authorization check: only OWNER or SYSTEM_ADMIN can access | Backend Developer | 2 | T6 |
| EM-AUTH-004-T8 | Verify requesting user belongs to the organization | Backend Developer | 1.5 | T7 |
| EM-AUTH-004-T9 | Return 403 Forbidden if unauthorized | Backend Developer | 1 | T8 |
| EM-AUTH-004-T10 | Create organization settings page component in Angular | Frontend Developer | 3 | None |
| EM-AUTH-004-T11 | Create OrganizationService to call backend API | Frontend Developer | 1.5 | T6 |
| EM-AUTH-004-T12 | Display organization name and creation date | Frontend Developer | 2 | T11 |
| EM-AUTH-004-T13 | Display list of users with their roles | Frontend Developer | 2 | T11 |
| EM-AUTH-004-T14 | Add navigation link to organization settings | Frontend Developer | 1 | T10 |
| EM-AUTH-004-T15 | Write unit tests for OrganizationService.getOrganizationById() | QA Engineer | 2 | T3 |
| EM-AUTH-004-T16 | Write integration test for GET /api/v1/organizations/{orgId} | QA Engineer | 1.5 | T6 |
| EM-AUTH-004-T17 | Test authorization (OWNER can access, ORGANIZER cannot) | QA Engineer | 2 | T7 |
| EM-AUTH-004-T18 | Manual testing of organization profile page | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~28 hours

---

## EM-AUTH-005: Add Users to Organization

**User Story:** As an organization owner, I want to add users to my organization, so that my team can manage events.

**Priority:** Should Have  
**Story Points:** 5  
**Sprint:** 2  
**Dependencies:** EM-AUTH-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-005-T1 | Create AddUserRequest DTO with email and role fields | Backend Developer | 0.5 | None |
| EM-AUTH-005-T2 | Add validation annotations to AddUserRequest | Backend Developer | 0.5 | T1 |
| EM-AUTH-005-T3 | Implement OrganizationService.addUserToOrganization() method | Backend Developer | 4 | EM-AUTH-001-T11 |
| EM-AUTH-005-T4 | Check if user exists by email | Backend Developer | 1 | T3 |
| EM-AUTH-005-T5 | If user exists, add organization association | Backend Developer | 2 | T4 |
| EM-AUTH-005-T6 | If user doesn't exist, create new user with temporary password | Backend Developer | 3 | T4 |
| EM-AUTH-005-T7 | Generate temporary password securely | Backend Developer | 1.5 | T6 |
| EM-AUTH-005-T8 | Create user-organization association with specified role | Backend Developer | 1.5 | T5, T6 |
| EM-AUTH-005-T9 | Create POST /api/v1/organizations/{orgId}/users endpoint | Backend Developer | 1.5 | T3 |
| EM-AUTH-005-T10 | Add authorization check: only OWNER can add users | Backend Developer | 1.5 | T9 |
| EM-AUTH-005-T11 | Return created user information in response | Backend Developer | 1 | T9 |
| EM-AUTH-005-T12 | Create email notification service (placeholder for MVP) | Backend Developer | 2 | T6 |
| EM-AUTH-005-T13 | Log user creation event (email would be sent post-MVP) | Backend Developer | 1 | T12 |
| EM-AUTH-005-T14 | Create "Add User" form component in organization settings | Frontend Developer | 3 | EM-AUTH-004-T10 |
| EM-AUTH-005-T15 | Add email input and role dropdown (ORGANIZER, CHECK_IN_OPERATOR) | Frontend Developer | 2 | T14 |
| EM-AUTH-005-T16 | Implement form validation | Frontend Developer | 1.5 | T15 |
| EM-AUTH-005-T17 | Call backend API on form submit | Frontend Developer | 1.5 | T9 |
| EM-AUTH-005-T18 | Refresh user list after successful addition | Frontend Developer | 1.5 | T17 |
| EM-AUTH-005-T19 | Display success/error messages | Frontend Developer | 1 | T17 |
| EM-AUTH-005-T20 | Write unit tests for addUserToOrganization() method | QA Engineer | 3 | T3 |
| EM-AUTH-005-T21 | Test adding existing user scenario | QA Engineer | 1 | T20 |
| EM-AUTH-005-T22 | Test adding new user scenario | QA Engineer | 1 | T20 |
| EM-AUTH-005-T23 | Write integration test for POST endpoint | QA Engineer | 2 | T9 |
| EM-AUTH-005-T24 | Test authorization (only OWNER can add users) | QA Engineer | 1.5 | T10 |
| EM-AUTH-005-T25 | Manual testing of add user flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~44 hours

---

## EM-AUTH-006: Switch Between Organizations

**User Story:** As a user, I want to switch between organizations, so that I can manage events for different companies.

**Priority:** Could Have  
**Story Points:** 5  
**Sprint:** 2  
**Dependencies:** EM-AUTH-002, EM-AUTH-005

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-006-T1 | Create SwitchOrganizationRequest DTO with organizationId | Backend Developer | 0.5 | None |
| EM-AUTH-006-T2 | Implement AuthService.switchOrganization() method | Backend Developer | 3 | EM-AUTH-002-T10 |
| EM-AUTH-006-T3 | Verify user belongs to the target organization | Backend Developer | 2 | T2 |
| EM-AUTH-006-T4 | Generate new JWT token with updated organization context | Backend Developer | 2 | T2, EM-AUTH-002-T3 |
| EM-AUTH-006-T5 | Include new organization ID in token claims | Backend Developer | 1 | T4 |
| EM-AUTH-006-T6 | Create POST /api/v1/auth/switch-organization endpoint | Backend Developer | 1.5 | T2 |
| EM-AUTH-006-T7 | Return new JWT token in response | Backend Developer | 1 | T6 |
| EM-AUTH-006-T8 | Return 403 if user doesn't belong to target organization | Backend Developer | 1 | T6 |
| EM-AUTH-006-T9 | Create organization selector dropdown component in header | Frontend Developer | 3 | None |
| EM-AUTH-006-T10 | Fetch list of user's organizations on app load | Frontend Developer | 2 | EM-AUTH-002-T21 |
| EM-AUTH-006-T11 | Display current organization in dropdown | Frontend Developer | 1.5 | T10 |
| EM-AUTH-006-T12 | Implement organization switch on dropdown selection | Frontend Developer | 2 | T6 |
| EM-AUTH-006-T13 | Replace old JWT token with new token in localStorage | Frontend Developer | 1.5 | T12 |
| EM-AUTH-006-T14 | Reload application or refresh data after switch | Frontend Developer | 2 | T13 |
| EM-AUTH-006-T15 | Update organization context in app state | Frontend Developer | 2 | T14 |
| EM-AUTH-006-T16 | Display success message after switch | Frontend Developer | 1 | T14 |
| EM-AUTH-006-T17 | Write unit tests for switchOrganization() method | QA Engineer | 2 | T2 |
| EM-AUTH-006-T18 | Test verification of user membership | QA Engineer | 1.5 | T3 |
| EM-AUTH-006-T19 | Write integration test for switch endpoint | QA Engineer | 2 | T6 |
| EM-AUTH-006-T20 | Test switching to unauthorized organization (should fail) | QA Engineer | 1.5 | T19 |
| EM-AUTH-006-T21 | Manual testing of organization switching | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~36 hours

---

## EM-AUTH-007: Role-Based Authorization

**User Story:** As a developer, I want to protect API endpoints with role-based authorization, so that users can only access permitted resources.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 2  
**Dependencies:** EM-AUTH-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-007-T1 | Create Role enum with SYSTEM_ADMIN, OWNER, ORGANIZER, CHECK_IN_OPERATOR | Backend Developer | 1 | None |
| EM-AUTH-007-T2 | Update User entity to include roles collection | Backend Developer | 1.5 | EM-AUTH-001-T8 |
| EM-AUTH-007-T3 | Create migration to add roles to user_organization table | Database Engineer | 1 | None |
| EM-AUTH-007-T4 | Configure method-level security in SecurityConfig (@EnableMethodSecurity) | Backend Developer | 2 | None |
| EM-AUTH-007-T5 | Create JwtAuthenticationFilter to extract JWT from requests | Backend Developer | 3 | EM-AUTH-002-T2 |
| EM-AUTH-007-T6 | Validate JWT token in filter | Backend Developer | 2 | T5 |
| EM-AUTH-007-T7 | Extract user ID and roles from JWT claims | Backend Developer | 2 | T6 |
| EM-AUTH-007-T8 | Set Authentication object in SecurityContext | Backend Developer | 2 | T7 |
| EM-AUTH-007-T9 | Add @PreAuthorize annotations to controller methods | Backend Developer | 3 | T4 |
| EM-AUTH-007-T10 | Example: @PreAuthorize("hasRole('OWNER') or hasRole('SYSTEM_ADMIN')") on organization endpoints | Backend Developer | 1 | T9 |
| EM-AUTH-007-T11 | Example: @PreAuthorize("hasRole('ORGANIZER')") on event endpoints | Backend Developer | 1 | T9 |
| EM-AUTH-007-T12 | Create custom authorization logic for organization ownership | Backend Developer | 3 | T9 |
| EM-AUTH-007-T13 | Implement @PreAuthorize with SpEL for resource-level checks | Backend Developer | 3 | T12 |
| EM-AUTH-007-T14 | Configure security to return 401 for unauthenticated requests | Backend Developer | 1.5 | T4 |
| EM-AUTH-007-T15 | Configure security to return 403 for unauthorized requests | Backend Developer | 1.5 | T4 |
| EM-AUTH-007-T16 | Create global exception handler for AccessDeniedException | Backend Developer | 2 | T15 |
| EM-AUTH-007-T17 | Write unit tests for JwtAuthenticationFilter | QA Engineer | 3 | T5 |
| EM-AUTH-007-T18 | Write integration tests for protected endpoints | QA Engineer | 4 | T9 |
| EM-AUTH-007-T19 | Test OWNER accessing organization endpoints (should succeed) | QA Engineer | 1 | T18 |
| EM-AUTH-007-T20 | Test ORGANIZER accessing organization endpoints (should fail with 403) | QA Engineer | 1 | T18 |
| EM-AUTH-007-T21 | Test unauthenticated access (should fail with 401) | QA Engineer | 1 | T18 |
| EM-AUTH-007-T22 | Manual testing of various authorization scenarios | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~47 hours

---

## EM-AUTH-008: Set Organization Context per Request

**User Story:** As a system, I want to automatically set organization context for each request, so that RLS policies are enforced correctly.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 1  
**Dependencies:** EM-AUTH-002, EM-AUTH-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-AUTH-008-T1 | Create OrganizationContextInterceptor class | Backend Developer | 2 | None |
| EM-AUTH-008-T2 | Implement HandlerInterceptor interface | Backend Developer | 1 | T1 |
| EM-AUTH-008-T3 | Extract organization ID from JWT in preHandle() method | Backend Developer | 3 | EM-AUTH-002-T5 |
| EM-AUTH-008-T4 | Get Authentication from SecurityContext | Backend Developer | 1.5 | T3 |
| EM-AUTH-008-T5 | Retrieve JWT claims containing organization ID | Backend Developer | 2 | T4 |
| EM-AUTH-008-T6 | Inject JdbcTemplate or EntityManager for SQL execution | Backend Developer | 1 | None |
| EM-AUTH-008-T7 | Execute SET LOCAL app.current_org = {orgId} SQL statement | Backend Developer | 3 | T6, T5 |
| EM-AUTH-008-T8 | Handle case when organization ID is null | Backend Developer | 1.5 | T7 |
| EM-AUTH-008-T9 | Register interceptor in WebMvcConfigurer | Backend Developer | 1.5 | T2 |
| EM-AUTH-008-T10 | Configure interceptor to run for all protected endpoints | Backend Developer | 1 | T9 |
| EM-AUTH-008-T11 | Exclude public endpoints from interceptor | Backend Developer | 1.5 | T10 |
| EM-AUTH-008-T12 | Add logging to track organization context setting | Backend Developer | 1 | T7 |
| EM-AUTH-008-T13 | Test interceptor with authenticated request | Backend Developer | 2 | T9 |
| EM-AUTH-008-T14 | Verify session variable is set correctly in transaction | Backend Developer | 2 | T13 |
| EM-AUTH-008-T15 | Write unit tests for OrganizationContextInterceptor | QA Engineer | 3 | T1 |
| EM-AUTH-008-T16 | Mock JWT token with organization ID | QA Engineer | 1.5 | T15 |
| EM-AUTH-008-T17 | Verify SQL statement execution | QA Engineer | 1.5 | T15 |
| EM-AUTH-008-T18 | Write integration test with full request flow | QA Engineer | 3 | T9 |
| EM-AUTH-008-T19 | Test that RLS uses the set organization context | QA Engineer | 3 | EM-AUTH-003-T25 |
| EM-AUTH-008-T20 | Test with multiple concurrent requests (different organizations) | QA Engineer | 3 | T19 |
| EM-AUTH-008-T21 | Manual testing of organization context propagation | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~42 hours

---

# EPIC 2: EVENT MANAGEMENT (CORE)

---

## EM-EVENT-001: Create New Event

**User Story:** As an organizer, I want to create a new event, so that I can start selling tickets.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 2  
**Dependencies:** EM-AUTH-001, EM-AUTH-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-001-T1 | Create database migration for `events` table | Database Engineer | 2 | None |
| EM-EVENT-001-T2 | Add columns: id, organization_id, title, description, location, start_date, end_date, timezone, visibility, status, image_path | Database Engineer | 1.5 | T1 |
| EM-EVENT-001-T3 | Add foreign key to organizations table | Database Engineer | 0.5 | T2 |
| EM-EVENT-001-T4 | Add indexes on organization_id and start_date | Database Engineer | 0.5 | T2 |
| EM-EVENT-001-T5 | Add check constraint: start_date < end_date | Database Engineer | 0.5 | T2 |
| EM-EVENT-001-T6 | Add default value for visibility = 'public' and status = 'active' | Database Engineer | 0.5 | T2 |
| EM-EVENT-001-T7 | Create Event JPA entity with all fields | Backend Developer | 2.5 | T1 |
| EM-EVENT-001-T8 | Add relationship to Organization entity (@ManyToOne) | Backend Developer | 1 | T7 |
| EM-EVENT-001-T9 | Add audit fields (createdAt, updatedAt) with @CreatedDate, @LastModifiedDate | Backend Developer | 1 | T7 |
| EM-EVENT-001-T10 | Create EventRepository extending JpaRepository | Backend Developer | 0.5 | T7 |
| EM-EVENT-001-T11 | Add custom query methods (findByOrganizationId, findUpcoming) | Backend Developer | 1.5 | T10 |
| EM-EVENT-001-T12 | Create CreateEventRequest DTO with validation | Backend Developer | 2 | None |
| EM-EVENT-001-T13 | Add @NotBlank, @Future, @Size annotations | Backend Developer | 1 | T12 |
| EM-EVENT-001-T14 | Create EventResponse DTO | Backend Developer | 1 | None |
| EM-EVENT-001-T15 | Implement EventService.createEvent() method | Backend Developer | 4 | T10 |
| EM-EVENT-001-T16 | Validate start_date < end_date in service | Backend Developer | 1 | T15 |
| EM-EVENT-001-T17 | Set organization_id from authenticated user context | Backend Developer | 1.5 | T15, EM-AUTH-008 |
| EM-EVENT-001-T18 | Save event to database | Backend Developer | 1 | T15 |
| EM-EVENT-001-T19 | Map Event entity to EventResponse DTO | Backend Developer | 1 | T18 |
| EM-EVENT-001-T20 | Create POST /api/v1/events endpoint in EventController | Backend Developer | 2 | T15 |
| EM-EVENT-001-T21 | Add @PreAuthorize("hasRole('ORGANIZER') or hasRole('OWNER')") | Backend Developer | 0.5 | T20 |
| EM-EVENT-001-T22 | Return 201 Created with event details | Backend Developer | 1 | T20 |
| EM-EVENT-001-T23 | Create event creation page component in Angular | Frontend Developer | 4 | None |
| EM-EVENT-001-T24 | Design multi-step form or single form with all fields | Frontend Developer | 3 | T23 |
| EM-EVENT-001-T25 | Add form fields: title, description, location, start date, end date, timezone | Frontend Developer | 3 | T24 |
| EM-EVENT-001-T26 | Implement date/time picker for start and end dates | Frontend Developer | 2 | T25 |
| EM-EVENT-001-T27 | Add timezone selector dropdown | Frontend Developer | 1.5 | T25 |
| EM-EVENT-001-T28 | Implement form validation (required fields, date validation) | Frontend Developer | 2.5 | T25 |
| EM-EVENT-001-T29 | Create EventService to call backend API | Frontend Developer | 2 | T20 |
| EM-EVENT-001-T30 | Call POST /api/v1/events on form submit | Frontend Developer | 1.5 | T29 |
| EM-EVENT-001-T31 | Redirect to event details page on success | Frontend Developer | 1.5 | T30 |
| EM-EVENT-001-T32 | Display error messages for validation failures | Frontend Developer | 1.5 | T30 |
| EM-EVENT-001-T33 | Write unit tests for EventService.createEvent() | QA Engineer | 3 | T15 |
| EM-EVENT-001-T34 | Test date validation logic | QA Engineer | 1.5 | T16 |
| EM-EVENT-001-T35 | Write integration test for POST /api/v1/events | QA Engineer | 2 | T20 |
| EM-EVENT-001-T36 | Test authorization (ORGANIZER can create) | QA Engineer | 1 | T21 |
| EM-EVENT-001-T37 | Test RLS (event belongs to correct organization) | QA Engineer | 2 | T17 |
| EM-EVENT-001-T38 | Write E2E test for event creation flow | QA Engineer | 3 | T23 |
| EM-EVENT-001-T39 | Manual testing of complete event creation | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~64 hours

---

## EM-EVENT-002: Upload Event Image

**User Story:** As an organizer, I want to upload an image for my event, so that it appears attractive to potential attendees.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 2  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-002-T1 | Create uploads directory structure: /uploads/events/{eventId}/ | Backend Developer | 0.5 | None |
| EM-EVENT-002-T2 | Configure multipart file upload in application.properties | Backend Developer | 0.5 | None |
| EM-EVENT-002-T3 | Set max file size to 5MB | Backend Developer | 0.5 | T2 |
| EM-EVENT-002-T4 | Implement FileStorageService for file operations | Backend Developer | 3 | None |
| EM-EVENT-002-T5 | Add method: saveEventImage(eventId, MultipartFile) | Backend Developer | 2 | T4 |
| EM-EVENT-002-T6 | Validate file type (image/png, image/jpeg) | Backend Developer | 1.5 | T5 |
| EM-EVENT-002-T7 | Validate file size (< 5MB) | Backend Developer | 1 | T5 |
| EM-EVENT-002-T8 | Generate unique filename using UUID | Backend Developer | 1 | T5 |
| EM-EVENT-002-T9 | Save file to disk at /uploads/events/{eventId}/{filename} | Backend Developer | 2 | T5 |
| EM-EVENT-002-T10 | Return relative file path | Backend Developer | 0.5 | T9 |
| EM-EVENT-002-T11 | Update Event entity with image_path | Backend Developer | 1 | EM-EVENT-001-T7 |
| EM-EVENT-002-T12 | Create POST /api/v1/events/{eventId}/image endpoint | Backend Developer | 2 | T4 |
| EM-EVENT-002-T13 | Accept @RequestParam MultipartFile | Backend Developer | 1 | T12 |
| EM-EVENT-002-T14 | Verify event belongs to user's organization | Backend Developer | 1.5 | T12 |
| EM-EVENT-002-T15 | Call FileStorageService to save image | Backend Developer | 1 | T14 |
| EM-EVENT-002-T16 | Update event.image_path in database | Backend Developer | 1 | T15 |
| EM-EVENT-002-T17 | Return updated event details | Backend Developer | 1 | T16 |
| EM-EVENT-002-T18 | Create GET /api/v1/events/images/{filename} endpoint to serve images | Backend Developer | 2 | None |
| EM-EVENT-002-T19 | Configure static resource handling for /uploads | Backend Developer | 1.5 | T18 |
| EM-EVENT-002-T20 | Add file upload component to event form | Frontend Developer | 3 | EM-EVENT-001-T23 |
| EM-EVENT-002-T21 | Implement drag-and-drop file upload or file input | Frontend Developer | 2 | T20 |
| EM-EVENT-002-T22 | Add image preview before upload | Frontend Developer | 2 | T21 |
| EM-EVENT-002-T23 | Validate file type and size on client side | Frontend Developer | 1.5 | T21 |
| EM-EVENT-002-T24 | Call POST /api/v1/events/{eventId}/image API | Frontend Developer | 2 | T12 |
| EM-EVENT-002-T25 | Display uploaded image in event details | Frontend Developer | 1.5 | T24 |
| EM-EVENT-002-T26 | Handle upload errors (invalid type, size exceeded) | Frontend Developer | 1.5 | T24 |
| EM-EVENT-002-T27 | Write unit tests for FileStorageService | QA Engineer | 2 | T4 |
| EM-EVENT-002-T28 | Test file type validation | QA Engineer | 1 | T6 |
| EM-EVENT-002-T29 | Test file size validation | QA Engineer | 1 | T7 |
| EM-EVENT-002-T30 | Write integration test for image upload endpoint | QA Engineer | 2 | T12 |
| EM-EVENT-002-T31 | Test uploading valid image (should succeed) | QA Engineer | 1 | T30 |
| EM-EVENT-002-T32 | Test uploading invalid file type (should fail) | QA Engineer | 1 | T30 |
| EM-EVENT-002-T33 | Test uploading file > 5MB (should fail) | QA Engineer | 1 | T30 |
| EM-EVENT-002-T34 | Manual testing of image upload flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~47 hours

---

## EM-EVENT-003: View Event List

**User Story:** As an organizer, I want to view a list of all my events, so that I can manage them.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 2  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-003-T1 | Create EventListItemDTO with summary fields (id, title, startDate, location, ticketsSold) | Backend Developer | 1 | None |
| EM-EVENT-003-T2 | Implement EventService.getEventsByOrganization() method | Backend Developer | 3 | EM-EVENT-001-T10 |
| EM-EVENT-003-T3 | Add pagination support using Pageable | Backend Developer | 2 | T2 |
| EM-EVENT-003-T4 | Default page size: 20 events | Backend Developer | 0.5 | T3 |
| EM-EVENT-003-T5 | Sort by start_date ascending (upcoming first) | Backend Developer | 1 | T3 |
| EM-EVENT-003-T6 | Join with tickets table to count tickets sold | Backend Developer | 2.5 | T2 |
| EM-EVENT-003-T7 | Filter by organization_id (automatically via RLS) | Backend Developer | 1 | T2 |
| EM-EVENT-003-T8 | Map results to EventListItemDTO | Backend Developer | 1 | T2 |
| EM-EVENT-003-T9 | Create GET /api/v1/events endpoint | Backend Developer | 1.5 | T2 |
| EM-EVENT-003-T10 | Accept pagination params: ?page=0&size=20 | Backend Developer | 1 | T9 |
| EM-EVENT-003-T11 | Return Page<EventListItemDTO> with total count | Backend Developer | 1 | T9 |
| EM-EVENT-003-T12 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T9 |
| EM-EVENT-003-T13 | Create events list page component in Angular | Frontend Developer | 4 | None |
| EM-EVENT-003-T14 | Create event card component for list display | Frontend Developer | 3 | T13 |
| EM-EVENT-003-T15 | Display event title, date, location, tickets sold | Frontend Developer | 2 | T14 |
| EM-EVENT-003-T16 | Add event image thumbnail | Frontend Developer | 1.5 | T14 |
| EM-EVENT-003-T17 | Implement pagination controls | Frontend Developer | 2.5 | T13 |
| EM-EVENT-003-T18 | Call GET /api/v1/events with pagination params | Frontend Developer | 2 | T9 |
| EM-EVENT-003-T19 | Handle empty state (no events created yet) | Frontend Developer | 1.5 | T13 |
| EM-EVENT-003-T20 | Add "Create Event" button in empty state | Frontend Developer | 1 | T19 |
| EM-EVENT-003-T21 | Add navigation to event details on card click | Frontend Developer | 1 | T14 |
| EM-EVENT-003-T22 | Write unit tests for getEventsByOrganization() | QA Engineer | 2 | T2 |
| EM-EVENT-003-T23 | Test pagination logic | QA Engineer | 1.5 | T3 |
| EM-EVENT-003-T24 | Test sorting by start_date | QA Engineer | 1 | T5 |
| EM-EVENT-003-T25 | Write integration test for GET /api/v1/events | QA Engineer | 2 | T9 |
| EM-EVENT-003-T26 | Test RLS (only organization's events returned) | QA Engineer | 2 | T7 |
| EM-EVENT-003-T27 | Manual testing of events list page | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~45 hours

---

## EM-EVENT-004: Search Events by Title

**User Story:** As an organizer, I want to search for events by title, so that I can quickly find specific events.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 3  
**Dependencies:** EM-EVENT-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-004-T1 | Add search parameter to EventRepository | Backend Developer | 1.5 | EM-EVENT-001-T10 |
| EM-EVENT-004-T2 | Create custom query: WHERE LOWER(title) LIKE LOWER('%' || :search || '%') | Backend Developer | 2 | T1 |
| EM-EVENT-004-T3 | Update EventService to accept optional search parameter | Backend Developer | 1.5 | EM-EVENT-003-T2 |
| EM-EVENT-004-T4 | If search is provided, filter by title | Backend Developer | 1 | T3 |
| EM-EVENT-004-T5 | Update GET /api/v1/events to accept ?search={term} | Backend Developer | 1 | EM-EVENT-003-T9 |
| EM-EVENT-004-T6 | Pass search parameter to service | Backend Developer | 0.5 | T5 |
| EM-EVENT-004-T7 | Add search input field to events list page | Frontend Developer | 2 | EM-EVENT-003-T13 |
| EM-EVENT-004-T8 | Implement debounced search (wait 300ms after typing) | Frontend Developer | 2 | T7 |
| EM-EVENT-004-T9 | Call API with search parameter on input change | Frontend Developer | 1.5 | T8 |
| EM-EVENT-004-T10 | Display filtered results | Frontend Developer | 1 | T9 |
| EM-EVENT-004-T11 | Show "No events found" message for empty results | Frontend Developer | 1 | T10 |
| EM-EVENT-004-T12 | Add clear search button | Frontend Developer | 1 | T7 |
| EM-EVENT-004-T13 | Write unit tests for search query | QA Engineer | 1.5 | T2 |
| EM-EVENT-004-T14 | Test case-insensitive search | QA Engineer | 1 | T13 |
| EM-EVENT-004-T15 | Write integration test for search endpoint | QA Engineer | 1.5 | T5 |
| EM-EVENT-004-T16 | Test with matching and non-matching search terms | QA Engineer | 1 | T15 |
| EM-EVENT-004-T17 | Manual testing of search functionality | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~22 hours

---

## EM-EVENT-005: Edit Event Details

**User Story:** As an organizer, I want to edit event details, so that I can update information as needed.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 3  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-005-T1 | Create UpdateEventRequest DTO | Backend Developer | 1 | None |
| EM-EVENT-005-T2 | Add validation annotations | Backend Developer | 0.5 | T1 |
| EM-EVENT-005-T3 | Implement EventService.updateEvent() method | Backend Developer | 3 | EM-EVENT-001-T10 |
| EM-EVENT-005-T4 | Fetch existing event by ID | Backend Developer | 1 | T3 |
| EM-EVENT-005-T5 | Verify event belongs to user's organization (RLS enforces this) | Backend Developer | 1 | T4 |
| EM-EVENT-005-T6 | Update event fields with new values | Backend Developer | 1.5 | T4 |
| EM-EVENT-005-T7 | Validate start_date < end_date | Backend Developer | 1 | T6 |
| EM-EVENT-005-T8 | Update updated_at timestamp automatically | Backend Developer | 0.5 | T6 |
| EM-EVENT-005-T9 | Save updated event | Backend Developer | 1 | T6 |
| EM-EVENT-005-T10 | Create PUT /api/v1/events/{eventId} endpoint | Backend Developer | 1.5 | T3 |
| EM-EVENT-005-T11 | Add authorization check (user owns event) | Backend Developer | 1.5 | T10 |
| EM-EVENT-005-T12 | Return 404 if event not found | Backend Developer | 0.5 | T10 |
| EM-EVENT-005-T13 | Return updated event in response | Backend Developer | 1 | T10 |
| EM-EVENT-005-T14 | Create edit event page component | Frontend Developer | 3 | EM-EVENT-001-T23 |
| EM-EVENT-005-T15 | Reuse event form component from create page | Frontend Developer | 2 | T14 |
| EM-EVENT-005-T16 | Pre-populate form with existing event data | Frontend Developer | 2 | T15 |
| EM-EVENT-005-T17 | Call PUT /api/v1/events/{eventId} on form submit | Frontend Developer | 1.5 | T10 |
| EM-EVENT-005-T18 | Display success message after update | Frontend Developer | 1 | T17 |
| EM-EVENT-005-T19 | Handle validation errors | Frontend Developer | 1.5 | T17 |
| EM-EVENT-005-T20 | Add "Edit" button on event details page | Frontend Developer | 1 | None |
| EM-EVENT-005-T21 | Write unit tests for updateEvent() method | QA Engineer | 2.5 | T3 |
| EM-EVENT-005-T22 | Test date validation | QA Engineer | 1 | T7 |
| EM-EVENT-005-T23 | Write integration test for PUT endpoint | QA Engineer | 2 | T10 |
| EM-EVENT-005-T24 | Test updating non-existent event (should return 404) | QA Engineer | 1 | T23 |
| EM-EVENT-005-T25 | Test RLS (cannot update another org's event) | QA Engineer | 1.5 | T11 |
| EM-EVENT-005-T26 | Manual testing of edit flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~38 hours

---

## EM-EVENT-006: Set Event Visibility

**User Story:** As an organizer, I want to set event visibility to public or private, so that I can control who can see my event.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 3  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-006-T1 | Verify visibility column exists in events table (added in EM-EVENT-001) | Database Engineer | 0.5 | EM-EVENT-001-T2 |
| EM-EVENT-006-T2 | Add visibility field to CreateEventRequest and UpdateEventRequest DTOs | Backend Developer | 0.5 | None |
| EM-EVENT-006-T3 | Add validation: visibility in ['public', 'private'] | Backend Developer | 0.5 | T2 |
| EM-EVENT-006-T4 | Update createEvent() to set visibility | Backend Developer | 0.5 | EM-EVENT-001-T15 |
| EM-EVENT-006-T5 | Update updateEvent() to allow changing visibility | Backend Developer | 0.5 | EM-EVENT-005-T3 |
| EM-EVENT-006-T6 | Create GET /api/v1/public/events endpoint (no auth required) | Backend Developer | 2 | None |
| EM-EVENT-006-T7 | Filter events WHERE visibility = 'public' | Backend Developer | 1 | T6 |
| EM-EVENT-006-T8 | Return public events with pagination | Backend Developer | 1 | T6 |
| EM-EVENT-006-T9 | Update GET /api/v1/public/events/{eventId} endpoint | Backend Developer | 1.5 | None |
| EM-EVENT-006-T10 | For private events, require authentication | Backend Developer | 2 | T9 |
| EM-EVENT-006-T11 | Return 401 Unauthorized if private event accessed without auth | Backend Developer | 1 | T10 |
| EM-EVENT-006-T12 | Add visibility toggle/dropdown to event form | Frontend Developer | 2 | EM-EVENT-001-T24 |
| EM-EVENT-006-T13 | Default to "Public" | Frontend Developer | 0.5 | T12 |
| EM-EVENT-006-T14 | Display visibility badge on event cards | Frontend Developer | 1.5 | EM-EVENT-003-T14 |
| EM-EVENT-006-T15 | Write unit tests for visibility filtering | QA Engineer | 1.5 | T7 |
| EM-EVENT-006-T16 | Write integration test for public events endpoint | QA Engineer | 2 | T6 |
| EM-EVENT-006-T17 | Test private event access without auth (should fail) | QA Engineer | 1 | T10 |
| EM-EVENT-006-T18 | Test private event access with auth (should succeed) | QA Engineer | 1 | T10 |
| EM-EVENT-006-T19 | Manual testing of visibility settings | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~22 hours

---

## EM-EVENT-007: Cancel Event

**User Story:** As an organizer, I want to cancel an event, so that I can handle event cancellations.

**Priority:** Could Have  
**Story Points:** 3  
**Sprint:** 3  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-EVENT-007-T1 | Verify status column exists in events table (added in EM-EVENT-001) | Database Engineer | 0.5 | EM-EVENT-001-T2 |
| EM-EVENT-007-T2 | Ensure status ENUM includes 'active' and 'cancelled' | Database Engineer | 0.5 | T1 |
| EM-EVENT-007-T3 | Implement EventService.cancelEvent() method | Backend Developer | 3 | EM-EVENT-001-T10 |
| EM-EVENT-007-T4 | Fetch event by ID | Backend Developer | 1 | T3 |
| EM-EVENT-007-T5 | Check if event has ticket sales | Backend Developer | 2 | T4 |
| EM-EVENT-007-T6 | If tickets sold, require confirmation (passed as parameter) | Backend Developer | 1.5 | T5 |
| EM-EVENT-007-T7 | Update event.status = 'cancelled' | Backend Developer | 1 | T6 |
| EM-EVENT-007-T8 | Save updated event | Backend Developer | 0.5 | T7 |
| EM-EVENT-007-T9 | Create PATCH /api/v1/events/{eventId}/cancel endpoint | Backend Developer | 1.5 | T3 |
| EM-EVENT-007-T10 | Accept ?force=true parameter for forced cancellation | Backend Developer | 1 | T9 |
| EM-EVENT-007-T11 | Return warning if tickets exist and force=false | Backend Developer | 1.5 | T9 |
| EM-EVENT-007-T12 | Return success after cancellation | Backend Developer | 0.5 | T9 |
| EM-EVENT-007-T13 | Update public events endpoint to filter out cancelled events | Backend Developer | 1 | EM-EVENT-006-T6 |
| EM-EVENT-007-T14 | Add "Cancel Event" button to event details page | Frontend Developer | 1.5 | None |
| EM-EVENT-007-T15 | Show warning modal if event has sales | Frontend Developer | 2.5 | T14 |
| EM-EVENT-007-T16 | Display number of tickets sold in warning | Frontend Developer | 1 | T15 |
| EM-EVENT-007-T17 | Require user confirmation before cancellation | Frontend Developer | 1.5 | T16 |
| EM-EVENT-007-T18 | Call PATCH /api/v1/events/{eventId}/cancel with force=true | Frontend Developer | 1.5 | T9 |
| EM-EVENT-007-T19 | Display success message after cancellation | Frontend Developer | 1 | T18 |
| EM-EVENT-007-T20 | Mark event as "Cancelled" in event list | Frontend Developer | 1 | EM-EVENT-003-T14 |
| EM-EVENT-007-T21 | Write unit tests for cancelEvent() method | QA Engineer | 2 | T3 |
| EM-EVENT-007-T22 | Test cancellation without sales (should succeed) | QA Engineer | 1 | T21 |
| EM-EVENT-007-T23 | Test cancellation with sales and force=false (should warn) | QA Engineer | 1 | T21 |
| EM-EVENT-007-T24 | Test cancellation with sales and force=true (should succeed) | QA Engineer | 1 | T21 |
| EM-EVENT-007-T25 | Write integration test for cancel endpoint | QA Engineer | 2 | T9 |
| EM-EVENT-007-T26 | Verify cancelled events don't appear in public listing | QA Engineer | 1 | T13 |
| EM-EVENT-007-T27 | Manual testing of cancel flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~37 hours

---

# PART 1 SUMMARY

## Epic 1: Multi-Tenant Foundation & Authentication
**User Stories:** 8  
**Total Tasks:** ~92 tasks  
**Total Hours:** ~403 hours  

## Epic 2: Event Management (Core)
**User Stories:** 7  
**Total Tasks:** ~73 tasks  
**Total Hours:** ~275 hours  

## PART 1 TOTALS
**User Stories:** 15  
**Total Tasks:** ~165 tasks  
**Total Estimated Hours:** ~678 hours  

---

**Notes:**
- All task durations are estimates based on typical development speeds
- Tasks include all roles: Backend Dev, Frontend Dev, Database Engineer, QA Engineer
- Dependencies clearly marked for proper sequencing
- Each story effort calculated from sum of task hours
- RLS = Row-Level Security (PostgreSQL feature)

**Next:** Part 2 will cover Epics 3-4 (Tickets & Reservations)

