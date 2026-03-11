export interface AttendeeDetailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface ReservationSummaryDTO {
  reservationId: string;
  eventName: string;
  eventDate: string;
  ticketCategoryName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  expiresAt: string; // ISO Date string for the timer
}

// Reuse or extend the Response from Public types
export interface ReservationStatusResponse {
  reservationId: string;
  expiresAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';
}