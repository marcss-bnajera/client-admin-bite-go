import { useInventoryStore } from "../store/inventoryStore";
import { updateInsumo as updateInsumoRequest } from "../../../shared/api";

export const useSaveInsumo = () => {
    const createInsumo = useInventoryStore((state) => state.createInsumo);

    const saveInsumo = async (data, insumoId = null) => {
        if (insumoId) {
            await updateInsumoRequest(insumoId, {
                stock_actual: Number(data.stock_actual),
                stock_minimo: Number(data.stock_minimo),
            });
        } else {
            await createInsumo({
                id_restaurante: data.id_restaurante,
                id_sucursal: data.id_sucursal || "",
                nombre_insumo: data.nombre_insumo,
                stock_actual: Number(data.stock_actual),
                stock_minimo: Number(data.stock_minimo),
            });
        }
    };

    return { saveInsumo };
};