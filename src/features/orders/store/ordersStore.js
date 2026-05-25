import { create } from 'zustand';
import {
    getOrders as getOrdersRequest,
    createOrder as createOrderRequest,
    updateOrder as updateOrderRequest,
    deleteOrder as deleteOrderRequest,
    activateOrder as activateOrderRequest,
} from "../../../shared/api";

export const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    getOrders: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getOrdersRequest(params);
            set({ orders: response.data.orders ?? [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener pedidos", loading: false });
        }
    },

    createOrder: async (data) => {
        try {
            set({ loading: true, error: null });
            await createOrderRequest(data);
            await get().getOrders();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear pedido",
                loading: false
            });
            throw error;
        }
    },

    updateOrder: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateOrderRequest(id, data);
            await get().getOrders({ activo: true });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar pedido", loading: false });
            throw error;
        }
    },

    deleteOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteOrderRequest(id);
            set({
                orders: get().orders.map((o) => o._id === id ? { ...o, activo: false } : o),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al desactivar pedido", loading: false });
            throw error;
        }
    },

    activateOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateOrderRequest(id);
            set({
                orders: get().orders.map((o) => o._id === id ? { ...o, activo: true } : o),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al reactivar pedido", loading: false });
            throw error;
        }
    },
}));