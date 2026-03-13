export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO String
  endDate: string;
  timezone: string;
  visibility?: "PUBLIC" | "PRIVATE";
}

export interface UpdateEventRequest extends CreateEventRequest {}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  timezone: string;
  visibility: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface EventListItemDTO {
  id: number;
  title: string;
  startDate: string;
  location: string;
  imageUrl: string | null;
  status: string;
  ticketsSold: number;
}

// Add this to your types file
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // This is the current page index
  first: boolean;
  last: boolean;
  empty: boolean;
}
