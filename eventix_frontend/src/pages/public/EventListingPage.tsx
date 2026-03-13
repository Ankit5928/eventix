import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";
import publicService from "../../service/publicService";

interface EventSummary {
  id: number;
  title: string;
  description: string;
  startDate: string;
  location: string;
  imageUrl: string | null;
  minPrice: number;
}

export default function EventListingPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const result = await publicService.fetchEvents({ page: 0, size: 12 });
        setEvents(result.content);
      } catch (error) {
        console.error("Failed to fetch events", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
    const eventDate = new Date(e.startDate);
    const matchesFrom = !dateFrom || eventDate >= new Date(dateFrom);
    const matchesTo = !dateTo || eventDate <= new Date(dateTo + "T23:59:59");
    return matchesSearch && matchesFrom && matchesTo;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-16 px-4">
        <div className="container mx-auto text-center max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-6 tracking-tight">
            Discover Your Next <span className="text-gradient">Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Find and book tickets to the most exciting events, conferences, and
            festivals around you.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 h-14 text-lg rounded-full shadow-lg border-primary/20 bg-background/80 backdrop-blur-md"
              placeholder="Search for events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Event Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold font-heading">Upcoming Events</h2>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <label className="text-muted-foreground whitespace-nowrap">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-muted-foreground whitespace-nowrap">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-xs text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border bg-card h-[400px] animate-pulse"
              >
                <div className="h-48 bg-muted rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-20 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              We couldn't find any events matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                className="overflow-hidden group hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                      <CalendarIcon className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    From ${event.minPrice}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <p className="text-xs font-medium text-primary">
                    By {event.title}
                  </p>
                </CardHeader>

                <CardContent className="pb-3 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      {new Date(event.startDate).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t">
                  <Button asChild className="w-full group-hover:bg-primary/90">
                    <Link to={`/event/${event.id}`}>Get Tickets</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
