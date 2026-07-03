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
            rol: data.rol,
            id_restaurante: rolesConRestaurante.includes(data.rol) ? data.id_restaurante : null,
        };

        if (data.password) {
            payload.password = data.password;
        }

        if (userId) {
            await updateUser(userId, payload);
        } else {
            const formData = new FormData();
            formData.append("Name", data.nombre.split(" ")[0]);
            formData.append("Surname", data.nombre.split(" ").slice(1).join(" ") || data.nombre);
            formData.append("Username", data.email.split("@")[0]);
            formData.append("Email", data.email);
            formData.append("Password", data.password);
            formData.append("Phone", data.telefono || "00000000");
            formData.append("RoleName", data.rol);

            // Capturar el id que devuelve el auth-service
            const authResponse = await register(formData);
            const authUserId = authResponse?.data?.user?.id ?? null;

            // Si MongoDB falla, el error sube con contexto útil
            try {
                await createUser({ ...payload, auth_id: authUserId });
            } catch (mongoError) {
                console.error(`[dual-write] Fallo MongoDB para auth_id ${authUserId}:`, mongoError.message);
                throw new Error(
                    "Usuario creado en autenticación pero falló el registro operativo. " +
                    "Contacta al administrador del sistema."
                );
            }
        }
    };

    return { saveUser };
};