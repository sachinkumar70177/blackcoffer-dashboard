import axios from "axios";

// With CRA's "proxy" field in package.json set to the backend, relative
// paths are enough in development. In production, set REACT_APP_API_BASE.
const BASE = process.env.REACT_APP_API_BASE || "";
console.log("API base URL:", BASE);
export const api = axios.create({ baseURL: `${BASE}/api` });

export function toQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) {
      if (val.length) params.set(key, val.join(","));
    } else if (val !== "") {
      params.set(key, val);
    }
  });
  return params.toString();
}

export async function fetchFilterOptions() {
  const { data } = await api.get("/insights/filters");
  return data;
}

export async function fetchStats(filters) {
  const qs = toQueryString(filters);
  const { data } = await api.get(`/insights/stats${qs ? `?${qs}` : ""}`);
  return data;
}

export async function fetchInsights(filters, limit = 200) {
  const qs = toQueryString({ ...filters, limit });
  const { data } = await api.get(`/insights${qs ? `?${qs}` : ""}`);
  return data;
}
