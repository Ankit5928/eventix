export interface AttendeeDTO {
  id: string; // UUID
  attendeeName: string;
  attendeeEmail: string;
  ticketCategoryName: string;
  status: string;
  checkedInAt: string | null;
  orderId: number;
}

export interface AttendeeDetailDTO extends AttendeeDTO {
  phoneNumber: string;
  purchaseDate: string;
  ticketPrice: number;
  transactionId: string;
}

export interface AttendeeFilters {
  search?: string;
  categoryId?: string;
  checkedIn?: "checked_in" | "not_checked_in" | "";
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
