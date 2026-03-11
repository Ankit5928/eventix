import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/index";
import { fetchOrgDashboard } from "../store/slices/reportSlice";
import StatCard from "../components/commons/StatCard";
import ProgressBar from "../components/commons/ProgressBar";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrganizationId } = useAppSelector((state) => state.auth);
  const { orgSummary, revenueByEvent, isLoading } = useAppSelector(
    (state) => state.reports,
  );

  useEffect(() => {
    if (currentOrganizationId) {
      dispatch(fetchOrgDashboard(currentOrganizationId));
    }
  }, [dispatch, currentOrganizationId]);

  if (isLoading) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Organization Overview</h1>

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
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
