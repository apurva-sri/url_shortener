import api from "./axios";

// POST /api/auth/register — body: { email, password }
export const register = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

// POST /api/auth/verify-email — body: { email, otp }
export const verifyEmail = (payload) =>
  api.post("/auth/verify-email", payload).then((res) => res.data);

// POST /api/auth/login — body: { email, password }
export const login = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

// POST /api/auth/resend-otp — body: { email }
export const resendOTP = (payload) =>
  api.post("/auth/resend-otp", payload).then((res) => res.data);

// PUT /api/auth/profile — body: { name, username, phone, avatar }
export const updateProfile = (payload) =>
  api.put("/auth/profile", payload).then((res) => res.data);

// PUT /api/auth/password — body: { currentPassword, newPassword }
export const changePassword = (payload) =>
  api.put("/auth/password", payload).then((res) => res.data);
