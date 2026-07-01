import { create } from 'zustand';
import {
    getReservations as getReservationsRequest,
    createReservation as createReservationRequest,
    updateReservation as updateReservationRequest,
    deleteReservation as deleteReservationRequest,
    checkInReservation as checkInReservationRequest,
} from "../../../shared/api";

const STATUS_TO_EN = { Confirmada: "Confirmed", Atendida: "Attended", Cancelada: "Cancelled" };
const STATUS_TO_ES = { Confirmed: "Confirmada", Attended: "Atendida", Cancelled: "Cancelada" };

const mapFromBackend = (r) => ({
    ...r,
    restaurantId: r.id_restaurante,
    reservationDate: r.fecha_reserva,
    peopleCount: r.cantidad_personas,
    status: STATUS_TO_EN[r.estado] || r.estado,
    tableId: r.id_mesa,
    asistio: r.asistio ?? false,
});

const mapToBackend = (data) => {
    const payload = {};
    if (data.userId !== undefined) payload.id_usuario = data.userId;
    if (data.restaurantId !== undefined) payload.id_restaurante = data.restaurantId;
    if (data.tableId !== undefined) payload.id_mesa = data.tableId;
    if (data.reservationDate !== undefined) payload.fecha_reserva = data.reservationDate;
    if (data.peopleCount !== undefined) payload.cantidad_personas = Number(data.peopleCount);
    if (data.status !== undefined) payload.estado = STATUS_TO_ES[data.status] || data.status;
    if (data.id_sucursal !== undefined) payload.id_sucursal = data.id_sucursal;
    return payload;
};

export const useReservationsStore = create((set, get) => ({
    reservations: [],
    loading: false,
    error: null,

    getReservations: async (params, silent = false) => {
        try {
            if (!silent) set({ loading: true, error: null });
            const response = await getReservationsRequest(params);
            const raw = response.data.reservations ?? [];
            set({
                reservations: raw.map(mapFromBackend),
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
            await createReservationRequest(mapToBackend(data));
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
            await updateReservationRequest(id, mapToBackend(data));
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

    checkInReservation: async (id) => {
        try {
            set({ loading: true, error: null });
            await checkInReservationRequest(id);
            await get().getReservations();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al registrar asistencia",
                loading: false,
            });
            throw error;
        }
    },
}));
