import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import checkInService from "../service/checkInService";
import eventService from "../service/eventService";
import {
  TicketValidationResponse,
  CheckInStatsDTO,
  TicketSearchResultDTO,
} from "../types/checkin.types";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Search,
  AlertCircle,
  Users,
  Loader2,
  Scan,
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Modal } from "../components/ui/Modal";

export default function CheckInPage() {
  const { user } = useAppSelector((state) => state.auth);
  const orgId = user?.currentOrganizationId || 1;

  const [ticketCode, setTicketCode] = useState("");
  const [validation, setValidation] = useState<TicketValidationResponse | null>(null);
  const [checkInResult, setCheckInResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event selector
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Search
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<TicketSearchResultDTO[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<CheckInStatsDTO | null>(null);

  // QR Scanner
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Load events
  useEffect(() => {
    eventService
      .getOrgEvents(orgId, undefined, 0, 100)
      .then((res: any) => setEvents(res.content || []))
      .catch(() => {});
  }, [orgId]);

  // Load stats when event is selected
  const loadStats = useCallback(async () => {
    if (!selectedEventId) return;
    try {
      const s = await checkInService.getEventStats(selectedEventId);
      setStats(s);
    } catch {}
  }, [selectedEventId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Validate ticket
  const handleValidate = useCallback(async (codeToValidate?: string) => {
    const code = codeToValidate || ticketCode.trim();
    if (!code) return;
    setError(null);
    setCheckInResult(null);
    setValidation(null);
    setLoading(true);
    try {
      const res = await checkInService.validateTicket(code);
      setValidation(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid ticket code.");
    } finally {
      setLoading(false);
    }
  }, [ticketCode]);

  // QR Scanner logic
  useEffect(() => {
    if (!isScannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        setTicketCode(decodedText);
        handleValidate(decodedText);
        setIsScannerOpen(false);
      },
      () => {
        // Suppress errors
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [isScannerOpen, handleValidate]);

  // Execute check-in
  const handleCheckIn = async () => {
    if (!ticketCode.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await checkInService.executeCheckIn(ticketCode.trim());
      setCheckInResult(res.message);
      setValidation(null);
      setTicketCode("");
      loadStats();
    } catch (err: any) {
      setError(err.response?.data?.message || "Check-in failed.");
    } finally {
      setLoading(false);
    }
  };

  // Search by name
  const handleSearch = async () => {
    if (!selectedEventId || searchName.length < 3) return;
    setSearchLoading(true);
    try {
      const res = await checkInService.searchTickets(selectedEventId, searchName);
      setSearchResults(res);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold font-heading">Check-In</h1>
        <p className="text-muted-foreground mt-1">
          Scan QR codes or enter ticket codes to check in attendees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scanner + Code Entry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Selector */}
          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Event
              </label>
              <select
                value={selectedEventId || ""}
                onChange={(e) => setSelectedEventId(Number(e.target.value) || null)}
                className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
              >
                <option value="">Choose an event...</option>
                {events.map((ev: any) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Ticket Code Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Enter Ticket Code
              </CardTitle>
              <CardDescription>
                Type or scan a QR code to validate and check in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  className="flex-1"
                  placeholder="Enter ticket code (12 digits)..."
                  value={ticketCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTicketCode(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleValidate()}
                />
                <Button variant="outline" onClick={() => setIsScannerOpen(true)} title="Scan QR Code">
                  <Scan className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleValidate()} disabled={loading || !ticketCode}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate"}
                </Button>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {checkInResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in-up">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">Check-In Successful!</p>
                    <p className="text-sm text-green-600">{checkInResult}</p>
                  </div>
                </div>
              )}

              {validation && (
                <div
                  className={`p-4 rounded-lg border animate-fade-in-up ${
                    validation.status === "VALID"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {validation.status === "VALID" ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1 text-sm space-y-1">
                      <p className="font-semibold">
                        {validation.status === "VALID" ? "Valid Ticket" : "Invalid Ticket"}
                      </p>
                      <p>Attendee: {validation.attendeeName}</p>
                      <p>Category: {validation.categoryName}</p>
                      <p>Status: {validation.status}</p>
                      {validation.message && (
                        <p className="text-muted-foreground">{validation.message}</p>
                      )}
                    </div>
                      {validation.status === "VALID" && (
                      <Button size="sm" onClick={handleCheckIn} disabled={loading}>
                        Confirm Check-In
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search by Name */}
          {selectedEventId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Search Attendee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    className="flex-1"
                    placeholder="Search by name (min 3 chars)"
                    value={searchName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={searchLoading || searchName.length < 3}
                  >
                    {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="divide-y rounded-md border">
                    {searchResults.map((r) => (
                      <div
                        key={r.ticketCode}
                        className="flex items-center justify-between p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{r.attendeeName}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.attendeeEmail} · {r.categoryName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.isCheckedIn ? (
                            <span className="text-xs text-green-600 font-semibold">
                              Already In
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setTicketCode(r.ticketCode);
                              }}
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Stats Panel */}
        <div className="space-y-6">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {stats.totalCheckedIn}
                    <span className="text-lg text-muted-foreground">
                      /{stats.totalTickets}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.attendancePercentage.toFixed(1)}% attendance
                  </p>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${stats.attendancePercentage}%` }}
                  />
                </div>
                {stats.categoryBreakdown &&
                  stats.categoryBreakdown.map((cat) => (
                    <div key={cat.categoryName} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">{cat.categoryName}</span>
                        <span className="font-medium">
                          {cat.checkedInCount}/{cat.totalTickets}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{
                            width: `${
                              cat.totalTickets
                                ? (cat.checkedInCount / cat.totalTickets) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        title="Scan Ticket QR Code"
        description="Position the QR code within the frame to scan."
        className="max-w-md"
      >
        <div id="qr-reader" className="w-full overflow-hidden rounded-lg"></div>
      </Modal>
    </div>
  );
}
