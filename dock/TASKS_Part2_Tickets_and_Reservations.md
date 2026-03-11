# TASK BREAKDOWN - PART 2
## Tickets & Reservations (Epics 3-4)

**Epics Covered:** 
- Epic 3: Ticket Category & Inventory Management (6 stories)
- Epic 4: Reservation & Checkout System (9 stories)

**Total User Stories:** 15  
**Total Tasks:** ~170 tasks  
**Total Estimated Hours:** ~550-600 hours  

---

# EPIC 3: TICKET CATEGORY & INVENTORY MANAGEMENT

---

## EM-TICKET-001: Create Ticket Categories

**User Story:** As an organizer, I want to create ticket categories for my event, so that I can offer different ticket types at different prices.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 3  
**Dependencies:** EM-EVENT-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-001-T1 | Create database migration for `ticket_categories` table | Database Engineer | 2 | None |
| EM-TICKET-001-T2 | Add columns: id, event_id, name, description, price, quantity_total, quantity_available | Database Engineer | 1.5 | T1 |
| EM-TICKET-001-T3 | Add columns: sales_start, sales_end, created_at, updated_at | Database Engineer | 1 | T1 |
| EM-TICKET-001-T4 | Add foreign key constraint to events table | Database Engineer | 0.5 | T2 |
| EM-TICKET-001-T5 | Add CHECK constraint: price >= 0 | Database Engineer | 0.5 | T2 |
| EM-TICKET-001-T6 | Add CHECK constraint: quantity_available >= 0 | Database Engineer | 0.5 | T2 |
| EM-TICKET-001-T7 | Add CHECK constraint: quantity_total >= quantity_available | Database Engineer | 0.5 | T2 |
| EM-TICKET-001-T8 | Add index on event_id | Database Engineer | 0.5 | T2 |
| EM-TICKET-001-T9 | Create TicketCategory JPA entity | Backend Developer | 2.5 | T1 |
| EM-TICKET-001-T10 | Add @ManyToOne relationship to Event entity | Backend Developer | 1 | T9 |
| EM-TICKET-001-T11 | Add validation annotations (@NotBlank, @Min, @DecimalMin) | Backend Developer | 1 | T9 |
| EM-TICKET-001-T12 | Create TicketCategoryRepository extending JpaRepository | Backend Developer | 0.5 | T9 |
| EM-TICKET-001-T13 | Add custom query: findByEventId | Backend Developer | 1 | T12 |
| EM-TICKET-001-T14 | Create CreateTicketCategoryRequest DTO | Backend Developer | 1.5 | None |
| EM-TICKET-001-T15 | Add validation: price >= 0, quantity_total > 0 | Backend Developer | 1 | T14 |
| EM-TICKET-001-T16 | Create TicketCategoryResponse DTO | Backend Developer | 1 | None |
| EM-TICKET-001-T17 | Implement TicketCategoryService.createCategory() method | Backend Developer | 4 | T12 |
| EM-TICKET-001-T18 | Verify event exists and belongs to user's organization | Backend Developer | 2 | T17 |
| EM-TICKET-001-T19 | Initialize quantity_available = quantity_total | Backend Developer | 1 | T17 |
| EM-TICKET-001-T20 | Save ticket category to database | Backend Developer | 1 | T17 |
| EM-TICKET-001-T21 | Map entity to response DTO | Backend Developer | 1 | T20 |
| EM-TICKET-001-T22 | Create POST /api/v1/events/{eventId}/categories endpoint | Backend Developer | 2 | T17 |
| EM-TICKET-001-T23 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T22 |
| EM-TICKET-001-T24 | Return 201 Created with category details | Backend Developer | 1 | T22 |
| EM-TICKET-001-T25 | Create ticket category form component | Frontend Developer | 4 | None |
| EM-TICKET-001-T26 | Add form fields: name, description, price, quantity | Frontend Developer | 3 | T25 |
| EM-TICKET-001-T27 | Implement number input for price (allow decimals) | Frontend Developer | 1.5 | T26 |
| EM-TICKET-001-T28 | Implement number input for quantity (integers only) | Frontend Developer | 1 | T26 |
| EM-TICKET-001-T29 | Add form validation (required fields, price >= 0, quantity > 0) | Frontend Developer | 2 | T26 |
| EM-TICKET-001-T30 | Display "Free Ticket" label when price = 0 | Frontend Developer | 1 | T27 |
| EM-TICKET-001-T31 | Create TicketCategoryService to call backend API | Frontend Developer | 2 | T22 |
| EM-TICKET-001-T32 | Call POST /api/v1/events/{eventId}/categories on submit | Frontend Developer | 1.5 | T31 |
| EM-TICKET-001-T33 | Display created category in list | Frontend Developer | 2 | T32 |
| EM-TICKET-001-T34 | Add "Add Category" button to event management page | Frontend Developer | 1.5 | T25 |
| EM-TICKET-001-T35 | Write unit tests for TicketCategoryService.createCategory() | QA Engineer | 3 | T17 |
| EM-TICKET-001-T36 | Test quantity_available initialization | QA Engineer | 1 | T19 |
| EM-TICKET-001-T37 | Test price validation (negative price should fail) | QA Engineer | 1 | T15 |
| EM-TICKET-001-T38 | Write integration test for POST endpoint | QA Engineer | 2 | T22 |
| EM-TICKET-001-T39 | Test authorization (ORGANIZER can create) | QA Engineer | 1 | T23 |
| EM-TICKET-001-T40 | Test creating category for non-existent event | QA Engineer | 1 | T18 |
| EM-TICKET-001-T41 | Manual testing of category creation flow | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~59 hours

---

## EM-TICKET-002: Set Sales Periods for Categories

