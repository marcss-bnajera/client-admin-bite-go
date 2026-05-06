import { useEffect } from "react";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { showError } from "../../../shared/utils/toast";

export const useRestaurants = () => {
    const { restaurants, loading, error, getRestaurants } = useRestaurantsStore();

    useEffect(() => {
        getRestaurants();
    }, []);

    useEffect(() => {
        if (error) {
            showError(error);
            useRestaurantsStore.setState({ error: null });
        }
    }, [error]);

    return { restaurants, loading, error, getRestaurants };
};