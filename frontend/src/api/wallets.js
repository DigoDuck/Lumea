import api from "./axios";

export const walletsApi = {
  list: () => api.get("/wallets/"),
  create: (data) => api.post("/wallets/", data),
  update: (id, data) => api.put(`/wallets/${id}`, data),
  delete: (id) => api.delete(`/wallets/${id}`),
};