**User Story:** As an organizer, I want to set sales periods for ticket categories, so that tickets are only available during specific timeframes.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 3  
**Dependencies:** EM-TICKET-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-002-T1 | Verify sales_start and sales_end columns exist (added in EM-TICKET-001-T3) | Database Engineer | 0.5 | EM-TICKET-001-T3 |
| EM-TICKET-002-T2 | Add CHECK constraint: sales_start < sales_end (if both are set) | Database Engineer | 1 | T1 |
| EM-TICKET-002-T3 | Add sales_start and sales_end to CreateTicketCategoryRequest DTO | Backend Developer | 0.5 | EM-TICKET-001-T14 |
| EM-TICKET-002-T4 | Make fields optional (nullable) | Backend Developer | 0.5 | T3 |
| EM-TICKET-002-T5 | Add validation: if both provided, sales_start < sales_end | Backend Developer | 1.5 | T3 |
| EM-TICKET-002-T6 | Update createCategory() to save sales periods | Backend Developer | 1 | EM-TICKET-001-T17 |
| EM-TICKET-002-T7 | Create method: isSalesPeriodActive() in TicketCategory entity | Backend Developer | 2 | EM-TICKET-001-T9 |
| EM-TICKET-002-T8 | Logic: return true if NOW() between sales_start and sales_end (or null) | Backend Developer | 1.5 | T7 |
| EM-TICKET-002-T9 | Update public event API to check sales period before showing category | Backend Developer | 2.5 | T7 |
| EM-TICKET-002-T10 | Filter categories WHERE NOW() BETWEEN sales_start AND sales_end | Backend Developer | 1.5 | T9 |
| EM-TICKET-002-T11 | Add date/time picker for sales_start to category form | Frontend Developer | 2.5 | EM-TICKET-001-T25 |
| EM-TICKET-002-T12 | Add date/time picker for sales_end to category form | Frontend Developer | 2 | T11 |
| EM-TICKET-002-T13 | Make sales period fields optional | Frontend Developer | 0.5 | T11 |
| EM-TICKET-002-T14 | Add client-side validation: sales_start < sales_end | Frontend Developer | 1.5 | T12 |
| EM-TICKET-002-T15 | Display sales period in category list | Frontend Developer | 2 | T12 |
| EM-TICKET-002-T16 | Show "Sales not started" badge if before sales_start | Frontend Developer | 1.5 | T15 |
| EM-TICKET-002-T17 | Show "Sales ended" badge if after sales_end | Frontend Developer | 1.5 | T15 |
| EM-TICKET-002-T18 | Write unit tests for isSalesPeriodActive() method | QA Engineer | 2 | T7 |
| EM-TICKET-002-T19 | Test sales not started scenario | QA Engineer | 1 | T18 |
| EM-TICKET-002-T20 | Test sales ended scenario | QA Engineer | 1 | T18 |
| EM-TICKET-002-T21 | Test active sales period | QA Engineer | 1 | T18 |
| EM-TICKET-002-T22 | Write integration test for sales period filtering | QA Engineer | 2 | T10 |
| EM-TICKET-002-T23 | Manual testing of sales period functionality | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~34 hours

---

## EM-TICKET-003: Track Ticket Availability in Real-Time

**User Story:** As a system, I want to track ticket availability in real-time, so that we never oversell tickets.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 3  
**Dependencies:** EM-TICKET-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-003-T1 | Verify quantity_available column exists with CHECK constraint >= 0 | Database Engineer | 0.5 | EM-TICKET-001-T6 |
| EM-TICKET-003-T2 | Test CHECK constraint by attempting negative update (should fail) | Database Engineer | 1 | T1 |
| EM-TICKET-003-T3 | Create method: decrementAvailability(categoryId, quantity) | Backend Developer | 3 | EM-TICKET-001-T12 |
| EM-TICKET-003-T4 | Implement atomic UPDATE statement: SET quantity_available = quantity_available - :qty | Backend Developer | 2.5 | T3 |
| EM-TICKET-003-T5 | Add WHERE clause: WHERE id = :id AND quantity_available >= :qty | Backend Developer | 1.5 | T4 |
| EM-TICKET-003-T6 | Check rows affected; if 0, throw InsufficientInventoryException | Backend Developer | 2 | T5 |
| EM-TICKET-003-T7 | Create method: incrementAvailability(categoryId, quantity) for releases | Backend Developer | 2 | T3 |
| EM-TICKET-003-T8 | Implement: SET quantity_available = quantity_available + :qty | Backend Developer | 1.5 | T7 |
| EM-TICKET-003-T9 | Create InsufficientInventoryException class | Backend Developer | 1 | None |
| EM-TICKET-003-T10 | Add exception handling in global exception handler | Backend Developer | 1.5 | T9 |
| EM-TICKET-003-T11 | Return 400 Bad Request with message "Not enough tickets available" | Backend Developer | 1 | T10 |
| EM-TICKET-003-T12 | Update GET /api/v1/public/events/{eventId} to include quantity_available | Backend Developer | 1.5 | None |
| EM-TICKET-003-T13 | Display "X tickets remaining" on public event page | Frontend Developer | 2 | T12 |
| EM-TICKET-003-T14 | Update display in real-time after each reservation attempt | Frontend Developer | 1.5 | T13 |
| EM-TICKET-003-T15 | Show "Sold Out" badge when quantity_available = 0 | Frontend Developer | 1.5 | T13 |
| EM-TICKET-003-T16 | Disable ticket selection for sold out categories | Frontend Developer | 1 | T15 |
| EM-TICKET-003-T17 | Write unit tests for decrementAvailability() | QA Engineer | 3 | T3 |
| EM-TICKET-003-T18 | Test successful decrement with sufficient inventory | QA Engineer | 1 | T17 |
| EM-TICKET-003-T19 | Test failed decrement with insufficient inventory | QA Engineer | 1.5 | T17 |
| EM-TICKET-003-T20 | Test incrementAvailability() method | QA Engineer | 2 | T7 |
| EM-TICKET-003-T21 | Write integration test for inventory operations | QA Engineer | 2.5 | T3 |
| EM-TICKET-003-T22 | Test CHECK constraint prevents negative values | QA Engineer | 1.5 | T2 |
| EM-TICKET-003-T23 | Manual testing of real-time availability updates | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~41 hours

---

## EM-TICKET-004: Prevent Overselling with Database Locks

**User Story:** As a system, I want to prevent overselling using database locks, so that concurrent purchases don't exceed available inventory.

