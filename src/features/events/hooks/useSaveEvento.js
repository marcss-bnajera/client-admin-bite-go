import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";

export const useSaveEvento = () => {
    const addEvento = useRestaurantsStore((state) => state.addEvento);
    const updateEvento = useRestaurantsStore((state) => state.updateEvento);

    const saveEvento = async (data, restaurantId, eventoId = null, originalRestaurantId = null) => {
        const payload = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            fechas: data.fechas.filter((f) => f !== ""),
            servicios: data.servicios.filter((s) => s !== ""),
            id_restaurante: data.id_restaurante,
        };

        if (eventoId) {
            await updateEvento(originalRestaurantId || restaurantId, eventoId, payload);
        } else {
            await addEvento(restaurantId, payload);
        }
    };

    return { saveEvento };
};