import { create } from 'zustand';
import {
    getItems as getItemsRequest,
    addItem as addItemRequest,
    updateItem as updateItemRequest,
    deleteItem as deleteItemRequest,
} from "../../../shared/api";

export const useItemsStore = create((set, get) => ({
    items: [],
    loading: false,
    error: null,

    getItems: async (orderId) => {
        try {
            set({ loading: true, error: null });
            const response = await getItemsRequest(orderId);
            set({
                items: response.data.items ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener items",
                loading: false,
            });
        }
    },

    addItem: async (orderId, data) => {
        try {
            set({ loading: true, error: null });
            await addItemRequest(orderId, data);
            await get().getItems(orderId);
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al agregar item",
                loading: false,
            });
            throw error;
        }
    },

    updateItem: async (orderId, itemId, data) => {
        try {
            set({ loading: true, error: null });
            await updateItemRequest(orderId, itemId, data);
            await get().getItems(orderId);
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar item",
                loading: false,
            });
            throw error;
        }
    },

    deleteItem: async (orderId, itemId) => {
        try {
            set({ loading: true, error: null });
            await deleteItemRequest(orderId, itemId);
            set({
                items: get().items.filter((i) => i._id !== itemId),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al eliminar item",
                loading: false,
            });
        }
    },
}));