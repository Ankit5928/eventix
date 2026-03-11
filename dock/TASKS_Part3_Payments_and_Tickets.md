# TASK BREAKDOWN - PART 3
## Payments & Ticket Generation (Epics 5-6)

**Epics Covered:** 
- Epic 5: Payment Processing (Stripe) (7 stories)
- Epic 6: Ticket Issuance & QR Code Generation (6 stories)

**Total User Stories:** 13  
**Total Tasks:** ~160 tasks  
**Total Estimated Hours:** ~520-560 hours  

---

# EPIC 5: PAYMENT PROCESSING (STRIPE)

---

## EM-PAY-001: Configure Stripe API Keys

**User Story:** As an organization owner, I want to configure Stripe API keys, so that my organization can accept payments.

**Priority:** Must Have  
**Story Points:** 3  
**Sprint:** 5  
**Dependencies:** EM-AUTH-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-001-T1 | Add Stripe Java SDK dependency to build.gradle | Backend Developer | 0.5 | None |
| EM-PAY-001-T2 | Add columns to organizations table: stripe_publishable_key, stripe_secret_key (encrypted) | Database Engineer | 1.5 | None |
| EM-PAY-001-T3 | Create migration for payment configuration columns | Database Engineer | 1 | T2 |
| EM-PAY-001-T4 | Add encryption service for storing Stripe keys (AES-256) | Backend Developer | 4 | None |
| EM-PAY-001-T5 | Implement encrypt() and decrypt() methods | Backend Developer | 2 | T4 |
| EM-PAY-001-T6 | Store encryption key in environment variable | Backend Developer | 1 | T4 |
| EM-PAY-001-T7 | Update Organization entity with Stripe key fields | Backend Developer | 1.5 | T2 |
| EM-PAY-001-T8 | Create StripeConfigRequest DTO with publishable and secret keys | Backend Developer | 1 | None |
| EM-PAY-001-T9 | Implement OrganizationService.updateStripeConfig() | Backend Developer | 3 | EM-AUTH-001-T10 |
| EM-PAY-001-T10 | Encrypt secret key before storing | Backend Developer | 1.5 | T9, T4 |
| EM-PAY-001-T11 | Store publishable key in plain text (not sensitive) | Backend Developer | 0.5 | T9 |
| EM-PAY-001-T12 | Create PUT /api/v1/organizations/{orgId}/stripe-config endpoint | Backend Developer | 2 | T9 |
| EM-PAY-001-T13 | Add @PreAuthorize("hasRole('OWNER')") | Backend Developer | 0.5 | T12 |
| EM-PAY-001-T14 | Return success message after configuration | Backend Developer | 0.5 | T12 |
| EM-PAY-001-T15 | Create GET endpoint to retrieve publishable key only | Backend Developer | 1.5 | None |
| EM-PAY-001-T16 | Never expose secret key in API responses | Backend Developer | 1 | T15 |
| EM-PAY-001-T17 | Create Stripe configuration page in organization settings | Frontend Developer | 3 | None |
| EM-PAY-001-T18 | Add form with fields for publishable and secret keys | Frontend Developer | 2 | T17 |
| EM-PAY-001-T19 | Add input type="password" for secret key | Frontend Developer | 1 | T18 |
| EM-PAY-001-T20 | Add validation for key format (starts with pk_ or sk_) | Frontend Developer | 1.5 | T18 |
| EM-PAY-001-T21 | Call PUT endpoint on form submit | Frontend Developer | 1.5 | T12 |
| EM-PAY-001-T22 | Display success message after configuration | Frontend Developer | 1 | T21 |
| EM-PAY-001-T23 | Add link to Stripe documentation for obtaining keys | Frontend Developer | 1 | T17 |
| EM-PAY-001-T24 | Write unit tests for encryption service | QA Engineer | 3 | T4 |
| EM-PAY-001-T25 | Test encrypt and decrypt roundtrip | QA Engineer | 1.5 | T24 |
| EM-PAY-001-T26 | Write unit tests for updateStripeConfig() | QA Engineer | 2 | T9 |
| EM-PAY-001-T27 | Write integration test for configuration endpoint | QA Engineer | 2 | T12 |
| EM-PAY-001-T28 | Test authorization (only OWNER can configure) | QA Engineer | 1.5 | T13 |
| EM-PAY-001-T29 | Verify secret key is encrypted in database | QA Engineer | 2 | T10 |
| EM-PAY-001-T30 | Manual testing of Stripe configuration | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~48 hours

---

## EM-PAY-002: Enter Credit Card Details

**User Story:** As an attendee, I want to enter my credit card details securely, so that I can complete my purchase.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-001, EM-RESERVE-005

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-002-T1 | Add Stripe.js library to Angular project | Frontend Developer | 1 | None |
| EM-PAY-002-T2 | Load Stripe script from CDN: https://js.stripe.com/v3/ | Frontend Developer | 1 | T1 |
| EM-PAY-002-T3 | Initialize Stripe instance with publishable key | Frontend Developer | 1.5 | T2 |
| EM-PAY-002-T4 | Fetch publishable key from backend API | Frontend Developer | 1.5 | EM-PAY-001-T15 |
| EM-PAY-002-T5 | Create payment form component | Frontend Developer | 4 | None |
| EM-PAY-002-T6 | Create Stripe Elements container | Frontend Developer | 2 | T5 |
| EM-PAY-002-T7 | Mount Stripe Card Element in container | Frontend Developer | 2 | T6 |
| EM-PAY-002-T8 | Style Card Element to match application design | Frontend Developer | 2 | T7 |
| EM-PAY-002-T9 | Add custom CSS for Stripe Elements | Frontend Developer | 1.5 | T8 |
| EM-PAY-002-T10 | Handle card input change events | Frontend Developer | 1.5 | T7 |
| EM-PAY-002-T11 | Display validation errors from Stripe (invalid card, incomplete) | Frontend Developer | 2 | T10 |
| EM-PAY-002-T12 | Disable submit button until card is complete and valid | Frontend Developer | 1.5 | T10 |
| EM-PAY-002-T13 | Add billing address fields (optional for MVP) | Frontend Developer | 2 | T5 |
| EM-PAY-002-T14 | Display order summary above payment form | Frontend Developer | 2 | EM-RESERVE-005-T11 |
| EM-PAY-002-T15 | Show total amount to be charged | Frontend Developer | 1 | T14 |
| EM-PAY-002-T16 | Add "Pay ${amount}" button | Frontend Developer | 1 | T5 |
| EM-PAY-002-T17 | Create payment service in Angular | Frontend Developer | 2 | None |
| EM-PAY-002-T18 | IMPORTANT: Never send card data to backend directly | Frontend Developer | 0.5 | None |
| EM-PAY-002-T19 | All card data handled by Stripe.js client-side only | Frontend Developer | 0.5 | T7 |
| EM-PAY-002-T20 | Write frontend tests for payment form rendering | QA Engineer | 2 | T5 |
| EM-PAY-002-T21 | Test Stripe Elements mounting | QA Engineer | 1.5 | T7 |
| EM-PAY-002-T22 | Test validation error display | QA Engineer | 1.5 | T11 |
| EM-PAY-002-T23 | Test button disable/enable logic | QA Engineer | 1 | T12 |
| EM-PAY-002-T24 | Manual testing with Stripe test cards | QA Engineer | 2 | All tasks |
| EM-PAY-002-T25 | Document Stripe test card numbers (4242 4242 4242 4242) | QA Engineer | 1 | None |

