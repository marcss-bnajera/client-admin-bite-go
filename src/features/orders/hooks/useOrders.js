import { useEffect } from "react";
import { useOrdersStore } from "../store/ordersStore";
import { showError } from "../../../shared/utils/toast";

export const useOrders = () => {
    const { orders, loading, error, getOrders } = useOrdersStore();

    useEffect(() => {
        getOrders({ activo: true });
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { orders, loading, error, getOrders };
};