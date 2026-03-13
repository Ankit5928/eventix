import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";
import publicService from "../../service/publicService";
import {
  PublicEventDetailDTO,
  PublicTicketCategoryDTO,
} from "../../types/public.types";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<PublicEventDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const data = await publicService.fetchEventDetail(Number(id));
        setEvent(data);
      } catch (err: any) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  const handleSelectTicket = async (cat: PublicTicketCategoryDTO) => {
    if (!id) return;
    setCreating(true);
    setCreateError(null);
    try {
      const reservation = await publicService.createReservation(Number(id), {
        items: [
          {
            ticketCategoryId: cat.id,
            quantity: 1,
          },
        ],
      });
      navigate(`/checkout/${reservation.reservationId}`);
    } catch (err: any) {
      // Log error details for debugging
      if (err?.response?.data?.message) {
        setCreateError(`Reservation failed: ${err.response.data.message}`);
        console.error("Reservation error:", err.response.data);
      } else {
        setCreateError("Failed to create reservation. Please try again.");
        console.error("Reservation error:", err);
      }
    } finally {
      setCreating(false);
    }
  };

  /*
  useEffect(() => {
    // In a real app we would load event and categories here
    apiClient.get(`/public/events/${id}`)
      .finally(() => setIsLoading(false));
  }, [id]);
  */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event details...
      </div>
    );
  }
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error || "Event not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-muted overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 backdrop-blur-md"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-4">
                {event.title}
              </h1>
              {/* <p className="text-xl font-medium text-primary mb-6">Organized by {event.organizationName}</p> */}
              <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground p-4 bg-card rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {new Date(event.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {event.location}
                </div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none animate-fade-in-up delay-100">
              <h2 className="text-2xl font-semibold mt-8 mb-4">
                About This Event
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </div>
          {/* Sidebar / Tickets */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-primary/20 bg-background/95 backdrop-blur-sm animate-fade-in-up delay-200">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl">Tickets</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select your ticket type below.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {createError && (
                  <div className="p-2 text-destructive text-sm text-center">
                    {createError}
                  </div>
                )}
                <div className="divide-y">
                  {event.ticketCategories.map((cat) => (
                    <div key={cat.id} className="p-6 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{cat.name}</h4>
                          <span className="text-sm text-primary font-medium">
                            {cat.quantityAvailable} available
                          </span>
                        </div>
                        <span className="text-xl font-bold">${cat.price}</span>
                      </div>
                      <Button
                        className="w-full mt-2"
                        disabled={cat.quantityAvailable === 0 || creating}
                        onClick={() => handleSelectTicket(cat)}
                      >
                        {cat.quantityAvailable > 0
                          ? creating
                            ? "Processing..."
                            : "Select Ticket"
                          : "Sold Out"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
