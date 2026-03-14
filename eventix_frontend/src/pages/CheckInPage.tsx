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
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Modal } from "../components/ui/Modal";

export default function CheckInPage() {
  const { user } = useAppSelector((state) => state.auth);
  const orgId = user?.currentOrganizationId || 1;

  const [ticketCode, setTicketCode] = useState("");
  const [validation, setValidation] = useState<TicketValidationResponse | null>(
    null,
  );
  const [checkInResult, setCheckInResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<TicketSearchResultDTO[]>(
    [],
  );
  const [searchLoading, setSearchLoading] = useState(false);

  const [stats, setStats] = useState<CheckInStatsDTO | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    eventService
      .getOrgEvents(orgId, undefined, 0, 100)
      .then((res: any) => setEvents(res.content || []))
      .catch(() => {});
  }, [orgId]);

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

  const handleValidate = useCallback(
    async (codeToValidate?: string) => {
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
        setError(
          err.response?.data?.message ||
            "Verification failed. Invalid manifest key.",
        );
      } finally {
        setLoading(false);
      }
    },
    [ticketCode],
  );

  useEffect(() => {
    if (!isScannerOpen) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );

    scanner.render(
      (decodedText) => {
        setTicketCode(decodedText);
        handleValidate(decodedText);
        setIsScannerOpen(false);
      },
      () => {},
    );

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [isScannerOpen, handleValidate]);

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
      setError(
        err.response?.data?.message || "Deployment synchronization failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedEventId || searchName.length < 3) return;
    setSearchLoading(true);
    try {
      const res = await checkInService.searchTickets(
        selectedEventId,
        searchName,
      );
      setSearchResults(res);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up bg-background min-h-screen text-white">
      {/* Header Section */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-2 text-[#FF3333] mb-2">
          <Scan className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Field Terminal
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter italic">
          Entry <span className="text-[#FF3333]">Verification</span>
        </h1>
        <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-medium">
          Synchronizing perimeter access manifest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Terminal Controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* Node Selection */}
          <Card
            variant="premium"
            className="bg-white/[0.02] border-white/5 rounded-[2rem] backdrop-blur-3xl"
          >
            <CardContent className="p-8">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 block">
                Active Node Deployment
              </label>
              <select
                value={selectedEventId || ""}
                onChange={(e) =>
                  setSelectedEventId(Number(e.target.value) || null)
                }
                className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-bold tracking-widest text-white focus:ring-1 focus:ring-[#FF3333]/50 appearance-none transition-all cursor-pointer"
              >
                <option value="" className="bg-background/10">
                  SELECT MISSION ASSET...
                </option>
                {events.map((ev: any) => (
                  <option
                    key={ev.id}
                    value={ev.id}
                    className="bg-background/10"
                  >
                    {ev.title.toUpperCase()}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Verification Terminal */}
          <Card
            variant="premium"
            className="bg-white/[0.02] border-white/5 rounded-[2rem] backdrop-blur-3xl overflow-hidden shadow-2xl"
          >
            <CardHeader className="bg-white/[0.01] border-b border-white/5 p-8">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight">
                    <QrCode className="w-5 h-5 text-[#FF3333]" /> Key
                    Authorization
                  </CardTitle>
                  <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Scan or input unique manifest token
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-[#FF3333]/10"
                  onClick={() => setIsScannerOpen(true)}
                >
                  <Scan className="h-5 w-5 text-[#FF3333]" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                <Input
                  className="h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-black tracking-[0.2em] flex-1"
                  placeholder="INPUT ACCESS TOKEN..."
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleValidate()}
                />
                <Button
                  variant="premium"
                  className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#FF3333]/10"
                  onClick={() => handleValidate()}
                  disabled={loading || !ticketCode}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "VALIDATE"
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {checkInResult && (
                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-4 animate-fade-in-up">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-green-500 uppercase tracking-widest">
                      Entry Authorized
                    </p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter mt-1">
                      {checkInResult}
                    </p>
                  </div>
                </div>
              )}

              {validation && (
                <div
                  className={`p-8 rounded-[2rem] border animate-fade-in-up transition-all ${validation.status === "VALID" ? "bg-white/[0.03] border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.05)]" : "bg-red-500/5 border-red-500/20"}`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div
                      className={`h-20 w-20 rounded-3xl flex items-center justify-center ${validation.status === "VALID" ? "bg-blue-500/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "bg-red-500/10 text-red-500"}`}
                    >
                      {validation.status === "VALID" ? (
                        <ShieldCheck className="w-10 h-10" />
                      ) : (
                        <XCircle className="w-10 h-10" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        Verification Result
                      </p>
                      <h3 className="text-2xl font-bold tracking-tighter uppercase italic">
                        {validation.status === "VALID"
                          ? "Authorized Liaison"
                          : "Security Violation"}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase">
                            Subject
                          </p>
                          <p className="text-xs font-bold text-white/80">
                            {validation.attendeeName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase">
                            Protocol
                          </p>
                          <p className="text-xs font-bold text-white/80">
                            {validation.categoryName}
                          </p>
                        </div>
                      </div>
                    </div>
                    {validation.status === "VALID" && (
                      <Button
                        variant="premium"
                        className="h-12 px-10 rounded-xl font-black text-[10px] uppercase tracking-widest"
                        onClick={handleCheckIn}
                        disabled={loading}
                      >
                        GRANT ENTRY
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendee Intelligence */}
          {selectedEventId && (
            <Card
              variant="premium"
              className="bg-white/[0.02] border-white/5 rounded-[2rem] backdrop-blur-3xl overflow-hidden"
            >
              <CardHeader className="bg-white/[0.01] border-b border-white/5 p-8">
                <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight text-white">
                  <Search className="w-5 h-5 text-[#FF3333]" /> Registry
                  Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex gap-4">
                  <Input
                    className="h-12 bg-white/[0.02] border-white/10 rounded-xl focus:border-[#FF3333]/40 text-white placeholder:text-white/10 text-xs font-bold tracking-widest flex-1"
                    placeholder="QUERY BY IDENTITY NAME..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    variant="ghost"
                    className="h-12 px-6 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF3333]/40 font-black text-[9px] uppercase tracking-widest"
                    onClick={handleSearch}
                    disabled={searchLoading || searchName.length < 3}
                  >
                    {searchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "EXECUTE"
                    )}
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="divide-y divide-white/5 rounded-2xl border border-white/5 bg-background/20 overflow-hidden">
                    {searchResults.map((r) => (
                      <div
                        key={r.ticketCode}
                        className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-all group"
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white uppercase tracking-widest group-hover:text-[#FF3333] transition-colors">
                            {r.attendeeName}
                          </p>
                          <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">
                            {r.categoryName} · {r.attendeeEmail}
                          </p>
                        </div>
                        {r.isCheckedIn ? (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">
                              Active Inside
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            className="h-8 text-[9px] font-black uppercase tracking-widest rounded-lg bg-[#FF3333]/10 text-[#FF3333] hover:bg-[#FF3333] hover:text-white"
                            onClick={() => setTicketCode(r.ticketCode)}
                          >
                            SELECT
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Analytics Stream */}
        <div className="lg:col-span-4 space-y-8">
          {stats && (
            <Card
              variant="premium"
              className="bg-white/[0.02] border-white/5 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl sticky top-28"
            >
              <CardHeader className="p-8 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight">
                  <Activity className="w-5 h-5 text-[#FF3333]" /> Live Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-black tracking-tighter text-white">
                    {stats.totalCheckedIn}
                    <span className="text-2xl text-white/20 ml-2">
                      / {stats.totalTickets}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF3333]">
                    Synchronization Ratio
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF3333] to-[#990000] shadow-[0_0_15px_#FF3333] transition-all duration-1000"
                      style={{ width: `${stats.attendancePercentage}%` }}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    {stats.categoryBreakdown?.map((cat) => (
                      <div key={cat.categoryName} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                            {cat.categoryName}
                          </span>
                          <span className="text-[10px] font-bold text-white">
                            {cat.checkedInCount}{" "}
                            <span className="text-white/20">
                              / {cat.totalTickets}
                            </span>
                          </span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FF3333]/50 transition-all duration-700"
                            style={{
                              width: `${cat.totalTickets ? (cat.checkedInCount / cat.totalTickets) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* QR MODAL - THEME REFINED */}
      <Modal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        className="bg-background border border-white/10 rounded-[2.5rem] max-w-md shadow-3xl text-white"
      >
        <div className="p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Scan className="w-8 h-8 text-[#FF3333] animate-pulse" />
          </div>
          <h3 className="text-xl font-bold tracking-tight italic">
            Optical Authorization
          </h3>
          <p className="text-xs text-white/40 uppercase tracking-widest">
            Position manifest QR within frame
          </p>
          <div
            id="qr-reader"
            className="w-full overflow-hidden rounded-2xl border border-white/10 bg-background/40 aspect-square mt-4"
          ></div>
        </div>
      </Modal>
    </div>
  );
}
