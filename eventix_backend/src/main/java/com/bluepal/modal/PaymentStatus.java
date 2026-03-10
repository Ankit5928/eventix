package com.bluepal.modal;

public enum PaymentStatus {

    PENDING,

    /**
     * Stripe confirmed the funds were successfully captured.
     */
    SUCCEEDED,

    /**
     * The payment was declined by the bank or failed during processing.
     */
    FAILED,

    /**
     * The user manually cancelled the checkout session or it timed out.
     */
    CANCELLED,

    /**
     * The payment was successful but has since been returned to the customer.
     */
    REFUNDED
}
