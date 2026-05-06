import { useEffect } from "react";
import { useProductsStore } from "../store/productsStore";
import { showError } from "../../../shared/utils/toast";

export const useProducts = () => {
    const { products, loading, error, getProducts } = useProductsStore();

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (error) {
            showError(error);
            useProductsStore.setState({ error: null });
        }
    }, [error]);

    return { products, loading, error, getProducts };
};