**Total Story Effort:** ~45 hours

---

## EM-PAY-003: Create Payment Intent

**User Story:** As a system, I want to create a Stripe Payment Intent, so that payments are processed securely with SCA compliance.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-001, EM-PAY-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-003-T1 | Create database migration for `payments` table | Database Engineer | 2 | None |
| EM-PAY-003-T2 | Add columns: id, reservation_id, stripe_payment_intent_id, amount, currency, status, created_at | Database Engineer | 1.5 | T1 |
| EM-PAY-003-T3 | Add foreign key to reservations table | Database Engineer | 0.5 | T2 |
| EM-PAY-003-T4 | Add index on stripe_payment_intent_id | Database Engineer | 0.5 | T2 |
| EM-PAY-003-T5 | Create payment status enum: PENDING, SUCCEEDED, FAILED, CANCELLED | Database Engineer | 1 | T2 |
| EM-PAY-003-T6 | Create Payment JPA entity | Backend Developer | 2.5 | T1 |
| EM-PAY-003-T7 | Add @ManyToOne relationship to Reservation | Backend Developer | 1 | T6 |
| EM-PAY-003-T8 | Create PaymentRepository | Backend Developer | 0.5 | T6 |
| EM-PAY-003-T9 | Create StripeService for Stripe API interactions | Backend Developer | 3 | None |
| EM-PAY-003-T10 | Inject Stripe secret key from organization configuration | Backend Developer | 2 | EM-PAY-001-T9 |
| EM-PAY-003-T11 | Decrypt secret key using encryption service | Backend Developer | 1.5 | T10, EM-PAY-001-T4 |
| EM-PAY-003-T12 | Initialize Stripe API client with secret key | Backend Developer | 1.5 | T11 |
| EM-PAY-003-T13 | Implement createPaymentIntent(reservationId) method | Backend Developer | 4 | T9 |
| EM-PAY-003-T14 | Fetch reservation and calculate total amount | Backend Developer | 2 | T13, EM-RESERVE-005-T3 |
| EM-PAY-003-T15 | Verify reservation is active (not expired) | Backend Developer | 1.5 | T13 |
| EM-PAY-003-T16 | Convert amount to cents/smallest currency unit (USD: multiply by 100) | Backend Developer | 1 | T14 |
| EM-PAY-003-T17 | Create Stripe PaymentIntent with amount and currency | Backend Developer | 2.5 | T13 |
| EM-PAY-003-T18 | Set metadata: reservation_id, event_id, organization_id | Backend Developer | 1.5 | T17 |
| EM-PAY-003-T19 | Create Payment entity and save to database | Backend Developer | 2 | T17 |
| EM-PAY-003-T20 | Store stripe_payment_intent_id for tracking | Backend Developer | 1 | T19 |
| EM-PAY-003-T21 | Set initial status = PENDING | Backend Developer | 0.5 | T19 |
| EM-PAY-003-T22 | Create PaymentIntentResponse DTO with client_secret | Backend Developer | 1 | None |
| EM-PAY-003-T23 | Return client_secret to frontend (needed for confirmation) | Backend Developer | 1 | T22 |
| EM-PAY-003-T24 | Create POST /api/v1/reservations/{id}/payment-intent endpoint | Backend Developer | 2 | T13 |
| EM-PAY-003-T25 | Verify user has access to reservation | Backend Developer | 1.5 | T24 |
| EM-PAY-003-T26 | Return 400 if reservation expired | Backend Developer | 1 | T24 |
| EM-PAY-003-T27 | Return PaymentIntentResponse with client_secret | Backend Developer | 1 | T24 |
| EM-PAY-003-T28 | Handle Stripe API errors (invalid amount, auth failure) | Backend Developer | 2.5 | T24 |
| EM-PAY-003-T29 | Add global exception handler for StripeException | Backend Developer | 2 | T28 |
| EM-PAY-003-T30 | Call POST /api/v1/reservations/{id}/payment-intent from frontend | Frontend Developer | 2 | T24 |
| EM-PAY-003-T31 | Store client_secret for payment confirmation | Frontend Developer | 1 | T30 |
| EM-PAY-003-T32 | Display loading spinner during payment intent creation | Frontend Developer | 1 | T30 |
| EM-PAY-003-T33 | Handle errors and display user-friendly messages | Frontend Developer | 2 | T30 |
| EM-PAY-003-T34 | Write unit tests for createPaymentIntent() | QA Engineer | 3.5 | T13 |
| EM-PAY-003-T35 | Test amount calculation and conversion to cents | QA Engineer | 1.5 | T16 |
| EM-PAY-003-T36 | Test expired reservation handling | QA Engineer | 1.5 | T15 |
| EM-PAY-003-T37 | Write integration test for payment intent endpoint | QA Engineer | 3 | T24 |
| EM-PAY-003-T38 | Test with Stripe test mode credentials | QA Engineer | 2 | T37 |
| EM-PAY-003-T39 | Verify payment record created in database | QA Engineer | 1.5 | T19 |
| EM-PAY-003-T40 | Manual testing with Stripe dashboard | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~71 hours

---

## EM-PAY-004: Confirm Payment

**User Story:** As an attendee, I want to confirm my payment, so that my ticket purchase is completed.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-004-T1 | Implement payment confirmation on frontend using Stripe.js | Frontend Developer | 4 | EM-PAY-002-T7 |
| EM-PAY-004-T2 | Call stripe.confirmCardPayment(client_secret, {card_element}) | Frontend Developer | 2.5 | T1, EM-PAY-003-T30 |
| EM-PAY-004-T3 | Handle 3D Secure / SCA authentication flow | Frontend Developer | 3 | T2 |
| EM-PAY-004-T4 | Display authentication modal if required by bank | Frontend Developer | 2 | T3 |
| EM-PAY-004-T5 | Handle successful payment result | Frontend Developer | 2 | T2 |
| EM-PAY-004-T6 | Extract payment_intent.id from result | Frontend Developer | 1 | T5 |
| EM-PAY-004-T7 | Call backend to verify payment status | Frontend Developer | 2 | T6 |
| EM-PAY-004-T8 | Redirect to order confirmation page on success | Frontend Developer | 1.5 | T7 |
| EM-PAY-004-T9 | Handle payment errors (card declined, insufficient funds) | Frontend Developer | 3 | T2 |
| EM-PAY-004-T10 | Display specific error messages from Stripe | Frontend Developer | 2 | T9 |
| EM-PAY-004-T11 | Allow user to retry payment with different card | Frontend Developer | 2 | T9 |
| EM-PAY-004-T12 | Show loading spinner during payment processing | Frontend Developer | 1 | T2 |
| EM-PAY-004-T13 | Disable payment button during processing (prevent double-submit) | Frontend Developer | 1 | T12 |
| EM-PAY-004-T14 | Create ConfirmPaymentRequest DTO with payment_intent_id | Backend Developer | 1 | None |
| EM-PAY-004-T15 | Implement PaymentService.confirmPayment() method | Backend Developer | 3 | EM-PAY-003-T9 |
| EM-PAY-004-T16 | Retrieve PaymentIntent from Stripe API | Backend Developer | 2 | T15 |
| EM-PAY-004-T17 | Verify payment_intent.status = 'succeeded' | Backend Developer | 1.5 | T16 |
| EM-PAY-004-T18 | Update Payment entity status to SUCCEEDED | Backend Developer | 1 | T17 |
| EM-PAY-004-T19 | If payment failed, update status to FAILED | Backend Developer | 1 | T17 |
| EM-PAY-004-T20 | Create POST /api/v1/payments/confirm endpoint | Backend Developer | 1.5 | T15 |
| EM-PAY-004-T21 | Return payment status and order details | Backend Developer | 1.5 | T20 |
| EM-PAY-004-T22 | Return 400 if payment failed | Backend Developer | 1 | T20 |
| EM-PAY-004-T23 | Write unit tests for confirmPayment() | QA Engineer | 3 | T15 |
| EM-PAY-004-T24 | Test successful payment scenario | QA Engineer | 1.5 | T23 |
| EM-PAY-004-T25 | Test failed payment scenario | QA Engineer | 1.5 | T23 |
| EM-PAY-004-T26 | Write integration test for confirm endpoint | QA Engineer | 2.5 | T20 |
| EM-PAY-004-T27 | Test with Stripe test card: 4242 4242 4242 4242 (success) | QA Engineer | 2 | T26 |
| EM-PAY-004-T28 | Test with Stripe test card: 4000 0000 0000 0002 (decline) | QA Engineer | 2 | T26 |
| EM-PAY-004-T29 | Test 3D Secure card: 4000 0027 6000 3184 | QA Engineer | 2 | T26 |
| EM-PAY-004-T30 | Manual end-to-end payment testing | QA Engineer | 3 | All tasks |

