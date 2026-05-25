import { create } from 'zustand';
import {
    getInventoryByRestaurant as getInventoryRequest,
    getLowStockAlerts as getLowStockRequest,
    createInsumo as createInsumoRequest,
    adjustStock as adjustStockRequest,
    deleteInsumo as deleteInsumoRequest,
    activateInsumo as activateInsumoRequest,
} from "../../../shared/api";

export const useInventoryStore = create((set, get) => ({
    inventory: [],
    alerts: [],
    loading: false,
    error: null,

    getInventoryByRestaurant: async (id_restaurante, params = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getInventoryRequest(id_restaurante, params);
            set({ inventory: response.data.inventory ?? [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener inventario", loading: false });
        }
    },

    getLowStockAlerts: async (id_restaurante) => {
        try {
            const response = await getLowStockRequest(id_restaurante);
            set({ alerts: response.data.alerts ?? [] });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener alertas" });
        }
    },

    createInsumo: async (data) => {
        try {
            set({ loading: true, error: null });
            await createInsumoRequest(data);
            await get().getInventoryByRestaurant(data.id_restaurante);
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al crear insumo", loading: false });
            throw error;
        }
    },

    adjustStock: async (id, cantidad, id_restaurante) => {
        try {
            set({ loading: true, error: null });
            await adjustStockRequest(id, { cantidad });
            await get().getInventoryByRestaurant(id_restaurante);
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al ajustar stock", loading: false });
            throw error;
        }
    },

    deleteInsumo: async (id, id_restaurante) => {
        try {
            set({ loading: true, error: null });
            await deleteInsumoRequest(id);
            set({
                inventory: get().inventory.map((i) => i._id === id ? { ...i, activo: false } : i),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al desactivar insumo", loading: false });
            throw error;
        }
    },

    activateInsumo: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateInsumoRequest(id);
            set({
                inventory: get().inventory.map((i) => i._id === id ? { ...i, activo: true } : i),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al reactivar insumo", loading: false });
            throw error;
        }
    },
}));