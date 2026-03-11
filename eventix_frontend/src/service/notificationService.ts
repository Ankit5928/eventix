const API_BASE_URL = 'http://localhost:8085/api/v1';

const notificationService = {
  /**
   * Opens the SSE connection. 
   * Note: EventSource doesn't support custom headers (like Authorization) natively.
   * If your backend requires a JWT for SSE, you must pass it as a query param 
   * or handle it via a cookie.
   */
  subscribeToSales: (orgId: number, token: string) => {
    // Adding token as query param since native EventSource doesn't support headers
    const url = `${API_BASE_URL}/notifications/sales-stream?organizationId=${orgId}&token=${token}`;
    return new EventSource(url);
  }
};

export default notificationService;