**Total Story Effort:** ~60 hours

---

## EM-PAY-005: Create Order on Successful Payment

**User Story:** As a system, I want to create an order when payment succeeds, so that the purchase is recorded.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-005-T1 | Create database migration for `orders` table | Database Engineer | 2 | None |
| EM-PAY-005-T2 | Add columns: id (UUID), reservation_id, payment_id, total_amount, status, created_at | Database Engineer | 1.5 | T1 |
| EM-PAY-005-T3 | Add foreign keys to reservations and payments tables | Database Engineer | 1 | T2 |
| EM-PAY-005-T4 | Add unique constraint on reservation_id (one order per reservation) | Database Engineer | 0.5 | T2 |
| EM-PAY-005-T5 | Create order status enum: CONFIRMED, CANCELLED, REFUNDED | Database Engineer | 1 | T2 |
| EM-PAY-005-T6 | Create database migration for `order_items` table | Database Engineer | 1.5 | None |
| EM-PAY-005-T7 | Add columns: id, order_id, ticket_category_id, quantity, price_paid, subtotal | Database Engineer | 1 | T6 |
| EM-PAY-005-T8 | Add foreign keys to orders and ticket_categories | Database Engineer | 0.5 | T7 |
| EM-PAY-005-T9 | Create Order JPA entity with UUID | Backend Developer | 2.5 | T1 |
| EM-PAY-005-T10 | Add @OneToOne relationship to Reservation | Backend Developer | 1 | T9 |
| EM-PAY-005-T11 | Add @OneToOne relationship to Payment | Backend Developer | 1 | T9 |
| EM-PAY-005-T12 | Create OrderItem JPA entity | Backend Developer | 2 | T6 |
| EM-PAY-005-T13 | Add @ManyToOne relationship to Order | Backend Developer | 1 | T12 |
| EM-PAY-005-T14 | Create OrderRepository with UUID as ID type | Backend Developer | 1 | T9 |
| EM-PAY-005-T15 | Implement OrderService.createOrder(paymentId) method | Backend Developer | 5 | T14 |
| EM-PAY-005-T16 | Fetch Payment entity with reservation and items | Backend Developer | 2 | T15 |
| EM-PAY-005-T17 | Verify payment status = SUCCEEDED | Backend Developer | 1 | T16 |
| EM-PAY-005-T18 | Create Order entity with UUID.randomUUID() | Backend Developer | 1.5 | T17 |
| EM-PAY-005-T19 | Set total_amount from payment | Backend Developer | 1 | T18 |
| EM-PAY-005-T20 | Set status = CONFIRMED | Backend Developer | 0.5 | T18 |
| EM-PAY-005-T21 | Create OrderItem for each reservation item | Backend Developer | 2.5 | T18 |
| EM-PAY-005-T22 | Copy quantity and price_at_reservation from reservation items | Backend Developer | 1.5 | T21 |
| EM-PAY-005-T23 | Calculate subtotal: quantity × price_paid | Backend Developer | 1 | T21 |
| EM-PAY-005-T24 | Update Reservation status to CONFIRMED | Backend Developer | 1 | T18 |
| EM-PAY-005-T25 | Save Order and OrderItems in transaction | Backend Developer | 1.5 | T21 |
| EM-PAY-005-T26 | Call createOrder() from payment confirmation flow | Backend Developer | 2 | EM-PAY-004-T15 |
| EM-PAY-005-T27 | Only create order if payment_intent.status = 'succeeded' | Backend Developer | 1 | T26 |
| EM-PAY-005-T28 | Add idempotency check: don't create duplicate orders | Backend Developer | 2.5 | T15 |
| EM-PAY-005-T29 | Check if order already exists for reservation | Backend Developer | 1.5 | T28 |
| EM-PAY-005-T30 | If exists, return existing order | Backend Developer | 1 | T29 |
| EM-PAY-005-T31 | Create OrderResponse DTO with order details | Backend Developer | 1.5 | None |
| EM-PAY-005-T32 | Include order ID, total, items, attendee info | Backend Developer | 1.5 | T31 |
| EM-PAY-005-T33 | Write unit tests for createOrder() | QA Engineer | 4 | T15 |
| EM-PAY-005-T34 | Test order creation with valid payment | QA Engineer | 1.5 | T33 |
| EM-PAY-005-T35 | Test idempotency (calling twice returns same order) | QA Engineer | 2 | T28 |
| EM-PAY-005-T36 | Test order items match reservation items | QA Engineer | 1.5 | T21 |
| EM-PAY-005-T37 | Write integration test for order creation | QA Engineer | 3 | T15 |
| EM-PAY-005-T38 | Verify reservation status updated to CONFIRMED | QA Engineer | 1 | T24 |
| EM-PAY-005-T39 | Verify order items stored correctly | QA Engineer | 1.5 | T37 |
| EM-PAY-005-T40 | Manual testing of order creation flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~65 hours

---

## EM-PAY-006: Process Stripe Webhooks

