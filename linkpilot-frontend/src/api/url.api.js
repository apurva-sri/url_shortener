import api from "./axios";

// POST /api/url/shorten — body: { originalUrl, alias?, expiresAt? }
export const createShortUrl = (payload) =>
  api.post("/url/shorten", payload).then((res) => res.data);

// GET /api/url/my-urls?page&limit&search&sortBy&order
export const getMyUrls = (params) =>
  api.get("/url/my-urls", { params }).then((res) => res.data);

// GET /api/url/:shortCode/stats
export const getUrlStats = (shortCode) =>
  api.get(`/url/${shortCode}/stats`).then((res) => res.data);

// PATCH /api/url/:id — body: { originalUrl?, isActive? }
export const updateUrl = (id, payload) =>
  api.patch(`/url/${id}`, payload).then((res) => res.data);

// DELETE /api/url/:id
export const deleteUrl = (id) =>
  api.delete(`/url/${id}`).then((res) => res.data);

// PATCH /api/url/:id/password — body: { password }
export const enablePasswordProtection = (id, password) =>
  api.patch(`/url/${id}/password`, { password }).then((res) => res.data);

// DELETE /api/url/:id/password
export const removePasswordProtection = (id) =>
  api.delete(`/url/${id}/password`).then((res) => res.data);

// POST /api/url/verify-password — body: { shortCode, password }
export const verifyUrlPassword = (payload) =>
  api.post("/url/verify-password", payload).then((res) => res.data);

// GET /api/url/:id/qr
export const getQRCode = (id) =>
  api.get(`/url/${id}/qr`).then((res) => res.data);
