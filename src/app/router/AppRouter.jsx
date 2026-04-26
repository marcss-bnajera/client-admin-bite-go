import { Route, Routes, Navigate } from "react-router-dom"
import { AuthPage } from "../../features/auth/pages/AuthPage"
import { DashboardPage } from "../layouts/DashboardPage";
import { useAuthStore } from "../../features/auth/store/authStore";

export const AppRoutes = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <Routes>
            {/*PUBLICAS */}
            <Route path="/" element={<AuthPage />} />

            {/* PROTEGIDO POR ROL */}
            <Route
                path="/dashboard/*"
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />}
            />
        </Routes>
    );

}
