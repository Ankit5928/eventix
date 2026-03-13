import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import paymentIntentService from "../../service/paymentIntentService";
import reservationService from "../../service/reservationService";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/checkout/PaymentForm";
import { AttendeeDetailRequest, ReservationSummaryDTO } from "../../types/reservation.types";

type Step = "info" | "review" | "pay";

export default function CheckoutPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("info");
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Attendee form
  const [attendee, setAttendee] = useState<AttendeeDetailRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    termsAccepted: false,
  });

  // Order summary
  const [summary, setSummary] = useState<ReservationSummaryDTO | null>(null);

  // ── Load reservation status on mount ──
  useEffect(() => {
    if (!reservationId) return;
    reservationService
      .getStatus(reservationId)
      .then((res) => {
        if (res.status === "EXPIRED") {
          setError("This reservation has expired. Please go back and try again.");
        }
        setExpiresAt(res.expiresAt);
      })
      .catch(() => {});

    reservationService
      .getSummary(reservationId)
      .then((s) => setSummary(s))
      .catch(() => {});
  }, [reservationId]);

  // ── Countdown timer ──
  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        setError("Reservation expired. Please start over.");
        clearInterval(interval);
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // ── Step 1: Submit attendee info ──
  const handleAttendeeSubmit = async () => {
    if (!reservationId) return;
    if (!attendee.firstName || !attendee.lastName || !attendee.email || !attendee.phone) {
      setError("Please fill all required fields.");
      return;
    }
    if (!attendee.termsAccepted) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await reservationService.updateAttendee(reservationId, attendee);
      setStep("review");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save attendee info.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 → 3: Create payment intent ──
  const handleProceedToPayment = async () => {
    if (!reservationId) return;
    setError(null);
    setLoading(true);
    try {
      const intent = await paymentIntentService.createIntent({ reservationId });
      setClientSecret(intent.clientSecret);
      const stripe = await loadStripe(intent.stripePublishableKey);
      setStripePromise(stripe);
      setStep("pay");
    } catch (err: any) {
      console.error("Payment init error:", err.response?.status, err.response?.data);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to initialize payment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    navigate(`/payment-success?orderId=${orderId}`);
  };

  const stepLabels: { key: Step; label: string }[] = [
    { key: "info", label: "Attendee Info" },
    { key: "review", label: "Review Order" },
    { key: "pay", label: "Payment" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Timer Banner */}
      {timeLeft && timeLeft !== "Expired" && (
        <div className="mb-4 flex items-center justify-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-medium text-yellow-800">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Reservation expires in <span className="font-bold">{timeLeft}</span>
        </div>
      )}

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-0 mb-8">
        {stepLabels.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                step === s.key
                  ? "bg-primary text-primary-foreground"
                  : stepLabels.findIndex((x) => x.key === step) > i
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {stepLabels.findIndex((x) => x.key === step) > i ? "✓" : i + 1}
              </span>
              {s.label}
            </div>
            {i < stepLabels.length - 1 && (
              <div className="w-8 h-0.5 bg-muted mx-1" />
            )}
          </div>
        ))}
      </div>

      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>
            {step === "info" && "Attendee Information"}
            {step === "review" && "Review Your Order"}
            {step === "pay" && "Payment Details"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Reservation: {reservationId?.slice(0, 8)}...
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {/* ── Step 1: Attendee Info ── */}
          {step === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  placeholder="John"
                  value={attendee.firstName}
                  onChange={(e) =>
                    setAttendee({ ...attendee, firstName: e.target.value })
                  }
                  required
                />
                <Input
                  label="Last Name *"
                  placeholder="Doe"
                  value={attendee.lastName}
                  onChange={(e) =>
                    setAttendee({ ...attendee, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="Email *"
                type="email"
                placeholder="john@example.com"
                value={attendee.email}
                onChange={(e) =>
                  setAttendee({ ...attendee, email: e.target.value })
                }
                required
              />
              <Input
                label="Phone *"
                type="tel"
                placeholder="+15550123456"
                value={attendee.phone}
                onChange={(e) =>
                  setAttendee({ ...attendee, phone: e.target.value })
                }
                required
              />
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendee.termsAccepted}
                  onChange={(e) =>
                    setAttendee({ ...attendee, termsAccepted: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I accept the <a href="#" className="text-primary underline">terms and conditions</a> *
                </span>
              </label>
              <div className="flex justify-end pt-2">
                <Button onClick={handleAttendeeSubmit} disabled={loading}>
                  {loading ? "Saving..." : "Continue to Review →"}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Order Review ── */}
          {step === "review" && (
            <div className="space-y-4">
              {summary ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Event</span>
                    <span className="font-medium">{summary.eventName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{summary.ticketCategoryName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{summary.quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Unit Price</span>
                    <span className="font-medium">${summary.unitPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">${summary.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
                  Loading order summary...
                </div>
              )}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep("info")}>
                  ← Back
                </Button>
                <Button onClick={handleProceedToPayment} disabled={loading}>
                  {loading ? "Loading..." : "Proceed to Payment →"}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Payment ── */}
          {step === "pay" && (
            <div className="space-y-4">
              {!clientSecret || !stripePromise ? (
                <div className="p-4 bg-muted rounded-md text-center text-sm">
                  Preparing payment...
                </div>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm 
                    reservationId={reservationId!} 
                    onSuccess={handlePaymentSuccess} 
                  />
                </Elements>
              )}
              <div className="pt-2">
                <Button variant="outline" onClick={() => setStep("review")}>
                  ← Back to Review
                </Button>
              </div>
              <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Secure checkout powered by Stripe
              </div>
            </div>
          )}

          <div className="text-center mt-4 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cancel and return to event list
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
