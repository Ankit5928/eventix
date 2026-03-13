// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/Card";
// import { Button } from "../../components/ui/Button";
// import { Input } from "../../components/ui/Input";
// import { Link } from "react-router-dom";
// import { Search, MapPin, Calendar as CalendarIcon, Clock, Award } from "lucide-react";
// import publicService from "../../service/publicService";

// interface EventSummary {
//   id: number;
//   title: string;
//   description: string;
//   startDate: string;
//   location: string;
//   imageUrl: string | null;
//   minPrice: number;
// }

// export default function EventListingPage() {
//   const [events, setEvents] = useState<EventSummary[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setIsLoading(true);
//       try {
//         const result = await publicService.fetchEvents({ page: 0, size: 12 });
//         setEvents(result.content);
//       } catch (error) {
//         console.error("Failed to fetch events", error);
//         setEvents([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const filteredEvents = events.filter((e) => {
//     const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const eventDate = new Date(e.startDate);
//     const matchesFrom = !dateFrom || eventDate >= new Date(dateFrom);
//     const matchesTo = !dateTo || eventDate <= new Date(dateTo + "T23:59:59");
//     return matchesSearch && matchesFrom && matchesTo;
//   });

//   return (
//     <div className="premium-page-container">
//       <div className="premium-bg-overlay" />

//       {/* Background depth elements */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF3333]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