**Priority:** Must Have  
**Story Points:** 8  
**Sprint:** 3  
**Dependencies:** EM-TICKET-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-004-T1 | Research PostgreSQL pessimistic locking (SELECT FOR UPDATE) | Backend Developer | 2 | None |
| EM-TICKET-004-T2 | Create method: lockAndFetchCategory(categoryId) in repository | Backend Developer | 2.5 | EM-TICKET-001-T12 |
| EM-TICKET-004-T3 | Implement: SELECT * FROM ticket_categories WHERE id = :id FOR UPDATE | Backend Developer | 2 | T2 |
| EM-TICKET-004-T4 | Add @Lock(LockModeType.PESSIMISTIC_WRITE) annotation | Backend Developer | 1 | T3 |
| EM-TICKET-004-T5 | Update decrementAvailability() to use pessimistic locking | Backend Developer | 3 | EM-TICKET-003-T3, T2 |
| EM-TICKET-004-T6 | Wrap inventory operations in @Transactional | Backend Developer | 1.5 | T5 |
| EM-TICKET-004-T7 | Set transaction isolation level to READ_COMMITTED | Backend Developer | 1 | T6 |
| EM-TICKET-004-T8 | Test locking behavior with concurrent threads | Backend Developer | 3 | T5 |
| EM-TICKET-004-T9 | Create integration test with 2 concurrent reservation attempts | QA Engineer | 4 | T5 |
| EM-TICKET-004-T10 | Setup: Category with 5 available tickets | QA Engineer | 1 | T9 |
| EM-TICKET-004-T11 | Thread 1: Reserve 3 tickets | QA Engineer | 1 | T10 |
| EM-TICKET-004-T12 | Thread 2: Reserve 3 tickets (should wait for Thread 1) | QA Engineer | 1 | T10 |
| EM-TICKET-004-T13 | Verify: One succeeds, one fails with InsufficientInventoryException | QA Engineer | 2 | T12 |
| EM-TICKET-004-T14 | Verify: Final quantity_available = 2 (not negative) | QA Engineer | 1 | T13 |
| EM-TICKET-004-T15 | Create JMeter load test script for concurrent purchases | QA Engineer | 4 | None |
| EM-TICKET-004-T16 | Configure: 50 concurrent users attempting to buy tickets | QA Engineer | 2 | T15 |
| EM-TICKET-004-T17 | Setup: Category with 100 tickets, each user tries to buy 5 | QA Engineer | 1.5 | T16 |
| EM-TICKET-004-T18 | Run load test and capture results | QA Engineer | 2 | T17 |
| EM-TICKET-004-T19 | Verify: Exactly 100 tickets sold (20 successful purchases) | QA Engineer | 2 | T18 |
| EM-TICKET-004-T20 | Verify: No overselling occurred | QA Engineer | 1.5 | T19 |
| EM-TICKET-004-T21 | Verify: Remaining 30 users received "sold out" error | QA Engineer | 1 | T19 |
| EM-TICKET-004-T22 | Document load test results | QA Engineer | 2 | T20 |
| EM-TICKET-004-T23 | Write unit tests for locking behavior (using mocks) | QA Engineer | 3 | T2 |
| EM-TICKET-004-T24 | Test timeout scenario (lock held too long) | QA Engineer | 2 | T23 |

**Total Story Effort:** ~52 hours

---

## EM-TICKET-005: View Ticket Sales by Category

**User Story:** As an organizer, I want to view ticket sales by category, so that I can see which ticket types are selling well.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 3  
**Dependencies:** EM-TICKET-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-005-T1 | Create CategoryStatsDTO with fields: categoryId, name, total, sold, available, revenue | Backend Developer | 1 | None |
| EM-TICKET-005-T2 | Implement TicketCategoryService.getCategoryStats(eventId) | Backend Developer | 3.5 | EM-TICKET-001-T12 |
| EM-TICKET-005-T3 | Calculate: tickets_sold = quantity_total - quantity_available | Backend Developer | 1 | T2 |
| EM-TICKET-005-T4 | Calculate: revenue = tickets_sold * price | Backend Developer | 1 | T2 |
| EM-TICKET-005-T5 | Group results by category | Backend Developer | 1.5 | T2 |
| EM-TICKET-005-T6 | Create GET /api/v1/events/{eventId}/categories/stats endpoint | Backend Developer | 1.5 | T2 |
| EM-TICKET-005-T7 | Return List<CategoryStatsDTO> | Backend Developer | 1 | T6 |
| EM-TICKET-005-T8 | Add authorization check (user owns event) | Backend Developer | 1 | T6 |
| EM-TICKET-005-T9 | Create category statistics component in event dashboard | Frontend Developer | 3 | None |
| EM-TICKET-005-T10 | Display table with columns: Category, Total, Sold, Available, Revenue | Frontend Developer | 3 | T9 |
| EM-TICKET-005-T11 | Add visual indicator (progress bar) for sold/total ratio | Frontend Developer | 2 | T10 |
| EM-TICKET-005-T12 | Calculate and display percentage sold | Frontend Developer | 1 | T10 |
| EM-TICKET-005-T13 | Highlight categories that are sold out | Frontend Developer | 1 | T10 |
| EM-TICKET-005-T14 | Add total revenue summary | Frontend Developer | 1.5 | T10 |
| EM-TICKET-005-T15 | Write unit tests for getCategoryStats() | QA Engineer | 2.5 | T2 |
| EM-TICKET-005-T16 | Test calculations (tickets_sold, revenue) | QA Engineer | 1.5 | T15 |
| EM-TICKET-005-T17 | Write integration test for stats endpoint | QA Engineer | 2 | T6 |
| EM-TICKET-005-T18 | Manual testing of statistics display | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~31 hours

---

## EM-TICKET-006: Edit Ticket Category Details

