import { useRestaurantsStore } from "../store/restaurantsStore";

export const useSaveRestaurant = () => {
    const createRestaurant = useRestaurantsStore((state) => state.createRestaurant);
    const updateRestaurant = useRestaurantsStore((state) => state.updateRestaurant);

    const saveRestaurant = async (data, restaurantId = null) => {
        const payload = {
            nombre: data.nombre,
            direccion: { texto: data.direccion_texto },
            horarios_atencion: data.horarios_atencion,
            categoria_gastronomica: data.categoria_gastronomica,
            precio_promedio: Number(data.precio_promedio),
            informacion_contacto: {
                telefono: data.telefono,
                email: data.email,
            },
            ...(restaurantId && { activo: data.activo }),
        };

        try {
            if (restaurantId) {
                await updateRestaurant(restaurantId, payload);
            } else {
                await createRestaurant(payload);
            }
        } catch (error) {
            throw error;
        }
    };

    return { saveRestaurant };
};