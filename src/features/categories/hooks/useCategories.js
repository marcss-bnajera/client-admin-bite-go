import { useEffect } from "react";
import { useCategoriesStore } from "../store/categoriesStore";
import { showError } from "../../../shared/utils/toast";

export const useCategories = () => {
    const { categories, loading, error, getCategories } = useCategoriesStore();

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { categories, loading, error, getCategories };
};