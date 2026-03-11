import axiosInstance from '../service/axiosConfig';
import { 
  CreateEventRequest, 
  UpdateEventRequest, 
  EventResponse, 
  EventListItemDTO,
  PaginatedResponse 
} from '../types/event.types';

const eventService = {
  // Public: Get all events
  getPublicEvents: async (page = 0, size = 10): Promise<PaginatedResponse<EventResponse>> => {
    const response = await axiosInstance.get<PaginatedResponse<EventResponse>>('/events', {
      params: { page, size }
    });
    return response.data;
  },

  // Public: Get event detail
  getPublicEvent: async (eventId: number): Promise<EventResponse> => {
    const response = await axiosInstance.get<EventResponse>(`/events/${eventId}`);
    return response.data;
  },

  // Admin: Create Event
  createEvent: async (orgId: number, data: CreateEventRequest): Promise<EventResponse> => {
    const response = await axiosInstance.post<EventResponse>(`/events/${orgId}`, data);
    return response.data;
  },

  // Admin: Upload Banner (Multipart)
  uploadImage: async (orgId: number, eventId: number, file: File): Promise<EventResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post<EventResponse>(
      `/events/${orgId}/${eventId}/image`, 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // Admin: Get Dashboard List
  getOrgEvents: async (orgId: number, search?: string, page = 0, size = 10): Promise<PaginatedResponse<EventListItemDTO>> => {
    const response = await axiosInstance.get<PaginatedResponse<EventListItemDTO>>(`/events/${orgId}`, {
      params: { search, page, size }
    });
    return response.data;
  },

  // Admin: Update
  updateEvent: async (orgId: number, eventId: number, data: UpdateEventRequest): Promise<EventResponse> => {
    const response = await axiosInstance.put<EventResponse>(`/events/${orgId}/${eventId}`, data);
    return response.data;
  },

  // Admin: Cancel
  cancelEvent: async (orgId: number, eventId: number, force = false): Promise<void> => {
    await axiosInstance.patch(`/events/${orgId}/${eventId}/cancel`, null, {
      params: { force }
    });
  }
};

export default eventService;