package com.bluepal.modal;

/**
 * EM-RESERVE-001-T5: Defines the lifecycle of a ticket reservation.
 */
public enum ReservationStatus {
    /** Initial state when tickets are locked but not yet paid */
    PENDING,

    /** State after successful Stripe payment confirmation */
    CONFIRMED,

    /** State after the 15-minute timer expires without payment */
    EXPIRED,

    /** State if a user or system manually cancels the hold */
    CANCELLED
}