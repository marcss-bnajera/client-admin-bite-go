import { create } from 'zustand';
import {
    getCategories as getCategoriesRequest,
    createCategory as createCategoryRequest,
    updateCategory as updateCategoryRequest,
    deleteCategory as deleteCategoryRequest,
    activateCategory as activateCategoryRequest,
} from "../../../shared/api";

export const useCategoriesStore = create((set, get) => ({
    categories: [],
    loading: false,
    error: null,

    getCategories: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getCategoriesRequest(params);
            set({
                categories: response.data.categories ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener categorías",
                loading: false,
            });
        }
    },


    createCategory: async (data) => {
        try {
            set({ loading: true, error: null });
            await createCategoryRequest(data);
            await get().getCategories();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear categoría",
                loading: false,
            });
        }
    },

    updateCategory: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateCategoryRequest(id, data);
            await get().getCategories();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar categoría",
                loading: false,
            });
        }
    },

    deleteCategory: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteCategoryRequest(id);
            await get().getCategories();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al desactivar categoría",
                loading: false,
            });
        }
    },

    activateCategory: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateCategoryRequest(id);
            await get().getCategories();
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al activar categoría",
                loading: false,
            });
        }
    },
}));