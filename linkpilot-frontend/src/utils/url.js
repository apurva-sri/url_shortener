export const getShortUrl = (shortCode) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const base = apiBase.replace(/\/api\/?$/, "");
  return `${base}/${shortCode}`;
};
