import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Ticket, Search, Mail } from "lucide-react";

interface SimpleTicket {
  ticketCode: string;
  eventName: string;
  categoryName: string;
  eventDate: string;
  attendeeName: string;
  checkedIn: boolean;
}

export default function MyTicketsPage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<SimpleTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      // Use a generic GET call since the my-tickets endpoint might use email lookup
      const { data } = await (
        await import("../../service/axiosConfig")
      ).default.get("/tickets/my-tickets", { params: { email } });
      setTickets(data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Could not find tickets for this email.",
      );
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <Ticket className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className="text-3xl font-bold font-heading">My Tickets</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email to view and download your purchased tickets.
        </p>
      </div>

      <Card className="mb-8 animate-fade-in-up">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !email}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Find Tickets"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md mb-6">
          {error}
        </div>
      )}

      {searched && tickets.length === 0 && !error && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No tickets found for this email address.</p>
        </div>
      )}

      {tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.ticketCode} className="animate-fade-in-up">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {ticket.eventName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {ticket.categoryName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.eventDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      Code: {ticket.ticketCode}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        ticket.checkedIn
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {ticket.checkedIn ? "Checked In" : "Valid"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
