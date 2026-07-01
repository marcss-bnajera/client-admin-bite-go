import { useEffect, useRef } from "react";
import { useReservationsStore } from "../store/reservationsStore";
import { showError } from "../../../shared/utils/toast";
import { useAuthStore } from "../../auth/store/authStore";

export const useReservations = () => {
    const { reservations, loading, error, getReservations } = useReservationsStore();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        getReservations();
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            if (document.visibilityState === "visible" && mountedRef.current) {
                getReservations(undefined, true);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isAuthenticated, getReservations]);

    return { reservations, loading, error, getReservations };
};