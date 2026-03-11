export interface PaymentRequest {
  reservationId: string; // UUID from the reservation step
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  publishableKey: string; // The backend often sends this to initialize Stripe
}

export interface PaymentIntentState {
  clientSecret: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
