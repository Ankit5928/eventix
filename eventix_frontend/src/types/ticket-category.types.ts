export interface CreateTicketCategoryRequest {
  name: string;
  description: string;
  price: number;
  quantityTotal: number;
  salesStartDate: string;
  salesEndDate: string;
}

export interface UpdateTicketCategoryRequest extends CreateTicketCategoryRequest {
  isActive: boolean;
}

export interface TicketCategoryResponse {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  quantityTotal: number;
  salesStartDate: string;
  salesEndDate: string;
  isSoldOut: boolean;
}

export interface CategoryStatsDTO {
  categoryId: string;
  categoryName: string;
  ticketsSold: number;
  revenue: number;
  occupancyRate: number; // Percentage
}
