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
  MoreVertical,
  ArrowUpRight,
  Sparkles,
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
  const { dashboardEvents, isLoading } = useAppSelector(
    (state) => state.events,
  );
  const { user } = useAppSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResponse | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [cancellingEventId, setCancellingEventId] = useState<number | null>(
    null,
  );

  const orgId = user?.currentOrganizationId || 1;

  const loadEvents = useCallback(() => {
    dispatch(fetchOrgEvents({ orgId, search: searchTerm }));
  }, [dispatch, orgId, searchTerm]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleCreateEvent = async (
    data: CreateEventRequest,
  ): Promise<EventResponse | undefined> => {
    setCreateLoading(true);
    setError(null);
    try {
      const newEvent = await eventService.createEvent(orgId, data);
      setModalOpen(false);
      setSuccess("Manifest established.");
      loadEvents();
      return newEvent;
    } catch (err: any) {
      setError("Authorization error. Failed to initiate event.");
      return undefined;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateEvent = async (data: UpdateEventRequest) => {
    if (!editingEvent) return;
    setError(null);
    await eventService.updateEvent(orgId, editingEvent.id, data);
    setSuccess("Manifest synchronized.");
    setEditModalOpen(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleCancelEvent = async (eventId: number) => {
    setError(null);
    try {
      await eventService.cancelEvent(orgId, eventId, true);
      setSuccess("Event deployment terminated.");
      setCancellingEventId(null);
      loadEvents();
    } catch (err: any) {
      setError("Protocol error during termination.");
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
      setSuccess("Tier access added.");
      loadEvents();
    } catch (err: any) {
      setError("Tier synchronization failed.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const openEdit = (event: any) => {
    eventService.getPublicEvent(event.id).then((full) => {
      setEditingEvent(full);
      setEditModalOpen(true);
    });
  };

  return (
    <div className="space-y-10 animate-fade-in-up bg-background min-h-screen text-white">
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF3333]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Portfolio Terminal
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter italic">
            Event <span className="text-[#FF3333]">Deployments</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase font-medium">
            Synchronized Global Operations
          </p>
        </div>

        <Button
          variant="premium"
          onClick={() => setModalOpen(true)}
          disabled={createLoading}
          className="h-12 px-8 rounded-2xl shadow-2xl shadow-[#FF3333]/20 border-0"
        >
          {createLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          Initialize New Manifest
        </Button>
      </div>

      {/* Notifications */}
      {(error || success) && (
        <div className="animate-in fade-in slide-in-from-top-4">
          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {error}
              </span>
            </div>
          )}
          {success && (
            <div className="bg-green-500/5 border border-green-500/20 text-green-500 px-6 py-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {success}
              </span>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto hover:text-white transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Overlay */}
      {cancellingEventId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center space-y-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h3 className="text-2xl font-bold italic tracking-tight">
              Terminate Deployment?
            </h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              This action will revoke access and notify all liaison officers.
              This process is irreversible.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="premium"
                className="w-full h-12 rounded-xl"
                onClick={() => handleCancelEvent(cancellingEventId)}
              >
                Confirm Termination
              </Button>
              <Button
                variant="ghost"
                className="w-full text-white/40 hover:text-white"
                onClick={() => setCancellingEventId(null)}
              >
                Abort
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Terminal Grid */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#FF3333] transition-colors" />
            <Input
              className="pl-12 h-11 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#FF3333]/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
              placeholder="FILTER MANIFEST..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-[#FF3333]" />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5">
                <th className="px-8 py-6 font-black">Asset Details</th>
                <th className="px-8 py-6 font-black">Deployment Date</th>
                <th className="px-8 py-6 font-black text-center">Status</th>
                <th className="px-8 py-6 font-black">Velocity</th>
                <th className="px-8 py-6 font-black text-right">
                  Terminal Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {dashboardEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-white/[0.02] transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center overflow-hidden border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt=""
                            className="h-full w-full object-cover brightness-75 group-hover:brightness-100"
                          />
                        ) : (
                          <CalendarIcon className="h-5 w-5 text-white/20" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold tracking-tight text-white group-hover:text-[#FF3333] transition-colors">
                          {event.title}
                        </div>
                        <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">
                          Asset ID: #{event.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-white/60 tracking-widest uppercase">
                      {new Date(event.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-[0.2em] ${
                        event.status === "PUBLISHED" ||
                        event.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : event.status === "DRAFT"
                            ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Ticket className="h-3.5 w-3.5 text-[#FF3333]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white">
                          {event.ticketsSold}
                        </span>
                        <span className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">
                          Authorized Passes
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-[#FF3333]/10 text-white/40 hover:text-[#FF3333]"
                        onClick={() => openEdit(event)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-[#FF3333]/10 text-white/40 hover:text-[#FF3333]"
                      >
                        <Link to={`/events/${event.id}/attendees`}>
                          <Users className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-10 px-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF3333]/40 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white"
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setCategoryModalOpen(true);
                        }}
                      >
                        Add Tier
                      </Button>
                      {event.status !== "CANCELLED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-red-500/10 text-white/20 hover:text-red-500"
                          onClick={() => setCancellingEventId(event.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && dashboardEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <CalendarIcon className="h-16 w-16" />
                      <p className="text-xs font-black uppercase tracking-[0.5em]">
                        No Assets Detected
                      </p>
                    </div>
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
