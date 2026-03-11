# Sprint Plan - 8 Sprints Over 16 Weeks
## Event Management SaaS MVP

---

**Sprint Duration:** 2 weeks  
**Total Sprints:** 8  
**Team Velocity:** 30-35 story points per sprint  
**Total Duration:** 16 weeks  

---

# SPRINT OVERVIEW

| Sprint | Weeks | Points | Epics | Sprint Goal |
|--------|-------|--------|-------|-------------|
| Sprint 1 | 1-2 | 32 | Epic 1 (Part) | Multi-tenant foundation and authentication |
| Sprint 2 | 3-4 | 33 | Epic 1, 2 | Complete auth, event CRUD |
| Sprint 3 | 5-6 | 35 | Epic 2, 3, 10 (Part) | Tickets, inventory, public pages |
| Sprint 4 | 7-8 | 38 | Epic 4, 10 (Part) | Reservation system |
| Sprint 5 | 9-10 | 40 | Epic 4, 5, 6 (Part) | Payments and ticket generation |
| Sprint 6 | 11-12 | 32 | Epic 6, 7, 8 (Part) | Check-in and attendees |
| Sprint 7 | 13-14 | 28 | Epic 8, 9 | Reporting and final features |
| Sprint 8 | 15-16 | 22 | Testing, Deploy | Testing, deployment, documentation |

**Total Story Points:** 260

---

# SPRINT 1: Multi-Tenant Foundation (Weeks 1-2)

## Sprint Goal
Establish multi-tenant database architecture with PostgreSQL RLS, implement JWT authentication, and create basic user/organization management.

## Story Points: 32

## User Stories
1. **EM-AUTH-001:** Register organization (5 pts)
2. **EM-AUTH-002:** User login with JWT (5 pts)
3. **EM-AUTH-003:** Enforce Row-Level Security (8 pts)
4. **EM-AUTH-008:** Set organization context per request (5 pts)
5. **TECH-001:** Setup project structure and dependencies (5 pts)
6. **TECH-002:** Configure PostgreSQL and Flyway (2 pts)
7. **TECH-003:** Setup Angular project and routing (2 pts)

## Key Deliverables
- ✅ Working multi-tenant database with RLS policies
- ✅ User registration and login functionality
- ✅ JWT token generation and validation
- ✅ Organization context propagation
- ✅ Basic Angular app structure
- ✅ Project CI/CD pipeline configured

## Sprint Success Criteria
- All acceptance criteria met for committed stories
- Unit tests passing with >60% coverage
- Integration tests for RLS passing
- User can register organization and log in
- RLS prevents cross-organization data access
- Code reviewed and merged to main branch

## Risks & Mitigation
- **Risk:** RLS complexity may cause delays
  - **Mitigation:** Allocate extra time for RLS testing, start early
- **Risk:** Team unfamiliar with JWT
  - **Mitigation:** Pair programming, reference documentation

---

# SPRINT 2: Authentication & Event Management (Weeks 3-4)

## Sprint Goal
Complete authentication features and implement core event creation and management capabilities.

## Story Points: 33

## User Stories
1. **EM-AUTH-004:** View organization profile (3 pts)
2. **EM-AUTH-005:** Add users to organization (5 pts)
3. **EM-AUTH-006:** Switch between organizations (5 pts)
4. **EM-AUTH-007:** Role-based authorization (5 pts)
5. **EM-EVENT-001:** Create new event (5 pts)
6. **EM-EVENT-002:** Upload event image (3 pts)
7. **EM-EVENT-003:** View event list (3 pts)
8. **EM-EVENT-005:** Edit event details (3 pts)

## Key Deliverables
- ✅ Complete user/organization management
- ✅ RBAC implementation with method-level security
- ✅ Event CRUD operations
- ✅ Event image upload working
- ✅ Admin event list page functional

## Sprint Success Criteria
- Organizer can create, view, edit events
- Role-based authorization prevents unauthorized access
- API documentation updated (Swagger)
- Frontend event management working
- Deployed to dev environment

## Dependencies
- Sprint 1 completion required

---

# SPRINT 3: Tickets & Public Pages (Weeks 5-6)

## Sprint Goal
Implement ticket category management with real-time inventory control and build public event listing pages.

## Story Points: 35

