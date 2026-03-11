# TASK BREAKDOWN - PART 4
## Check-In & Attendee Management (Epics 7-8)

**Epics Covered:** 
- Epic 7: Basic Check-In System (6 stories)
- Epic 8: Attendee Management (7 stories)

**Total User Stories:** 13  
**Total Tasks:** ~145 tasks  
**Total Estimated Hours:** ~440-480 hours  

---

# EPIC 7: BASIC CHECK-IN SYSTEM

---

## EM-CHECKIN-001: Validate Ticket by Code

**User Story:** As a check-in operator, I want to validate a ticket by entering its code, so that I can verify ticket authenticity.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-001-T1 | Create CheckInService for ticket validation | Backend Developer | 2.5 | None |
| EM-CHECKIN-001-T2 | Implement validateTicket(ticketCode) method | Backend Developer | 4 | T1 |
| EM-CHECKIN-001-T3 | Parse ticket code string to UUID | Backend Developer | 1 | T2 |
| EM-CHECKIN-001-T4 | Handle invalid UUID format gracefully | Backend Developer | 1.5 | T3 |
| EM-CHECKIN-001-T5 | Query ticket by ticket_code using findByTicketCode() | Backend Developer | 1.5 | T2, EM-TICKET-GEN-001-T12 |
| EM-CHECKIN-001-T6 | Return validation result: VALID, INVALID, ALREADY_CHECKED_IN | Backend Developer | 2 | T5 |
| EM-CHECKIN-001-T7 | If ticket not found, return INVALID | Backend Developer | 1 | T5 |
| EM-CHECKIN-001-T8 | If ticket.checked_in = true, return ALREADY_CHECKED_IN | Backend Developer | 1.5 | T5 |
| EM-CHECKIN-001-T9 | If ticket valid and not checked in, return VALID with ticket details | Backend Developer | 2 | T5 |
| EM-CHECKIN-001-T10 | Fetch related event and category info for display | Backend Developer | 2 | T9 |
| EM-CHECKIN-001-T11 | Create TicketValidationResponse DTO | Backend Developer | 1.5 | None |
| EM-CHECKIN-001-T12 | Include status, ticket details, event info, attendee name | Backend Developer | 1.5 | T11 |
| EM-CHECKIN-001-T13 | Create POST /api/v1/checkin/validate endpoint | Backend Developer | 2 | T2 |
| EM-CHECKIN-001-T14 | Accept request body with ticket_code field | Backend Developer | 1 | T13 |
| EM-CHECKIN-001-T15 | Add @PreAuthorize("hasRole('CHECK_IN_OPERATOR')") | Backend Developer | 0.5 | T13 |
| EM-CHECKIN-001-T16 | Return 200 with validation response | Backend Developer | 1 | T13 |
| EM-CHECKIN-001-T17 | Return 400 if ticket code format is invalid | Backend Developer | 1 | T13 |
| EM-CHECKIN-001-T18 | Add rate limiting to prevent abuse (optional) | Backend Developer | 2 | T13 |
| EM-CHECKIN-001-T19 | Create check-in page component in Angular | Frontend Developer | 4 | None |
| EM-CHECKIN-001-T20 | Add ticket code input field | Frontend Developer | 2 | T19 |
| EM-CHECKIN-001-T21 | Support both manual entry and QR scan (future) | Frontend Developer | 1 | T20 |
| EM-CHECKIN-001-T22 | Add "Validate" button | Frontend Developer | 1 | T20 |
| EM-CHECKIN-001-T23 | Call POST /api/v1/checkin/validate on button click | Frontend Developer | 2 | T13 |
| EM-CHECKIN-001-T24 | Display validation result prominently | Frontend Developer | 3 | T23 |
| EM-CHECKIN-001-T25 | Show green checkmark for VALID ticket | Frontend Developer | 1.5 | T24 |
| EM-CHECKIN-001-T26 | Show red X for INVALID ticket | Frontend Developer | 1.5 | T24 |
| EM-CHECKIN-001-T27 | Show warning for ALREADY_CHECKED_IN | Frontend Developer | 1.5 | T24 |
| EM-CHECKIN-001-T28 | Display ticket details: event name, attendee, category | Frontend Developer | 2.5 | T24 |
| EM-CHECKIN-001-T29 | Auto-focus input field for quick consecutive scans | Frontend Developer | 1 | T20 |
| EM-CHECKIN-001-T30 | Clear input field after validation | Frontend Developer | 1 | T23 |
| EM-CHECKIN-001-T31 | Add sound/visual feedback for validation result | Frontend Developer | 2 | T24 |
| EM-CHECKIN-001-T32 | Write unit tests for validateTicket() method | QA Engineer | 3 | T2 |
| EM-CHECKIN-001-T33 | Test with valid ticket code (should return VALID) | QA Engineer | 1 | T32 |
| EM-CHECKIN-001-T34 | Test with invalid/non-existent code (should return INVALID) | QA Engineer | 1 | T32 |
| EM-CHECKIN-001-T35 | Test with already checked-in ticket (should return ALREADY_CHECKED_IN) | QA Engineer | 1.5 | T32 |
| EM-CHECKIN-001-T36 | Test with malformed UUID (should handle gracefully) | QA Engineer | 1 | T32 |
| EM-CHECKIN-001-T37 | Write integration test for validate endpoint | QA Engineer | 2.5 | T13 |
| EM-CHECKIN-001-T38 | Test authorization (only CHECK_IN_OPERATOR can access) | QA Engineer | 1.5 | T15 |
| EM-CHECKIN-001-T39 | Manual testing of validation flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~67 hours

---

## EM-CHECKIN-002: Mark Ticket as Checked-In