**User Story:** As an organizer, I want to edit ticket category details, so that I can update pricing or quantity.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 3  
**Dependencies:** EM-TICKET-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-006-T1 | Create UpdateTicketCategoryRequest DTO | Backend Developer | 1 | None |
| EM-TICKET-006-T2 | Add validation annotations | Backend Developer | 0.5 | T1 |
| EM-TICKET-006-T3 | Implement TicketCategoryService.updateCategory() | Backend Developer | 3 | EM-TICKET-001-T12 |
| EM-TICKET-006-T4 | Fetch existing category | Backend Developer | 1 | T3 |
| EM-TICKET-006-T5 | Update name, description, price | Backend Developer | 1 | T4 |
| EM-TICKET-006-T6 | Handle quantity_total increase: increment quantity_available by delta | Backend Developer | 2.5 | T4 |
| EM-TICKET-006-T7 | Validate: cannot reduce quantity_total below tickets already sold | Backend Developer | 2 | T4 |
| EM-TICKET-006-T8 | Calculate: tickets_sold = quantity_total - quantity_available | Backend Developer | 1 | T7 |
| EM-TICKET-006-T9 | If new_quantity_total < tickets_sold, throw ValidationException | Backend Developer | 1.5 | T8 |
| EM-TICKET-006-T10 | Create PUT /api/v1/events/{eventId}/categories/{categoryId} endpoint | Backend Developer | 1.5 | T3 |
| EM-TICKET-006-T11 | Add authorization check (user owns event) | Backend Developer | 1 | T10 |
| EM-TICKET-006-T12 | Return updated category | Backend Developer | 0.5 | T10 |
| EM-TICKET-006-T13 | Create edit category modal/page | Frontend Developer | 3 | EM-TICKET-001-T25 |
| EM-TICKET-006-T14 | Pre-populate form with existing category data | Frontend Developer | 2 | T13 |
| EM-TICKET-006-T15 | Add "Edit" button on category list | Frontend Developer | 1 | None |
| EM-TICKET-006-T16 | Call PUT endpoint on form submit | Frontend Developer | 1.5 | T10 |
| EM-TICKET-006-T17 | Display success message after update | Frontend Developer | 1 | T16 |
| EM-TICKET-006-T18 | Handle validation errors (e.g., reducing quantity below sold) | Frontend Developer | 1.5 | T16 |
| EM-TICKET-006-T19 | Write unit tests for updateCategory() | QA Engineer | 2.5 | T3 |
| EM-TICKET-006-T20 | Test quantity increase scenario | QA Engineer | 1 | T6 |
| EM-TICKET-006-T21 | Test invalid quantity decrease (should fail) | QA Engineer | 1.5 | T9 |
| EM-TICKET-006-T22 | Write integration test for PUT endpoint | QA Engineer | 2 | T10 |
| EM-TICKET-006-T23 | Manual testing of edit category flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~34 hours

---

# EPIC 4: RESERVATION & CHECKOUT SYSTEM

---

## EM-RESERVE-001: Add Tickets to Reservation

**User Story:** As an attendee, I want to add tickets to a reservation, so that I can hold tickets while I complete checkout.

**Priority:** Must Have  
**Story Points:** 8  
**Sprint:** 4  
**Dependencies:** EM-TICKET-001, EM-TICKET-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-001-T1 | Create database migration for `reservations` table | Database Engineer | 2 | None |
| EM-RESERVE-001-T2 | Add columns: id (UUID), event_id, user_id (nullable), expires_at, status, created_at | Database Engineer | 1.5 | T1 |
| EM-RESERVE-001-T3 | Add foreign key to events table | Database Engineer | 0.5 | T2 |
| EM-RESERVE-001-T4 | Add index on status and expires_at (for cleanup queries) | Database Engineer | 0.5 | T2 |
| EM-RESERVE-001-T5 | Create enum for reservation status: PENDING, CONFIRMED, EXPIRED, CANCELLED | Database Engineer | 1 | T2 |
| EM-RESERVE-001-T6 | Create database migration for `reservation_items` table | Database Engineer | 1.5 | None |
| EM-RESERVE-001-T7 | Add columns: id, reservation_id, ticket_category_id, quantity, price_at_reservation | Database Engineer | 1 | T6 |
| EM-RESERVE-001-T8 | Add foreign keys to reservations and ticket_categories | Database Engineer | 0.5 | T7 |
| EM-RESERVE-001-T9 | Create Reservation JPA entity with UUID | Backend Developer | 2.5 | T1 |
| EM-RESERVE-001-T10 | Add @ManyToOne relationship to Event | Backend Developer | 1 | T9 |
| EM-RESERVE-001-T11 | Add status enum field | Backend Developer | 1 | T9 |
| EM-RESERVE-001-T12 | Create ReservationItem JPA entity | Backend Developer | 2 | T6 |
| EM-RESERVE-001-T13 | Add @ManyToOne relationships to Reservation and TicketCategory | Backend Developer | 1.5 | T12 |
| EM-RESERVE-001-T14 | Create ReservationRepository with UUID as ID type | Backend Developer | 1 | T9 |
| EM-RESERVE-001-T15 | Create CreateReservationRequest DTO with List<ReservationItemRequest> | Backend Developer | 2 | None |
| EM-RESERVE-001-T16 | Add validation: at least one item required | Backend Developer | 1 | T15 |
| EM-RESERVE-001-T17 | Create ReservationResponse DTO with expiration time | Backend Developer | 1.5 | None |
| EM-RESERVE-001-T18 | Implement ReservationService.createReservation() method | Backend Developer | 5 | T14 |
| EM-RESERVE-001-T19 | Start database transaction with isolation level READ_COMMITTED | Backend Developer | 1 | T18 |
| EM-RESERVE-001-T20 | For each item, lock ticket category using SELECT FOR UPDATE | Backend Developer | 2.5 | T18, EM-TICKET-004-T2 |
| EM-RESERVE-001-T21 | Validate ticket availability for all items before proceeding | Backend Developer | 2 | T20 |
| EM-RESERVE-001-T22 | If any category has insufficient inventory, rollback and throw exception | Backend Developer | 2 | T21 |
| EM-RESERVE-001-T23 | Atomically decrement inventory for all categories | Backend Developer | 2.5 | T21, EM-TICKET-003-T3 |
| EM-RESERVE-001-T24 | Create Reservation entity with UUID.randomUUID() | Backend Developer | 1.5 | T23 |
| EM-RESERVE-001-T25 | Set expires_at = NOW() + 15 minutes | Backend Developer | 1 | T24 |
| EM-RESERVE-001-T26 | Set status = PENDING | Backend Developer | 0.5 | T24 |
| EM-RESERVE-001-T27 | Create ReservationItem entities for each item | Backend Developer | 2 | T24 |
| EM-RESERVE-001-T28 | Store current price as price_at_reservation (freeze price) | Backend Developer | 1 | T27 |
| EM-RESERVE-001-T29 | Save reservation and items to database | Backend Developer | 1 | T27 |
| EM-RESERVE-001-T30 | Commit transaction | Backend Developer | 0.5 | T29 |
| EM-RESERVE-001-T31 | Calculate total amount for response | Backend Developer | 1 | T29 |
| EM-RESERVE-001-T32 | Create POST /api/v1/events/{eventId}/reservations endpoint | Backend Developer | 2 | T18 |
| EM-RESERVE-001-T33 | Return 201 Created with reservation ID and expiration time | Backend Developer | 1 | T32 |
| EM-RESERVE-001-T34 | Handle InsufficientInventoryException and return 400 | Backend Developer | 1.5 | T32 |
| EM-RESERVE-001-T35 | Create reservation service in Angular | Frontend Developer | 2.5 | None |
| EM-RESERVE-001-T36 | Call POST /api/v1/events/{eventId}/reservations | Frontend Developer | 1.5 | T32 |
| EM-RESERVE-001-T37 | Store reservation ID in localStorage | Frontend Developer | 1 | T36 |
| EM-RESERVE-001-T38 | Redirect to checkout page with reservation ID | Frontend Developer | 1.5 | T37 |
| EM-RESERVE-001-T39 | Display loading spinner during reservation creation | Frontend Developer | 1 | T36 |
| EM-RESERVE-001-T40 | Handle "sold out" error and display appropriate message | Frontend Developer | 2 | T36 |
| EM-RESERVE-001-T41 | Write unit tests for createReservation() | QA Engineer | 4 | T18 |
| EM-RESERVE-001-T42 | Test successful reservation creation | QA Engineer | 1.5 | T41 |
| EM-RESERVE-001-T43 | Test insufficient inventory scenario | QA Engineer | 2 | T41 |
| EM-RESERVE-001-T44 | Test transaction rollback on failure | QA Engineer | 2 | T41 |
| EM-RESERVE-001-T45 | Write integration test for reservation endpoint | QA Engineer | 3 | T32 |
| EM-RESERVE-001-T46 | Test concurrent reservation attempts (2 users, limited inventory) | QA Engineer | 3 | T45 |
| EM-RESERVE-001-T47 | Verify inventory decremented correctly | QA Engineer | 1.5 | T45 |
| EM-RESERVE-001-T48 | Verify expiration time set correctly (15 minutes) | QA Engineer | 1 | T45 |
| EM-RESERVE-001-T49 | Manual testing of reservation creation flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~78 hours

