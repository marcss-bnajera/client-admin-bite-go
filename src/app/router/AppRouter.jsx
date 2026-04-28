import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { DashboardPage } from "../layouts/DashboardPage";
import { Dashboard } from "../../features/dashboard/components/Dashboard";
import { Orders } from "../../features/orders/components/Orders";
import { Products } from "../../features/products/components/Products";
import { Inventory } from "../../features/inventory/components/Inventory";
import { Reservations } from "../../features/reservations/components/Reservations";
import { Restaurants } from "../../features/restaurants/components/Restaurants";
import { Users } from "../../features/users/components/Users";
import { Recipes } from "../../features/recipes/components/Recipes";
import { Events } from "../../features/events/components/Events";
import { Tables } from "../../features/tables/components/Tables";
import { Categories } from "../../features/categories/components/Categories";
import { Items } from "../../features/items/components/Items";

export const AppRoutes = () => {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<AuthPage />} />

            {/* PROTECTED + ROLE */}
            <Route path="/dashboard/*" element={<DashboardPage />}>
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
};