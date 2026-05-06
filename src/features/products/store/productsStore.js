import { create } from 'zustand';
import {
    getProducts as getProductsRequest,
    createProduct as createProductRequest,
    updateProduct as updateProductRequest,
    deleteProduct as deleteProductRequest,
    addRecipeItem as addRecipeItemRequest,
    updateRecipeItem as updateRecipeItemRequest,
    deleteRecipeItem as deleteRecipeItemRequest,
} from "../../../shared/api";

export const useProductsStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,

    getProducts: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getProductsRequest(params);
            set({ products: response.data.products ?? [], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al obtener productos", loading: false });
        }
    },

    createProduct: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await createProductRequest(data);
            set({ products: [response.data.product, ...get().products], loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al crear producto", loading: false });
        }
    },

    updateProduct: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateProductRequest(id, data);
            set({
                products: get().products.map((p) => p._id === id ? response.data.product : p),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar producto", loading: false });
        }
    },

    deleteProduct: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteProductRequest(id);
            set({
                products: get().products.map((p) =>
                    p._id === id ? { ...p, activo: false } : p
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al desactivar producto", loading: false });
        }
    },

    addRecipeItem: async (productId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await addRecipeItemRequest(productId, data);
            set({
                products: get().products.map((p) =>
                    p._id === productId ? { ...p, receta: response.data.receta } : p
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al agregar ingrediente", loading: false });
        }
    },

    updateRecipeItem: async (productId, recipeId, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateRecipeItemRequest(productId, recipeId, data);
            set({
                products: get().products.map((p) =>
                    p._id === productId ? { ...p, receta: response.data.product.receta } : p
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar ingrediente", loading: false });
        }
    },

    deleteRecipeItem: async (productId, recipeId) => {
        try {
            set({ loading: true, error: null });
            await deleteRecipeItemRequest(productId, recipeId);
            set({
                products: get().products.map((p) =>
                    p._id === productId
                        ? { ...p, receta: p.receta.filter((r) => r._id !== recipeId) }
                        : p
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al eliminar ingrediente", loading: false });
        }
    },

    toggleProduct: async (id, activo) => {
        try {
            set({ loading: true, error: null });
            await updateProductRequest(id, { activo });
            set({
                products: get().products.map((p) =>
                    p._id === id ? { ...p, activo } : p
                ),
                loading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error al actualizar producto", loading: false });
        }
    },
}));