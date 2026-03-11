export interface StripeConfigRequest {
  stripePublishableKey: string;
  stripeSecretKey: string;
}

export interface PaymentState {
  publishableKey: string | null;
  isUpdating: boolean;
  error: string | null;
}