---

## EM-RESERVE-002: Auto-Expire Reservations

**User Story:** As a system, I want to automatically expire reservations after 15 minutes, so that tickets become available again if checkout is not completed.

**Priority:** Must Have  
**Story Points:** 8  
**Sprint:** 4  
**Dependencies:** EM-RESERVE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-002-T1 | Enable Spring scheduling with @EnableScheduling | Backend Developer | 0.5 | None |
| EM-RESERVE-002-T2 | Create ReservationExpirationScheduler class | Backend Developer | 2 | None |
| EM-RESERVE-002-T3 | Add @Scheduled annotation with fixedRate = 60000 (1 minute) | Backend Developer | 1 | T2 |
| EM-RESERVE-002-T4 | Implement expireReservations() method | Backend Developer | 4 | T2 |
| EM-RESERVE-002-T5 | Query: SELECT * FROM reservations WHERE status = 'PENDING' AND expires_at < NOW() | Backend Developer | 2 | T4 |
| EM-RESERVE-002-T6 | For each expired reservation, fetch reservation items | Backend Developer | 1.5 | T5 |
| EM-RESERVE-002-T7 | For each item, increment ticket category quantity_available | Backend Developer | 2.5 | T6, EM-TICKET-003-T7 |
| EM-RESERVE-002-T8 | Update reservation status to EXPIRED | Backend Developer | 1 | T7 |
| EM-RESERVE-002-T9 | Wrap entire operation in @Transactional | Backend Developer | 1 | T4 |
| EM-RESERVE-002-T10 | Add logging: log reservation ID and ticket quantities released | Backend Developer | 1.5 | T8 |
| EM-RESERVE-002-T11 | Add error handling: continue processing if one reservation fails | Backend Developer | 2 | T4 |
| EM-RESERVE-002-T12 | Create batch update method for efficiency (update all at once if possible) | Backend Developer | 3 | T5 |
| EM-RESERVE-002-T13 | Add configuration property: reservation.expiration.check.interval | Backend Developer | 1 | T3 |
| EM-RESERVE-002-T14 | Make expiration time configurable: reservation.expiration.minutes (default 15) | Backend Developer | 1.5 | EM-RESERVE-001-T25 |
| EM-RESERVE-002-T15 | Write unit tests for expireReservations() | QA Engineer | 3.5 | T4 |
| EM-RESERVE-002-T16 | Create test reservation with past expiration time | QA Engineer | 1 | T15 |
| EM-RESERVE-002-T17 | Call expireReservations() | QA Engineer | 0.5 | T16 |
| EM-RESERVE-002-T18 | Verify reservation status changed to EXPIRED | QA Engineer | 1 | T17 |
| EM-RESERVE-002-T19 | Verify inventory was restored | QA Engineer | 1.5 | T17 |
| EM-RESERVE-002-T20 | Write integration test for scheduler | QA Engineer | 3 | T2 |
| EM-RESERVE-002-T21 | Test with multiple expired reservations | QA Engineer | 2 | T20 |
| EM-RESERVE-002-T22 | Test that active reservations are not affected | QA Engineer | 1.5 | T20 |
| EM-RESERVE-002-T23 | Manual testing: create reservation, wait 15+ minutes, verify expiration | QA Engineer | 2 | All tasks |
| EM-RESERVE-002-T24 | Monitor scheduler logs in deployed environment | DevOps Engineer | 1 | T10 |

**Total Story Effort:** ~46 hours

---

## EM-RESERVE-003: Countdown Timer