//       <div className="relative z-10">
//         {/* Hero Section */}
//         <section className="pt-24 pb-16 px-4">
//           <div className="container mx-auto text-center max-w-3xl">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#FF3333] text-xs mb-6 uppercase tracking-widest">
//               <Award className="h-3 w-3" /> Exclusive Gatherings
//             </div>
//             <h1 className="premium-title mb-6">
//               Discover Your Next <span className="premium-gradient-text">Experience</span>
//             </h1>
//             <div className="relative max-w-xl mx-auto group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FF3333]" />
//               <Input
//                 className="pl-12 h-14 text-lg rounded-2xl border-white/10 bg-white/5 backdrop-blur-md focus:border-[#FF3333]/50 transition-all text-white placeholder:text-white/30"
//                 placeholder="Search for events..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Event Grid & Filters */}
//         <section className="container mx-auto px-4 py-12">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 border-b border-white/5 pb-8">
//             <h2 className="text-2xl font-bold">Upcoming Events</h2>
//             <div className="flex flex-wrap items-center gap-4 text-sm">
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 focus:border-[#FF3333] outline-none"
//               />
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 focus:border-[#FF3333] outline-none"
//               />
//             </div>
//           </div>

//           {isLoading ? (
//             /* Updated Skeleton to 5 columns */
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="premium-card h-[380px] animate-pulse overflow-hidden" />
//               ))}
//             </div>
//           ) : filteredEvents.length === 0 ? (
//             <div className="text-center py-24 premium-card border-dashed bg-transparent">
//               <CalendarIcon className="mx-auto h-16 w-16 text-[#FF3333] mb-4 opacity-20" />
//               <h3 className="text-2xl font-bold mb-2">No Empires Found</h3>
//             </div>
//           ) : (
//             /* THE UPDATED GRID: Added xl:grid-cols-5 and reduced gap */
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {filteredEvents.map((event, index) => (
//                 <Card
//                   key={event.id}
//                   className="premium-card group border-0 overflow-hidden flex flex-col bg-white"
//                   style={{ animationDelay: `${index * 80}ms` }}
//                 >
//                   {/* Aspect ratio changed to 4:3 for narrower cards */}
//                   <div className="aspect-[4/3] relative overflow-hidden bg-[#1A0000]">
//                     {event.imageUrl ? (
//                       <img
//                         src={event.imageUrl}
//                         alt={event.title}
//                         className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
//                       />
//                     ) : (
//                       <div className="absolute inset-0 bg-gradient-to-br from-[#330000] to-[#1A0000] flex items-center justify-center">
//                         <CalendarIcon className="h-10 w-10 text-[#FF3333]/20" />
//                       </div>
//                     )}
//                     <div className="absolute top-2 right-2 bg-[#FF3333] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
//                       ${event.minPrice}+
//                     </div>
//                   </div>

//                   {/* Reduced internal padding for slim cards */}
//                   <CardHeader className="pb-2 px-4 pt-4">
//                     <CardTitle className="text-base text-black font-bold line-clamp-1 group-hover:text-[#FF3333] transition-colors leading-tight">
//                       {event.title}
//                     </CardTitle>
//                     <p className="text-[9px] font-bold text-[#FF3333]/70 uppercase tracking-tighter">
//                       Premium Event
//                     </p>
//                   </CardHeader>

//                   <CardContent className="px-4 pb-3 flex-grow space-y-2">
//                     <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">
//                       {event.description}
//                     </p>

//                     <div className="space-y-1.5 text-[10px] font-semibold text-[#330000]">
//                       <div className="flex items-center gap-2">
//                         <Clock className="h-3 w-3 text-[#FF3333]" />
//                         <span>
//                           {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="h-3 w-3 text-[#FF3333]" />
//                         <span className="line-clamp-1">{event.location}</span>
//                       </div>
//                     </div>
//                   </CardContent>

//                   <CardFooter className="px-4 pb-4 pt-0">
//                     {/* Slimmer button for 5-column layout */}
//                     <Button variant="premium" className="w-full h-8 text-[10px] uppercase tracking-wider" asChild>
//                       <Link to={`/event/${event.id}`}>View Pass</Link>
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }


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
import { Search, MapPin, Calendar as CalendarIcon, Clock, Award, Sparkles } from "lucide-react";
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
        const result = await publicService.fetchEvents({ page: 0, size: 15 }); // Increased size for 5-col rows
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
    <div className="premium-page-container min-h-screen pb-20">
      <div className="premium-bg-overlay" />

      {/* Animated cinematic depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF3333]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-[#990000]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FF3333] text-[10px] font-bold mb-6 uppercase tracking-[0.3em] backdrop-blur-md">
              <Sparkles className="h-3 w-3 animate-pulse" /> Curated Elite Access
            </div>

            <h1 className="premium-title mb-8 leading-tight">
              Embark on Your Next <span className="premium-gradient-text">Legendary Experience</span>
            </h1>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FF3333] group-focus-within:scale-110 transition-transform" />
              <Input
                className="pl-14 h-16 text-lg rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-xl focus:border-[#FF3333]/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20 shadow-2xl"
                placeholder="Search global events, summits, and festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Event Grid & Luxury Filters */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-white">Upcoming Portfolio</h2>
              <p className="text-white/40 text-sm font-light mt-1 uppercase tracking-widest">Global Reservation Terminal</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="text-[10px] font-bold text-white/30 uppercase pl-2">Period</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:ring-0 outline-none cursor-pointer"
                />
                <div className="w-px h-4 bg-white/10" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:ring-0 outline-none cursor-pointer"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => { setDateFrom(""); setDateTo(""); }}
                    className="text-[10px] font-black text-[#FF3333] uppercase hover:text-white transition-colors pr-2 pl-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="premium-card h-[400px] animate-pulse overflow-hidden bg-white/5 border-white/5" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-32 premium-card border-dashed bg-white/[0.01] border-white/10">
              <CalendarIcon className="mx-auto h-20 w-20 text-[#FF3333] mb-6 opacity-10" />
              <h3 className="text-2xl font-bold mb-2 text-white/80">No Experiences Found</h3>
              <p className="text-white/30 text-sm font-light italic">Refine your search criteria for exclusive access.</p>
            </div>
          ) : (
            /* THE 5-COLUMN GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="premium-card group border-0 overflow-hidden flex flex-col bg-white shadow-2xl hover:shadow-[#FF3333]/10 transition-all duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-[#0A0000]">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 brightness-90 group-hover:brightness-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0000] to-[#0A0000] flex items-center justify-center">
                        <Award className="h-12 w-12 text-[#FF3333]/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                      ${event.minPrice}+
                    </div>
                  </div>

                  <CardHeader className="pb-1 px-5 pt-5">
                    <CardTitle className="text-base text-black font-black tracking-tight line-clamp-1 group-hover:text-[#FF3333] transition-colors leading-tight">
                      {event.title}
                    </CardTitle>
                    <p className="text-[9px] font-black text-[#FF3333]/80 uppercase tracking-widest mt-1">
                      Elite Series
                    </p>
                  </CardHeader>

                  <CardContent className="px-5 pb-4 flex-grow space-y-3 mt-2">
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-medium italic">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-[10px] font-bold text-[#330000]/80">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#FF3333]/5 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-[#FF3333]" />
                        </div>
                        <span>
                          {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#FF3333]/5 flex items-center justify-center">
                          <MapPin className="h-3 w-3 text-[#FF3333]" />
                        </div>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-5 pb-5 pt-0">
                    <Button variant="premium" className="w-full h-10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl" asChild>
                      <Link to={`/event/${event.id}`}>Secure Entry</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}