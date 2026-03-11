export interface SaleNotification {
  orderId: number;
  eventName: string;
  amount: number;
  customerName: string;
  timestamp: string;
}

export interface NotificationState {
  notifications: SaleNotification[];
  isLive: boolean;
  error: string | null;
}