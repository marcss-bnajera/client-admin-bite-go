import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";

export const useSaveMesa = () => {
    const addMesa = useRestaurantsStore((state) => state.addMesa);
    const updateMesa = useRestaurantsStore((state) => state.updateMesa);
    const addMesaSucursal = useRestaurantsStore((state) => state.addMesaSucursal);
    const updateMesaSucursal = useRestaurantsStore((state) => state.updateMesaSucursal);

    const saveMesa = async (data, restaurantId, mesaId = null, originalRestaurantId = null, originalSucursalId = null) => {
        const sucursalId = data.id_sucursal || null;

        if (mesaId) {
            if (originalSucursalId) {
                await updateMesaSucursal(originalRestaurantId || restaurantId, originalSucursalId, mesaId, {
                    numero: Number(data.numero),
                    capacidad: Number(data.capacidad),
                    ubicacion: data.ubicacion,
                    estado: data.estado,
                });
            } else {
                await updateMesa(originalRestaurantId || restaurantId, mesaId, {
                    numero: Number(data.numero),
                    capacidad: Number(data.capacidad),
                    ubicacion: data.ubicacion,
                    estado: data.estado,
                });
            }
        } else {
            const payload = {
                numero: Number(data.numero),
                capacidad: Number(data.capacidad),
                ubicacion: data.ubicacion,
                estado: data.estado,
            };
            if (sucursalId) {
                await addMesaSucursal(restaurantId, sucursalId, payload);
            } else {
                await addMesa(restaurantId, payload);
            }
        }
    };

    return { saveMesa };
};