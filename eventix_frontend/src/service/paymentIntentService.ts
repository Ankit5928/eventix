import axiosInstance from "../service/axiosConfig";
import {
  PaymentRequest,
  PaymentIntentResponse,
} from "../types/payment-intent.types";

const paymentIntentService = {
  /**
   * POST /create-intent
   * We now use the PaymentRequest type for the 'data' parameter.
   */
  createIntent: async (
    data: PaymentRequest,
  ): Promise<PaymentIntentResponse> => {
    // Passing 'data' directly ensures it matches the PaymentRequest interface structure
    const response = await axiosInstance.post<PaymentIntentResponse>(
      "/payments/create-intent",
      data,
    );
    return response.data;
  },
};

export default paymentIntentService;