**User Story:** As a check-in operator, I want to mark a ticket as checked-in, so that the attendee can enter the event.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 6  
**Dependencies:** EM-CHECKIN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-002-T1 | Implement CheckInService.checkInTicket(ticketCode) method | Backend Developer | 3.5 | EM-CHECKIN-001-T1 |
| EM-CHECKIN-002-T2 | Validate ticket first using validateTicket() | Backend Developer | 1 | T1, EM-CHECKIN-001-T2 |
| EM-CHECKIN-002-T3 | If ticket invalid or already checked in, throw exception | Backend Developer | 1.5 | T2 |
| EM-CHECKIN-002-T4 | Update ticket.checked_in = true | Backend Developer | 1 | T2 |
| EM-CHECKIN-002-T5 | Set ticket.checked_in_at = NOW() | Backend Developer | 1 | T4 |
| EM-CHECKIN-002-T6 | Save updated ticket to database | Backend Developer | 1 | T5 |
| EM-CHECKIN-002-T7 | Return check-in confirmation with timestamp | Backend Developer | 1 | T6 |
| EM-CHECKIN-002-T8 | Wrap operation in @Transactional | Backend Developer | 1 | T1 |
| EM-CHECKIN-002-T9 | Add optimistic locking to prevent race conditions | Backend Developer | 2.5 | T1 |
| EM-CHECKIN-002-T10 | Add @Version field to Ticket entity | Backend Developer | 1.5 | T9 |
| EM-CHECKIN-002-T11 | Handle OptimisticLockException if concurrent check-in attempt | Backend Developer | 2 | T9 |
| EM-CHECKIN-002-T12 | Create CheckInRequest DTO with ticket_code | Backend Developer | 1 | None |
| EM-CHECKIN-002-T13 | Create CheckInResponse DTO with success, timestamp, ticket details | Backend Developer | 1.5 | None |
| EM-CHECKIN-002-T14 | Create POST /api/v1/checkin/check-in endpoint | Backend Developer | 2 | T1 |
| EM-CHECKIN-002-T15 | Add @PreAuthorize("hasRole('CHECK_IN_OPERATOR')") | Backend Developer | 0.5 | T14 |
| EM-CHECKIN-002-T16 | Return 200 with check-in confirmation | Backend Developer | 1 | T14 |
| EM-CHECKIN-002-T17 | Return 400 if ticket invalid or already checked in | Backend Developer | 1.5 | T14 |
| EM-CHECKIN-002-T18 | Log check-in event for audit trail | Backend Developer | 1.5 | T14 |
| EM-CHECKIN-002-T19 | Add "Check In" button on validation success screen | Frontend Developer | 2 | EM-CHECKIN-001-T24 |
| EM-CHECKIN-002-T20 | Only show button if ticket status is VALID | Frontend Developer | 1 | T19 |
| EM-CHECKIN-002-T21 | Call POST /api/v1/checkin/check-in on button click | Frontend Developer | 2 | T14 |
| EM-CHECKIN-002-T22 | Display check-in success message with timestamp | Frontend Developer | 2 | T21 |
| EM-CHECKIN-002-T23 | Show large "CHECKED IN" confirmation | Frontend Developer | 2 | T22 |
| EM-CHECKIN-002-T24 | Add success animation (e.g., confetti, green pulse) | Frontend Developer | 2.5 | T22 |
| EM-CHECKIN-002-T25 | Play success sound effect | Frontend Developer | 1.5 | T22 |
| EM-CHECKIN-002-T26 | Auto-clear screen after 3 seconds for next attendee | Frontend Developer | 1.5 | T22 |
| EM-CHECKIN-002-T27 | Handle check-in errors (network, already checked in) | Frontend Developer | 2 | T21 |
| EM-CHECKIN-002-T28 | Display error message if check-in fails | Frontend Developer | 1.5 | T27 |
| EM-CHECKIN-002-T29 | Implement keyboard shortcut (Enter) to check in | Frontend Developer | 1 | T19 |
| EM-CHECKIN-002-T30 | Write unit tests for checkInTicket() method | QA Engineer | 3 | T1 |
| EM-CHECKIN-002-T31 | Test successful check-in | QA Engineer | 1 | T30 |
| EM-CHECKIN-002-T32 | Test check-in of already checked-in ticket (should fail) | QA Engineer | 1.5 | T30 |
| EM-CHECKIN-002-T33 | Test check-in of invalid ticket (should fail) | QA Engineer | 1 | T30 |
| EM-CHECKIN-002-T34 | Test optimistic locking (concurrent check-in attempts) | QA Engineer | 2.5 | T9 |
| EM-CHECKIN-002-T35 | Write integration test for check-in endpoint | QA Engineer | 2.5 | T14 |
| EM-CHECKIN-002-T36 | Verify ticket marked as checked in database | QA Engineer | 1.5 | T35 |
| EM-CHECKIN-002-T37 | Verify checked_in_at timestamp set | QA Engineer | 1 | T35 |
| EM-CHECKIN-002-T38 | Manual end-to-end testing of check-in flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~65 hours

---

## EM-CHECKIN-003: Prevent Duplicate Check-Ins

