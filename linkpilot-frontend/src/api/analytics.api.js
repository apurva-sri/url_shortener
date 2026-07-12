import api from "./axios";

// GET /api/analytics/:id  (id = url id, per analytics.routes.js + controller)
export const getUrlAnalytics = (id) =>
  api.get(`/analytics/${id}`).then((res) => res.data);
