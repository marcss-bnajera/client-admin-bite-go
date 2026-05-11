import { useEffect } from "react";
import { useItemsStore } from "../store/itemsStore";
import { showError } from "../../../shared/utils/toast";

export const useItems = (orderId) => {
    const { items, loading, error, getItems } = useItemsStore();

    useEffect(() => {
        if (orderId) getItems(orderId);
    }, [orderId]);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { items, loading, error, getItems };
};