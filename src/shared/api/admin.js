import { axiosAdmin } from "./api";

// ================= ORDERS =================
export const getOrders = async (params) => {
    return await axiosAdmin.get("/orders", { params });
};
export const getOrderById = async (id) => {
    return await axiosAdmin.get(`/orders/${id}`);
};
export const getOrdersByUser = async (id, params) => {
    return await axiosAdmin.get(`/orders/user/${id}`, { params });
};
export const getOrdersByRestaurant = async (id, params) => {
    return await axiosAdmin.get(`/orders/restaurant/${id}`, { params });
};
export const createOrder = async (data) => {
    return await axiosAdmin.post("/orders", data);
};
export const updateOrder = async (id, data) => {
    return await axiosAdmin.put(`/orders/${id}`, data);
};
export const deleteOrder = async (id) => {
    return await axiosAdmin.delete(`/orders/${id}`);
};