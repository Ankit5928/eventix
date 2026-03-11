import axiosInstance from '../service/axiosConfig';
import { 
  AttendeeDetailRequest, 
  ReservationStatusResponse, 
  ReservationSummaryDTO 
} from '../types/reservation.types';

const reservationService = {
  // GET /reservations/{id}/status
  getStatus: async (id: string): Promise<ReservationStatusResponse> => {
    // We use standard GET, but handle the error case where status is EXPIRED
    const response = await axiosInstance.get<ReservationStatusResponse>(`/events/reservations/${id}/status`);
    return response.data;
  },

  // PUT /reservations/{id}/attendee
  updateAttendee: async (id: string, data: AttendeeDetailRequest): Promise<void> => {
    await axiosInstance.put(`/events/reservations/${id}/attendee`, data);
  },

  // GET /reservations/{id}/summary
  getSummary: async (id: string): Promise<ReservationSummaryDTO> => {
    const response = await axiosInstance.get<ReservationSummaryDTO>(`/events/reservations/${id}/summary`);
    return response.data;
  }
};

export default reservationService;