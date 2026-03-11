import axiosInstance from "../service/axiosConfig";
import {
  TicketValidationResponse,
  CheckInResponse,
  CheckInStatsDTO,
  TicketSearchResultDTO,
} from "../types/checkin.types";

const checkInService = {
  // POST /validate
  validateTicket: async (
    ticketCode: string,
  ): Promise<TicketValidationResponse> => {
    const response = await axiosInstance.post<TicketValidationResponse>(
      "/checkin/validate",
      {
        ticket_code: ticketCode,
      },
    );
    return response.data;
  },

  // POST /execute
  executeCheckIn: async (ticketCode: string): Promise<CheckInResponse> => {
    const response = await axiosInstance.post<CheckInResponse>(
      "/checkin/execute",
      {
        ticketCode, // Matches CheckInRequest DTO
      },
    );
    return response.data;
  },

  // GET /events/{eventId}/stats
  getEventStats: async (eventId: number): Promise<CheckInStatsDTO> => {
    const response = await axiosInstance.get<CheckInStatsDTO>(
      `/checkin/events/${eventId}/stats`,
    );
    return response.data;
  },

  // GET /search
  searchTickets: async (
    eventId: number,
    name: string,
  ): Promise<TicketSearchResultDTO[]> => {
    // Fix here
    const response = await axiosInstance.get<TicketSearchResultDTO[]>(
      "/checkin/search",
      {
        params: { eventId, name },
      },
    );
    return response.data;
  },
};

export default checkInService;