**User Story:** As a system, I want to process Stripe webhooks, so that payment status updates are handled asynchronously.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-005

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-006-T1 | Create StripeWebhookController for webhook endpoints | Backend Developer | 2 | None |
| EM-PAY-006-T2 | Create POST /api/v1/webhooks/stripe endpoint | Backend Developer | 1.5 | T1 |
| EM-PAY-006-T3 | Accept raw request body (needed for signature verification) | Backend Developer | 2 | T2 |
| EM-PAY-006-T4 | Get Stripe webhook signing secret from organization config | Backend Developer | 2 | EM-PAY-001-T9 |
| EM-PAY-006-T5 | Store webhook secret in organizations table | Database Engineer | 1 | None |
| EM-PAY-006-T6 | Add migration for stripe_webhook_secret column | Database Engineer | 1 | T5 |
| EM-PAY-006-T7 | Implement webhook signature verification | Backend Developer | 3 | T4 |
| EM-PAY-006-T8 | Use Stripe SDK: Webhook.constructEvent(payload, signature, secret) | Backend Developer | 2 | T7 |
| EM-PAY-006-T9 | Return 400 if signature verification fails | Backend Developer | 1 | T7 |
| EM-PAY-006-T10 | Parse webhook event type | Backend Developer | 1.5 | T7 |
| EM-PAY-006-T11 | Handle event: payment_intent.succeeded | Backend Developer | 4 | T10 |
| EM-PAY-006-T12 | Extract payment_intent_id from event data | Backend Developer | 1 | T11 |
| EM-PAY-006-T13 | Find Payment by stripe_payment_intent_id | Backend Developer | 1.5 | T12 |
| EM-PAY-006-T14 | Update Payment status to SUCCEEDED | Backend Developer | 1 | T13 |
| EM-PAY-006-T15 | Call OrderService.createOrder() if not already created | Backend Developer | 2 | T13, EM-PAY-005-T15 |
| EM-PAY-006-T16 | Handle event: payment_intent.payment_failed | Backend Developer | 3 | T10 |
| EM-PAY-006-T17 | Update Payment status to FAILED | Backend Developer | 1 | T16 |
| EM-PAY-006-T18 | Release reservation (restore inventory) | Backend Developer | 2.5 | T16 |
| EM-PAY-006-T19 | Update Reservation status to CANCELLED | Backend Developer | 1 | T18 |
| EM-PAY-006-T20 | Handle event: payment_intent.canceled | Backend Developer | 2 | T10 |
| EM-PAY-006-T21 | Update Payment status to CANCELLED | Backend Developer | 1 | T20 |
| EM-PAY-006-T22 | Log all webhook events for debugging | Backend Developer | 1.5 | T10 |
| EM-PAY-006-T23 | Add @Async processing for webhook handling (optional) | Backend Developer | 2 | T2 |
| EM-PAY-006-T24 | Return 200 OK immediately to Stripe | Backend Developer | 1 | T2 |
| EM-PAY-006-T25 | Implement idempotency: check event.id to prevent duplicate processing | Backend Developer | 3 | T10 |
| EM-PAY-006-T26 | Store processed event IDs in database or cache | Backend Developer | 2 | T25 |
| EM-PAY-006-T27 | Skip processing if event already handled | Backend Developer | 1 | T26 |
| EM-PAY-006-T28 | Create database table for webhook event log | Database Engineer | 1.5 | None |
| EM-PAY-006-T29 | Store: event_id, event_type, processed_at, status | Database Engineer | 1 | T28 |
| EM-PAY-006-T30 | Configure webhook endpoint in Stripe dashboard | DevOps Engineer | 2 | None |
| EM-PAY-006-T31 | Set webhook URL: https://yourdomain.com/api/v1/webhooks/stripe | DevOps Engineer | 1 | T30 |
| EM-PAY-006-T32 | Select events to listen for: payment_intent.* | DevOps Engineer | 1 | T30 |
| EM-PAY-006-T33 | Obtain webhook signing secret from Stripe | DevOps Engineer | 0.5 | T30 |
| EM-PAY-006-T34 | Write unit tests for webhook signature verification | QA Engineer | 3 | T7 |
| EM-PAY-006-T35 | Test with valid signature (should succeed) | QA Engineer | 1.5 | T34 |
| EM-PAY-006-T36 | Test with invalid signature (should return 400) | QA Engineer | 1.5 | T34 |
| EM-PAY-006-T37 | Write integration test for payment_intent.succeeded event | QA Engineer | 3 | T11 |
| EM-PAY-006-T38 | Verify order created on webhook processing | QA Engineer | 2 | T37 |
| EM-PAY-006-T39 | Write integration test for payment_intent.payment_failed | QA Engineer | 2.5 | T16 |
| EM-PAY-006-T40 | Verify inventory restored on failed payment | QA Engineer | 2 | T39 |
| EM-PAY-006-T41 | Test idempotency (processing same event twice) | QA Engineer | 2 | T25 |
| EM-PAY-006-T42 | Use Stripe CLI to test webhooks locally | QA Engineer | 2 | None |
| EM-PAY-006-T43 | Command: stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe | QA Engineer | 1 | T42 |
| EM-PAY-006-T44 | Trigger test events and verify handling | QA Engineer | 2 | T42 |
| EM-PAY-006-T45 | Manual testing with Stripe dashboard webhook testing tool | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~79 hours

---

## EM-PAY-007: Handle Failed Payments

**User Story:** As an attendee, I want to see clear error messages when payment fails, so that I can resolve the issue.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 5  
**Dependencies:** EM-PAY-004

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-PAY-007-T1 | Map Stripe error codes to user-friendly messages | Backend Developer | 3 | None |
| EM-PAY-007-T2 | Examples: card_declined → "Your card was declined", insufficient_funds → "Insufficient funds" | Backend Developer | 1.5 | T1 |
| EM-PAY-007-T3 | Create PaymentErrorResponse DTO | Backend Developer | 1 | None |
| EM-PAY-007-T4 | Include error code, user message, and decline code (if applicable) | Backend Developer | 1 | T3 |
| EM-PAY-007-T5 | Update payment confirmation endpoint to return detailed errors | Backend Developer | 2 | EM-PAY-004-T20 |
| EM-PAY-007-T6 | Return 400 with PaymentErrorResponse for failed payments | Backend Developer | 1.5 | T5 |
| EM-PAY-007-T7 | Log payment failures for support purposes | Backend Developer | 1 | T5 |
| EM-PAY-007-T8 | Display error messages on payment form | Frontend Developer | 2.5 | EM-PAY-004-T9 |
| EM-PAY-007-T9 | Show specific error from Stripe (card declined, expired, etc.) | Frontend Developer | 2 | T8 |
| EM-PAY-007-T10 | Display generic error for unknown failures | Frontend Developer | 1 | T8 |
| EM-PAY-007-T11 | Provide "Try Again" button after error | Frontend Developer | 1.5 | T8 |
| EM-PAY-007-T12 | Allow user to enter different card without restarting checkout | Frontend Developer | 2 | T11 |
| EM-PAY-007-T13 | Clear previous error when user starts editing card | Frontend Developer | 1 | T8 |
| EM-PAY-007-T14 | Add link to contact support if problem persists | Frontend Developer | 1.5 | T8 |
| EM-PAY-007-T15 | Track failed payment attempts in analytics (optional) | Backend Developer | 2 | T7 |
| EM-PAY-007-T16 | Write unit tests for error message mapping | QA Engineer | 2 | T1 |
| EM-PAY-007-T17 | Test all common Stripe error codes | QA Engineer | 2 | T16 |
| EM-PAY-007-T18 | Write integration test for failed payment response | QA Engineer | 2 | T5 |
| EM-PAY-007-T19 | Test with Stripe test card for card declined (4000 0000 0000 0002) | QA Engineer | 1.5 | T18 |
| EM-PAY-007-T20 | Test with insufficient funds card (4000 0000 0000 9995) | QA Engineer | 1.5 | T18 |
| EM-PAY-007-T21 | Test with expired card (use any exp date in past) | QA Engineer | 1 | T18 |
| EM-PAY-007-T22 | Manual testing of error display and retry flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~37 hours

---