## User Stories
1. **EM-EVENT-004:** Search events by title (2 pts)
2. **EM-EVENT-006:** Set event visibility (2 pts)
3. **EM-EVENT-007:** Cancel event (3 pts)
4. **EM-TICKET-001:** Create ticket categories (5 pts)
5. **EM-TICKET-002:** Set sales periods (3 pts)
6. **EM-TICKET-003:** Track ticket availability (5 pts)
7. **EM-TICKET-004:** Prevent overselling with locks (8 pts)
8. **EM-PUBLIC-001:** Browse public events (3 pts)
9. **EM-PUBLIC-002:** View event details (3 pts)

## Key Deliverables
- ✅ Ticket category system operational
- ✅ Real-time inventory tracking
- ✅ Concurrency control with database locks
- ✅ Public event listing page
- ✅ Public event detail page
- ✅ Load testing for concurrent purchases

## Sprint Success Criteria
- Concurrent purchase tests pass (no overselling)
- Public pages responsive on mobile
- Load test with 50 concurrent users passes
- All APIs documented

## Testing Focus
- **Critical:** Concurrent ticket purchase testing
- **Performance:** Load testing ticket availability

---

# SPRINT 4: Reservation System (Weeks 7-8)

## Sprint Goal
Build shopping cart reservation system with 15-minute expiration and complete checkout flow.

## Story Points: 38

## User Stories
1. **EM-TICKET-005:** View ticket sales by category (3 pts)
2. **EM-TICKET-006:** Edit ticket categories (2 pts)
3. **EM-RESERVE-001:** Add tickets to reservation (8 pts)
4. **EM-RESERVE-002:** Auto-expire reservations (8 pts)
5. **EM-RESERVE-003:** Countdown timer (3 pts)
6. **EM-RESERVE-004:** Enter attendee information (5 pts)
7. **EM-RESERVE-007:** Show sold out status (2 pts)
8. **EM-RESERVE-008:** Validate reservation quantities (3 pts)
9. **EM-PUBLIC-003:** Select ticket quantities (5 pts)
10. **EM-PUBLIC-004:** Real-time availability (3 pts)

## Key Deliverables
- ✅ Working reservation system with expiration
- ✅ Scheduled job for cleanup (runs every minute)
- ✅ Checkout page with attendee form
- ✅ Ticket selection UI with real-time updates
- ✅ Frontend countdown timer functional

## Sprint Success Criteria
- Reservations expire after 15 minutes
- Expired reservations release inventory
- Countdown timer accurate
- Attendee form validation working
- No reservations persist beyond expiration

## Technical Challenges
- Scheduled job implementation (@Scheduled)
- Race condition handling in expiration
- Frontend timer synchronization with backend

---

# SPRINT 5: Payment & Ticket Generation (Weeks 9-10)

## Sprint Goal
Integrate Stripe payment processing and implement ticket/QR code generation with email delivery.

## Story Points: 40

## User Stories
1. **EM-RESERVE-005:** Review order summary (3 pts)
2. **EM-RESERVE-006:** Prevent expired checkout (3 pts)
3. **EM-RESERVE-009:** Accept terms and conditions (2 pts)
4. **EM-PAY-001:** Configure Stripe API keys (3 pts)
5. **EM-PAY-002:** Enter credit card details (5 pts)
6. **EM-PAY-003:** Create Payment Intent (5 pts)
7. **EM-PAY-004:** Confirm payment (5 pts)
8. **EM-PAY-005:** Create order on success (5 pts)
9. **EM-PAY-006:** Process Stripe webhooks (5 pts)
10. **EM-PAY-007:** Handle failed payments (2 pts)
11. **EM-TICKET-GEN-001:** Generate unique tickets (5 pts)
12. **EM-TICKET-GEN-002:** Generate QR codes (5 pts)
13. **EM-PUBLIC-005:** Reserve tickets (from Sprint 4 if needed) (0 pts - completed)
14. **EM-PUBLIC-006:** Complete checkout (0 pts - part of payment flow)

## Key Deliverables
- ✅ Stripe integration complete
- ✅ Payment webhook handling
- ✅ Order creation on successful payment
- ✅ Ticket generation with UUIDs
- ✅ QR code generation
- ✅ Complete end-to-end purchase flow

## Sprint Success Criteria
- Payment works with test cards
- Webhooks verified with signature
- Tickets generated automatically
- QR codes are scannable
- Failed payments handled gracefully
- Email configuration working

## Integration Testing
- Stripe test mode integration
- Test cards: 4242... (success), 4000 0000 0000 0002 (decline)
- Webhook signature verification

