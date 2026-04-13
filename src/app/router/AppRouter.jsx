import { Route, Routes } from "react-router-dom"
import { AuthPage } from "../../features/auth/pages/AuthPage"
import { DashboardPage } from "../layouts/DashboardPage";

export const AppRoutes = () => {
    return (
        <Routes>
            {/*PUBLICAS */}
            <Route path="/" element={<AuthPage />} />

            {/* PROTEGIDO POR ROL */}
            <Route path="/dashboard/*" element={<DashboardPage />} />
        </Routes>
    );

}