**User Story:** As a system, I want to prevent duplicate check-ins, so that tickets cannot be reused.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 6  
**Dependencies:** EM-CHECKIN-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-003-T1 | Verify duplicate check-in prevention already implemented in EM-CHECKIN-002 | Backend Developer | 1 | EM-CHECKIN-002-T3 |
| EM-CHECKIN-003-T2 | Add database-level check constraint (optional redundancy) | Database Engineer | 1.5 | None |
| EM-CHECKIN-003-T3 | Add unique partial index: CREATE UNIQUE INDEX ON tickets(ticket_code) WHERE checked_in = true | Database Engineer | 2 | T2 |
| EM-CHECKIN-003-T4 | Test constraint prevents duplicate check-ins at DB level | Database Engineer | 1.5 | T3 |
| EM-CHECKIN-003-T5 | Enhance error message for duplicate check-in attempt | Backend Developer | 1.5 | EM-CHECKIN-002-T3 |
| EM-CHECKIN-003-T6 | Include original check-in timestamp in error response | Backend Developer | 1.5 | T5 |
| EM-CHECKIN-003-T7 | Message: "Ticket already checked in at {timestamp}" | Backend Developer | 1 | T5 |
| EM-CHECKIN-003-T8 | Display duplicate check-in warning prominently on frontend | Frontend Developer | 2 | EM-CHECKIN-001-T27 |
| EM-CHECKIN-003-T9 | Show original check-in timestamp | Frontend Developer | 1.5 | T8 |
| EM-CHECKIN-003-T10 | Display warning icon and message | Frontend Developer | 1.5 | T8 |
| EM-CHECKIN-003-T11 | Add "Override" button for authorized users (optional for MVP) | Frontend Developer | 2.5 | T8 |
| EM-CHECKIN-003-T12 | Log duplicate check-in attempts for security monitoring | Backend Developer | 2 | T5 |
| EM-CHECKIN-003-T13 | Track: ticket_code, operator, timestamp, IP address | Backend Developer | 1.5 | T12 |
| EM-CHECKIN-003-T14 | Create check-in audit log table | Database Engineer | 2 | None |
| EM-CHECKIN-003-T15 | Columns: id, ticket_id, operator_id, action, timestamp, ip_address | Database Engineer | 1 | T14 |
| EM-CHECKIN-003-T16 | Write unit tests for duplicate prevention | QA Engineer | 2 | EM-CHECKIN-002-T30 |
| EM-CHECKIN-003-T17 | Test attempting to check in same ticket twice | QA Engineer | 1.5 | T16 |
| EM-CHECKIN-003-T18 | Verify second attempt fails with appropriate error | QA Engineer | 1 | T16 |
| EM-CHECKIN-003-T19 | Test concurrent duplicate check-in attempts | QA Engineer | 2.5 | T16 |
| EM-CHECKIN-003-T20 | Verify only one succeeds | QA Engineer | 1 | T19 |
| EM-CHECKIN-003-T21 | Write integration test for duplicate prevention | QA Engineer | 2 | T5 |
| EM-CHECKIN-003-T22 | Manual testing of duplicate check-in scenario | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~37 hours

---

## EM-CHECKIN-004: Check-In Statistics Dashboard

**User Story:** As an event organizer, I want to view check-in statistics, so that I can monitor event attendance in real-time.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 6  
**Dependencies:** EM-CHECKIN-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-004-T1 | Create CheckInStatsDTO with metrics | Backend Developer | 1.5 | None |
| EM-CHECKIN-004-T2 | Fields: total_tickets, checked_in_count, pending_count, check_in_percentage | Backend Developer | 1 | T1 |
| EM-CHECKIN-004-T3 | Implement CheckInService.getEventCheckInStats(eventId) | Backend Developer | 3.5 | EM-CHECKIN-001-T1 |
| EM-CHECKIN-004-T4 | Query total tickets for event | Backend Developer | 1.5 | T3 |
| EM-CHECKIN-004-T5 | Query tickets WHERE checked_in = true | Backend Developer | 1.5 | T3 |
| EM-CHECKIN-004-T6 | Calculate pending: total - checked_in | Backend Developer | 1 | T3 |
| EM-CHECKIN-004-T7 | Calculate percentage: (checked_in / total) * 100 | Backend Developer | 1 | T3 |
| EM-CHECKIN-004-T8 | Add breakdown by ticket category | Backend Developer | 2.5 | T3 |
| EM-CHECKIN-004-T9 | Group by ticket_category_id and count check-ins | Backend Developer | 2 | T8 |
| EM-CHECKIN-004-T10 | Create GET /api/v1/events/{eventId}/checkin-stats endpoint | Backend Developer | 1.5 | T3 |
| EM-CHECKIN-004-T11 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T10 |
| EM-CHECKIN-004-T12 | Verify user has access to event | Backend Developer | 1.5 | T10 |
| EM-CHECKIN-004-T13 | Return CheckInStatsDTO | Backend Developer | 1 | T10 |
| EM-CHECKIN-004-T14 | Create check-in statistics component | Frontend Developer | 4 | None |
| EM-CHECKIN-004-T15 | Display key metrics in cards: Total, Checked In, Pending | Frontend Developer | 3 | T14 |
| EM-CHECKIN-004-T16 | Display check-in percentage with progress bar | Frontend Developer | 2 | T15 |
| EM-CHECKIN-004-T17 | Add color coding: red (<30%), yellow (30-70%), green (>70%) | Frontend Developer | 1.5 | T16 |
| EM-CHECKIN-004-T18 | Display breakdown by ticket category in table | Frontend Developer | 2.5 | T14 |
| EM-CHECKIN-004-T19 | Add auto-refresh every 30 seconds | Frontend Developer | 2 | T14 |
| EM-CHECKIN-004-T20 | Display last updated timestamp | Frontend Developer | 1 | T19 |
| EM-CHECKIN-004-T21 | Add "Refresh" button for manual update | Frontend Developer | 1 | T14 |
| EM-CHECKIN-004-T22 | Add check-in stats to event dashboard page | Frontend Developer | 2 | None |
| EM-CHECKIN-004-T23 | Write unit tests for getEventCheckInStats() | QA Engineer | 2.5 | T3 |
| EM-CHECKIN-004-T24 | Test calculation accuracy | QA Engineer | 1.5 | T23 |
| EM-CHECKIN-004-T25 | Test with 0 check-ins (avoid division by zero) | QA Engineer | 1 | T23 |
| EM-CHECKIN-004-T26 | Test with partial check-ins | QA Engineer | 1 | T23 |
| EM-CHECKIN-004-T27 | Test category breakdown | QA Engineer | 1.5 | T23 |
| EM-CHECKIN-004-T28 | Write integration test for stats endpoint | QA Engineer | 2 | T10 |
| EM-CHECKIN-004-T29 | Manual testing of statistics display | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~50 hours

---

## EM-CHECKIN-005: Mobile-Friendly Check-In Interface

