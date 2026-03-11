# Event Management SaaS - Product Vision & Scope
## Lean MVP for 16-Week Capstone Project

---

**Project Name:** Multi-Tenant Event Ticketing & Management SaaS Platform  
**Duration:** 16 weeks (8 sprints × 2 weeks)  
**Team Velocity:** 30-35 story points per sprint  
**Total Story Points:** ~260-280 points  
**Total User Stories:** 70 stories  
**Total Epics:** 10 epics  

---

# 1. PRODUCT VISION

## Vision Statement

**To build a cloud-native, multi-tenant SaaS platform that enables event organizers to efficiently create, manage, and sell tickets for their events while maintaining complete data isolation and security between organizations.**

## Product Goals

### Business Goals
- Enable event organizers to manage end-to-end event lifecycle from a single platform
- Provide seamless ticket purchasing experience for attendees
- Ensure secure payment processing and ticket delivery
- Deliver real-time inventory management to prevent overselling
- Provide actionable insights through reporting and analytics

### Technical Goals
- Demonstrate multi-tenant SaaS architecture with PostgreSQL Row-Level Security
- Implement microservices design pattern with at least 2 independent services
- Build RESTful APIs following industry best practices
- Integrate external payment gateway (Stripe)
- Ensure secure authentication and authorization (JWT + RBAC)
- Deploy containerized application to cloud platform

### Learning Outcomes
Students will demonstrate:
- Multi-tenant architecture design and implementation
- Concurrent data management with database locks
- Time-based business logic (reservation expiration)
- Payment gateway integration
- PDF generation and QR code handling
- Full-stack development (Spring Boot + Angular)
- Cloud deployment and containerization

## Success Criteria

### MVP Success Metrics
- ✅ User can register organization and create events
- ✅ User can create ticket categories with inventory limits
- ✅ Public user can browse and purchase tickets
- ✅ Payment successfully processes through Stripe
- ✅ Tickets are automatically emailed with QR codes
- ✅ Check-in operator can validate tickets
- ✅ Organizer can view attendees and basic reports
- ✅ Multi-tenant data isolation verified (no cross-organization data access)
- ✅ Concurrent purchases do not cause overselling

### Technical Quality Metrics
- Test coverage > 60%
- API documentation complete (Swagger/OpenAPI)
- Application containerized with Docker
- Successfully deployed to cloud platform
- All APIs respond within 2 seconds under normal load

---

# 2. PRODUCT PERSONAS

## System Administrator (SYSTEM_ADMIN)
**Name:** Alex Platform Admin  
**Role:** Platform administrator managing all organizations  

**Goals:**
- Monitor platform health
- Manage organization accounts
- Resolve technical issues
- Ensure data isolation between tenants

**Key Activities:**
- Create and configure organizations
- Assign organization owners
- Monitor system usage
- Troubleshoot platform issues

---

## Organization Owner (OWNER)
**Name:** Maria Event Company Owner  
**Role:** Owner of an event management company using the platform  

**Goals:**
- Manage organization profile and settings
- Add team members to organization
- Configure payment gateway
- Oversee all events in organization

**Key Activities:**
- Configure Stripe API keys
- Invite organizers and check-in operators
- Review revenue across all events
- Manage organization branding

---

## Event Organizer (ORGANIZER)
**Name:** David Conference Organizer  
**Role:** Person responsible for creating and managing individual events  

**Goals:**
- Create compelling events
- Sell maximum tickets
- Track sales in real-time
- Ensure smooth event check-in

**Key Activities:**
- Create events with descriptions and images
- Set up ticket categories and pricing
- Monitor ticket sales
- Manage attendee information
- View sales reports

---

## Check-In Operator (CHECK_IN_OPERATOR)
**Name:** Sarah Check-In Staff  
**Role:** On-site staff validating tickets at event entrance  

**Goals:**
- Quickly validate tickets
- Prevent fraudulent entry
- Track check-in progress

