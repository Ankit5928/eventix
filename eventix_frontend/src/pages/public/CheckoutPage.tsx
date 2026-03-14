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
import {
  Clock,
  ShieldCheck,
  User,
  Search,
  CreditCard,
  Sparkles,
  Lock,
  ArrowLeft,
  Loader2
} from "lucide-react";

type Step = "info" | "review" | "pay";

export default function CheckoutPage() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("info");
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const [attendee, setAttendee] = useState<AttendeeDetailRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    termsAccepted: false,
  });

  const [summary, setSummary] = useState<ReservationSummaryDTO | null>(null);

  useEffect(() => {
    if (!reservationId) return;
    reservationService.getStatus(reservationId)
      .then((res) => {
        if (res.status === "EXPIRED") {
          setError("Manifest Timeout: This reservation has expired.");
        }
        setExpiresAt(res.expiresAt);
      })
      .catch(() => { });

    reservationService.getSummary(reservationId)
      .then((s) => setSummary(s))
      .catch(() => { });
  }, [reservationId]);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        setError("Protocol Termination: Reservation has expired.");
        clearInterval(interval);
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleAttendeeSubmit = async () => {
    if (!reservationId) return;
    if (!attendee.firstName || !attendee.lastName || !attendee.email || !attendee.phone) {
      setError("Incomplete manifest: Required identity fields missing.");
      return;
    }
    if (!attendee.termsAccepted) {
      setError("Authorization required: Please accept operational terms.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await reservationService.updateAttendee(reservationId, attendee);
      setStep("review");
    } catch (err: any) {
      setError("Sync Failure: Failed to synchronize identity data.");
    } finally {
      setLoading(false);
    }
  };

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
      setError("Gateway Error: Failed to initialize financial clearing.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    navigate(`/payment-success?orderId=${orderId}`);
  };

  const stepLabels: { key: Step; label: string; icon: any }[] = [
    { key: "info", label: "Identity", icon: User },
    { key: "review", label: "Manifest", icon: Search },
    { key: "pay", label: "Clearing", icon: CreditCard },
  ];

  return (
    <div className="premium-page-container pb-24 overflow-y-auto">
      <div className="smoke-overlay" />
      <div className="max-w-3xl mx-auto space-y-10 animate-fade-in-up">

        {/* Tactical Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#FF0000]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Terminal</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter italic">Checkout <span className="text-[#FF0000]">Protocol</span></h1>
        </div>

        {/* Expiry Clock */}
        {timeLeft && timeLeft !== "EXPIRED" && (
          <div className="flex items-center justify-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
            <Clock className="w-4 h-4 text-[#FF0000] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Terminal Link Expiry: <span className="text-white font-mono text-xs ml-2">{timeLeft}</span>
            </span>
          </div>
        )}

        {/* Progress System */}
        <div className="flex items-center justify-between px-6">
          {stepLabels.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.key;
            const isCompleted = stepLabels.findIndex((x) => x.key === step) > i;

            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isActive ? "bg-[#FF0000] border-[#FF0000] shadow-[0_0_20px_#FF0000]/30 text-white" :
                      isCompleted ? "bg-green-500/10 border-green-500/20 text-green-500" :
                        "bg-white/[0.02] border-white/5 text-white/20"
                    }`}>
                    {isCompleted ? <ShieldCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isActive ? "text-white" : "text-white/20"}`}>
                    {s.label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`flex-1 h-px mx-4 mt-[-20px] ${isCompleted ? 'bg-green-500/20' : 'bg-white/5'}`} />
                )}
              </div>
            );
          })}
        </div>

        <Card className="bg-white/[0.02] backdrop-blur-3xl border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          {/* Top Line Glow */}
          <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-50" />

          <CardHeader className="p-10 border-b border-white/5">
            <div className="flex justify-between items-end">
              <div>
                <CardTitle className="text-2xl font-bold italic tracking-tight text-white uppercase">
                  {step === "info" && "Subject Identity"}
                  {step === "review" && "Manifest Review"}
                  {step === "pay" && "Financial Clearing"}
                </CardTitle>
                <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">
                  Node Token: {reservationId?.slice(0, 16)}...
                </p>
              </div>
              <Lock className="w-5 h-5 text-white/10" />
            </div>
          </CardHeader>

          <CardContent className="p-10 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" /> {error}
              </div>
            )}

            {/* Step 1: Attendee Info */}
            {step === "info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Legal First Name</label>
                    <Input
                      value={attendee.firstName}
                      onChange={(e) => setAttendee({ ...attendee, firstName: e.target.value })}
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 text-white text-xs font-bold"
                      placeholder="GIVEN NAME"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Legal Last Name</label>
                    <Input
                      value={attendee.lastName}
                      onChange={(e) => setAttendee({ ...attendee, lastName: e.target.value })}
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 text-white text-xs font-bold"
                      placeholder="SURNAME"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Communications Node (Email)</label>
                  <Input
                    type="email"
                    value={attendee.email}
                    onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
                    className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 text-white text-xs font-bold"
                    placeholder="EMAIL IDENTITY"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Security Liaison (Phone)</label>
                  <Input
                    type="tel"
                    value={attendee.phone}
                    onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })}
                    className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 text-white text-xs font-bold"
                    placeholder="TELEPHONE"
                  />
                </div>

                <label className="flex items-start gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.03] transition-all group">
                  <input
                    type="checkbox"
                    checked={attendee.termsAccepted}
                    onChange={(e) => setAttendee({ ...attendee, termsAccepted: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded-lg bg-black border-white/10 text-[#FF0000] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider leading-relaxed">
                    I acknowledge and authorize the <a href="#" className="text-white underline decoration-[#FF0000]">Deployment Terms</a> and operational protocols.
                  </span>
                </label>

                <div className="flex justify-end pt-4">
                  <Button variant="premium" onClick={handleAttendeeSubmit} disabled={loading} className="h-12 px-10 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#FF0000]/20 border-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "PROCEED TO MANIFEST →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Manifest Review */}
            {step === "review" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {summary ? (
                  <div className="space-y-4">
                    {[
                      { label: "Operation", val: summary.eventName },
                      { label: "Clearance Tier", val: summary.ticketCategoryName },
                      { label: "Authorized Units", val: summary.quantity },
                      { label: "Unit Valuation", val: `$${summary.unitPrice?.toFixed(2)}` }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{item.label}</span>
                        <span className="text-xs font-bold text-white uppercase italic">{item.val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-8 bg-gradient-to-r from-[#FF0000]/10 to-transparent rounded-[2rem] border border-[#FF0000]/20 mt-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF0000]">Total Gross Valuation</span>
                      <span className="text-3xl font-bold tracking-tighter text-white">${summary.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Decrypting...</div>
                )}
                <div className="flex justify-between gap-4 pt-6">
                  <Button variant="ghost" onClick={() => setStep("info")} className="h-12 px-8 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                    <ArrowLeft className="w-3 h-3 mr-2" /> Adjust Identity
                  </Button>
                  <Button variant="premium" onClick={handleProceedToPayment} disabled={loading} className="h-12 px-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-0">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "FINALIZE CLEARING →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Financial Gateway */}
            {step === "pay" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {!clientSecret || !stripePromise ? (
                  <div className="h-40 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Syncing Gateway...</div>
                ) : (
                  <div className="p-6 bg-white/[0.01] rounded-[2rem] border border-white/5">
                    <Elements stripe={stripePromise} options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: { colorPrimary: '#FF0000', colorBackground: '#0D0D0D' }
                      }
                    }}>
                      <PaymentForm
                        reservationId={reservationId!}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  </div>
                )}
                <div className="flex flex-col gap-6 pt-4">
                  <Button variant="ghost" onClick={() => setStep("review")} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white">
                    <ArrowLeft className="w-3 h-3 mr-2" /> Back to Manifest
                  </Button>
                  <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-3">
                    <Lock className="w-3 h-3 text-green-500" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Cleared via Secure Stripe Terminal</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center pb-20">
          <Link to="/" className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-[#FF0000] transition-all flex items-center justify-center gap-2">
            Terminate Session & Return
          </Link>
        </div>
      </div>
    </div>
  );
}