---

# SPRINT 6: Check-In & Attendee Management (Weeks 11-12)

## Sprint Goal
Implement check-in system and attendee management with PDF ticket generation and email delivery.

## Story Points: 32

## User Stories
1. **EM-TICKET-GEN-003:** Generate PDF tickets (8 pts)
2. **EM-TICKET-GEN-004:** Email tickets (5 pts)
3. **EM-TICKET-GEN-005:** View tickets online (3 pts)
4. **EM-TICKET-GEN-006:** Download ticket PDF (2 pts)
5. **EM-CHECKIN-001:** Validate ticket by code (5 pts)
6. **EM-CHECKIN-002:** Mark ticket as checked-in (5 pts)
7. **EM-CHECKIN-003:** Prevent duplicate check-ins (3 pts)
8. **EM-CHECKIN-004:** Check-in statistics (3 pts)
9. **EM-CHECKIN-005:** Mobile-friendly interface (3 pts)
10. **EM-ATTENDEE-001:** View attendee list (3 pts)
11. **EM-ATTENDEE-002:** Search attendees (2 pts)
12. **EM-PUBLIC-007:** Confirmation page (3 pts)

## Key Deliverables
- ✅ PDF ticket generation working
- ✅ Email ticket delivery functional
- ✅ Check-in web interface complete
- ✅ Duplicate check-in prevention
- ✅ Attendee list page
- ✅ My Tickets page for attendees

## Sprint Success Criteria
- PDFs render correctly across viewers
- Emails delivered successfully (test with Mailtrap)
- Check-in validation works
- Mobile responsive check-in interface
- Attendee list searchable

## Focus Areas
- PDF library integration (Apache PDFBox)
- Email configuration (JavaMail)
- Check-in UI optimization for mobile

---

# SPRINT 7: Reporting & Final Features (Weeks 13-14)

## Sprint Goal
Complete reporting dashboard, attendee management features, and polish remaining functionality.

## Story Points: 28

## User Stories
1. **EM-CHECKIN-006:** Search by attendee name (3 pts)
2. **EM-ATTENDEE-003:** Filter by ticket category (2 pts)
3. **EM-ATTENDEE-004:** Filter by check-in status (2 pts)
4. **EM-ATTENDEE-005:** Export attendee CSV (5 pts)
5. **EM-ATTENDEE-006:** Resend ticket email (3 pts)
6. **EM-ATTENDEE-007:** View attendee details (2 pts)
7. **EM-REPORT-001:** Event dashboard (5 pts)
8. **EM-REPORT-002:** Sales report (3 pts)
9. **EM-REPORT-003:** Check-in report (3 pts)
10. **EM-REPORT-004:** Export sales CSV (3 pts)
11. **EM-REPORT-005:** Sales by category (3 pts)
12. **EM-PUBLIC-008:** Search events (2 pts)

## Key Deliverables
- ✅ Complete attendee management features
- ✅ CSV export functionality
- ✅ Dashboard with key metrics
- ✅ Sales and check-in reports
- ✅ Event search functional
- ✅ All core features polished

## Sprint Success Criteria
- All reports display accurate data
- CSV exports working
- Dashboard shows real-time metrics
- Search functional on public pages
- No critical bugs remaining

## Polish Activities
- UI/UX improvements
- Performance optimization
- Bug fixes from earlier sprints

---

# SPRINT 8: Testing, Deployment & Documentation (Weeks 15-16)

## Sprint Goal
Comprehensive testing, bug fixes, cloud deployment, and complete documentation.

## Story Points: 22

## Tasks & Activities
1. **End-to-end testing** (5 pts)
   - Test complete user flows
   - Cross-browser testing
   - Mobile responsiveness testing

2. **Load testing and performance optimization** (5 pts)
   - JMeter load tests
   - Database query optimization
   - Frontend performance tuning

3. **Security testing** (4 pts)
   - OWASP Top 10 check
   - Dependency vulnerability scan
   - Penetration testing basics

4. **Bug fixes from testing** (4 pts)
   - Prioritized bug backlog
   - Critical and high-priority fixes

5. **API documentation completion** (2 pts)
   - Swagger/OpenAPI complete
   - All endpoints documented

6. **User guide creation** (2 pts)
   - Organizer guide
   - Attendee guide
   - Check-in operator guide

