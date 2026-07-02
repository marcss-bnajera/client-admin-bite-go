import { useOrdersStore } from "../store/ordersStore";

export const useSaveOrder = () => {
    const createOrder = useOrdersStore((state) => state.createOrder);
    const updateOrder = useOrdersStore((state) => state.updateOrder);

    const saveOrder = async (data, orderId = null) => {
        const payload = {
            id_usuario_cliente: data.id_usuario_cliente,
            id_restaurante: data.id_restaurante,
            id_sucursal: data.id_sucursal || "",
            id_mesero_asignado: data.id_mesero_asignado || null,
            id_repartidor_asignado: data.id_repartidor_asignado || null,
            tipo_servicio: data.tipo_servicio,
            estado: data.estado,
            activo: data.activo ?? true,
            items: data.items ?? [],
            total: data.total ?? 0,
        };

        if (orderId) {
            await updateOrder(orderId, payload);
        } else {
            await createOrder(payload);
        }
    };

    return { saveOrder };
};