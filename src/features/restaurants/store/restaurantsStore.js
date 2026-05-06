import { create } from "zustand";
import {
    getRestaurants as getRestaurantsRequest,
    createRestaurant as createRestaurantRequest,
    updateRestaurant as updateRestaurantRequest,
    deleteRestaurant as deleteRestaurantRequest,
    addMesa as addMesaRequest,
    updateMesa as updateMesaRequest,
    deleteMesa as deleteMesaRequest,
    addEvento as addEventoRequest,
    updateEvento as updateEventoRequest,
    deleteEvento as deleteEventoRequest,
} from "../../../shared/api";

export const useRestaurantsStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    getRestaurants: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getRestaurantsRequest();
            set({
                restaurants: response.data.restaurants ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener restaurantes",
                loading: false,
            });
        }
    },

    createRestaurant: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await createRestaurantRequest(data);
            set({ restaurants: [response.data.restaurant, ...get().restaurants], loading: false });
        } catch (error) {
            console.log("CATCH EN STORE:", error);
            set({ error: error.response?.data?.message || "Error al crear restaurante", loading: false });
        }
    },

    updateRestaurant: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateRestaurantRequest(id, data);
            set({
                restaurants: get().restaurants.map((r) => r._id === id ? response.data.restaurant : r),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar restaurante", loading: false });
        }
    },

    deleteRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteRestaurantRequest(id);
            set({ restaurants: get().restaurants.filter((r) => r._id !== id), loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al desactivar restaurante", loading: false });
        }
    },
    //subDocumentos
    addMesa: async (restaurantId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await addMesaRequest(restaurantId, data);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restaurantId ? { ...r, mesas: response.data.mesas } : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al agregar mesa", loading: false });
        }
    },

    updateMesa: async (restId, mesaId, data) => {
        try {
            set({ loading: true, error: null });
            await updateMesaRequest(restId, mesaId, data);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar mesa", loading: false });
        }
    },

    deleteMesa: async (restId, mesaId) => {
        try {
            set({ loading: true, error: null });
            await deleteMesaRequest(restId, mesaId);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restId
                        ? { ...r, mesas: r.mesas.filter((m) => m._id !== mesaId) }
                        : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al eliminar mesa", loading: false });
        }
    },

    addEvento: async (restaurantId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await addEventoRequest(restaurantId, data);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restaurantId ? { ...r, eventos: response.data.eventos } : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al agregar evento", loading: false });
        }
    },

    updateEvento: async (restId, eventoId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateEventoRequest(restId, eventoId, data);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar evento", loading: false });
        }
    },

    deleteEvento: async (restId, eventoId) => {
        try {
            set({ loading: true, error: null });
            await deleteEventoRequest(restId, eventoId);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restId
                        ? { ...r, eventos: r.eventos.filter((e) => e._id !== eventoId) }
                        : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al eliminar evento", loading: false });
        }
    },
}));