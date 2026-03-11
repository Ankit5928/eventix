import axiosInstance from "../service/axiosConfig";
import {
  AttendeeDTO,
  AttendeeDetailDTO,
  AttendeeFilters,
  PaginatedResponse,
} from "../types/attendee.types";

const attendeeService = {
  // GET /{eventId}/attendees
  getEventAttendees: async (
    eventId: number,
    filters: AttendeeFilters,
  ): Promise<PaginatedResponse<AttendeeDTO>> => {
    const response = await axiosInstance.get<PaginatedResponse<AttendeeDTO>>(
      `/events/${eventId}/attendees`,
      {
        params: filters,
      },
    );
    return response.data;
  },

  // GET /details/{ticketId}
  getAttendeeDetails: async (ticketId: string): Promise<AttendeeDetailDTO> => {
    const response = await axiosInstance.get<AttendeeDetailDTO>(
      `/events/details/${ticketId}`,
    );
    return response.data;
  },

  // GET /{eventId}/attendees/export
  exportAttendees: async (
    eventId: number,
    filters: Omit<AttendeeFilters, "page" | "size">,
  ): Promise<void> => {
    const response = await axiosInstance.get(
      `/events/${eventId}/attendees/export`,
      {
        params: filters,
        responseType: "blob", // Important for file downloads
      },
    );

    // Create a download link for the browser
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendees_event_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default attendeeService;
