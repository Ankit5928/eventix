import axiosInstance from '../service/axiosConfig';
import { StripeConfigRequest } from '../types/payment.types';

const paymentService = {
  /**
   * Updates Stripe credentials.
   * Note: The backend uses the Master Key to encrypt the Secret Key before DB storage.
   */
  updateStripeConfig: async (orgId: number, data: StripeConfigRequest): Promise<string> => {
    const response = await axiosInstance.put<string>(`/organizations/${orgId}/stripe-config`, data);
    return response.data;
  },

  /**
   * Fetches only the Publishable Key.
   * This is used to initialize the loadStripe() function from @stripe/stripe-js.
   */
  getPublishableKey: async (orgId: number): Promise<string> => {
    const response = await axiosInstance.get<string>(`/organizations/${orgId}/stripe-publishable-key`);
    return response.data;
  }
};

export default paymentService;