# EPIC 6: TICKET ISSUANCE & QR CODE GENERATION

---

## EM-TICKET-GEN-001: Generate Unique Ticket Codes

**User Story:** As a system, I want to generate unique ticket codes for each ticket, so that tickets can be validated at check-in.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-PAY-005

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-001-T1 | Create database migration for `tickets` table | Database Engineer | 2 | None |
| EM-TICKET-GEN-001-T2 | Add columns: id (UUID), order_id, ticket_category_id, ticket_code (UUID), attendee_name, attendee_email | Database Engineer | 2 | T1 |
| EM-TICKET-GEN-001-T3 | Add columns: qr_code_path, pdf_path, checked_in, checked_in_at, created_at | Database Engineer | 1.5 | T1 |
| EM-TICKET-GEN-001-T4 | Add foreign keys to orders and ticket_categories | Database Engineer | 1 | T2 |
| EM-TICKET-GEN-001-T5 | Add unique constraint on ticket_code | Database Engineer | 0.5 | T2 |
| EM-TICKET-GEN-001-T6 | Add index on ticket_code for fast lookups | Database Engineer | 0.5 | T2 |
| EM-TICKET-GEN-001-T7 | Add index on order_id | Database Engineer | 0.5 | T2 |
| EM-TICKET-GEN-001-T8 | Create Ticket JPA entity with UUID | Backend Developer | 3 | T1 |
| EM-TICKET-GEN-001-T9 | Add @ManyToOne relationship to Order | Backend Developer | 1 | T8 |
| EM-TICKET-GEN-001-T10 | Add @ManyToOne relationship to TicketCategory | Backend Developer | 1 | T8 |
| EM-TICKET-GEN-001-T11 | Create TicketRepository with UUID as ID type | Backend Developer | 1 | T8 |
| EM-TICKET-GEN-001-T12 | Add custom query: findByTicketCode(UUID) | Backend Developer | 1 | T11 |
| EM-TICKET-GEN-001-T13 | Implement TicketService.generateTickets(orderId) method | Backend Developer | 5 | T11 |
| EM-TICKET-GEN-001-T14 | Fetch Order with items and attendee | Backend Developer | 2 | T13 |
| EM-TICKET-GEN-001-T15 | For each order item, create tickets based on quantity | Backend Developer | 2.5 | T14 |
| EM-TICKET-GEN-001-T16 | Generate unique ticket_code using UUID.randomUUID() | Backend Developer | 1.5 | T15 |
| EM-TICKET-GEN-001-T17 | Set attendee name and email from reservation attendee | Backend Developer | 1 | T15 |
| EM-TICKET-GEN-001-T18 | Set checked_in = false initially | Backend Developer | 0.5 | T15 |
| EM-TICKET-GEN-001-T19 | Save all tickets in batch | Backend Developer | 1.5 | T15 |
| EM-TICKET-GEN-001-T20 | Return list of created tickets | Backend Developer | 1 | T13 |
| EM-TICKET-GEN-001-T21 | Call generateTickets() after order creation | Backend Developer | 1.5 | EM-PAY-005-T15 |
| EM-TICKET-GEN-001-T22 | Wrap in transaction with order creation | Backend Developer | 1 | T21 |
| EM-TICKET-GEN-001-T23 | Add idempotency check: don't generate tickets twice for same order | Backend Developer | 2 | T13 |
| EM-TICKET-GEN-001-T24 | Check if tickets already exist for order | Backend Developer | 1.5 | T23 |
| EM-TICKET-GEN-001-T25 | If exist, return existing tickets | Backend Developer | 1 | T24 |
| EM-TICKET-GEN-001-T26 | Write unit tests for generateTickets() | QA Engineer | 3.5 | T13 |
| EM-TICKET-GEN-001-T27 | Test correct number of tickets generated (matches order quantity) | QA Engineer | 1.5 | T26 |
| EM-TICKET-GEN-001-T28 | Test unique ticket codes (no duplicates) | QA Engineer | 1.5 | T26 |
| EM-TICKET-GEN-001-T29 | Test attendee info copied to tickets | QA Engineer | 1 | T26 |
| EM-TICKET-GEN-001-T30 | Test idempotency (calling twice returns same tickets) | QA Engineer | 2 | T23 |
| EM-TICKET-GEN-001-T31 | Write integration test for ticket generation | QA Engineer | 3 | T13 |
| EM-TICKET-GEN-001-T32 | Verify tickets created in database | QA Engineer | 1.5 | T31 |
| EM-TICKET-GEN-001-T33 | Verify ticket codes are valid UUIDs | QA Engineer | 1 | T31 |
| EM-TICKET-GEN-001-T34 | Manual testing of ticket generation flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~57 hours

---

## EM-TICKET-GEN-002: Generate QR Codes

**User Story:** As a system, I want to generate QR codes for tickets, so that they can be scanned at check-in.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 5  
**Dependencies:** EM-TICKET-GEN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-002-T1 | Add ZXing (Zebra Crossing) library dependency to build.gradle | Backend Developer | 0.5 | None |
| EM-TICKET-GEN-002-T2 | Dependency: com.google.zxing:core:3.5.0 and javase:3.5.0 | Backend Developer | 0.5 | T1 |
| EM-TICKET-GEN-002-T3 | Create QRCodeService for QR code generation | Backend Developer | 3 | None |
| EM-TICKET-GEN-002-T4 | Implement generateQRCode(ticketCode, width, height) method | Backend Developer | 4 | T3 |
| EM-TICKET-GEN-002-T5 | Encode ticket code (UUID as string) into QR code | Backend Developer | 2 | T4 |
| EM-TICKET-GEN-002-T6 | Set QR code size: 300x300 pixels | Backend Developer | 0.5 | T4 |
| EM-TICKET-GEN-002-T7 | Set error correction level: HIGH | Backend Developer | 1 | T4 |
| EM-TICKET-GEN-002-T8 | Generate BitMatrix using QRCodeWriter | Backend Developer | 2 | T4 |
| EM-TICKET-GEN-002-T9 | Convert BitMatrix to BufferedImage | Backend Developer | 2 | T8 |
| EM-TICKET-GEN-002-T10 | Save image as PNG file | Backend Developer | 1.5 | T9 |
| EM-TICKET-GEN-002-T11 | Create directory structure: /uploads/qrcodes/{orderId}/ | Backend Developer | 1 | T10 |
| EM-TICKET-GEN-002-T12 | Save QR code with filename: {ticketId}.png | Backend Developer | 1 | T11 |
| EM-TICKET-GEN-002-T13 | Return file path | Backend Developer | 0.5 | T12 |
| EM-TICKET-GEN-002-T14 | Update TicketService to generate QR codes during ticket creation | Backend Developer | 2.5 | EM-TICKET-GEN-001-T13 |
| EM-TICKET-GEN-002-T15 | For each generated ticket, call generateQRCode() | Backend Developer | 1.5 | T14 |
| EM-TICKET-GEN-002-T16 | Store QR code file path in ticket.qr_code_path | Backend Developer | 1 | T15 |
| EM-TICKET-GEN-002-T17 | Update ticket in database with QR code path | Backend Developer | 1 | T16 |
| EM-TICKET-GEN-002-T18 | Handle QR code generation errors gracefully | Backend Developer | 2 | T14 |
| EM-TICKET-GEN-002-T19 | Log errors but don't fail ticket creation | Backend Developer | 1 | T18 |
| EM-TICKET-GEN-002-T20 | Add retry logic for QR generation failures (optional) | Backend Developer | 2 | T18 |
| EM-TICKET-GEN-002-T21 | Create GET /api/v1/tickets/{id}/qrcode endpoint to serve QR images | Backend Developer | 2 | None |
| EM-TICKET-GEN-002-T22 | Return image file with content-type: image/png | Backend Developer | 1.5 | T21 |
| EM-TICKET-GEN-002-T23 | Add caching headers for QR code images | Backend Developer | 1 | T21 |
| EM-TICKET-GEN-002-T24 | Write unit tests for QRCodeService | QA Engineer | 3 | T3 |
| EM-TICKET-GEN-002-T25 | Test QR code generation with valid UUID | QA Engineer | 1.5 | T24 |
| EM-TICKET-GEN-002-T26 | Test QR code image file created | QA Engineer | 1 | T24 |
| EM-TICKET-GEN-002-T27 | Scan generated QR code and verify it contains ticket code | QA Engineer | 2 | T24 |
| EM-TICKET-GEN-002-T28 | Use QR code reader app or library to validate | QA Engineer | 1.5 | T27 |
| EM-TICKET-GEN-002-T29 | Write integration test for QR code generation in ticket flow | QA Engineer | 2.5 | T14 |
| EM-TICKET-GEN-002-T30 | Verify QR code path stored in database | QA Engineer | 1 | T29 |
| EM-TICKET-GEN-002-T31 | Verify QR code file exists on disk | QA Engineer | 1 | T29 |
| EM-TICKET-GEN-002-T32 | Test GET /api/v1/tickets/{id}/qrcode endpoint | QA Engineer | 2 | T21 |
| EM-TICKET-GEN-002-T33 | Verify correct image returned | QA Engineer | 1 | T32 |
| EM-TICKET-GEN-002-T34 | Manual testing: generate ticket, scan QR code with phone | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~56 hours

