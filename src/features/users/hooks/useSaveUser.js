import { useUsersStore } from "../store/usersStore";
import { register } from "../../../shared/api";

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
            // Editar: solo actualiza MongoDB
            await updateUser(userId, payload);
        } else {
            // Crear: registrar en auth-service (PostgreSQL) con el rol ya asignado
            const formData = new FormData();
            formData.append("Name", data.nombre.split(" ")[0]);
            formData.append("Surname", data.nombre.split(" ").slice(1).join(" ") || data.nombre);
            formData.append("Username", data.email.split("@")[0]);
            formData.append("Email", data.email);
            formData.append("Password", data.password);
            formData.append("Phone", data.telefono || "00000000");
            formData.append("RoleName", data.rol);

            await register(formData);

            // Luego guardar en MongoDB con los datos operativos
            await createUser(payload);
        }
    };

    return { saveUser };
};