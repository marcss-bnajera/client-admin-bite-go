import { Layers } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, ClipboardList, UtensilsCrossed,
    Package, CalendarDays, Store, Users,
    BookOpen, PartyPopper, Armchair, Tag
} from "lucide-react";

const groups = [
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
        items: [
            { label: "Usuarios", icon: Users, path: "/dashboard/usuarios" },
        ],
    },
];

export const Sidebar = () => {
    return (
        <aside className="w-16 md:w-64 bg-[#3A2E2A] min-h-[calc(100vh-4rem)] flex flex-col p-2 md:p-4 shadow-xl transition-all duration-300">
            <div className="flex-1 space-y-4 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.label}>
                        {/* Label grupo — solo md+ */}
                        <p className="hidden md:block text-[10px] font-black text-[#8a7a72] uppercase tracking-widest px-4 mb-1">
                            {group.label}
                        </p>
                        {/* Separador mobile */}
                        <div className="block md:hidden w-6 h-px bg-[#5a4a44] mx-auto mb-2" />

                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.label}>
                                        <NavLink
                                            to={item.path}
                                            end={item.path === "/dashboard"}
                                            className={({ isActive }) => `
                                                flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3 rounded-xl font-semibold transition-all duration-300
                                                ${isActive
                                                    ? "bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20"
                                                    : "text-[#D1D1D1] hover:bg-[#D35400] hover:text-white"}
                                            `}
                                            title={item.label}
                                        >
                                            <Icon size={18} className="shrink-0" />
                                            <span className="text-sm hidden md:block">{item.label}</span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-8 mx-1 md:mx-2 p-2 md:p-4 bg-gradient-to-br from-[#4a3c38] to-[#3A2E2A] rounded-2xl border border-[#5a4a44]">
                <p className="text-xs text-[#8a7a72] hidden md:block">Estado del Servicio</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-0 md:mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                    <p className="text-sm font-bold text-white hidden md:block">Sistema Activo</p>
                </div>
                <p className="text-[10px] text-[#8a7a72] mt-1 hidden md:block">Bite &amp; Go v1.0.0</p>
            </div>
        </aside>
    );
};