**User Story:** As a check-in operator, I want a mobile-friendly interface, so that I can check in attendees using a tablet or phone.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 6  
**Dependencies:** EM-CHECKIN-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-005-T1 | Review current check-in page for mobile responsiveness | Frontend Developer | 1 | EM-CHECKIN-001-T19 |
| EM-CHECKIN-005-T2 | Implement responsive CSS for mobile (max-width: 768px) | Frontend Developer | 3 | T1 |
| EM-CHECKIN-005-T3 | Increase input field size for easier touch input | Frontend Developer | 1.5 | T2 |
| EM-CHECKIN-005-T4 | Increase button sizes to minimum 44x44px (touch-friendly) | Frontend Developer | 1.5 | T2 |
| EM-CHECKIN-005-T5 | Optimize layout for portrait mobile screen | Frontend Developer | 2 | T2 |
| EM-CHECKIN-005-T6 | Stack elements vertically on mobile | Frontend Developer | 1.5 | T5 |
| EM-CHECKIN-005-T7 | Increase font sizes for readability on small screens | Frontend Developer | 1 | T2 |
| EM-CHECKIN-005-T8 | Test on iOS Safari and Chrome mobile | Frontend Developer | 2 | T2 |
| EM-CHECKIN-005-T9 | Test on Android Chrome | Frontend Developer | 1.5 | T2 |
| EM-CHECKIN-005-T10 | Fix viewport meta tag for proper mobile rendering | Frontend Developer | 1 | T2 |
| EM-CHECKIN-005-T11 | Add PWA manifest for "Add to Home Screen" capability | Frontend Developer | 2.5 | None |
| EM-CHECKIN-005-T12 | Create manifest.json with app name, icons, theme | Frontend Developer | 2 | T11 |
| EM-CHECKIN-005-T13 | Add service worker for offline capability (basic) | Frontend Developer | 3 | T11 |
| EM-CHECKIN-005-T14 | Cache check-in page for offline access | Frontend Developer | 2 | T13 |
| EM-CHECKIN-005-T15 | Optimize performance for slower mobile connections | Frontend Developer | 2 | None |
| EM-CHECKIN-005-T16 | Minimize bundle size | Frontend Developer | 1.5 | T15 |
| EM-CHECKIN-005-T17 | Lazy load non-critical components | Frontend Developer | 2 | T15 |
| EM-CHECKIN-005-T18 | Add touch gestures (swipe to clear) | Frontend Developer | 2.5 | T2 |
| EM-CHECKIN-005-T19 | Test with real mobile devices (iPhone, Android) | QA Engineer | 3 | T2 |
| EM-CHECKIN-005-T20 | Test touch interactions (tap, swipe) | QA Engineer | 1.5 | T19 |
| EM-CHECKIN-005-T21 | Test in landscape and portrait orientations | QA Engineer | 1.5 | T19 |
| EM-CHECKIN-005-T22 | Test with different screen sizes (phone, tablet) | QA Engineer | 2 | T19 |
| EM-CHECKIN-005-T23 | Verify readability and usability on small screens | QA Engineer | 1.5 | T19 |
| EM-CHECKIN-005-T24 | Test offline mode (if implemented) | QA Engineer | 2 | T13 |
| EM-CHECKIN-005-T25 | Manual testing with check-in operators using mobile | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~48 hours

---

## EM-CHECKIN-006: Search Tickets by Attendee Name

**User Story:** As a check-in operator, I want to search for tickets by attendee name, so that I can help attendees who lost their tickets.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 7  
**Dependencies:** EM-CHECKIN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-CHECKIN-006-T1 | Add search method to TicketRepository | Backend Developer | 2 | EM-TICKET-GEN-001-T11 |
| EM-CHECKIN-006-T2 | Implement: findByEventIdAndAttendeeNameContaining(eventId, name) | Backend Developer | 2 | T1 |
| EM-CHECKIN-006-T3 | Make search case-insensitive using LOWER() | Backend Developer | 1 | T2 |
| EM-CHECKIN-006-T4 | Add pagination support | Backend Developer | 1.5 | T2 |
| EM-CHECKIN-006-T5 | Implement CheckInService.searchTicketsByName(eventId, name) | Backend Developer | 2.5 | EM-CHECKIN-001-T1 |
| EM-CHECKIN-006-T6 | Return list of matching tickets with details | Backend Developer | 1.5 | T5 |
| EM-CHECKIN-006-T7 | Include check-in status in results | Backend Developer | 1 | T6 |
| EM-CHECKIN-006-T8 | Create TicketSearchResultDTO | Backend Developer | 1 | None |
| EM-CHECKIN-006-T9 | Fields: ticket_code, attendee_name, category, checked_in, checked_in_at | Backend Developer | 1 | T8 |
| EM-CHECKIN-006-T10 | Create GET /api/v1/checkin/search endpoint | Backend Developer | 1.5 | T5 |
| EM-CHECKIN-006-T11 | Accept query params: ?eventId={id}&name={searchTerm} | Backend Developer | 1 | T10 |
| EM-CHECKIN-006-T12 | Add @PreAuthorize("hasRole('CHECK_IN_OPERATOR')") | Backend Developer | 0.5 | T10 |
| EM-CHECKIN-006-T13 | Return List<TicketSearchResultDTO> | Backend Developer | 1 | T10 |
| EM-CHECKIN-006-T14 | Return empty list if no matches found | Backend Developer | 0.5 | T10 |
| EM-CHECKIN-006-T15 | Add search input field to check-in page | Frontend Developer | 2 | EM-CHECKIN-001-T19 |
| EM-CHECKIN-006-T16 | Add "Search by Name" tab/section | Frontend Developer | 2.5 | T15 |
| EM-CHECKIN-006-T17 | Implement debounced search (wait 300ms after typing) | Frontend Developer | 2 | T15 |
| EM-CHECKIN-006-T18 | Call GET /api/v1/checkin/search on input | Frontend Developer | 1.5 | T10 |
| EM-CHECKIN-006-T19 | Display search results in list | Frontend Developer | 2.5 | T18 |
| EM-CHECKIN-006-T20 | Show attendee name, ticket code, category, check-in status | Frontend Developer | 2 | T19 |
| EM-CHECKIN-006-T21 | Add "Check In" button for each result | Frontend Developer | 1.5 | T19 |
| EM-CHECKIN-006-T22 | Disable button if already checked in | Frontend Developer | 1 | T21 |
| EM-CHECKIN-006-T23 | Handle click to check in selected ticket | Frontend Developer | 2 | T21 |
| EM-CHECKIN-006-T24 | Display "No results found" message | Frontend Developer | 1 | T18 |
| EM-CHECKIN-006-T25 | Add minimum search length (3 characters) | Frontend Developer | 1 | T17 |
| EM-CHECKIN-006-T26 | Write unit tests for searchTicketsByName() | QA Engineer | 2 | T5 |
| EM-CHECKIN-006-T27 | Test exact name match | QA Engineer | 1 | T26 |
| EM-CHECKIN-006-T28 | Test partial name match | QA Engineer | 1 | T26 |
| EM-CHECKIN-006-T29 | Test case-insensitive search | QA Engineer | 1 | T26 |
| EM-CHECKIN-006-T30 | Write integration test for search endpoint | QA Engineer | 2 | T10 |
| EM-CHECKIN-006-T31 | Test with multiple matching results | QA Engineer | 1 | T30 |
| EM-CHECKIN-006-T32 | Test with no matches | QA Engineer | 1 | T30 |
| EM-CHECKIN-006-T33 | Manual testing of search functionality | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~47 hours

