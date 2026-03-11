import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock Data
  const event = {
    id: Number(id),
    title: "Summer Tech Conference 2026",
    description: "Join us for the biggest tech conference of the year featuring keynotes from industry leaders. This three-day event will cover AI, cloud computing, and the future of web development.",
    startDate: "2026-07-15T09:00:00",
    endDate: "2026-07-17T17:00:00",
    location: "San Francisco Convention Center",
    organizationName: "TechEvents Inc",
    imagePath: "",
  };

  const categories = [
    { id: 1, name: "Early Bird General", price: 199.99, quantityAvailable: 50 },
    { id: 2, name: "VIP Pass", price: 499.99, quantityAvailable: 10 },
  ];

  /*
  useEffect(() => {
    // In a real app we would load event and categories here
    apiClient.get(`/public/events/${id}`)
      .finally(() => setIsLoading(false));
  }, [id]);
  */

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-muted overflow-hidden">
        {event.imagePath ? (
           <img src={`http://localhost:8085/api/v1/events/images/${event.imagePath}`} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-md" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight mb-4">{event.title}</h1>
              <p className="text-xl font-medium text-primary mb-6">Organized by {event.organizationName}</p>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground p-4 bg-card rounded-xl border shadow-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {event.location}
                </div>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none animate-fade-in-up delay-100">
              <h2 className="text-2xl font-semibold mt-8 mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{event.description}</p>
            </div>
          </div>

          {/* Sidebar / Tickets */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-primary/20 bg-background/95 backdrop-blur-sm animate-fade-in-up delay-200">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl">Tickets</CardTitle>
                <p className="text-sm text-muted-foreground">Select your ticket type below.</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{cat.name}</h4>
                          <span className="text-sm text-primary font-medium">{cat.quantityAvailable} available</span>
                        </div>
                        <span className="text-xl font-bold">${cat.price}</span>
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        disabled={cat.quantityAvailable === 0}
                        onClick={() => navigate(`/checkout/mock-res-${cat.id}`)}
                      >
                        {cat.quantityAvailable > 0 ? 'Select Ticket' : 'Sold Out'}
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