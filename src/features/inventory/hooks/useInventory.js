import { useEffect } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { showError } from "../../../shared/utils/toast";

export const useInventory = (id_restaurante) => {
    const { inventory, alerts, loading, error, getInventoryByRestaurant, getLowStockAlerts } = useInventoryStore();

    useEffect(() => {
        if (id_restaurante) {
            getInventoryByRestaurant(id_restaurante);
            getLowStockAlerts(id_restaurante);
        }
    }, [id_restaurante]);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { inventory, alerts, loading, error, getInventoryByRestaurant, getLowStockAlerts };
};