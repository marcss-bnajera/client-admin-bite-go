import { create } from "zustand";
import {
    getRestaurants as getRestaurantsRequest,
    createRestaurant as createRestaurantRequest,
    updateRestaurant as updateRestaurantRequest,
    deleteRestaurant as deleteRestaurantRequest,
    activateRestaurant as activateRestaurantRequest,
    addMesa as addMesaRequest,
    updateMesa as updateMesaRequest,
    deleteMesa as deleteMesaRequest,
    addEvento as addEventoRequest,
    updateEvento as updateEventoRequest,
    deleteEvento as deleteEventoRequest,
    addSucursal as addSucursalRequest,
    updateSucursal as updateSucursalRequest,
    deleteSucursal as deleteSucursalRequest,
    addMesaSucursal as addMesaSucursalRequest,
    updateMesaSucursal as updateMesaSucursalRequest,
    deleteMesaSucursal as deleteMesaSucursalRequest,
} from "../../../shared/api";

export const useRestaurantsStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    getRestaurants: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getRestaurantsRequest(params);
            set({ restaurants: response.data.restaurants ?? [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener restaurantes", loading: false });
        }
    },

    createRestaurant: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await createRestaurantRequest(data);
            const newRestaurant = response.data.restaurant;
            set({ restaurants: [newRestaurant, ...get().restaurants], loading: false });
            return newRestaurant;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al crear restaurante", loading: false });
            throw error;
        }
    },

    updateRestaurant: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateRestaurantRequest(id, data);
            const updated = response.data.restaurant;
            set({
                restaurants: get().restaurants.map((r) => r._id === id ? updated : r),
                loading: false,
            });
            return updated;
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar restaurante", loading: false });
            throw error;
        }
    },

    deleteRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteRestaurantRequest(id);
            set({
                restaurants: get().restaurants.map((r) => r._id === id ? { ...r, activo: false } : r),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al desactivar restaurante", loading: false });
            throw error;
        }
    },

    activateRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateRestaurantRequest(id);
            set({
                restaurants: get().restaurants.map((r) => r._id === id ? { ...r, activo: true } : r),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al reactivar restaurante", loading: false });
            throw error;
        }
    },

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
        set({ loading: true, error: null });
        try {
            const response = await addEventoRequest(restaurantId, data);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restaurantId ? { ...r, eventos: response.data.eventos } : r
                ),
                loading: false,
            });
            return response;
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    updateEvento: async (restId, eventoId, data) => {
        set({ loading: true, error: null });
        try {
            await updateEventoRequest(restId, eventoId, data);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    deleteEvento: async (restId, eventoId) => {
        set({ loading: true, error: null });
        try {
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
            set({ loading: false });
            throw error;
        }
    },

    addSucursal: async (restaurantId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await addSucursalRequest(restaurantId, data);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restaurantId ? { ...r, sucursales: response.data.sucursales } : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al crear sucursal", loading: false });
            throw error;
        }
    },

    updateSucursal: async (restaurantId, sucursalId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateSucursalRequest(restaurantId, sucursalId, data);
            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === restaurantId ? { ...r, sucursales: response.data.sucursales } : r
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar sucursal", loading: false });
            throw error;
        }
    },

    deleteSucursal: async (restaurantId, sucursalId) => {
        try {
            set({ loading: true, error: null });
            await deleteSucursalRequest(restaurantId, sucursalId);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al eliminar sucursal", loading: false });
            throw error;
        }
    },

    addMesaSucursal: async (restaurantId, sucursalId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await addMesaSucursalRequest(restaurantId, sucursalId, data);
            set({
                restaurants: get().restaurants.map((r) => {
                    if (r._id !== restaurantId) return r;
                    return { ...r, sucursales: r.sucursales.map(s => s._id === sucursalId ? { ...s, mesas: response.data.mesas } : s) };
                }),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al agregar mesa", loading: false });
            throw error;
        }
    },

    updateMesaSucursal: async (restaurantId, sucursalId, mesaId, data) => {
        try {
            set({ loading: true, error: null });
            await updateMesaSucursalRequest(restaurantId, sucursalId, mesaId, data);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar mesa", loading: false });
        }
    },

    deleteMesaSucursal: async (restaurantId, sucursalId, mesaId) => {
        try {
            set({ loading: true, error: null });
            await deleteMesaSucursalRequest(restaurantId, sucursalId, mesaId);
            await get().getRestaurants();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al eliminar mesa", loading: false });
        }
    },
}));