import { useEffect, useRef } from "react";
import { useOrdersStore } from "../store/ordersStore";
import { showError } from "../../../shared/utils/toast";
import { useAuthStore } from "../../auth/store/authStore";

export const useOrders = () => {
    const { orders, loading, error, getOrders } = useOrdersStore();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        getOrders({ activo: true });
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            if (document.visibilityState === "visible" && mountedRef.current) {
                getOrders({ activo: true }, true);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isAuthenticated, getOrders]);

    return { orders, loading, error, getOrders };
};