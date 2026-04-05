import api from "./axios";

export const transactionsApi = {
    list: (params) => api.get("/transactions/", { params }),
    create: (data) => api.post("/transactions/", data),
    delete: (id) => api.delete(`/transactions/${id}`),
};
