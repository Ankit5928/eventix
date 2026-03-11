export interface TicketValidationResponse {
  isValid: boolean;
  ticketCode: string;
  attendeeName: string;
  ticketCategory: string;
  status: "UNUSED" | "USED" | "INVALID" | "CANCELLED";
  message?: string;
}

export interface CheckInResponse {
  success: boolean;
  checkedInAt: string;
  message: string;
}

export interface CategoryStats {
  categoryName: string;
  totalTickets: number;
  checkedInCount: number;
}

export interface CheckInStatsDTO {
  eventId: number;
  totalTickets: number;
  totalCheckedIn: number;
  attendancePercentage: number;
  categoryBreakdown: CategoryStats[];
}

export interface TicketSearchResultDTO {
  ticketCode: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketCategory: string;
  isCheckedIn: boolean;
}
