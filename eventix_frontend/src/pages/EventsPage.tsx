import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchOrgEvents } from "../store/slices/eventSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  PlusCircle,
  Search,
  Edit2,
  Ticket,
  Users,
  Loader2,
  AlertCircle,
  Calendar as CalendarIcon,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import AddEventModal from "../modal/AddEventModal";
import EditEventModal from "../modal/EditEventModal";
import AddCategoryModal from "../modal/AddCategoryModal";
import ticketCategoryService from "../service/ticketCategoryService";
import { CreateTicketCategoryRequest } from "../types/ticket-category.types";
import eventService from "../service/eventService";
import {
  CreateEventRequest,
  UpdateEventRequest,
  EventResponse,
} from "../types/event.types";

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { dashboardEvents, isLoading } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResponse | null>(null);

  // Category modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Cancel confirm
  const [cancellingEventId, setCancellingEventId] = useState<number | null>(null);

  const orgId = user?.currentOrganizationId || 1;

  const loadEvents = useCallback(() => {
    dispatch(fetchOrgEvents({ orgId, search: searchTerm }));
  }, [dispatch, orgId, searchTerm]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCreateEvent = async (
    data: CreateEventRequest
  ): Promise<EventResponse | undefined> => {
    setCreateLoading(true);
    setError(null);
    try {
      const newEvent = await eventService.createEvent(orgId, data);
      setModalOpen(false);
      setSuccess("Event created successfully!");
      loadEvents();
      return newEvent;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create event");
      return undefined;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateEvent = async (data: UpdateEventRequest) => {
    if (!editingEvent) return;
    setError(null);
    await eventService.updateEvent(orgId, editingEvent.id, data);
    setSuccess("Event updated successfully!");
    setEditModalOpen(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleCancelEvent = async (eventId: number) => {
    setError(null);
    try {
      await eventService.cancelEvent(orgId, eventId, true);
      setSuccess("Event cancelled.");
      setCancellingEventId(null);
      loadEvents();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to cancel event");
    }
  };

  const handleCreateCategory = async (data: CreateTicketCategoryRequest) => {
    if (!selectedEventId) return;
    setCategoryLoading(true);
    setError(null);
    try {
      await ticketCategoryService.createCategory(selectedEventId, data);
      setCategoryModalOpen(false);
      setSelectedEventId(null);
      setSuccess("Category added!");
      loadEvents();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create ticket category");
    } finally {
      setCategoryLoading(false);
    }
  };

  const openEdit = (event: any) => {
    // fetch full event details
    eventService.getPublicEvent(event.id).then((full) => {
      setEditingEvent(full);
      setEditModalOpen(true);
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <AddEventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateEvent}
      />
      <EditEventModal
        open={editModalOpen}
        event={editingEvent}
        onClose={() => {
          setEditModalOpen(false);
          setEditingEvent(null);
        }}
        onUpdate={handleUpdateEvent}
      />
      <AddCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setSelectedEventId(null);
        }}
        onSubmit={handleCreateCategory}
        isLoading={categoryLoading}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's events and ticket sales.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={createLoading}>
          {createLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {createLoading ? "Creating..." : "Create Event"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cancel confirm dialog */}
      {cancellingEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Cancel Event?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will cancel the event. Attendees will be notified. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancellingEventId(null)}>
                Keep Event
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancelEvent(cancellingEventId)}
              >
                Cancel Event
              </Button>
            </div>
          </div>
        </div>
      )}

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
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
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
              {dashboardEvents.map((event) => (
                <tr key={event.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden border">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <CalendarIcon className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="font-semibold text-foreground">{event.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.startDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                        event.status === "PUBLISHED" || event.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : event.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span>{event.ticketsSold} Sold</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Event"
                        onClick={() => openEdit(event)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button asChild variant="ghost" size="icon" title="Attendees">
                        <Link to={`/events/${event.id}/attendees`}>
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setCategoryModalOpen(true);
                        }}
                      >
                        Add Category
                      </Button>
                      {event.status !== "CANCELLED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Cancel Event"
                          onClick={() => setCancellingEventId(event.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && dashboardEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No events found. Click "Create Event" to get started.
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
