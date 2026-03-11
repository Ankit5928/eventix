import axiosInstance from '../service/axiosConfig';
import { 
  PublicEventDTO, 
  PublicEventDetailDTO, 
  ReservationRequest, 
  ReservationResponse,
  PaginatedResponse 
} from '../types/public.types';

const publicService = {
  // GET / - List all public events with filters
  fetchEvents: async (params: { search?: string, startDate?: string, endDate?: string, page: number, size: number }): Promise<PaginatedResponse<PublicEventDTO>> => {
    const response = await axiosInstance.get<PaginatedResponse<PublicEventDTO>>('/public/events', { params });
    return response.data;
  },

  // GET /{id} - Detail view
  fetchEventDetail: async (id: number): Promise<PublicEventDetailDTO> => {
    const response = await axiosInstance.get<PublicEventDetailDTO>(`/public/events/${id}`);
    return response.data;
  },

  // POST /{eventId}/reservations - Lock ticket stock
  createReservation: async (eventId: number, data: ReservationRequest): Promise<ReservationResponse> => {
    const response = await axiosInstance.post<ReservationResponse>(`/public/events/${eventId}/reservations`, data);
    return response.data;
  },

  // GET /reservations/{reservationId} - Polling or verification
  getReservation: async (reservationId: string): Promise<ReservationResponse> => {
    const response = await axiosInstance.get<ReservationResponse>(`/public/events/reservations/${reservationId}`);
    return response.data;
  }
};

export default publicService;