import { Layers } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    LayoutDashboard, ClipboardList, UtensilsCrossed,
    Package, CalendarDays, Store, Users,
    BookOpen, PartyPopper, Armchair, Tag
} from "lucide-react";
import { useAuthStore } from "../../../features/auth/store/authStore";

const allGroups = [
    {
        label: "Principal",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { label: "Pedidos", icon: ClipboardList, path: "/dashboard/pedidos" },
        ],
    },
    {
        label: "Operaciones",
        items: [
            { label: "Restaurantes", icon: Store, path: "/dashboard/restaurantes" },
            { label: "Mesas", icon: Armchair, path: "/dashboard/mesas" },
            { label: "Reservaciones", icon: CalendarDays, path: "/dashboard/reservaciones" },
            { label: "Eventos Gastronomicos", icon: PartyPopper, path: "/dashboard/eventos" },
        ],
    },
    {
        label: "Menu & Stock",
        items: [
            { label: "Productos & Menu", icon: UtensilsCrossed, path: "/dashboard/productos" },
            { label: "Categorias", icon: Tag, path: "/dashboard/categorias" },
            { label: "Items & Variaciones", icon: Layers, path: "/dashboard/items" },
            { label: "Recetas", icon: BookOpen, path: "/dashboard/recetas" },
            { label: "Inventario de Insumos", icon: Package, path: "/dashboard/inventario" },
        ],
    },
    {
        label: "Acceso",
        superAdminOnly: true,
        items: [
            { label: "Usuarios", icon: Users, path: "/dashboard/usuarios" },
        ],
    },
];

export const Sidebar = ({ isOpen, onClose }) => {
    const role = useAuthStore((state) => state.user?.role);
    const isSuperAdmin = role === "SuperAdmin";
    const groups = allGroups.filter(g => !g.superAdminOnly || isSuperAdmin);

    const [collapsed, setCollapsed] = useState(!isOpen);

    useEffect(() => {
        setCollapsed(!isOpen);
    }, [isOpen]);

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className={`
                hidden md:flex flex-col bg-[#3A2E2A] min-h-[calc(100vh-4rem)] shadow-xl
                transition-[width,padding] duration-500 ease-in-out overflow-hidden
                ${collapsed ? "w-16 p-2" : "w-64 p-4"}
            `}>
                <div className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden">
                    {groups.map((group) => (
                        <div key={group.label}>
                            {/* Label grupo */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${collapsed ? "max-h-0 opacity-0 mb-0" : "max-h-8 opacity-100 mb-1"}`}>
                                <p className="text-[10px] font-black text-[#8a7a72] uppercase tracking-widest px-4 whitespace-nowrap">
                                    {group.label}
                                </p>
                            </div>

                            {/* Separador collapsed */}
                            <div className={`transition-all duration-500 ease-in-out border-[#5a4a44] ${collapsed ? "border-t mx-2 mb-2 opacity-100" : "border-t-0 mx-0 mb-0 opacity-0 h-0"}`} />

                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.label}>
                                            <NavLink
                                                to={item.path}
                                                end={item.path === "/dashboard"}
                                                className={({ isActive }) => `
                                                    flex items-center rounded-xl font-semibold transition-all duration-500 ease-in-out w-full py-3 overflow-hidden
                                                    ${collapsed ? "px-0 justify-center" : "px-4 justify-start"}
                                                    ${isActive
                                                        ? "bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20"
                                                        : "text-[#D1D1D1] hover:bg-[#D35400] hover:text-white"}
                                                `}
                                                title={item.label}
                                            >
                                                <div className={`
                                                    flex items-center justify-center shrink-0 h-5 transition-all duration-500 ease-in-out
                                                    ${collapsed ? "w-12" : "w-5"}
                                                `}>
                                                    <Icon size={18} />
                                                </div>

                                                <span className={`
                                                    text-sm whitespace-nowrap overflow-hidden
                                                    transition-all duration-500 ease-in-out
                                                    ${collapsed ? "w-0 opacity-0 invisible ml-0" : "w-44 opacity-100 visible ml-3"}
                                                `}>
                                                    {item.label}
                                                </span>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Widget de Estado del Servicio */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${collapsed ? "max-h-0 opacity-0 mt-0 mx-0 p-0" : "max-h-40 opacity-100 mt-8 mx-2"}`}>
                    <div className="p-4 bg-gradient-to-br from-[#4a3c38] to-[#3A2E2A] rounded-2xl border border-[#5a4a44]">
                        <p className="text-xs text-[#8a7a72]">Estado del Servicio</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                            <p className="text-sm font-bold text-white">Sistema Activo</p>
                        </div>
                        <p className="text-[10px] text-[#8a7a72] mt-1">Bite &amp; Go v1.0.0</p>
                    </div>
                </div>

                {/* Punto indicador cuando está colapsado */}
                <div className={`flex justify-center transition-all duration-500 ease-in-out ${collapsed ? "mt-4 opacity-100 h-2" : "mt-0 opacity-0 h-0 overflow-hidden"}`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </aside>

            {/* MOBILE DRAWER (Corregido el cierre automático y z-index) */}
            <aside className={`
                fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#3A2E2A] z-50 p-4
                flex flex-col md:hidden shadow-2xl overflow-hidden
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    {groups.map((group) => (
                        <div key={group.label} className="space-y-1">
                            {/* Títulos elegantes también en móvil */}
                            <p className="text-[10px] font-black text-[#8a7a72] uppercase tracking-widest px-4 mb-1">
                                {group.label}
                            </p>

                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.label}>
                                            <NavLink
                                                to={item.path}
                                                end={item.path === "/dashboard"}
                                                className={({ isActive }) => `
                                                    flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 w-full
                                                    ${isActive
                                                        ? "bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20"
                                                        : "text-[#D1D1D1] hover:bg-[#D35400] hover:text-white"}
                                                `}
                                                title={item.label}
                                            >
                                                <Icon size={18} className="shrink-0" />
                                                <span className="text-sm">{item.label}</span>
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Widget inferior en Móvil */}
                <div className="mt-4 bg-gradient-to-br from-[#4a3c38] to-[#3A2E2A] rounded-2xl border border-[#5a4a44] p-4">
                    <p className="text-xs text-[#8a7a72]">Estado del Servicio</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                        <p className="text-sm font-bold text-white">Sistema Activo</p>
                    </div>
                    <p className="text-[10px] text-[#8a7a72] mt-1">Bite &amp; Go v1.0.0</p>
                </div>
            </aside>
        </>
    );
};