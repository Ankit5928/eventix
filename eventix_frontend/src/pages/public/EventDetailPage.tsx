import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MapPin, Calendar, Clock, ArrowLeft, ShieldCheck, Info, Award, Sparkles } from "lucide-react";
import publicService from "../../service/publicService";
import {
  PublicEventDetailDTO,
  PublicTicketCategoryDTO,
} from "../../types/public.types";

interface SuggestedEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  location: string;
  imageUrl: string | null;
  minPrice: number;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<PublicEventDetailDTO | null>(null);
  const [suggestedEvents, setSuggestedEvents] = useState<SuggestedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventData() {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.fetchEventDetail(Number(id));
        setEvent(data);
        const suggested = await publicService.fetchEvents({ page: 0, size: 4 });
        setSuggestedEvents(suggested.content);
      } catch (err: any) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEventData();
  }, [id]);

  const handleSelectTicket = async (cat: PublicTicketCategoryDTO) => {
    if (!id) return;
    setCreating(true);
    setCreateError(null);
    try {
      const reservation = await publicService.createReservation(Number(id), {
        items: [{ ticketCategoryId: cat.id, quantity: 1 }],
      });
      navigate(`/checkout/${reservation.reservationId}`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || "Failed to create reservation.";
      setCreateError(errMsg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="premium-page-container flex items-center justify-center bg-[#0A0000]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-2 border-[#FF3333]/20 border-t-[#FF3333] rounded-full animate-spin" />
          <p className="text-[#FF3333] font-bold tracking-[0.3em] uppercase text-xs animate-pulse">Initializing Experience</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="premium-page-container flex items-center justify-center text-center px-4 bg-[#0A0000]">
        <Card variant="premium" className="p-12 max-w-md border-white/10">
          <Info className="w-12 h-12 text-[#FF3333] mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-white">{error || "Event not found."}</h2>
          <Button variant="premium" onClick={() => navigate("/")} className="w-full">Return to Gallery</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="premium-page-container pb-24 overflow-y-auto bg-[#0A0000]">
      <div className="premium-bg-overlay opacity-40" />

      {/* Cinematic Background Glows */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#FF3333]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#990000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header with Parallax-ready feel */}
      <div className="relative h-[55vh] min-h-[450px] w-full overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} className="w-full h-full object-cover scale-105 brightness-50" alt={event.title} />
        ) : (
          <div className="absolute inset-0 bg-[#1A0000] flex items-center justify-center">
            <Calendar className="h-32 w-32 text-[#FF3333]/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0000] via-[#0A0000]/40 to-transparent" />

        <div className="absolute top-10 left-10 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-[#FF3333]/20 backdrop-blur-xl border border-white/10 rounded-full transition-all group text-white text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-48 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            <div className="animate-fade-in-up space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-[#FF3333] to-transparent" />
                <span className="text-[#FF3333] font-black uppercase tracking-[0.4em] text-[10px]">Elite Access Portfolio</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tighter text-white">
                {event.title.split(' ').map((word, i) => (
                  <span key={i} className={i === event.title.split(' ').length - 1 ? "premium-gradient-text" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              {/* Glassmorphism Info Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-1 bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-4 p-5 rounded-2xl transition-colors text-white border-r border-white/5">
                  <Calendar className="h-5 w-5 text-[#FF3333]" />
                  <div>
                    <p className="text-[9px] uppercase text-white/40 tracking-widest font-bold mb-0.5">Date</p>
                    <p className="text-sm font-bold">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl transition-colors text-white border-r border-white/5">
                  <Clock className="h-5 w-5 text-[#FF3333]" />
                  <div>
                    <p className="text-[9px] uppercase text-white/40 tracking-widest font-bold mb-0.5">Doors</p>
                    <p className="text-sm font-bold">
                      {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl transition-colors text-white">
                  <MapPin className="h-5 w-5 text-[#FF3333]" />
                  <div>
                    <p className="text-[9px] uppercase text-white/40 tracking-widest font-bold mb-0.5">Venue</p>
                    <p className="text-sm font-bold line-clamp-1 tracking-tight">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <Card variant="premium" className="p-10 md:p-14 border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-3xl shadow-3xl">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-5 w-5 text-[#FF3333] animate-pulse" />
                <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white">Curated Narrative</h2>
              </div>
              <div className="text-white/70 leading-[1.8] text-xl font-light italic tracking-tight">
                {event.description}
              </div>
            </Card>

            {/* SUGGESTED EVENTS GRID */}
            <div className="pt-16 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tighter">Recommended Experiences</h3>
                <div className="h-px flex-grow mx-8 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedEvents.map((item: SuggestedEvent, index: number) => (
                  <Card
                    key={item.id}
                    className="premium-card group border-0 overflow-hidden flex flex-col bg-[#111] hover:bg-[#161616] transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
                      ) : (
                        <div className="absolute inset-0 bg-[#222] flex items-center justify-center">
                          <Award className="h-8 w-8 text-[#FF3333]/10" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-[#FF3333] text-[10px] font-black px-2.5 py-1 rounded-full">
                        ${item.minPrice}+
                      </div>
                    </div>
                    <CardHeader className="pb-1 px-5 pt-5">
                      <CardTitle className="text-sm text-white font-bold tracking-tight line-clamp-1 group-hover:text-[#FF3333] transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 flex-grow">
                      <p className="text-[10px] text-white/40 font-medium tracking-wide line-clamp-1 mb-4">{item.location}</p>
                      <Button variant="premium" className="w-full h-9 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full" asChild>
                        <Link to={`/event/${item.id}`}>Explore</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Ticket Card */}
          <div className="lg:col-span-4 relative">
            <Card className="sticky top-28 border-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] 
                            bg-gradient-to-b from-[#151515] to-[#0A0000] border-t border-white/10 
                            overflow-hidden w-full max-w-[380px] mx-auto lg:ml-auto ring-1 ring-white/10">

              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-8">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-xl font-bold tracking-[0.1em] uppercase text-white">Select Tier</CardTitle>
                  <ShieldCheck className="text-[#FF3333] h-5 w-5" />
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Authorized Reservation Terminal</p>
              </CardHeader>

              <CardContent className="p-6">
                {createError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] text-center font-bold tracking-wide">
                    {createError}
                  </div>
                )}

                <div className="space-y-4">
                  {event.ticketCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] 
                                 hover:border-[#FF3333]/40 transition-all flex flex-col gap-4 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 text-white">
                          <h4 className="font-bold text-sm tracking-tight group-hover:text-[#FF3333] transition-colors">{cat.name}</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              {cat.quantityAvailable} Passports Left
                            </span>
                          </div>
                        </div>
                        <span className="text-xl font-black premium-gradient-text">${cat.price}</span>
                      </div>

                      <Button
                        variant="premium"
                        className="w-full h-11 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl"
                        disabled={cat.quantityAvailable === 0 || creating}
                        onClick={() => handleSelectTicket(cat)}
                      >
                        {cat.quantityAvailable > 0 ? (creating ? "Validating..." : "Secure Pass") : "Allocation Full"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>

              <div className="bg-black/40 p-5 text-center border-t border-white/5">
                <p className="text-[9px] text-white/20 tracking-[0.1em] italic font-medium">Final cost includes all premium service allocations.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}