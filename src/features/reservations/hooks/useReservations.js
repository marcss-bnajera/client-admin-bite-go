import { useEffect } from "react";
import { useReservationsStore } from "../store/reservationsStore";
import { showError } from "../../../shared/utils/toast";

export const useReservations = () => {
    const { reservations, loading, error, getReservations } = useReservationsStore();

    useEffect(() => {
        getReservations();
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { reservations, loading, error, getReservations };
};