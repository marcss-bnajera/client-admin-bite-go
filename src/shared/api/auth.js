import { axiosAuth } from "./api";

export const login = async (data) => {
    return await axiosAuth.post("/api/v1/Auth/login", data);
};

export const register = async () => {
    return await axiosAuth.post("/auth/register", data, {
        Headers: { "Content-type": "multipart/form-data" }
    });
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return await axiosAuth.post("/auth/reset-password", { token, newPassword });
};

export const verifyEmail = async (token) => {
    return await axiosAuth.post("/auth/verify-email", { token });
};

export const updateUserRole = async () => {
    return await axiosAuth.post(`/users/${userId}/role`, { roleName });
};

export const getAllUser = async () => {
    const { data } = await axiosAuth.get("/auth/users")
    return { users: data };
};