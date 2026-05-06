import { axiosAuth } from "./api";

export const login = async (data) => {
    return await axiosAuth.post("/api/v1/Auth/login", data);
};

export const register = async (data) => {
    return await axiosAuth.post("/api/v1/Auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/api/v1/Auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return await axiosAuth.post("/api/v1/Auth/reset-password", { token, newPassword });
};

export const verifyEmail = async (token) => {
    return await axiosAuth.post("/api/v1/Auth/verify-email", { token });
};

export const updateUserRole = async (userId, roleName) => {
    return await axiosAuth.put(`/api/v1/users/${userId}/role`, { roleName });
};

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get("/api/v1/Auth/users");
    return { users: data };
};