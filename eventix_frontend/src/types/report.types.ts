export interface RevenueReportDTO {
  eventId: number;
  eventTitle: string;
  totalRevenue: number;
  ticketsSold: number;
}

export interface SalesTimeSeriesDTO {
  timeLabel: string; // e.g., "2026-03-11"
  salesCount: number;
  revenue: number;
}

export interface EventSummaryDTO {
  totalRevenue: number;
  totalTickets: number;
  availableCapacity: number;
  checkInCount: number;
  conversionRate: number;
}

export interface OrganizationSummaryDTO {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  activeEvents: number;
  upcomingEvents?: {
    eventId: number;
    title: string;
    startDate: string;
    ticketsSold: number;
  }[];
}