---

# EPIC 8: ATTENDEE MANAGEMENT

---

## EM-ATTENDEE-001: View Attendee List

**User Story:** As an organizer, I want to view a list of all attendees, so that I can see who purchased tickets.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-001-T1 | Create AttendeeDTO with ticket and event info | Backend Developer | 1.5 | None |
| EM-ATTENDEE-001-T2 | Fields: name, email, phone, ticket_category, ticket_code, checked_in | Backend Developer | 1 | T1 |
| EM-ATTENDEE-001-T3 | Implement AttendeeService.getEventAttendees(eventId) | Backend Developer | 3 | None |
| EM-ATTENDEE-001-T4 | Query tickets for event with JOIN to fetch attendee info | Backend Developer | 2 | T3 |
| EM-ATTENDEE-001-T5 | Add pagination support (default 50 per page) | Backend Developer | 2 | T3 |
| EM-ATTENDEE-001-T6 | Sort by created_at descending (newest first) | Backend Developer | 1 | T3 |
| EM-ATTENDEE-001-T7 | Map tickets to AttendeeDTO | Backend Developer | 1.5 | T3 |
| EM-ATTENDEE-001-T8 | Create GET /api/v1/events/{eventId}/attendees endpoint | Backend Developer | 1.5 | T3 |
| EM-ATTENDEE-001-T9 | Accept pagination params: ?page=0&size=50 | Backend Developer | 1 | T8 |
| EM-ATTENDEE-001-T10 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T8 |
| EM-ATTENDEE-001-T11 | Verify user has access to event | Backend Developer | 1.5 | T8 |
| EM-ATTENDEE-001-T12 | Return Page<AttendeeDTO> | Backend Developer | 1 | T8 |
| EM-ATTENDEE-001-T13 | Create attendees list page component | Frontend Developer | 4 | None |
| EM-ATTENDEE-001-T14 | Create data table component for attendees | Frontend Developer | 4 | T13 |
| EM-ATTENDEE-001-T15 | Display columns: Name, Email, Phone, Category, Ticket Code, Status | Frontend Developer | 3 | T14 |
| EM-ATTENDEE-001-T16 | Add check mark icon for checked-in attendees | Frontend Developer | 1.5 | T15 |
| EM-ATTENDEE-001-T17 | Add pagination controls | Frontend Developer | 2 | T14 |
| EM-ATTENDEE-001-T18 | Call GET /api/v1/events/{eventId}/attendees | Frontend Developer | 2 | T8 |
| EM-ATTENDEE-001-T19 | Handle loading state with skeleton loader | Frontend Developer | 1.5 | T18 |
| EM-ATTENDEE-001-T20 | Handle empty state (no attendees yet) | Frontend Developer | 1.5 | T18 |
| EM-ATTENDEE-001-T21 | Add navigation link to attendees from event dashboard | Frontend Developer | 1 | None |
| EM-ATTENDEE-001-T22 | Write unit tests for getEventAttendees() | QA Engineer | 2.5 | T3 |
| EM-ATTENDEE-001-T23 | Test pagination logic | QA Engineer | 1.5 | T22 |
| EM-ATTENDEE-001-T24 | Test sorting | QA Engineer | 1 | T22 |
| EM-ATTENDEE-001-T25 | Write integration test for attendees endpoint | QA Engineer | 2 | T8 |
| EM-ATTENDEE-001-T26 | Test authorization (ORGANIZER can access) | QA Engineer | 1 | T10 |
| EM-ATTENDEE-001-T27 | Manual testing of attendee list page | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~49 hours

---

## EM-ATTENDEE-002: Search Attendees

**User Story:** As an organizer, I want to search for attendees by name or email, so that I can quickly find specific attendees.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 6  
**Dependencies:** EM-ATTENDEE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-002-T1 | Add search method to TicketRepository | Backend Developer | 2 | EM-TICKET-GEN-001-T11 |
| EM-ATTENDEE-002-T2 | Implement: searchByEventAndNameOrEmail(eventId, searchTerm) | Backend Developer | 2.5 | T1 |
| EM-ATTENDEE-002-T3 | Query: WHERE event_id = :id AND (LOWER(attendee_name) LIKE :term OR LOWER(attendee_email) LIKE :term) | Backend Developer | 2 | T2 |
| EM-ATTENDEE-002-T4 | Update AttendeeService.getEventAttendees() to accept search param | Backend Developer | 2 | EM-ATTENDEE-001-T3 |
| EM-ATTENDEE-002-T5 | If search provided, use search query; otherwise use getAll | Backend Developer | 1.5 | T4 |
| EM-ATTENDEE-002-T6 | Update GET /api/v1/events/{eventId}/attendees to accept ?search={term} | Backend Developer | 1 | EM-ATTENDEE-001-T8 |
| EM-ATTENDEE-002-T7 | Add search input field to attendees page | Frontend Developer | 2 | EM-ATTENDEE-001-T13 |
| EM-ATTENDEE-002-T8 | Implement debounced search (300ms delay) | Frontend Developer | 1.5 | T7 |
| EM-ATTENDEE-002-T9 | Call API with search parameter on input change | Frontend Developer | 1.5 | T6 |
| EM-ATTENDEE-002-T10 | Update table with filtered results | Frontend Developer | 1 | T9 |
| EM-ATTENDEE-002-T11 | Display "No attendees found" if search returns empty | Frontend Developer | 1 | T9 |
| EM-ATTENDEE-002-T12 | Add clear search button | Frontend Developer | 1 | T7 |
| EM-ATTENDEE-002-T13 | Show search result count | Frontend Developer | 1 | T9 |
| EM-ATTENDEE-002-T14 | Write unit tests for search functionality | QA Engineer | 2 | T4 |
| EM-ATTENDEE-002-T15 | Test search by name | QA Engineer | 1 | T14 |
| EM-ATTENDEE-002-T16 | Test search by email | QA Engineer | 1 | T14 |
| EM-ATTENDEE-002-T17 | Test partial matches | QA Engineer | 1 | T14 |
| EM-ATTENDEE-002-T18 | Write integration test for search endpoint | QA Engineer | 2 | T6 |
| EM-ATTENDEE-002-T19 | Manual testing of search functionality | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~28 hours

