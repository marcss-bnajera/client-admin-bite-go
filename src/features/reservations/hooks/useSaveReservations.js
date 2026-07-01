import { useReservationsStore } from "../store/reservationsStore";

export const useSaveReservation = () => {
    const createReservation = useReservationsStore((state) => state.createReservation);
    const updateReservation = useReservationsStore((state) => state.updateReservation);

    const saveReservation = async (data, reservationId = null) => {
        if (reservationId) {
            const payload = {
                peopleCount: Number(data.peopleCount),
                status: data.status,
                reservationDate: data.reservationDate,
                tableId: data.tableId,
                id_sucursal: data.id_sucursal || "",
            };

            await updateReservation(reservationId, payload);
        } else {
            const payload = {
                userId: data.userId,
                restaurantId: data.restaurantId,
                tableId: data.tableId,
                reservationDate: data.reservationDate,
                peopleCount: Number(data.peopleCount),
                id_sucursal: data.id_sucursal || "",
            };
            await createReservation(payload);
        }
    };

    return { saveReservation };
};