export interface PublicEventDTO {
  id: number;
  title: string;
  description: string;
  startDate: string;
  location: string;
  imageUrl: string | null;
  minPrice: number;
}

export interface PublicTicketCategoryDTO {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  isSoldOut: boolean;
}

export interface PublicEventDetailDTO {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  venueDetails: string;
  imageUrl: string;
  ticketCategories: PublicTicketCategoryDTO[];
}

export interface ReservationRequest {
  ticketCategoryId: string; // UUID
  quantity: number;
}

export interface ReservationResponse {
  reservationId: string; // UUID
  expiresAt: string;
  totalAmount: number;
  eventName: string;
}

export interface PaginatedResponse<T> {
  content: T[]; // The list of items for the current page
  totalPages: number; // Total number of pages available
  totalElements: number; // Total number of records in the database
  size: number; // Number of items per page
  number: number; // Current page index (starts at 0)
  first: boolean; // True if this is the first page
  last: boolean; // True if this is the last page
  numberOfElements: number; // Items on the current page
  empty: boolean; // True if the content is empty
}
