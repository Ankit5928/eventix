import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/index";
import { fetchOrgDashboard } from "../store/slices/reportSlice";
import StatCard from "../components/commons/StatCard";
import ProgressBar from "../components/commons/ProgressBar";
import { Button } from "../components/ui/Button";
import reportService from "../service/reportService";
import { SalesTimeSeriesDTO } from "../types/report.types";
import { Download, Loader2, TrendingUp, Crown, Globe } from "lucide-react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrganizationId } = useAppSelector((state) => state.auth);
  const { orgSummary, revenueByEvent, isLoading } = useAppSelector(
    (state) => state.reports,
  );

  const [salesData, setSalesData] = useState<SalesTimeSeriesDTO[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const orgId = currentOrganizationId ? Number(currentOrganizationId) : null;

  useEffect(() => {
    // Ensure we request data even when orgId === 0 (which is falsy) but still valid.
    if (orgId !== null && orgId !== undefined) {
      dispatch(fetchOrgDashboard(orgId));
    }
  }, [dispatch, orgId]);

  useEffect(() => {
    if (revenueByEvent.length > 0) {
      reportService
        .getSalesTrend(revenueByEvent[0].eventId)
        .then((d) => setSalesData(d))
        .catch(() => {});
    }
  }, [revenueByEvent]);

  const handleDownloadPdf = async () => {
    if (!orgId) return;
    setPdfLoading(true);
    try {
      await reportService.downloadPdfReport(orgId);
    } catch {}
    setPdfLoading(false);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#FF3333] animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            Synchronizing Analytics...
          </span>
        </div>
      </div>
    );

  const maxSales = salesData.reduce((acc, d) => Math.max(acc, d.revenue), 0);

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Integrated Sidebar */}
      {/* <Sidebar /> */}

      {/* 2. Main Content Area - Shifted right by 64 (width of sidebar) */}
      <main className="flex-1 lg:pl-64 overflow-x-hidden">
        <div className="p-8 space-y-10 text-white">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#FF3333]">
                <Crown className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Organization Terminal
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter italic">
                Strategic <span className="text-[#FF3333]">Overview</span>
              </h1>
            </div>

            <Button
              variant="premium"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="h-12 px-8 rounded-2xl shadow-2xl shadow-[#FF3333]/20"
            >
              {pdfLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Intelligence
            </Button>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              label="Gross Portfolio Revenue"
              value={`$${orgSummary?.totalRevenue?.toLocaleString() || 0}`}
              className="bg-white/[0.03] border-white/5 rounded-3xl p-8 hover:border-[#FF3333]/30 transition-all"
            />
            <StatCard
              label="Global Attendees"
              value={orgSummary?.totalTicketsSold?.toLocaleString() || 0}
              className="bg-white/[0.03] border-white/5 rounded-3xl p-8 hover:border-[#FF3333]/30 transition-all"
            />
            <StatCard
              label="Active Deployments"
              value={orgSummary?.activeEvents || 0}
              className="bg-white/[0.03] border-white/5 rounded-3xl p-8 hover:border-[#FF3333]/30 transition-all"
            />
            <StatCard
              label="Archived Portfolio"
              value={orgSummary?.totalEvents || 0}
              className="bg-white/[0.03] border-white/5 rounded-3xl p-8 hover:border-[#FF3333]/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Revenue Breakdown */}
            <div className="lg:col-span-7 bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold italic tracking-tight flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#FF3333] rounded-full" />
                  Revenue Distribution
                </h2>
                <Globe className="w-5 h-5 text-white/20" />
              </div>
              <div className="space-y-8">
                {revenueByEvent.map((item: any) => (
                  <ProgressBar
                    key={item.eventId}
                    label={item.eventTitle}
                    current={item.totalRevenue}
                    total={orgSummary?.totalRevenue || 1}
                    color="bg-gradient-to-r from-[#FF3333] to-[#990000]"
                  />
                ))}
              </div>
            </div>

            {/* Top Performance */}
            <div className="lg:col-span-5 bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <h2 className="text-xl font-bold italic tracking-tight mb-10 flex items-center gap-3">
                <div className="w-1 h-6 bg-[#FF3333] rounded-full" />
                Top Performance
              </h2>
              <div className="space-y-4">
                {[...revenueByEvent]
                  .sort((a, b) => b.ticketsSold - a.ticketsSold)
                  .slice(0, 5)
                  .map((item, idx) => (
                    <div
                      key={item.eventId}
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-[#FF3333] w-4">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {item.eventTitle}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-white">
                          {item.ticketsSold}
                        </span>
                        <span className="text-[8px] text-white/30 uppercase tracking-widest">
                          Units
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          {salesData.length > 0 && (
            <div className="bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-xl font-bold italic tracking-tight flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-[#FF3333]" />
                  Historical Trajectory
                </h2>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                  Live Feed Analytics
                </span>
              </div>
              <div className="flex items-end gap-2 h-64">
                {salesData.map((d, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-4 group"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#FF3333] to-[#FF6666] opacity-30 group-hover:opacity-100 rounded-t-lg transition-all duration-500 relative"
                      style={{
                        height: `${maxSales ? (d.revenue / maxSales) * 100 : 0}%`,
                        minHeight: d.revenue > 0 ? "4px" : "0",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded-md border border-white/10 shadow-2xl">
                        ${d.revenue}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter truncate w-full text-center">
                      {d.timeLabel?.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
