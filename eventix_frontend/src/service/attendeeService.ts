import apiClient from './api';
import { AttendeeDTO, AttendeeDetailDTO, AttendeeFilters, PaginatedResponse } from '../types/attendee.types';

export const getAttendees = async (
  eventId: number | string,
  filters: AttendeeFilters
): Promise<PaginatedResponse<AttendeeDTO>> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.checkedIn) params.append('checkedIn', filters.checkedIn);
  
  params.append('page', filters.page.toString());
  params.append('size', filters.size.toString());

  const response = await apiClient.get<PaginatedResponse<AttendeeDTO>>(
    `/events/${eventId}/attendees`,
    { params }
  );
  return response.data;
};

export const getAttendeeDetails = async (
  ticketId: string
): Promise<AttendeeDetailDTO> => {
  const response = await apiClient.get<AttendeeDetailDTO>(
    `/events/details/${ticketId}`
  );
  return response.data;
};

export const exportAttendeesCSVUrl = (
  eventId: number | string,
  filters: Omit<AttendeeFilters, 'page' | 'size'>
): string => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.checkedIn) params.append('checkedIn', filters.checkedIn);
  
  // Need to pass token via URL or rely on cookie if using browser fetch for download.
  // Since we use a JWT in the header, downloading CSV directly via window.open is tricky 
  // without exposing the token or using a blob. We will use a fetch Blob approach in the UI instead.
  
  return `/events/${eventId}/attendees/export?${params.toString()}`;
};

export const downloadAttendeesCSV = async (
  eventId: number | string,
  filters: Omit<AttendeeFilters, 'page' | 'size'>
) => {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.categoryId) params.append('categoryId', filters.categoryId);
  if (filters.checkedIn) params.append('checkedIn', filters.checkedIn);

  const response = await apiClient.get(`/events/${eventId}/attendees/export`, {
    params,
    responseType: 'blob', // Important for downloading files
  });

  // Create a URL for the blob and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `attendees_event_${eventId}.csv`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