---

## EM-TICKET-GEN-003: Generate PDF Tickets

**User Story:** As a system, I want to generate PDF tickets, so that attendees can download and print them.

**Priority:** Must Have  
**Story Points:** 8  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-002

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-003-T1 | Add Apache PDFBox dependency to build.gradle | Backend Developer | 0.5 | None |
| EM-TICKET-GEN-003-T2 | Dependency: org.apache.pdfbox:pdfbox:2.0.27 | Backend Developer | 0.5 | T1 |
| EM-TICKET-GEN-003-T3 | Create PDFTicketService for PDF generation | Backend Developer | 3 | None |
| EM-TICKET-GEN-003-T4 | Implement generateTicketPDF(orderId) method | Backend Developer | 6 | T3 |
| EM-TICKET-GEN-003-T5 | Create new PDDocument | Backend Developer | 1 | T4 |
| EM-TICKET-GEN-003-T6 | For each ticket in order, add a page | Backend Developer | 2 | T5 |
| EM-TICKET-GEN-003-T7 | Design ticket layout: header, event info, attendee info, QR code, footer | Backend Developer | 4 | T6 |
| EM-TICKET-GEN-003-T8 | Add event name in large bold font | Backend Developer | 2 | T7 |
| EM-TICKET-GEN-003-T9 | Add event date, time, and location | Backend Developer | 2 | T7 |
| EM-TICKET-GEN-003-T10 | Add ticket category and price | Backend Developer | 1.5 | T7 |
| EM-TICKET-GEN-003-T11 | Add attendee name and email | Backend Developer | 1.5 | T7 |
| EM-TICKET-GEN-003-T12 | Add ticket number/code | Backend Developer | 1 | T7 |
| EM-TICKET-GEN-003-T13 | Embed QR code image in PDF | Backend Developer | 3 | T7, EM-TICKET-GEN-002-T10 |
| EM-TICKET-GEN-003-T14 | Load QR code image from file path | Backend Developer | 1.5 | T13 |
| EM-TICKET-GEN-003-T15 | Add QR code image to PDF at specified position | Backend Developer | 2 | T14 |
| EM-TICKET-GEN-003-T16 | Add footer with order number and organization info | Backend Developer | 2 | T7 |
| EM-TICKET-GEN-003-T17 | Add page numbers if multiple tickets | Backend Developer | 1.5 | T6 |
| EM-TICKET-GEN-003-T18 | Set PDF metadata (title, author, subject) | Backend Developer | 1 | T5 |
| EM-TICKET-GEN-003-T19 | Save PDF to file: /uploads/tickets/order_{orderId}.pdf | Backend Developer | 2 | T5 |
| EM-TICKET-GEN-003-T20 | Create directory structure if not exists | Backend Developer | 1 | T19 |
| EM-TICKET-GEN-003-T21 | Close PDDocument and release resources | Backend Developer | 0.5 | T19 |
| EM-TICKET-GEN-003-T22 | Return PDF file path | Backend Developer | 0.5 | T19 |
| EM-TICKET-GEN-003-T23 | Update Order entity with pdf_path field | Backend Developer | 1 | None |
| EM-TICKET-GEN-003-T24 | Add migration for pdf_path column in orders table | Database Engineer | 1 | None |
| EM-TICKET-GEN-003-T25 | Call generateTicketPDF() after tickets and QR codes generated | Backend Developer | 2 | EM-TICKET-GEN-001-T13 |
| EM-TICKET-GEN-003-T26 | Store PDF path in order.pdf_path | Backend Developer | 1 | T25 |
| EM-TICKET-GEN-003-T27 | Handle PDF generation errors gracefully | Backend Developer | 2 | T25 |
| EM-TICKET-GEN-003-T28 | Log errors but don't fail order creation | Backend Developer | 1 | T27 |
| EM-TICKET-GEN-003-T29 | Create GET /api/v1/orders/{id}/tickets-pdf endpoint | Backend Developer | 2 | None |
| EM-TICKET-GEN-003-T30 | Return PDF file with content-type: application/pdf | Backend Developer | 1.5 | T29 |
| EM-TICKET-GEN-003-T31 | Set Content-Disposition: attachment; filename="tickets.pdf" | Backend Developer | 1 | T29 |
| EM-TICKET-GEN-003-T32 | Verify user has access to order before serving PDF | Backend Developer | 1.5 | T29 |
| EM-TICKET-GEN-003-T33 | Write unit tests for PDFTicketService | QA Engineer | 4 | T3 |
| EM-TICKET-GEN-003-T34 | Test PDF generation with 1 ticket | QA Engineer | 1.5 | T33 |
| EM-TICKET-GEN-003-T35 | Test PDF generation with multiple tickets | QA Engineer | 1.5 | T33 |
| EM-TICKET-GEN-003-T36 | Verify PDF file created on disk | QA Engineer | 1 | T33 |
| EM-TICKET-GEN-003-T37 | Open generated PDF and verify layout | QA Engineer | 2 | T33 |
| EM-TICKET-GEN-003-T38 | Verify all ticket information present | QA Engineer | 1.5 | T37 |
| EM-TICKET-GEN-003-T39 | Verify QR code visible and scannable in PDF | QA Engineer | 2 | T37 |
| EM-TICKET-GEN-003-T40 | Write integration test for PDF generation | QA Engineer | 3 | T25 |
| EM-TICKET-GEN-003-T41 | Test GET /api/v1/orders/{id}/tickets-pdf endpoint | QA Engineer | 2 | T29 |
| EM-TICKET-GEN-003-T42 | Verify PDF download works in browser | QA Engineer | 1.5 | T41 |
| EM-TICKET-GEN-003-T43 | Test PDF opens correctly in Adobe Reader | QA Engineer | 1 | T41 |
| EM-TICKET-GEN-003-T44 | Test PDF prints correctly | QA Engineer | 1.5 | T41 |
| EM-TICKET-GEN-003-T45 | Manual testing of PDF generation flow | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~81 hours