---

## EM-ATTENDEE-003: Filter Attendees by Ticket Category

**User Story:** As an organizer, I want to filter attendees by ticket category, so that I can see attendees for specific ticket types.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 7  
**Dependencies:** EM-ATTENDEE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-003-T1 | Update AttendeeService to accept categoryId filter | Backend Developer | 2 | EM-ATTENDEE-001-T3 |
| EM-ATTENDEE-003-T2 | Add WHERE clause: ticket_category_id = :categoryId | Backend Developer | 1.5 | T1 |
| EM-ATTENDEE-003-T3 | Make filter optional (null = all categories) | Backend Developer | 1 | T1 |
| EM-ATTENDEE-003-T4 | Update GET /api/v1/events/{eventId}/attendees to accept ?categoryId={id} | Backend Developer | 1 | EM-ATTENDEE-001-T8 |
| EM-ATTENDEE-003-T5 | Add category filter dropdown to attendees page | Frontend Developer | 2.5 | EM-ATTENDEE-001-T13 |
| EM-ATTENDEE-003-T6 | Fetch list of categories for event | Frontend Developer | 1.5 | T5 |
| EM-ATTENDEE-003-T7 | Populate dropdown with category names | Frontend Developer | 1.5 | T6 |
| EM-ATTENDEE-003-T8 | Add "All Categories" option | Frontend Developer | 1 | T5 |
| EM-ATTENDEE-003-T9 | Call API with categoryId on dropdown change | Frontend Developer | 1.5 | T4 |
| EM-ATTENDEE-003-T10 | Update table with filtered results | Frontend Developer | 1 | T9 |
| EM-ATTENDEE-003-T11 | Display count of attendees per category | Frontend Developer | 1.5 | T9 |
| EM-ATTENDEE-003-T12 | Combine with search filter (both should work together) | Frontend Developer | 2 | EM-ATTENDEE-002-T9 |
| EM-ATTENDEE-003-T13 | Write unit tests for category filtering | QA Engineer | 2 | T1 |
| EM-ATTENDEE-003-T14 | Test filtering by each category | QA Engineer | 1.5 | T13 |
| EM-ATTENDEE-003-T15 | Test "All Categories" option | QA Engineer | 1 | T13 |
| EM-ATTENDEE-003-T16 | Write integration test for filter endpoint | QA Engineer | 2 | T4 |
| EM-ATTENDEE-003-T17 | Test combined search and category filter | QA Engineer | 1.5 | T12 |
| EM-ATTENDEE-003-T18 | Manual testing of filter functionality | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~27 hours

---

## EM-ATTENDEE-004: Filter Attendees by Check-In Status

**User Story:** As an organizer, I want to filter attendees by check-in status, so that I can see who has and hasn't checked in.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 7  
**Dependencies:** EM-ATTENDEE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-004-T1 | Update AttendeeService to accept checkedIn filter | Backend Developer | 2 | EM-ATTENDEE-001-T3 |
| EM-ATTENDEE-004-T2 | Add WHERE clause: checked_in = :status | Backend Developer | 1 | T1 |
| EM-ATTENDEE-004-T3 | Support three states: all, checked_in, not_checked_in | Backend Developer | 1.5 | T1 |
| EM-ATTENDEE-004-T4 | Update GET /api/v1/events/{eventId}/attendees to accept ?checkedIn={status} | Backend Developer | 1 | EM-ATTENDEE-001-T8 |
| EM-ATTENDEE-004-T5 | Add check-in status filter dropdown/buttons | Frontend Developer | 2.5 | EM-ATTENDEE-001-T13 |
| EM-ATTENDEE-004-T6 | Options: "All", "Checked In", "Not Checked In" | Frontend Developer | 1.5 | T5 |
| EM-ATTENDEE-004-T7 | Style as button group or dropdown | Frontend Developer | 1.5 | T5 |
| EM-ATTENDEE-004-T8 | Call API with checkedIn parameter on selection | Frontend Developer | 1.5 | T4 |
| EM-ATTENDEE-004-T9 | Update table with filtered results | Frontend Developer | 1 | T8 |
| EM-ATTENDEE-004-T10 | Display count for each status | Frontend Developer | 1.5 | T8 |
| EM-ATTENDEE-004-T11 | Combine with search and category filters | Frontend Developer | 2 | EM-ATTENDEE-003-T12 |
| EM-ATTENDEE-004-T12 | Write unit tests for check-in status filtering | QA Engineer | 2 | T1 |
| EM-ATTENDEE-004-T13 | Test filtering "Checked In" | QA Engineer | 1 | T12 |
| EM-ATTENDEE-004-T14 | Test filtering "Not Checked In" | QA Engineer | 1 | T12 |
| EM-ATTENDEE-004-T15 | Test "All" option | QA Engineer | 1 | T12 |
| EM-ATTENDEE-004-T16 | Write integration test for filter endpoint | QA Engineer | 2 | T4 |
| EM-ATTENDEE-004-T17 | Test combined filters (category + check-in + search) | QA Engineer | 2 | T11 |
| EM-ATTENDEE-004-T18 | Manual testing of filter functionality | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~27 hours

---

## EM-ATTENDEE-005: Export Attendee List to CSV

