import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PlusCircle, Search, Edit2, Ticket, Users } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  startDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  ticketsSold: number;
  capacity: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real application, make a request to /api/v1/events/organization/{id}
    // Using mock data for UI visual completion
    setEvents([
      { id: 1, title: 'Summer Tech Conf 2026', startDate: '2026-07-15T09:00:00', status: 'PUBLISHED', ticketsSold: 250, capacity: 500 },
      { id: 2, title: 'Developer Meetup Q3', startDate: '2026-08-10T18:00:00', status: 'DRAFT', ticketsSold: 0, capacity: 100 },
    ]);
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Events</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's events and ticket sales.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center justify-between bg-muted/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9 h-9" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
              <tr>
                <th className="px-6 py-4 font-medium">Event Details</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Sales</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{event.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>{event.ticketsSold} / {event.capacity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Edit Event">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button asChild variant="ghost" size="icon" title="Attendees">
                        <Link to={`/events/${event.id}/attendees`}>
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No events found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
