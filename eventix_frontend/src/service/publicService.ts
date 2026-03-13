import axiosInstance from "../service/axiosConfig";
import {
  PublicEventDTO,
  PublicEventDetailDTO,
  ReservationRequest,
  ReservationResponse,
  PaginatedResponse,
} from "../types/public.types";

const publicService = {
  // GET /public/events/{id} - Fetch event details
  fetchEventDetail: async (eventId: number): Promise<PublicEventDetailDTO> => {
    const response = await axiosInstance.get<PublicEventDetailDTO>(
      `/public/events/${eventId}`,
    );
    return response.data;
  },
  // GET / - List all public events with filters
  fetchEvents: async (params: {
    search?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    size: number;
  }): Promise<PaginatedResponse<PublicEventDTO>> => {
    const filteredParams: any = {
      page: params.page,
      size: params.size,
    };

    // Only add search if it has actual content
    if (params.search && params.search.trim() !== "") {
      filteredParams.search = params.search;
    }

    // Ensure dates are only sent if they exist
    if (params.startDate) filteredParams.start = params.startDate;
    if (params.endDate) filteredParams.end = params.endDate;

    const response = await axiosInstance.get<PaginatedResponse<PublicEventDTO>>(
      "/public/events", // Ensure this matches your Controller @RequestMapping
      { params: filteredParams },
    );
    return response.data;
  },

  // ...existing code...

  // POST /{eventId}/reservations - Lock ticket stock
  createReservation: async (
    eventId: number,
    data: ReservationRequest,
  ): Promise<ReservationResponse> => {
    const response = await axiosInstance.post<ReservationResponse>(
      `/public/events/${eventId}/reservations`,
      data,
    );
    return response.data;
  },

  // GET /reservations/{reservationId} - Polling or verification
  getReservation: async (
    reservationId: string,
  ): Promise<ReservationResponse> => {
    const response = await axiosInstance.get<ReservationResponse>(
      `/public/events/reservations/${reservationId}`,
    );
    return response.data;
  },
};

export default publicService;
