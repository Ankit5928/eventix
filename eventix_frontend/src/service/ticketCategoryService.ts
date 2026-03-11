import axiosInstance from "../service/axiosConfig";
import {
  TicketCategoryResponse,
  CreateTicketCategoryRequest,
  UpdateTicketCategoryRequest,
  CategoryStatsDTO,
} from "../types/ticket-category.types";

const ticketCategoryService = {
  // GET / - Fetch categories (public or internal)
  getCategories: async (
    eventId: number,
    internalView: boolean = false,
  ): Promise<TicketCategoryResponse[]> => {
    const response = await axiosInstance.get<TicketCategoryResponse[]>(
      `/events/${eventId}/categories`,
      {
        params: { internalView },
      },
    );
    return response.data;
  },

  // POST / - Create new category
  createCategory: async (
    eventId: number,
    data: CreateTicketCategoryRequest,
  ): Promise<TicketCategoryResponse> => {
    const response = await axiosInstance.post<TicketCategoryResponse>(
      `/events/${eventId}/categories`,
      data,
    );
    return response.data;
  },

  // PUT /{categoryId} - Update existing
  updateCategory: async (
    eventId: number,
    catId: string,
    data: UpdateTicketCategoryRequest,
  ): Promise<TicketCategoryResponse> => {
    const response = await axiosInstance.put<TicketCategoryResponse>(
      `/events/${eventId}/categories/${catId}`,
      data,
    );
    return response.data;
  },

  // GET /stats - Sales analytics
  getStats: async (eventId: number): Promise<CategoryStatsDTO[]> => {
    const response = await axiosInstance.get<CategoryStatsDTO[]>(
      `/events/${eventId}/categories/stats`,
    );
    return response.data;
  },

  // Helper to build the direct QR image URL
  getQRCodeUrl: (catId: string) => {
    return `${axiosInstance.defaults.baseURL}/events/categories/${catId}/qrcode`;
  },
};

export default ticketCategoryService;