**User Story:** As an organizer, I want to export the attendee list to CSV, so that I can use the data in other applications.

**Priority:** Should Have  
**Story Points:** 5  
**Sprint:** 7  
**Dependencies:** EM-ATTENDEE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-005-T1 | Add Apache Commons CSV dependency | Backend Developer | 0.5 | None |
| EM-ATTENDEE-005-T2 | Create CSVExportService | Backend Developer | 2.5 | None |
| EM-ATTENDEE-005-T3 | Implement exportAttendeesToCSV(eventId, filters) method | Backend Developer | 4 | T2 |
| EM-ATTENDEE-005-T4 | Fetch attendees based on filters (no pagination for export) | Backend Developer | 2 | EM-ATTENDEE-001-T3 |
| EM-ATTENDEE-005-T5 | Create CSV header row | Backend Developer | 1 | T3 |
| EM-ATTENDEE-005-T6 | Headers: Name, Email, Phone, Ticket Category, Ticket Code, Check-In Status, Check-In Time | Backend Developer | 1.5 | T5 |
| EM-ATTENDEE-005-T7 | Write data rows for each attendee | Backend Developer | 2 | T3 |
| EM-ATTENDEE-005-T8 | Format check-in time as readable date/time | Backend Developer | 1 | T7 |
| EM-ATTENDEE-005-T9 | Handle null values (e.g., no check-in time) | Backend Developer | 1 | T7 |
| EM-ATTENDEE-005-T10 | Return CSV as byte array or stream | Backend Developer | 1.5 | T3 |
| EM-ATTENDEE-005-T11 | Create GET /api/v1/events/{eventId}/attendees/export endpoint | Backend Developer | 2 | T3 |
| EM-ATTENDEE-005-T12 | Accept same filter params as list endpoint | Backend Developer | 1.5 | T11 |
| EM-ATTENDEE-005-T13 | Set response content-type: text/csv | Backend Developer | 1 | T11 |
| EM-ATTENDEE-005-T14 | Set Content-Disposition: attachment; filename="attendees_{eventName}.csv" | Backend Developer | 1.5 | T11 |
| EM-ATTENDEE-005-T15 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T11 |
| EM-ATTENDEE-005-T16 | Add "Export CSV" button to attendees page | Frontend Developer | 1.5 | EM-ATTENDEE-001-T13 |
| EM-ATTENDEE-005-T17 | Position button near search/filters | Frontend Developer | 1 | T16 |
| EM-ATTENDEE-005-T18 | Call GET /api/v1/events/{eventId}/attendees/export with current filters | Frontend Developer | 2 | T11 |
| EM-ATTENDEE-005-T19 | Trigger browser download of CSV file | Frontend Developer | 2 | T18 |
| EM-ATTENDEE-005-T20 | Display loading indicator during export | Frontend Developer | 1 | T18 |
| EM-ATTENDEE-005-T21 | Handle large exports (>1000 attendees) with progress indication | Frontend Developer | 2.5 | T18 |
| EM-ATTENDEE-005-T22 | Show success message after download | Frontend Developer | 1 | T19 |
| EM-ATTENDEE-005-T23 | Handle export errors | Frontend Developer | 1.5 | T18 |
| EM-ATTENDEE-005-T24 | Write unit tests for CSVExportService | QA Engineer | 3 | T2 |
| EM-ATTENDEE-005-T25 | Test CSV generation with various attendee data | QA Engineer | 2 | T24 |
| EM-ATTENDEE-005-T26 | Test CSV format (headers, data, escaping) | QA Engineer | 1.5 | T24 |
| EM-ATTENDEE-005-T27 | Write integration test for export endpoint | QA Engineer | 2.5 | T11 |
| EM-ATTENDEE-005-T28 | Test export with filters applied | QA Engineer | 2 | T27 |
| EM-ATTENDEE-005-T29 | Verify exported CSV can be opened in Excel/Google Sheets | QA Engineer | 1.5 | T27 |
| EM-ATTENDEE-005-T30 | Test export with large dataset (1000+ attendees) | QA Engineer | 2 | T27 |
| EM-ATTENDEE-005-T31 | Manual testing of CSV export flow | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~55 hours

---

## EM-ATTENDEE-006: Resend Ticket Email

**User Story:** As an organizer, I want to resend ticket emails to attendees, so that I can help attendees who didn't receive their original email.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 7  
**Dependencies:** EM-TICKET-GEN-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-006-T1 | Implement EmailService.resendTicketEmail(orderId) method | Backend Developer | 2.5 | EM-TICKET-GEN-004-T6 |
| EM-ATTENDEE-006-T2 | Fetch order with attendee email and PDF path | Backend Developer | 1.5 | T1 |
| EM-ATTENDEE-006-T3 | Reuse existing email sending logic from sendTicketEmail() | Backend Developer | 1 | T1 |
| EM-ATTENDEE-006-T4 | Add note in email: "This is a resent ticket email" | Backend Developer | 1 | T3 |
| EM-ATTENDEE-006-T5 | Log resend action for audit | Backend Developer | 1 | T1 |
| EM-ATTENDEE-006-T6 | Create POST /api/v1/orders/{orderId}/resend-email endpoint | Backend Developer | 1.5 | T1 |
| EM-ATTENDEE-006-T7 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T6 |
| EM-ATTENDEE-006-T8 | Verify organizer has access to order's event | Backend Developer | 1.5 | T6 |
| EM-ATTENDEE-006-T9 | Return success message after email sent | Backend Developer | 1 | T6 |
| EM-ATTENDEE-006-T10 | Handle email sending errors gracefully | Backend Developer | 1.5 | T6 |
| EM-ATTENDEE-006-T11 | Add "Resend Email" button/action to attendee list | Frontend Developer | 2 | EM-ATTENDEE-001-T14 |
| EM-ATTENDEE-006-T12 | Add icon button in actions column | Frontend Developer | 1.5 | T11 |
| EM-ATTENDEE-006-T13 | Show confirmation modal before resending | Frontend Developer | 2 | T11 |
| EM-ATTENDEE-006-T14 | Modal text: "Resend ticket email to {attendee_email}?" | Frontend Developer | 1 | T13 |
| EM-ATTENDEE-006-T15 | Call POST /api/v1/orders/{orderId}/resend-email on confirm | Frontend Developer | 1.5 | T6 |
| EM-ATTENDEE-006-T16 | Display success toast: "Email resent to {email}" | Frontend Developer | 1 | T15 |
| EM-ATTENDEE-006-T17 | Display error toast if resend fails | Frontend Developer | 1 | T15 |
| EM-ATTENDEE-006-T18 | Disable button while email is being sent | Frontend Developer | 1 | T15 |
| EM-ATTENDEE-006-T19 | Add "Resend Email" option to attendee details page (if exists) | Frontend Developer | 1.5 | None |
| EM-ATTENDEE-006-T20 | Write unit tests for resendTicketEmail() | QA Engineer | 2 | T1 |
| EM-ATTENDEE-006-T21 | Test email resending logic | QA Engineer | 1.5 | T20 |
| EM-ATTENDEE-006-T22 | Write integration test for resend endpoint | QA Engineer | 2 | T6 |
| EM-ATTENDEE-006-T23 | Test authorization (only ORGANIZER can resend) | QA Engineer | 1 | T7 |
| EM-ATTENDEE-006-T24 | Verify email actually sent (use Mailtrap) | QA Engineer | 1.5 | T22 |
| EM-ATTENDEE-006-T25 | Manual testing of resend email flow | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~35 hours

