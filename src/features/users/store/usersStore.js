import { create } from 'zustand';
import {
    getUsers as getUsersRequest,
    createUser as createUserRequest,
    updateUser as updateUserRequest,
    deleteUser as deleteUserRequest,
    activateUser as activateUserRequest,
} from "../../../shared/api";

export const useUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: async (params) => {
        try {
            set({ loading: true, error: null });
            const response = await getUsersRequest(params);
            set({
                users: response.data.users ?? [],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener usuarios",
                loading: false,
            });
        }
    },

    createUser: async (data) => {
        try {
            set({ loading: true, error: null });
            await createUserRequest(data);
            await get().getUsers({ activo: true });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear usuario",
                loading: false,
            });
            throw error;
        }
    },

    updateUser: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateUserRequest(id, data);
            await get().getUsers({ activo: true });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar usuario",
                loading: false,
            });
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteUserRequest(id);
            set({
                users: get().users.filter((u) => u._id !== id),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al desactivar usuario",
                loading: false,
            });
        }
    },

    activateUser: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateUserRequest(id);
            set({
                users: get().users.map((u) =>
                    u._id === id ? { ...u, activo: true } : u
                ),
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al activar usuario",
                loading: false,
            });
        }
    },
}));