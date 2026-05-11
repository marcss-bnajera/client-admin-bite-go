import { create } from 'zustand';
import {
    getReservations as getReservationsRequest,
    createReservation as createReservationRequest,
    updateReservation as updateReservationRequest,
    deleteReservation as deleteReservationRequest,
} from "../../../shared/api";

export const useReservationsStore = create((set, get) => ({
    reservations: [],
    loading: false,
    error: null,

    getReservations: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getReservationsRequest(params);
            set({
                reservations: response.data.reservations ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener reservaciones",
                loading: false,
            });
        }
    },

    createReservation: async (data) => {
        try {
            set({ loading: true, error: null });
            await createReservationRequest(data);
            await get().getReservations();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear reservación",
                loading: false,
            });
            throw error;
        }
    },

    updateReservation: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateReservationRequest(id, data);
            await get().getReservations();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar reservación",
                loading: false,
            });
            throw error;
        }
    },

    deleteReservation: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteReservationRequest(id);
            set({
                reservations: get().reservations.map((r) =>
                    r._id === id ? { ...r, active: false, status: "Cancelled" } : r
                ),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al cancelar reservación",
                loading: false,
            });
            throw error;
        }
    },
}));