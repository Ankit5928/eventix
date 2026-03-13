export interface TicketValidationResponse {
  status: "VALID" | "INVALID" | "ALREADY_CHECKED_IN";
  ticketCode: string;
  attendeeName: string;
  categoryName: string;
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
  categoryName: string;
  isCheckedIn: boolean;
}
