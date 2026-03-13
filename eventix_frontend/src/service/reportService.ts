import axiosInstance from "../service/axiosConfig";
import {
  RevenueReportDTO,
  SalesTimeSeriesDTO,
  EventSummaryDTO,
  OrganizationSummaryDTO,
} from "../types/report.types";

const reportService = {
  // GET /revenue-by-event
  getRevenueByEvent: async (
    orgId: number,
    start?: string,
    end?: string,
  ): Promise<RevenueReportDTO[]> => {
    const response = await axiosInstance.get<RevenueReportDTO[]>(
      "/reports/revenue-by-event",
      {
        params: { 
          organizationId: orgId, 
          startDate: start, 
          endDate: end 
        },
      },
    );
    return response.data;
  },

  // GET /sales-over-time
  getSalesTrend: async (
    eventId: number,
    groupBy: "DAY" | "WEEK" | "MONTH" = "DAY",
  ): Promise<SalesTimeSeriesDTO[]> => {
    const response = await axiosInstance.get<SalesTimeSeriesDTO[]>(
      "/reports/sales-over-time",
      {
        params: { eventId, groupBy },
      },
    );
    return response.data;
  },

  // GET /organization-summary
  getOrgSummary: async (orgId: number): Promise<OrganizationSummaryDTO> => {
    const response = await axiosInstance.get<OrganizationSummaryDTO>(
      "/reports/organization-summary",
      {
        params: { organizationId: orgId },
      },
    );
    return response.data;
  },

  getEventSummary: async (eventId: number): Promise<EventSummaryDTO> => {
    const response = await axiosInstance.get<EventSummaryDTO>(
      `/reports/events/${eventId}/summary`,
    );
    return response.data;
  },

  // GET /sales-pdf (Blob download)
  downloadPdfReport: async (orgId: number): Promise<void> => {
    const response = await axiosInstance.get("/reports/sales-pdf", {
      params: { organizationId: orgId },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Sales_Report_Org_${orgId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default reportService;
