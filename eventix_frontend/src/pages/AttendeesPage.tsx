import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { 
  Download, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Mail
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { 
  getAttendees, 
  getAttendeeDetails,
  downloadAttendeesCSV 
} from "../service/attendeeService";
import { 
  AttendeeDTO, 
  AttendeeDetailDTO, 
  AttendeeFilters, 
  PaginatedResponse 
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
  
  const [filters, setFilters] = useState<Omit<AttendeeFilters, 'page' | 'size'>>({
    search: '',
    categoryId: '',
    checkedIn: '',
  });

  // Debounced search term
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Modal State
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeDetailDTO | null>(null);
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
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch attendees:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, filters, pagination.page, pagination.size]);

  useEffect(() => {
    fetchAttendeesData();
  }, [fetchAttendeesData]);

  // Handle Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPagination(prev => ({ ...prev, page: 0 })); // Reset page on search
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleExportCSV = async () => {
    if (!eventId) return;
    setIsExporting(true);
    try {
      await downloadAttendeesCSV(eventId, filters);
    } catch (error) {
      console.error("Failed to export CSV:", error);
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
      console.error("Failed to fetch attendee details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    // Give time for exit animation before clearing data
    setTimeout(() => setSelectedAttendee(null), 300);
  };

  const getStatusBadge = (status: string, checkedInAt: string | null) => {
    if (checkedInAt) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Checked In
        </span>
      );
    }
    
    if (status === 'VALID' || status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Clock className="w-3.5 h-3.5" />
          Pending Entry
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
        <XCircle className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Attendees Management
          </h1>
          <p className="text-muted-foreground mt-1">
            View, filter, and export ticket holders for this event.
          </p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          disabled={isExporting}
          className="flex items-center gap-2 relative overflow-hidden group"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="relative z-10">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          <div className="absolute inset-0 h-full w-full scale-[0] rounded-lg transition-all duration-300 group-hover:scale-[100%] group-hover:bg-white/10 z-0"></div>
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // icon={<Search className="w-4 h-4 text-muted-foreground" />} // Assuming Input doesn't support icon based on earlier task
          />
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              name="checkedIn"
              value={filters.checkedIn}
              onChange={handleFilterChange}
              className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="checked_in">Checked In</option>
              <option value="not_checked_in">Not Checked In</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="flex-1 h-10 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              <option value="">All Categories</option>
              {/* Note: In a full app, you'd fetch the actual categories for this event to populate this */}
              <option value="fake-uuid-ga">General Admission</option>
              <option value="fake-uuid-vip">VIP Pass</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Table Card */}
      <Card className="overflow-hidden border border-border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Attendee</th>
                <th className="px-6 py-4 font-medium">Ticket Type</th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p>Loading attendees...</p>
                    </div>
                  </td>
                </tr>
              ) : attendees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Users className="w-12 h-12 text-muted" />
                      <p className="text-lg font-medium text-foreground">No attendees found</p>
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendees.map((attendee) => (
                  <tr 
                    key={attendee.id} 
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{attendee.attendeeName}</span>
                        <span className="text-xs text-muted-foreground">{attendee.attendeeEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                        {attendee.ticketCategoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      #{attendee.orderId}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(attendee.status, attendee.checkedInAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openAttendeeDetails(attendee.id)}
                        className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors inline-flex items-center justify-center"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && attendees.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{pagination.page * pagination.size + 1}</span> to <span className="font-medium text-foreground">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of <span className="font-medium text-foreground">{pagination.totalElements}</span> attendees
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="w-10 h-10 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium px-2">
                Page {pagination.page + 1} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="w-10 h-10 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Attendee Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeDetailsModal}
        title="Ticket Details"
      >
        {isLoadingDetails ? (
           <div className="py-12 flex flex-col items-center justify-center space-y-4">
             <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
             <p className="text-muted-foreground">Loading details...</p>
           </div>
        ) : selectedAttendee ? (
          <div className="space-y-6">
            
            {/* Top Identity Block */}
            <div className="flex items-start justify-between border-b pb-6">
              <div>
                <h3 className="text-xl font-bold font-heading">{selectedAttendee.attendeeName}</h3>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground flex flex-col">
                  <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> {selectedAttendee.attendeeEmail}</span>
                  {selectedAttendee.phoneNumber && (
                    <span className="flex items-center gap-2">📞 {selectedAttendee.phoneNumber}</span>
                  )}
                </div>
              </div>
              <div>
                {getStatusBadge(selectedAttendee.status, selectedAttendee.checkedInAt)}
              </div>
            </div>

            {/* Structured Details */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ticket Category</p>
                <p className="font-medium text-foreground">{selectedAttendee.ticketCategoryName}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ticket Price</p>
                <p className="font-medium text-foreground">${selectedAttendee.ticketPrice.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Ticket ID</p>
                <p className="font-mono text-xs p-1.5 bg-muted rounded border">{selectedAttendee.id}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
                <p className="font-mono text-xs p-1.5 bg-muted rounded border">{selectedAttendee.transactionId}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Purchase Date</p>
                <p className="text-sm font-medium">
                  {new Date(selectedAttendee.purchaseDate).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Check-In Time</p>
                <p className="text-sm font-medium">
                  {selectedAttendee.checkedInAt ? new Date(selectedAttendee.checkedInAt).toLocaleString() : '--'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t flex justify-end">
              <Button onClick={closeDetailsModal}>
                Close
              </Button>
            </div>
            
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Information unavailable.
          </div>
        )}
      </Modal>

    </div>
  );
};

export default AttendeesPage;
