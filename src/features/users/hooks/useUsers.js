import { useEffect } from "react";
import { useUsersStore } from "../store/usersStore";
import { showError } from "../../../shared/utils/toast";

export const useUsers = () => {
    const { users, loading, error, getUsers } = useUsersStore();

    useEffect(() => {
        getUsers({ activo: true });
    }, []);

    useEffect(() => {
        if (error) showError(error);
    }, [error]);

    return { users, loading, error, getUsers };
};