import axios from "axios";

// In dev, Vite proxy forwards /api to localhost:8000.
// In production, set VITE_API_URL to your deployed backend (e.g. on Railway/Render).
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Core
export const fetchDashboard = () => api.get("/dashboard/");
export const fetchElectionCycles = () => api.get("/election-cycles/");
export const fetchSectors = () => api.get("/sectors/");
export const fetchSubCounties = () => api.get("/sub-counties/");
export const fetchWards = (subCountyId) =>
  api.get("/wards/", { params: subCountyId ? { sub_county: subCountyId } : {} });

// Funds
export const fetchBudgets = (params) => api.get("/funds/budgets/", { params });
export const fetchProjects = (params) => api.get("/funds/projects/", { params });
export const fetchProject = (id) => api.get(`/funds/projects/${id}/`);
export const fetchExpenditures = (params) =>
  api.get("/funds/expenditures/", { params });
export const fetchFundSourceSummary = () => api.get("/funds/fund-source-summary/");
export const fetchWardSpending = () => api.get("/funds/ward-spending/");
export const fetchYearlySpending = () => api.get("/funds/yearly-spending/");
export const fetchMegaDams = () => api.get("/funds/mega-dams/");

// Officials
export const fetchGovernors = () => api.get("/officials/governors/");
export const fetchGovernorComparison = () =>
  api.get("/officials/governor-comparison/");
export const fetchMPs = (params) => api.get("/officials/mps/", { params });
export const fetchMPComparison = () => api.get("/officials/mp-comparison/");
export const fetchMPDeepDive = (id) => api.get(`/officials/mp-deep-dive/${id}/`);
export const fetchMPActivities = (params) =>
  api.get("/officials/mp-activities/", { params });

// Citizens
export const fetchReviews = (params) => api.get("/citizens/reviews/", { params });
export const submitReview = (data) => api.post("/citizens/reviews/", data);
export const fetchImpactReports = (params) =>
  api.get("/citizens/impact-reports/", { params });
export const submitImpactReport = (data) =>
  api.post("/citizens/impact-reports/", data);

export default api;
