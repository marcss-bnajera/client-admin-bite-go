import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { DashboardPage } from "../layouts/DashboardPage.jsx";
import { Dashboard } from "../../features/dashboard/components/Dashboard.jsx";
import { Orders } from "../../features/orders/components/Orders.jsx";
import { Products } from "../../features/products/components/Products.jsx";
import { Inventory } from "../../features/inventory/components/Inventory.jsx";
import { Reservations } from "../../features/reservations/components/Reservations.jsx";
import { Restaurants } from "../../features/restaurants/components/Restaurants.jsx";
import { Users } from "../../features/users/components/Users.jsx";
import { Recipes } from "../../features/recipes/components/Recipes.jsx";
import { Events } from "../../features/events/components/Events.jsx";
import { Tables } from "../../features/tables/components/Tables.jsx";
import { Categories } from "../../features/categories/components/Categories.jsx";
import { Items } from "../../features/items/components/Items.jsx";
import { useAuthStore } from "../../features/auth/store/authStore.js";

export const AppRoutes = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<AuthPage />} />

            {/* PROTECTED + ROLE */}
            <Route path="/dashboard/*" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" replace />}>
                <Route index element={<Dashboard />} />
                <Route path="pedidos" element={<Orders />} />
                <Route path="productos" element={<Products />} />
                <Route path="inventario" element={<Inventory />} />
                <Route path="reservaciones" element={<Reservations />} />
                <Route path="restaurantes" element={<Restaurants />} />
                <Route path="usuarios" element={<Users />} />
                <Route path="recetas" element={<Recipes />} />
                <Route path="eventos" element={<Events />} />
                <Route path="mesas" element={<Tables />} />
                <Route path="categorias" element={<Categories />} />
                <Route path="items" element={<Items />} />
            </Route>

            {/* Ruta temporal para pruebas */}
            <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
    );
}