---

## EM-TICKET-GEN-004: Email Tickets to Attendees

**User Story:** As a system, I want to email tickets to attendees, so that they receive their tickets immediately after purchase.

**Priority:** Must Have  
**Story Points:** 5  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-003

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-004-T1 | Add Spring Boot Mail starter dependency | Backend Developer | 0.5 | None |
| EM-TICKET-GEN-004-T2 | Configure SMTP settings in application.properties | Backend Developer | 1.5 | T1 |
| EM-TICKET-GEN-004-T3 | Use Gmail SMTP for testing (smtp.gmail.com:587) or Mailtrap | Backend Developer | 1 | T2 |
| EM-TICKET-GEN-004-T4 | Set mail.smtp.auth=true and mail.smtp.starttls.enable=true | Backend Developer | 0.5 | T2 |
| EM-TICKET-GEN-004-T5 | Store email credentials in environment variables | Backend Developer | 1 | T2 |
| EM-TICKET-GEN-004-T6 | Create EmailService for sending emails | Backend Developer | 3 | None |
| EM-TICKET-GEN-004-T7 | Inject JavaMailSender bean | Backend Developer | 1 | T6 |
| EM-TICKET-GEN-004-T8 | Implement sendTicketEmail(orderId, attendeeEmail) method | Backend Developer | 4 | T6 |
| EM-TICKET-GEN-004-T9 | Fetch order with event, attendee, and PDF path | Backend Developer | 2 | T8 |
| EM-TICKET-GEN-004-T10 | Create MimeMessage for email with attachment | Backend Developer | 2 | T8 |
| EM-TICKET-GEN-004-T11 | Set recipient: attendee email | Backend Developer | 1 | T10 |
| EM-TICKET-GEN-004-T12 | Set sender: from organization or default noreply@yourdomain.com | Backend Developer | 1 | T10 |
| EM-TICKET-GEN-004-T13 | Set subject: "Your Tickets for {Event Name}" | Backend Developer | 1 | T10 |
| EM-TICKET-GEN-004-T14 | Compose email body with HTML template | Backend Developer | 3 | T10 |
| EM-TICKET-GEN-004-T15 | Include event details, order summary, and instructions | Backend Developer | 2 | T14 |
| EM-TICKET-GEN-004-T16 | Add personalized greeting with attendee name | Backend Developer | 1 | T14 |
| EM-TICKET-GEN-004-T17 | Attach PDF ticket file | Backend Developer | 2 | T10, EM-TICKET-GEN-003-T19 |
| EM-TICKET-GEN-004-T18 | Set attachment filename: "Tickets_{EventName}.pdf" | Backend Developer | 1 | T17 |
| EM-TICKET-GEN-004-T19 | Send email using mailSender.send() | Backend Developer | 1 | T10 |
| EM-TICKET-GEN-004-T20 | Make email sending asynchronous using @Async | Backend Developer | 2 | T8 |
| EM-TICKET-GEN-004-T21 | Configure async executor in Spring config | Backend Developer | 1.5 | T20 |
| EM-TICKET-GEN-004-T22 | Handle email sending errors | Backend Developer | 2.5 | T8 |
| EM-TICKET-GEN-004-T23 | Log errors but don't fail order completion | Backend Developer | 1 | T22 |
| EM-TICKET-GEN-004-T24 | Store email send status in database (sent, failed, pending) | Backend Developer | 2 | T22 |
| EM-TICKET-GEN-004-T25 | Add email_sent boolean and email_sent_at columns to orders table | Database Engineer | 1 | None |
| EM-TICKET-GEN-004-T26 | Create migration for email tracking columns | Database Engineer | 1 | T25 |
| EM-TICKET-GEN-004-T27 | Update email_sent=true after successful send | Backend Developer | 1 | T19 |
| EM-TICKET-GEN-004-T28 | Implement retry logic for failed emails (up to 3 attempts) | Backend Developer | 3 | T22 |
| EM-TICKET-GEN-004-T29 | Use exponential backoff for retries | Backend Developer | 2 | T28 |
| EM-TICKET-GEN-004-T30 | Call sendTicketEmail() after PDF generation | Backend Developer | 1.5 | EM-TICKET-GEN-003-T25 |
| EM-TICKET-GEN-004-T31 | Create simple HTML email template | Frontend Developer | 3 | None |
| EM-TICKET-GEN-004-T32 | Use inline CSS for email compatibility | Frontend Developer | 2 | T31 |
| EM-TICKET-GEN-004-T33 | Test email rendering in multiple email clients | Frontend Developer | 2 | T31 |
| EM-TICKET-GEN-004-T34 | Write unit tests for EmailService | QA Engineer | 3 | T6 |
| EM-TICKET-GEN-004-T35 | Mock JavaMailSender in tests | QA Engineer | 1.5 | T34 |
| EM-TICKET-GEN-004-T36 | Verify email sent with correct recipient and subject | QA Engineer | 1.5 | T34 |
| EM-TICKET-GEN-004-T37 | Verify PDF attachment included | QA Engineer | 1 | T34 |
| EM-TICKET-GEN-004-T38 | Write integration test for email sending | QA Engineer | 3 | T8 |
| EM-TICKET-GEN-004-T39 | Use Mailtrap or similar for testing email delivery | QA Engineer | 2 | T38 |
| EM-TICKET-GEN-004-T40 | Verify email received in test inbox | QA Engineer | 1.5 | T39 |
| EM-TICKET-GEN-004-T41 | Verify PDF attachment can be downloaded and opened | QA Engineer | 1.5 | T39 |
| EM-TICKET-GEN-004-T42 | Test retry logic for failed emails | QA Engineer | 2 | T28 |
| EM-TICKET-GEN-004-T43 | Manual end-to-end test: purchase ticket, receive email | QA Engineer | 2 | All tasks |

**Total Story Effort:** ~72 hours

---

## EM-TICKET-GEN-005: View Tickets Online (My Tickets Page)

**User Story:** As an attendee, I want to view my tickets online, so that I can access them without email.

