import { useItemsStore } from "../store/itemsStore";

export const useSaveItem = () => {
    const addItem = useItemsStore((state) => state.addItem);
    const updateItem = useItemsStore((state) => state.updateItem);

    const saveItem = async (data, orderId, itemId = null) => {
        if (itemId) {
            // Editar: solo cantidad y notas son editables según el controller
            await updateItem(orderId, itemId, {
                cantidad: Number(data.cantidad),
                notas: data.notas?.trim() ?? "",
            });
        } else {
            // Crear: payload completo del subdocumento
            await addItem(orderId, {
                id_producto: data.id_producto,
                nombre_historico: data.nombre_historico,
                precio_historico: Number(data.precio_historico),
                cantidad: Number(data.cantidad),
                notas: data.notas?.trim() ?? "",
            });
        }
    };

    return { saveItem };
};