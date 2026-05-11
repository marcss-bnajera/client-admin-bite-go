import { useReservationsStore } from "../store/reservationsStore";

export const useSaveReservation = () => {
    const createReservation = useReservationsStore((state) => state.createReservation);
    const updateReservation = useReservationsStore((state) => state.updateReservation);

    const saveReservation = async (data, reservationId = null) => {
        if (reservationId) {
            const payload = {
                peopleCount: Number(data.peopleCount),
                status: data.status,
            };

            if (data.reservationDate !== data.originalReservationDate) {
                payload.reservationDate = data.reservationDate;
            }

            await updateReservation(reservationId, payload);
        } else {
            const payload = {
                userId: data.userId,
                restaurantId: data.restaurantId,
                tableId: data.tableId,
                reservationDate: data.reservationDate,
                peopleCount: Number(data.peopleCount),
            };
            await createReservation(payload);
        }
    };

    return { saveReservation };
};