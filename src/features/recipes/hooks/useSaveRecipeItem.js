import { useProductsStore } from "../../products/store/productsStore";

export const useSaveRecipeItem = () => {
    const addRecipeItem = useProductsStore((state) => state.addRecipeItem);
    const updateRecipeItem = useProductsStore((state) => state.updateRecipeItem);

    const saveRecipeItem = async (data, productId, recipeId = null) => {
        const payload = {
            nombre_insumo: data.nombre_insumo,
            cantidad_requerida: Number(data.cantidad_requerida),
        };

        if (recipeId) {
            await updateRecipeItem(productId, recipeId, payload);
        } else {
            await addRecipeItem(productId, payload);
        }
    };

    return { saveRecipeItem };
};
