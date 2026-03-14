import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
  getAttendees,
  getAttendeeDetails,
  downloadAttendeesCSV,
} from "../service/attendeeService";
import {
  AttendeeDTO,
  AttendeeDetailDTO,
  AttendeeFilters,
  PaginatedResponse,
} from "../types/attendee.types";

const AttendeesPage = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [attendees, setAttendees] = useState<AttendeeDTO[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const [filters, setFilters] = useState<
    Omit<AttendeeFilters, "page" | "size">
  >({
    search: "",
    categoryId: "",
    checkedIn: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [selectedAttendee, setSelectedAttendee] =
    useState<AttendeeDetailDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fetchAttendeesData = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      const data: PaginatedResponse<AttendeeDTO> = await getAttendees(eventId, {
        ...filters,
        page: pagination.page,
        size: pagination.size,
      });
      setAttendees(data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } catch (error) {
      console.error("Sync Failure:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, filters, pagination.page, pagination.size]);

  useEffect(() => {
    fetchAttendeesData();
  }, [fetchAttendeesData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
      setPagination((prev) => ({ ...prev, page: 0 }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleExportCSV = async () => {
    if (!eventId) return;
    setIsExporting(true);
    try {
      await downloadAttendeesCSV(eventId, filters);
    } catch (error) {
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const openAttendeeDetails = async (ticketId: string) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);
    try {
      const details = await getAttendeeDetails(ticketId);
      setSelectedAttendee(details);
    } catch (error) {
      console.error("Detail Fetch Error:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAttendee(null), 300);
  };

  const getStatusBadge = (status: string, checkedInAt: string | null) => {
    if (checkedInAt) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Verified Entry
        </span>
      );
    }

    if (status === "VALID" || status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Clock className="w-3 h-3" />
          Pending Node
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
        <XCircle className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in-up bg-background min-h-screen text-white p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF3333]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Registry Terminal
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter italic">
            Liaison <span className="text-[#FF3333]">Manifest</span>
          </h1>
          <p className="text-white/40 text-xs tracking-widest uppercase font-medium">
            Global Attendee Intelligence & Node Verification
          </p>
        </div>

        <Button
          variant="premium"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="h-12 px-8 rounded-2xl shadow-2xl shadow-[#FF3333]/20 border-0"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Decrypting Data..." : "Export Manifest CSV"}
        </Button>
      </div>

      {/* Control Terminal (Filters) */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#FF3333] transition-colors" />
            <Input
              placeholder="SEARCH BY IDENTITY OR ENCRYPTION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-[10px] font-black tracking-widest"
            />
          </div>

          <div className="md:col-span-3">
            <select
              name="checkedIn"
              value={filters.checkedIn}
              onChange={handleFilterChange}
              className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[10px] font-black tracking-widest text-white focus:ring-1 focus:ring-[#FF3333]/50 appearance-none transition-all cursor-pointer"
            >
              <option value="" className="bg-background/10">
                ALL PROTOCOLS
              </option>
              <option value="checked_in" className="bg-background/10">
                VERIFIED ENTRY
              </option>
              <option value="not_checked_in" className="bg-background/10">
                PENDING ACCESS
              </option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-[10px] font-black tracking-widest text-white focus:ring-1 focus:ring-[#FF3333]/50 appearance-none transition-all cursor-pointer"
            >
              <option value="" className="bg-background/10">
                ALL TIERS
              </option>
              <option value="fake-uuid-ga" className="bg-background/10">
                GENERAL CLEARANCE
              </option>
              <option value="fake-uuid-vip" className="bg-background/10">
                PREMIUM VIP
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Terminal */}
      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5">
                <th className="px-8 py-6">Subject Identity</th>
                <th className="px-8 py-6">Clearance Tier</th>
                <th className="px-8 py-6">Manifest ID</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 animate-spin text-[#FF3333]" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                        Decrypting Manifest...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : attendees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-32 text-center text-white/20"
                  >
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users className="h-16 w-16" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                        No Liaisons Detected
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendees.map((attendee) => (
                  <tr
                    key={attendee.id}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-[#FF3333] font-black border border-white/5 group-hover:scale-110 transition-transform">
                          {attendee.attendeeName[0]}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#FF3333] transition-colors">
                            {attendee.attendeeName}
                          </span>
                          <span className="block text-[9px] text-white/30 tracking-tight font-bold italic">
                            {attendee.attendeeEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-white/60 tracking-[0.1em]">
                        {attendee.ticketCategoryName}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-mono text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded">
                        #{attendee.orderId}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {getStatusBadge(attendee.status, attendee.checkedInAt)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAttendeeDetails(attendee.id)}
                        className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-[#FF3333]/10 text-white/40 hover:text-[#FF3333]"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tactical Pagination */}
        {!isLoading && attendees.length > 0 && (
          <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
              Showing{" "}
              <span className="text-white">
                {pagination.page * pagination.size + 1}
              </span>{" "}
              —{" "}
              <span className="text-white">
                {Math.min(
                  (pagination.page + 1) * pagination.size,
                  pagination.totalElements,
                )}
              </span>{" "}
              of{" "}
              <span className="text-[#FF3333]">{pagination.totalElements}</span>{" "}
              Node Subjects
            </span>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-white/5 border border-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-[10px] font-black uppercase tracking-[0.2em]">
                Page {pagination.page + 1}{" "}
                <span className="text-white/20">/</span> {pagination.totalPages}
              </div>
              <Button
                variant="ghost"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="h-10 w-10 rounded-xl bg-white/[0.03] hover:bg-white/5 border border-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Attendee Details Modal - Using Portal based Luxury Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeDetailsModal}
        title="Subject Intelligence"
        description="Detailed liaison manifest data and entry logs."
      >
        {isLoadingDetails ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-[#FF3333] animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              Synchronizing Hub...
            </p>
          </div>
        ) : selectedAttendee ? (
          <div className="space-y-8 p-2">
            {/* Top Identity Block */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FF3333] to-transparent p-px">
                  <div className="w-full h-full bg-background/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-[#FF3333]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase">
                    {selectedAttendee.attendeeName}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
                    <Mail className="w-3 h-3 text-[#FF3333]" />{" "}
                    {selectedAttendee.attendeeEmail}
                  </div>
                </div>
              </div>
              <div>
                {getStatusBadge(
                  selectedAttendee.status,
                  selectedAttendee.checkedInAt,
                )}
              </div>
            </div>

            {/* Intelligence Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Clearance Tier
                </p>
                <p className="text-xs font-black text-white uppercase tracking-widest">
                  {selectedAttendee.ticketCategoryName}
                </p>
              </div>

              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Asset Valuation
                </p>
                <p className="text-xs font-black text-[#FF3333] uppercase tracking-widest">
                  ${selectedAttendee.ticketPrice.toFixed(2)}
                </p>
              </div>

              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Manifest Token
                </p>
                <p className="font-mono text-[9px] text-white/60 truncate">
                  {selectedAttendee.id}
                </p>
              </div>

              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Transaction ID
                </p>
                <p className="font-mono text-[9px] text-white/60 truncate">
                  {selectedAttendee.transactionId}
                </p>
              </div>

              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Commencement Log
                </p>
                <p className="text-[10px] font-bold text-white/60">
                  {new Date(selectedAttendee.purchaseDate).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1.5 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Node Arrival Time
                </p>
                <p className="text-[10px] font-bold text-white/60">
                  {selectedAttendee.checkedInAt
                    ? new Date(selectedAttendee.checkedInAt).toLocaleString()
                    : "--"}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={closeDetailsModal}
                className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white"
              >
                Terminate View
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default AttendeesPage;