---

## EM-ATTENDEE-007: View Individual Attendee Details

**User Story:** As an organizer, I want to view detailed information about a specific attendee, so that I can access all their ticket and order information.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 7  
**Dependencies:** EM-ATTENDEE-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-ATTENDEE-007-T1 | Create AttendeeDetailDTO with comprehensive info | Backend Developer | 1.5 | None |
| EM-ATTENDEE-007-T2 | Fields: attendee info, all tickets, order details, event info, check-in history | Backend Developer | 1.5 | T1 |
| EM-ATTENDEE-007-T3 | Implement AttendeeService.getAttendeeDetails(ticketId) | Backend Developer | 3 | None |
| EM-ATTENDEE-007-T4 | Fetch ticket with all related entities (order, event, category) | Backend Developer | 2 | T3 |
| EM-ATTENDEE-007-T5 | Fetch all tickets for same order (if multiple) | Backend Developer | 1.5 | T4 |
| EM-ATTENDEE-007-T6 | Map to AttendeeDetailDTO | Backend Developer | 1.5 | T4 |
| EM-ATTENDEE-007-T7 | Create GET /api/v1/attendees/{ticketId} endpoint | Backend Developer | 1.5 | T3 |
| EM-ATTENDEE-007-T8 | Add @PreAuthorize("hasRole('ORGANIZER')") | Backend Developer | 0.5 | T7 |
| EM-ATTENDEE-007-T9 | Verify organizer has access to event | Backend Developer | 1.5 | T7 |
| EM-ATTENDEE-007-T10 | Return AttendeeDetailDTO | Backend Developer | 1 | T7 |
| EM-ATTENDEE-007-T11 | Create attendee details page/modal component | Frontend Developer | 4 | None |
| EM-ATTENDEE-007-T12 | Display attendee information (name, email, phone) | Frontend Developer | 2 | T11 |
| EM-ATTENDEE-007-T13 | Display order information (order ID, total, date) | Frontend Developer | 2 | T11 |
| EM-ATTENDEE-007-T14 | Display all tickets in order | Frontend Developer | 2.5 | T11 |
| EM-ATTENDEE-007-T15 | Show check-in status for each ticket | Frontend Developer | 1.5 | T14 |
| EM-ATTENDEE-007-T16 | Add "View Details" link/button in attendee list | Frontend Developer | 1.5 | EM-ATTENDEE-001-T14 |
| EM-ATTENDEE-007-T17 | Navigate to details page or open modal on click | Frontend Developer | 1.5 | T16 |
| EM-ATTENDEE-007-T18 | Call GET /api/v1/attendees/{ticketId} | Frontend Developer | 1.5 | T7 |
| EM-ATTENDEE-007-T19 | Add actions: Resend Email, Download PDF | Frontend Developer | 2 | T11 |
| EM-ATTENDEE-007-T20 | Add breadcrumb navigation back to list | Frontend Developer | 1 | T11 |
| EM-ATTENDEE-007-T21 | Write unit tests for getAttendeeDetails() | QA Engineer | 2 | T3 |
| EM-ATTENDEE-007-T22 | Test data completeness | QA Engineer | 1.5 | T21 |
| EM-ATTENDEE-007-T23 | Write integration test for details endpoint | QA Engineer | 2 | T7 |
| EM-ATTENDEE-007-T24 | Test authorization | QA Engineer | 1 | T8 |
| EM-ATTENDEE-007-T25 | Manual testing of attendee details view | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~42 hours

---

# PART 4 SUMMARY

## Epic 7: Basic Check-In System
**User Stories:** 6  
**Total Tasks:** ~73 tasks  
**Total Hours:** ~314 hours  

## Epic 8: Attendee Management
**User Stories:** 7  
**Total Tasks:** ~72 tasks  
**Total Hours:** ~263 hours  

## PART 4 TOTALS
**User Stories:** 13  
**Total Tasks:** ~145 tasks  
**Total Estimated Hours:** ~577 hours  

---

**Notes:**
- Check-in system designed for web-based manual entry (QR scanning deferred to post-MVP)
- Optimistic locking prevents race conditions in check-in
- Mobile-responsive design critical for on-site check-in operators
- CSV export supports all current filters for flexible data extraction
- Attendee search supports both name and email (case-insensitive)
- Email resending uses existing email infrastructure with audit logging

**Key Features:**
- Real-time check-in validation
- Duplicate check-in prevention (database and application level)
- Mobile-friendly interface for tablets/phones
- Comprehensive attendee filtering (category, status, search)
- CSV export for external analysis
- Audit trail for all check-in activities

**Next:** Part 5 will cover Epics 9-10 (Reporting & Public Event Flow) - FINAL PART!