**User Story:** As an attendee, I want to see a countdown timer during checkout, so that I know how much time I have to complete my purchase.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 4  
**Dependencies:** EM-RESERVE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-003-T1 | Create countdown timer component in Angular | Frontend Developer | 3 | None |
| EM-RESERVE-003-T2 | Accept expiresAt timestamp as input | Frontend Developer | 1 | T1 |
| EM-RESERVE-003-T3 | Calculate remaining time: expiresAt - currentTime | Frontend Developer | 1.5 | T2 |
| EM-RESERVE-003-T4 | Display in format: "MM:SS" (e.g., "14:32") | Frontend Developer | 1.5 | T3 |
| EM-RESERVE-003-T5 | Use setInterval to update every second | Frontend Developer | 1 | T3 |
| EM-RESERVE-003-T6 | When timer reaches 0, display "Reservation Expired" modal | Frontend Developer | 2.5 | T5 |
| EM-RESERVE-003-T7 | Redirect to event page after modal dismissed | Frontend Developer | 1 | T6 |
| EM-RESERVE-003-T8 | Add visual warning when < 5 minutes remaining (change color to orange) | Frontend Developer | 1.5 | T5 |
| EM-RESERVE-003-T9 | Add urgent warning when < 1 minute remaining (change color to red) | Frontend Developer | 1 | T8 |
| EM-RESERVE-003-T10 | Clear interval on component destroy to prevent memory leaks | Frontend Developer | 1 | T5 |
| EM-RESERVE-003-T11 | Add countdown timer to checkout page header | Frontend Developer | 1.5 | T1 |
| EM-RESERVE-003-T12 | Poll backend every 30 seconds to verify reservation still active | Frontend Developer | 2.5 | None |
| EM-RESERVE-003-T13 | Create GET /api/v1/reservations/{id}/status endpoint | Backend Developer | 1.5 | None |
| EM-RESERVE-003-T14 | Return reservation status and expiration time | Backend Developer | 1 | T13 |
| EM-RESERVE-003-T15 | If backend returns EXPIRED, show modal immediately | Frontend Developer | 1.5 | T12 |
| EM-RESERVE-003-T16 | Write unit tests for countdown timer component | QA Engineer | 2 | T1 |
| EM-RESERVE-003-T17 | Test timer countdown logic | QA Engineer | 1.5 | T16 |
| EM-RESERVE-003-T18 | Test expiration modal display | QA Engineer | 1 | T16 |
| EM-RESERVE-003-T19 | Manual testing of countdown timer | QA Engineer | 1.5 | All tasks |
| EM-RESERVE-003-T20 | Test timer synchronization with backend | QA Engineer | 1 | T12 |

**Total Story Effort:** ~31 hours

---

## EM-RESERVE-004: Enter Attendee Information

**User Story:** As an attendee, I want to enter attendee information during checkout, so that organizers know who is attending.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 4  
**Dependencies:** EM-RESERVE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-004-T1 | Create database migration for `attendees` table | Database Engineer | 2 | None |
| EM-RESERVE-004-T2 | Add columns: id, reservation_id, first_name, last_name, email, phone, created_at | Database Engineer | 1.5 | T1 |
| EM-RESERVE-004-T3 | Add foreign key to reservations table | Database Engineer | 0.5 | T2 |
| EM-RESERVE-004-T4 | Add unique constraint on reservation_id (one attendee per reservation for MVP) | Database Engineer | 0.5 | T2 |
| EM-RESERVE-004-T5 | Create Attendee JPA entity | Backend Developer | 2 | T1 |
| EM-RESERVE-004-T6 | Add @ManyToOne relationship to Reservation | Backend Developer | 1 | T5 |
| EM-RESERVE-004-T7 | Add validation annotations (@NotBlank, @Email, @Pattern for phone) | Backend Developer | 1.5 | T5 |
| EM-RESERVE-004-T8 | Create AttendeeRepository | Backend Developer | 0.5 | T5 |
| EM-RESERVE-004-T9 | Create AttendeeInfoRequest DTO | Backend Developer | 1 | None |
| EM-RESERVE-004-T10 | Add validation annotations | Backend Developer | 1 | T9 |
| EM-RESERVE-004-T11 | Implement ReservationService.addAttendeeInfo() method | Backend Developer | 3 | EM-RESERVE-001-T14 |
| EM-RESERVE-004-T12 | Verify reservation exists and is not expired | Backend Developer | 2 | T11 |
| EM-RESERVE-004-T13 | Create Attendee entity and associate with reservation | Backend Developer | 1.5 | T11 |
| EM-RESERVE-004-T14 | Save attendee information | Backend Developer | 1 | T11 |
| EM-RESERVE-004-T15 | Create PUT /api/v1/reservations/{id}/attendee endpoint | Backend Developer | 1.5 | T11 |
| EM-RESERVE-004-T16 | Return 400 if reservation is expired | Backend Developer | 1 | T15 |
| EM-RESERVE-004-T17 | Return updated reservation with attendee info | Backend Developer | 1 | T15 |
| EM-RESERVE-004-T18 | Create attendee information form component | Frontend Developer | 4 | None |
| EM-RESERVE-004-T19 | Add form fields: first name, last name, email, phone (all required) | Frontend Developer | 3 | T18 |
| EM-RESERVE-004-T20 | Implement email format validation | Frontend Developer | 1 | T19 |
| EM-RESERVE-004-T21 | Implement phone number validation (basic format check) | Frontend Developer | 1.5 | T19 |
| EM-RESERVE-004-T22 | Display required field indicators | Frontend Developer | 1 | T19 |
| EM-RESERVE-004-T23 | Call PUT /api/v1/reservations/{id}/attendee on form submit | Frontend Developer | 2 | T15 |
| EM-RESERVE-004-T24 | Handle validation errors and display field-specific messages | Frontend Developer | 2 | T23 |
| EM-RESERVE-004-T25 | Proceed to payment step after successful submission | Frontend Developer | 1.5 | T23 |
| EM-RESERVE-004-T26 | Write unit tests for addAttendeeInfo() | QA Engineer | 2.5 | T11 |
| EM-RESERVE-004-T27 | Test email validation | QA Engineer | 1 | T26 |
| EM-RESERVE-004-T28 | Test phone validation | QA Engineer | 1 | T26 |
| EM-RESERVE-004-T29 | Write integration test for attendee endpoint | QA Engineer | 2 | T15 |
| EM-RESERVE-004-T30 | Test adding attendee to expired reservation (should fail) | QA Engineer | 1.5 | T29 |
| EM-RESERVE-004-T31 | Manual testing of attendee form | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~50 hours

---

## EM-RESERVE-005: Review Order Summary

