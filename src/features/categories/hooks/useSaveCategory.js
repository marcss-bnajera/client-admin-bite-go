import { useCategoriesStore } from "../store/categoriesStore";

export const useSaveCategory = () => {
    const createCategory = useCategoriesStore((state) => state.createCategory);
    const updateCategory = useCategoriesStore((state) => state.updateCategory);

    const saveCategory = async (data, categoryId = null) => {
        const payload = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            id_restaurante: data.id_restaurante,
        };

        if (categoryId) {
            await updateCategory(categoryId, payload);
        } else {
            await createCategory(payload);
        }
    };

    return { saveCategory };
};