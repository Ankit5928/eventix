export interface PaymentRequest {
  reservationId: string; // UUID from the reservation step
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  stripePublishableKey: string;
}

export interface PaymentIntentState {
  clientSecret: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
