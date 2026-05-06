import { useUsersStore } from "../store/usersStore";

export const useSaveUser = () => {
    const createUser = useUsersStore((state) => state.createUser);
    const updateUser = useUsersStore((state) => state.updateUser);

    const saveUser = async (data, userId = null) => {
        const rolesConRestaurante = ["Admin_Restaurante", "Mesero", "Repartidor", "Cocinero"];

        const payload = {
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            dpi: data.dpi,
            rol: data.rol,
            id_restaurante: rolesConRestaurante.includes(data.rol) ? data.id_restaurante : null,
        };

        if (data.password) {
            payload.password = data.password;
        }

        if (userId) {
            await updateUser(userId, payload);
        } else {
            await createUser(payload);
        }
    };

    return { saveUser };
};