import axiosInstance from "../service/axiosConfig";
import { OrderDTO, OrderResponse } from "../types/order.types";

const orderService = {
  // GET /{id} - Used for the success/confirmation page
  getOrderDetails: async (orderId: string): Promise<OrderResponse> => {
    const response = await axiosInstance.get<OrderResponse>(
      `/orders/${orderId}`,
    );
    return response.data;
  },

  getOrderStatus: async (orderId: string): Promise<OrderDTO> => {
    const response = await axiosInstance.get<OrderDTO>(`/orders/${orderId}`);
    return response.data;
  },

  // Helper for downloading the generated PDF
  getTicketPdfUrl: (orderId: string, email: string) => {
    return `${axiosInstance.defaults.baseURL}/orders/${orderId}/tickets-pdf?email=${encodeURIComponent(email)}`;
  },

  // GET /{id}/tickets-pdf - Trigger PDF binary download
  downloadTicketsPdf: async (orderId: string, email: string): Promise<void> => {
    const response = await axiosInstance.get(`/orders/${orderId}/tickets-pdf`, {
      params: { email },
      responseType: "blob", // Crucial for handling PDF binary data
    });

    // Create a virtual link to trigger browser download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tickets_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default orderService;