**Key Activities:**
- Scan/enter ticket codes
- Validate ticket authenticity
- Mark attendees as checked-in
- Monitor check-in statistics

---

## Attendee (Public User)
**Name:** John Event Attendee  
**Role:** Person purchasing tickets to attend an event  

**Goals:**
- Discover interesting events
- Purchase tickets quickly and securely
- Receive tickets immediately
- Access tickets easily on event day

**Key Activities:**
- Browse public events
- Select ticket types
- Complete checkout
- Receive ticket via email
- Present ticket at event

---

# 3. MVP SCOPE SUMMARY

## Features INCLUDED in MVP

### Core Platform
✅ Multi-tenant architecture with PostgreSQL RLS  
✅ JWT-based authentication  
✅ Role-based access control (SYSTEM_ADMIN, OWNER, ORGANIZER, CHECK_IN_OPERATOR)  
✅ Organization registration and management  

### Event Management
✅ Create, edit, view events  
✅ Event listing and search  
✅ Public/private visibility  
✅ Single event image upload  
✅ Basic event cancellation  

### Ticketing
✅ Ticket categories with pricing  
✅ Inventory management with real-time tracking  
✅ Sales period configuration  
✅ Free ticket support  
✅ Concurrent purchase handling  

### Purchase Flow
✅ 15-minute reservation system  
✅ Shopping cart functionality  
✅ Attendee information collection  
✅ Stripe payment integration  
✅ Order confirmation  

### Ticket Delivery
✅ QR code generation  
✅ PDF ticket creation  
✅ Email delivery  
✅ Ticket viewing page  

### Check-In
✅ Web-based check-in interface  
✅ Manual ticket code entry  
✅ Real-time validation  
✅ Check-in statistics  

### Management
✅ Attendee list with search/filters  
✅ CSV export  
✅ Resend ticket email  
✅ Basic dashboard with sales metrics  
✅ Sales and check-in reports  

### APIs
✅ RESTful API design  
✅ Swagger/OpenAPI documentation  
✅ Proper error handling  
✅ Request validation  

---

## Features DEFERRED to Post-MVP

### Payment
❌ Multiple payment gateways (PayPal, Mollie)  
❌ Bank transfer support  
❌ Refund processing  
❌ Payment analytics  

### Ticketing
❌ Promo codes and discounts  
❌ Waiting queue system  
❌ Tax/VAT configuration  
❌ Dynamic pricing  
❌ Ticket bundling  

### Communication
❌ Email templates customization  
❌ Mass email campaigns  
❌ Scheduled reminders  
❌ Email delivery tracking  

### Advanced Features
❌ Additional services/add-ons  
❌ Multi-day events  
❌ QR code camera scanning  
❌ Offline check-in  
❌ Badge printing  
❌ Mobile apps  
❌ Advanced analytics with charts  
❌ Invoice generation  
❌ Multi-language support  
❌ GDPR compliance features  

---

# 4. EPIC SUMMARY

| Epic # | Epic Name | Story Points | Sprints | Stories |
|--------|-----------|--------------|---------|---------|
| 1 | Multi-Tenant Foundation & Authentication | 38 | 1-2 | 8 |
| 2 | Event Management (Core) | 30 | 2-3 | 7 |
| 3 | Ticket Category & Inventory Management | 26 | 3 | 6 |
| 4 | Reservation & Checkout System | 40 | 4-5 | 9 |
| 5 | Payment Processing (Stripe) | 30 | 5 | 7 |
| 6 | Ticket Issuance & QR Code Generation | 26 | 5-6 | 6 |
| 7 | Basic Check-In System | 22 | 6 | 6 |
| 8 | Attendee Management | 20 | 6-7 | 7 |
| 9 | Basic Reporting & Dashboard | 23 | 7 | 7 |
| 10 | Public Event Listing & Purchase Flow | 30 | 3-5 | 8 |
| **TOTAL** | | **~285** | **8** | **70** |