**User Story:** As an attendee, I want to review my order summary before payment, so that I can verify my purchase.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 5  
**Dependencies:** EM-RESERVE-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-005-T1 | Create ReservationSummaryDTO with event, items, attendee, total | Backend Developer | 1.5 | None |
| EM-RESERVE-005-T2 | Create OrderItemDTO for line items (category, quantity, price, subtotal) | Backend Developer | 1 | None |
| EM-RESERVE-005-T3 | Implement ReservationService.getReservationSummary() | Backend Developer | 3 | EM-RESERVE-001-T14 |
| EM-RESERVE-005-T4 | Fetch reservation with items and attendee (using JOIN FETCH) | Backend Developer | 2 | T3 |
| EM-RESERVE-005-T5 | Calculate subtotal for each item: quantity × price_at_reservation | Backend Developer | 1.5 | T4 |
| EM-RESERVE-005-T6 | Calculate total amount: sum of all subtotals | Backend Developer | 1 | T5 |
| EM-RESERVE-005-T7 | Map to ReservationSummaryDTO | Backend Developer | 1.5 | T4 |
| EM-RESERVE-005-T8 | Create GET /api/v1/reservations/{id}/summary endpoint | Backend Developer | 1.5 | T3 |
| EM-RESERVE-005-T9 | Return 404 if reservation not found | Backend Developer | 0.5 | T8 |
| EM-RESERVE-005-T10 | Return 400 if reservation is expired | Backend Developer | 1 | T8 |
| EM-RESERVE-005-T11 | Create order summary component | Frontend Developer | 4 | None |
| EM-RESERVE-005-T12 | Display event name and date | Frontend Developer | 1 | T11 |
| EM-RESERVE-005-T13 | Display attendee information (name, email) | Frontend Developer | 1.5 | T11 |
| EM-RESERVE-005-T14 | Display line items table: Category, Quantity, Price, Subtotal | Frontend Developer | 3 | T11 |
| EM-RESERVE-005-T15 | Calculate and display total amount | Frontend Developer | 1 | T14 |
| EM-RESERVE-005-T16 | Add "Proceed to Payment" button | Frontend Developer | 1 | T11 |
| EM-RESERVE-005-T17 | Style summary in clear, readable format | Frontend Developer | 2 | T11 |
| EM-RESERVE-005-T18 | Call GET /api/v1/reservations/{id}/summary | Frontend Developer | 1.5 | T8 |
| EM-RESERVE-005-T19 | Handle expired reservation (redirect to event page) | Frontend Developer | 1.5 | T18 |
| EM-RESERVE-005-T20 | Write unit tests for getReservationSummary() | QA Engineer | 2 | T3 |
| EM-RESERVE-005-T21 | Test total calculation accuracy | QA Engineer | 1.5 | T6 |
| EM-RESERVE-005-T22 | Write integration test for summary endpoint | QA Engineer | 2 | T8 |
| EM-RESERVE-005-T23 | Test with expired reservation | QA Engineer | 1 | T22 |
| EM-RESERVE-005-T24 | Manual testing of order summary display | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~39 hours

---

## EM-RESERVE-006: Prevent Expired Checkout

**User Story:** As a system, I want to prevent checkout of expired reservations, so that payments are not processed for unavailable tickets.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 5  
**Dependencies:** EM-RESERVE-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-006-T1 | Create method: isReservationActive(reservationId) | Backend Developer | 2 | EM-RESERVE-001-T14 |
| EM-RESERVE-006-T2 | Query: WHERE id = :id AND status = 'PENDING' AND expires_at > NOW() | Backend Developer | 1.5 | T1 |
| EM-RESERVE-006-T3 | Return boolean: true if active, false otherwise | Backend Developer | 0.5 | T2 |
| EM-RESERVE-006-T4 | Add validation before payment initiation | Backend Developer | 2 | T1 |
| EM-RESERVE-006-T5 | If reservation expired, throw ReservationExpiredException | Backend Developer | 1 | T4 |
| EM-RESERVE-006-T6 | Handle exception in payment controller | Backend Developer | 1.5 | T5 |
| EM-RESERVE-006-T7 | Return 400 Bad Request with message "Reservation has expired" | Backend Developer | 1 | T6 |
| EM-RESERVE-006-T8 | Add frontend check before showing payment form | Frontend Developer | 2 | None |
| EM-RESERVE-006-T9 | Call GET /api/v1/reservations/{id}/status before payment | Frontend Developer | 1.5 | EM-RESERVE-003-T13 |
| EM-RESERVE-006-T10 | If status is EXPIRED, show modal and redirect | Frontend Developer | 2 | T9 |
| EM-RESERVE-006-T11 | Disable payment button if reservation expired | Frontend Developer | 1 | T9 |
| EM-RESERVE-006-T12 | Display clear error message if payment attempted on expired reservation | Frontend Developer | 1.5 | T11 |
| EM-RESERVE-006-T13 | Write unit tests for isReservationActive() | QA Engineer | 2 | T1 |
| EM-RESERVE-006-T14 | Test with active reservation (should return true) | QA Engineer | 1 | T13 |
| EM-RESERVE-006-T15 | Test with expired reservation (should return false) | QA Engineer | 1 | T13 |
| EM-RESERVE-006-T16 | Write integration test for payment with expired reservation | QA Engineer | 2.5 | T6 |
| EM-RESERVE-006-T17 | Verify 400 error returned | QA Engineer | 1 | T16 |
| EM-RESERVE-006-T18 | Manual testing: attempt payment after expiration | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~27 hours

---

## EM-RESERVE-007: Show Sold Out Status

**User Story:** As a public user, I want to see if a ticket category is sold out, so that I don't waste time trying to purchase unavailable tickets.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 4  
**Dependencies:** EM-TICKET-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-007-T1 | Update GET /api/v1/public/events/{eventId} to include quantity_available | Backend Developer | 1 | None |
| EM-RESERVE-007-T2 | Add isSoldOut boolean to TicketCategoryDTO | Backend Developer | 0.5 | T1 |
| EM-RESERVE-007-T3 | Calculate: isSoldOut = (quantity_available == 0) | Backend Developer | 0.5 | T2 |
| EM-RESERVE-007-T4 | Display "Sold Out" badge on category when quantity_available = 0 | Frontend Developer | 2 | None |
| EM-RESERVE-007-T5 | Style badge prominently (red background, white text) | Frontend Developer | 1 | T4 |
| EM-RESERVE-007-T6 | Disable quantity selector for sold out categories | Frontend Developer | 1.5 | T4 |
| EM-RESERVE-007-T7 | Disable "Reserve Tickets" button for sold out categories | Frontend Developer | 1 | T4 |
| EM-RESERVE-007-T8 | Gray out sold out categories visually | Frontend Developer | 1 | T4 |
| EM-RESERVE-007-T9 | Show tooltip: "This ticket type is sold out" on hover | Frontend Developer | 1.5 | T4 |
| EM-RESERVE-007-T10 | Write integration test for sold out display | QA Engineer | 1.5 | T1 |
| EM-RESERVE-007-T11 | Test category with 0 availability shows as sold out | QA Engineer | 1 | T10 |
| EM-RESERVE-007-T12 | Test category with availability does not show sold out | QA Engineer | 1 | T10 |
| EM-RESERVE-007-T13 | Manual testing of sold out UI | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~15 hours

