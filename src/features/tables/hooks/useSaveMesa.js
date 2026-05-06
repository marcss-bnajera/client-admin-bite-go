import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";

export const useSaveMesa = () => {
    const addMesa = useRestaurantsStore((state) => state.addMesa);
    const updateMesa = useRestaurantsStore((state) => state.updateMesa);

    const saveMesa = async (data, restaurantId, mesaId = null, originalRestaurantId = null) => {
        const payload = {
            numero: Number(data.numero),
            capacidad: Number(data.capacidad),
            ubicacion: data.ubicacion,
            estado: data.estado,
            id_restaurante: data.id_restaurante,
        };

        if (mesaId) {
            await updateMesa(originalRestaurantId || restaurantId, mesaId, payload);
        } else {
            await addMesa(restaurantId, payload);
        }
    };

    return { saveMesa };
};