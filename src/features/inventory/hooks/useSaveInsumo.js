import { useInventoryStore } from "../store/inventoryStore";

export const useSaveInsumo = () => {
    const createInsumo = useInventoryStore((state) => state.createInsumo);
    const adjustStock = useInventoryStore((state) => state.adjustStock);

    const saveInsumo = async (data, insumoId = null) => {
        if (insumoId) {
            // Editar: solo stock_actual y stock_minimo
            // El ajuste directo de stock se maneja con adjustStock desde AdjustStockModal
            await createInsumo({
                id_restaurante: data.id_restaurante,
                nombre_insumo: data.nombre_insumo,
                stock_actual: Number(data.stock_actual),
                stock_minimo: Number(data.stock_minimo),
            });
        } else {
            // Crear: payload completo
            await createInsumo({
                id_restaurante: data.id_restaurante,
                nombre_insumo: data.nombre_insumo,
                stock_actual: Number(data.stock_actual),
                stock_minimo: Number(data.stock_minimo),
            });
        }
    };

    return { saveInsumo, adjustStock };
};