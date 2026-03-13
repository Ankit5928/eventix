import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addNotification,
  setConnectionStatus,
} from "../../store/slices/notificationSlice";
import notificationService from "../../service/notificationService";
import { SaleNotification } from "../../types/notification.types";
import { CheckCircle2, Wifi } from "lucide-react";

export default function NotificationToast() {
  const dispatch = useAppDispatch();
  const { notifications, isLive } = useAppSelector((state) => state.notifications);
  const { currentOrganizationId, token } = useAppSelector((state) => state.auth);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!currentOrganizationId || !token) return;

    const es = notificationService.subscribeToSales(
      Number(currentOrganizationId),
      token
    );
    eventSourceRef.current = es;

    es.onopen = () => dispatch(setConnectionStatus(true));

    es.onmessage = (event) => {
      try {
        const data: SaleNotification = JSON.parse(event.data);
        dispatch(addNotification(data));
      } catch {}
    };

    es.onerror = () => {
      dispatch(setConnectionStatus(false));
    };

    return () => {
      es.close();
      dispatch(setConnectionStatus(false));
    };
  }, [currentOrganizationId, token, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 mb-1 px-2">
          <Wifi className="w-3 h-3" />
          <span>Live</span>
        </div>
      )}

      {notifications.slice(0, 3).map((n, i) => (
        <div
          key={`${n.orderId}-${i}`}
          className="bg-card border border-green-200 rounded-lg shadow-lg p-4 animate-fade-in-up"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-foreground">New Sale!</p>
              <p className="text-muted-foreground">
                {n.customerName} bought a ticket for{" "}
                <span className="font-medium">{n.eventName}</span>
              </p>
              <p className="text-xs text-primary font-semibold mt-1">
                +${n.amount?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