---

## EM-RESERVE-008: Validate Reservation Quantities

**User Story:** As a system, I want to validate reservation quantities, so that users cannot reserve more tickets than available.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 4  
**Dependencies:** EM-RESERVE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-008-T1 | Add validation in ReservationService before inventory decrement | Backend Developer | 2 | EM-RESERVE-001-T18 |
| EM-RESERVE-008-T2 | For each item, check: requested_quantity <= category.quantity_available | Backend Developer | 2 | T1 |
| EM-RESERVE-008-T3 | If validation fails, collect all errors | Backend Developer | 1.5 | T2 |
| EM-RESERVE-008-T4 | Throw ValidationException with specific message per category | Backend Developer | 1.5 | T3 |
| EM-RESERVE-008-T5 | Message format: "Category '{name}': requested {x}, available {y}" | Backend Developer | 1 | T4 |
| EM-RESERVE-008-T6 | Add frontend validation before API call | Frontend Developer | 2 | None |
| EM-RESERVE-008-T7 | Check quantity_available from cached event data | Frontend Developer | 1.5 | T6 |
| EM-RESERVE-008-T8 | Display error if user enters quantity > available | Frontend Developer | 1.5 | T7 |
| EM-RESERVE-008-T9 | Limit quantity input max value to quantity_available | Frontend Developer | 1.5 | T7 |
| EM-RESERVE-008-T10 | Handle backend validation errors and display to user | Frontend Developer | 2 | None |
| EM-RESERVE-008-T11 | Write unit tests for quantity validation | QA Engineer | 2 | T1 |
| EM-RESERVE-008-T12 | Test requesting exactly available quantity (should succeed) | QA Engineer | 1 | T11 |
| EM-RESERVE-008-T13 | Test requesting more than available (should fail) | QA Engineer | 1 | T11 |
| EM-RESERVE-008-T14 | Write integration test for validation | QA Engineer | 2 | T4 |
| EM-RESERVE-008-T15 | Test error message format and content | QA Engineer | 1 | T14 |
| EM-RESERVE-008-T16 | Manual testing of quantity validation | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~24 hours

---

## EM-RESERVE-009: Accept Terms and Conditions

**User Story:** As an attendee, I want to accept terms and conditions, so that I acknowledge the event policies.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 5  
**Dependencies:** EM-RESERVE-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-RESERVE-009-T1 | Add terms_accepted column to reservations or orders table | Database Engineer | 1 | None |
| EM-RESERVE-009-T2 | Add terms_accepted boolean to AttendeeInfoRequest DTO | Backend Developer | 0.5 | EM-RESERVE-004-T9 |
| EM-RESERVE-009-T3 | Add validation: terms_accepted must be true | Backend Developer | 1 | T2 |
| EM-RESERVE-009-T4 | Update addAttendeeInfo() to validate terms acceptance | Backend Developer | 1.5 | EM-RESERVE-004-T11 |
| EM-RESERVE-009-T5 | Return 400 if terms_accepted = false | Backend Developer | 1 | T4 |
| EM-RESERVE-009-T6 | Store terms_accepted value in database | Backend Developer | 1 | T4 |
| EM-RESERVE-009-T7 | Add terms and conditions checkbox to attendee form | Frontend Developer | 2 | EM-RESERVE-004-T18 |
| EM-RESERVE-009-T8 | Display generic terms text (placeholder for MVP) | Frontend Developer | 1.5 | T7 |
| EM-RESERVE-009-T9 | Add "View Full Terms" link (opens modal with full text) | Frontend Developer | 2 | T7 |
| EM-RESERVE-009-T10 | Disable submit button until checkbox is checked | Frontend Developer | 1.5 | T7 |
| EM-RESERVE-009-T11 | Display error message if user tries to submit without accepting | Frontend Developer | 1 | T10 |
| EM-RESERVE-009-T12 | Style checkbox and label clearly | Frontend Developer | 1 | T7 |
| EM-RESERVE-009-T13 | Write unit tests for terms validation | QA Engineer | 1.5 | T4 |
| EM-RESERVE-009-T14 | Test with terms_accepted = true (should succeed) | QA Engineer | 0.5 | T13 |
| EM-RESERVE-009-T15 | Test with terms_accepted = false (should fail) | QA Engineer | 0.5 | T13 |
| EM-RESERVE-009-T16 | Write integration test for terms validation | QA Engineer | 1.5 | T5 |
| EM-RESERVE-009-T17 | Manual testing of terms acceptance flow | QA Engineer | 1 | All tasks |

**Total Story Effort:** ~20 hours

---

# PART 2 SUMMARY

## Epic 3: Ticket Category & Inventory Management
**User Stories:** 6  
**Total Tasks:** ~77 tasks  
**Total Hours:** ~251 hours  

## Epic 4: Reservation & Checkout System
**User Stories:** 9  
**Total Tasks:** ~92 tasks  
**Total Hours:** ~330 hours  

## PART 2 TOTALS
**User Stories:** 15  
**Total Tasks:** ~169 tasks  
**Total Estimated Hours:** ~581 hours  

---

**Notes:**
- Pessimistic locking critical for preventing overselling
- Scheduled job runs every minute to expire reservations
- 15-minute expiration configurable via properties
- All monetary amounts use decimal/numeric types for precision
- Frontend includes real-time availability updates
- Comprehensive load testing required for concurrent scenarios

**Next:** Part 3 will cover Epics 5-6 (Payments & Ticket Generation)