**Priority:** Should Have  
**Story Points:** 3  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-001

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-005-T1 | Create TicketDTO with ticket details, event info, QR code URL | Backend Developer | 1.5 | None |
| EM-TICKET-GEN-005-T2 | Implement TicketService.getUserTickets(userEmail) method | Backend Developer | 3 | EM-TICKET-GEN-001-T11 |
| EM-TICKET-GEN-005-T3 | Query tickets by attendee_email | Backend Developer | 2 | T2 |
| EM-TICKET-GEN-005-T4 | Join with event and category for complete info | Backend Developer | 1.5 | T3 |
| EM-TICKET-GEN-005-T5 | Filter for upcoming events (start_date >= NOW()) | Backend Developer | 1 | T3 |
| EM-TICKET-GEN-005-T6 | Sort by event start date ascending | Backend Developer | 1 | T3 |
| EM-TICKET-GEN-005-T7 | Map to TicketDTO with QR code URL | Backend Developer | 1.5 | T3 |
| EM-TICKET-GEN-005-T8 | Create GET /api/v1/tickets/my-tickets endpoint | Backend Developer | 1.5 | T2 |
| EM-TICKET-GEN-005-T9 | Accept query param: ?email={email} | Backend Developer | 1 | T8 |
| EM-TICKET-GEN-005-T10 | No authentication required (email-based access for MVP) | Backend Developer | 0.5 | T8 |
| EM-TICKET-GEN-005-T11 | Return List<TicketDTO> | Backend Developer | 1 | T8 |
| EM-TICKET-GEN-005-T12 | Create "My Tickets" page component | Frontend Developer | 4 | None |
| EM-TICKET-GEN-005-T13 | Add email input field to lookup tickets | Frontend Developer | 2 | T12 |
| EM-TICKET-GEN-005-T14 | Call GET /api/v1/tickets/my-tickets?email={email} | Frontend Developer | 2 | T8 |
| EM-TICKET-GEN-005-T15 | Display list of tickets grouped by event | Frontend Developer | 3 | T14 |
| EM-TICKET-GEN-005-T16 | Show event name, date, location | Frontend Developer | 2 | T15 |
| EM-TICKET-GEN-005-T17 | Show ticket category and ticket number | Frontend Developer | 1.5 | T15 |
| EM-TICKET-GEN-005-T18 | Display QR code image for each ticket | Frontend Developer | 2 | T15 |
| EM-TICKET-GEN-005-T19 | Make QR code clickable to view full size | Frontend Developer | 1.5 | T18 |
| EM-TICKET-GEN-005-T20 | Add "Download PDF" button per ticket/order | Frontend Developer | 2 | T15 |
| EM-TICKET-GEN-005-T21 | Handle no tickets found scenario | Frontend Developer | 1.5 | T14 |
| EM-TICKET-GEN-005-T22 | Add link to "My Tickets" in public navigation | Frontend Developer | 1 | None |
| EM-TICKET-GEN-005-T23 | Write unit tests for getUserTickets() | QA Engineer | 2.5 | T2 |
| EM-TICKET-GEN-005-T24 | Test filtering by email | QA Engineer | 1 | T23 |
| EM-TICKET-GEN-005-T25 | Test filtering for upcoming events only | QA Engineer | 1.5 | T23 |
| EM-TICKET-GEN-005-T26 | Write integration test for my-tickets endpoint | QA Engineer | 2 | T8 |
| EM-TICKET-GEN-005-T27 | Test with valid email (should return tickets) | QA Engineer | 1 | T26 |
| EM-TICKET-GEN-005-T28 | Test with email that has no tickets (should return empty) | QA Engineer | 1 | T26 |
| EM-TICKET-GEN-005-T29 | Manual testing of My Tickets page | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~49 hours

---

## EM-TICKET-GEN-006: Download Ticket PDF

**User Story:** As an attendee, I want to download my ticket PDF, so that I can print it or save it offline.

**Priority:** Should Have  
**Story Points:** 2  
**Sprint:** 6  
**Dependencies:** EM-TICKET-GEN-003, EM-TICKET-GEN-005

### Tasks:

| Task ID | Task Description | Role | Duration (hrs) | Dependencies |
|---------|------------------|------|----------------|--------------|
| EM-TICKET-GEN-006-T1 | Verify GET /api/v1/orders/{id}/tickets-pdf endpoint exists | Backend Developer | 0.5 | EM-TICKET-GEN-003-T29 |
| EM-TICKET-GEN-006-T2 | Update endpoint to allow access by email (no auth required for MVP) | Backend Developer | 2 | T1 |
| EM-TICKET-GEN-006-T3 | Accept query param: ?email={email} | Backend Developer | 1 | T2 |
| EM-TICKET-GEN-006-T4 | Verify email matches order's attendee email | Backend Developer | 1.5 | T2 |
| EM-TICKET-GEN-006-T5 | Return 403 if email doesn't match | Backend Developer | 1 | T4 |
| EM-TICKET-GEN-006-T6 | Return PDF file if authorized | Backend Developer | 0.5 | T4 |
| EM-TICKET-GEN-006-T7 | Create alternative endpoint: GET /api/v1/tickets/download-pdf | Backend Developer | 1.5 | None |
| EM-TICKET-GEN-006-T8 | Accept params: ?orderId={id}&email={email} | Backend Developer | 1 | T7 |
| EM-TICKET-GEN-006-T9 | Add "Download PDF" button on My Tickets page | Frontend Developer | 1.5 | EM-TICKET-GEN-005-T12 |
| EM-TICKET-GEN-006-T10 | On click, call download endpoint with order ID and email | Frontend Developer | 2 | T7 |
| EM-TICKET-GEN-006-T11 | Trigger browser download using blob and saveAs | Frontend Developer | 2 | T10 |
| EM-TICKET-GEN-006-T12 | Display loading indicator during download | Frontend Developer | 1 | T10 |
| EM-TICKET-GEN-006-T13 | Handle download errors (file not found, unauthorized) | Frontend Developer | 1.5 | T10 |
| EM-TICKET-GEN-006-T14 | Add "Download PDF" button on order confirmation page | Frontend Developer | 1.5 | None |
| EM-TICKET-GEN-006-T15 | Include order ID in confirmation page for download | Frontend Developer | 1 | T14 |
| EM-TICKET-GEN-006-T16 | Write integration test for download endpoint | QA Engineer | 2 | T7 |
| EM-TICKET-GEN-006-T17 | Test download with valid email (should succeed) | QA Engineer | 1 | T16 |
| EM-TICKET-GEN-006-T18 | Test download with invalid email (should fail with 403) | QA Engineer | 1 | T16 |
| EM-TICKET-GEN-006-T19 | Verify downloaded PDF is valid and opens correctly | QA Engineer | 1.5 | T16 |
| EM-TICKET-GEN-006-T20 | Manual testing of PDF download flow | QA Engineer | 1.5 | All tasks |

**Total Story Effort:** ~27 hours

---

# PART 3 SUMMARY

## Epic 5: Payment Processing (Stripe)
**User Stories:** 7  
**Total Tasks:** ~88 tasks  
**Total Hours:** ~405 hours  

## Epic 6: Ticket Issuance & QR Code Generation
**User Stories:** 6  
**Total Tasks:** ~72 tasks  
**Total Hours:** ~342 hours  

## PART 3 TOTALS
**User Stories:** 13  
**Total Tasks:** ~160 tasks  
**Total Estimated Hours:** ~747 hours  

---

**Notes:**
- **CRITICAL:** Never send card data to backend - all card handling via Stripe.js
- Stripe test mode credentials required throughout development
- PDF generation uses Apache PDFBox library
- QR codes generated with ZXing (300x300 pixels, HIGH error correction)
- Email sending configured with retry logic (3 attempts)
- Webhook signature verification is mandatory for security
- All monetary amounts in smallest currency unit (cents for USD)
- Idempotency checks prevent duplicate orders/tickets

**Stripe Test Cards:**
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- 3D Secure: 4000 0027 6000 3184
- Insufficient Funds: 4000 0000 0000 9995

**Next:** Part 4 will cover Epics 7-8 (Check-In & Attendee Management)

