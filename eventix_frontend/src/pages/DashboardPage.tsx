import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/index";
import { fetchOrgDashboard } from "../store/slices/reportSlice";
import StatCard from "../components/commons/StatCard";
import ProgressBar from "../components/commons/ProgressBar";
import { Button } from "../components/ui/Button";
import reportService from "../service/reportService";
import { SalesTimeSeriesDTO } from "../types/report.types";
import { Download, Loader2, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrganizationId } = useAppSelector((state) => state.auth);
  const { orgSummary, revenueByEvent, isLoading } = useAppSelector(
    (state) => state.reports
  );

  const [salesData, setSalesData] = useState<SalesTimeSeriesDTO[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);

  const orgId = currentOrganizationId ? Number(currentOrganizationId) : null;

  useEffect(() => {
    if (orgId) {
      dispatch(fetchOrgDashboard(orgId));
    }
  }, [dispatch, orgId]);

  // Load sales trend for first event found
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

  if (isLoading) return <div className="p-8">Loading Analytics...</div>;

  // Sales trend max for bar chart
  const maxSales = salesData.reduce(
    (acc, d) => Math.max(acc, d.revenue),
    0
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organization Overview</h1>
        <Button variant="outline" onClick={handleDownloadPdf} disabled={pdfLoading}>
          {pdfLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Report
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`$${orgSummary?.totalRevenue || 0}`}
          colorClass="text-green-600"
        />
        <StatCard
          label="Total Attendees"
          value={orgSummary?.totalAttendees || 0}
        />
        <StatCard
          label="Active Events"
          value={orgSummary?.activeEventsCount || 0}
        />
        <StatCard label="Total Events" value={orgSummary?.totalEvents || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6">Revenue by Event</h2>
          <div className="space-y-4">
            {revenueByEvent.map((item: any) => (
              <ProgressBar
                key={item.eventId}
                label={item.eventTitle}
                current={item.totalRevenue}
                total={orgSummary?.totalRevenue || 1}
                color="bg-blue-500"
              />
            ))}
            {revenueByEvent.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No revenue data yet.
              </p>
            )}
          </div>
        </div>

        {/* Top Selling Events */}
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6">Top Selling Events</h2>
          <div className="space-y-3">
            {[...revenueByEvent]
              .sort((a, b) => b.ticketsSold - a.ticketsSold)
              .slice(0, 5)
              .map((item, idx) => (
                <div
                  key={item.eventId}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-6">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium">{item.eventTitle}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {item.ticketsSold} sold
                  </span>
                </div>
              ))}
            {revenueByEvent.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sales data yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sales Over Time */}
      {salesData.length > 0 && (
        <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sales Trend
          </h2>
          <div className="flex items-end gap-1 h-40">
            {salesData.map((d, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-primary/80 rounded-t hover:bg-primary transition-colors"
                  style={{
                    height: `${maxSales ? (d.revenue / maxSales) * 100 : 0}%`,
                    minHeight: d.revenue > 0 ? "4px" : "0",
                  }}
                  title={`$${d.revenue}`}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                  {d.timeLabel?.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
