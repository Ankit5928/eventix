export interface OrderItemDTO {
  id: number;
  ticketCategoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string; // UUID
  orderNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  items: OrderItemDTO[];
}

export interface OrderDTO {
  id: string; // UUID
  orderNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  attendeeEmail: string;
  eventName: string;
  createdAt: string;
}