7. **Cloud deployment** (3 pts)
   - Deploy to Heroku/AWS
   - Configure environment variables
   - Database migration

8. **Docker setup** (2 pts)
   - Dockerfile optimization
   - Docker Compose for local dev

9. **Final code review and cleanup** (2 pts)
   - Code refactoring
   - Remove dead code
   - Code style consistency

10. **Demo preparation** (2 pts)
    - Demo script
    - Presentation slides
    - Video recording (optional)

## Key Deliverables
- ✅ Test coverage >60%
- ✅ Application deployed to cloud
- ✅ Complete API documentation
- ✅ User guides for all personas
- ✅ Docker setup documented
- ✅ Deployment guide written
- ✅ Demo ready for presentation

## Sprint Success Criteria
- All critical bugs fixed
- Performance benchmarks met:
  - API response < 2s
  - Page load < 3s
  - 50+ concurrent users supported
- Documentation complete
- Successfully deployed and accessible
- Demo rehearsed and ready

## Final Checklist
- [ ] All MVP features working
- [ ] No critical/high bugs open
- [ ] Test coverage target met
- [ ] Security scan passed
- [ ] Deployed to cloud
- [ ] Documentation complete
- [ ] Demo prepared
- [ ] Retrospective completed

---

# SPRINT CEREMONIES

## Sprint Planning (Every 2 weeks, Monday Week 1)
**Duration:** 2-3 hours

**Agenda:**
1. Review sprint goal
2. Review and estimate stories
3. Commit to sprint backlog
4. Create sprint plan
5. Identify dependencies and risks

**Participants:** Entire team

---

## Daily Standup (Every day, 15 minutes)
**Format:**
- What did you accomplish yesterday?
- What will you work on today?
- Any blockers or impediments?

**Participants:** Development team

---

## Sprint Review/Demo (Every 2 weeks, Friday Week 2)
**Duration:** 1-2 hours

**Agenda:**
1. Demo completed user stories
2. Gather feedback from stakeholders
3. Update product backlog based on feedback

**Participants:** Team + stakeholders (instructor, mentors)

---

## Sprint Retrospective (Every 2 weeks, Friday Week 2)
**Duration:** 1 hour

**Agenda:**
1. What went well?
2. What didn't go well?
3. What can we improve?
4. Action items for next sprint

**Participants:** Development team

---

## Backlog Refinement (Weekly, Wednesday)
**Duration:** 1 hour

**Agenda:**
1. Review upcoming stories
2. Add acceptance criteria
3. Estimate story points
4. Identify dependencies

**Participants:** Product Owner + development team

---

# VELOCITY TRACKING

## Expected Velocity by Sprint

| Sprint | Planned Points | Actual Points (TBD) | Variance (TBD) |
|--------|----------------|---------------------|----------------|
| Sprint 1 | 32 | ___ | ___ |
| Sprint 2 | 33 | ___ | ___ |
| Sprint 3 | 35 | ___ | ___ |
| Sprint 4 | 38 | ___ | ___ |
| Sprint 5 | 40 | ___ | ___ |
| Sprint 6 | 32 | ___ | ___ |
| Sprint 7 | 28 | ___ | ___ |
| Sprint 8 | 22 | ___ | ___ |
| **Total** | **260** | ___ | ___ |

## Velocity Adjustment Strategy
- After Sprint 2, reassess team velocity
- Adjust subsequent sprint commitments if needed
- Move lower-priority stories if velocity is lower than expected
- Add stretch goals if velocity is higher than expected

---

# DEPENDENCIES & RISKS

## Critical Dependencies
1. **Stripe Account** - Required by Sprint 5
   - Action: Create test account in Sprint 3
2. **Email Service** - Required by Sprint 6
   - Action: Configure Mailtrap/Gmail in Sprint 4
3. **Cloud Platform Access** - Required by Sprint 8
   - Action: Set up accounts in Sprint 6

## Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| RLS complexity causes delays | High | Medium | Extra time allocated, early start |
| Stripe integration issues | High | Low | Start early, use test mode extensively |
| Performance issues under load | Medium | Medium | Load testing in Sprint 4-5 |
| Team member unavailability | Medium | Low | Cross-training, pair programming |
| Scope creep | Medium | Medium | Strict adherence to MVP, defer to post-MVP |

---

**This sprint plan provides a detailed roadmap for the 16-week project. Adjust as needed based on team velocity and actual progress.**

