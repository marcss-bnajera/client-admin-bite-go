import {
    LayoutDashboard,
    ClipboardList,
    UtensilsCrossed,
    Package,
    CalendarDays,
    Store,
    Users,
    BookOpen,
    PartyPopper,
    Armchair,
    Tag
} from "lucide-react";

export const Sidebar = () => {
    const items = [
        { label: "Dashboard", icon: LayoutDashboard, active: true },
        { label: "Pedidos", icon: ClipboardList, active: false },
        { label: "Productos & Menú", icon: UtensilsCrossed, active: false },
        { label: "Inventario de Insumos", icon: Package, active: false },
        { label: "Reservaciones", icon: CalendarDays, active: false },
        { label: "Restaurantes", icon: Store, active: false },
        { label: "Usuarios", icon: Users, active: false },
        { label: "Recetas", icon: BookOpen, active: false },
        { label: "Eventos Gastronómicos", icon: PartyPopper, active: false },
        { label: "Mesas", icon: Armchair, active: false },
        { label: "Categorías", icon: Tag, active: false },
    ];

    return (
        <aside className="w-64 bg-[#1A1A1A] min-h-[calc(100vh-4rem)] p-4 shadow-xl">
            <div className="mb-6 px-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Gestión de Operaciones
                </span>
            </div>

            <ul className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.label}>
                            <div
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer
                                    ${item.active
                                        ? "bg-[#F27405] text-white shadow-lg shadow-[#F27405]/20"
                                        : "text-gray-400 hover:bg-[#262626] hover:text-[#F27405]"}
                                `}
                            >
                                <Icon size={18} />
                                <span className="text-sm">{item.label}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Estado del Servicio */}
            <div className="mt-8 mx-2 p-4 bg-gradient-to-br from-[#262626] to-[#1a1a1a] rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-400">Estado del Servicio</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm font-bold text-white">Sistema Activo</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Bite &amp; Go v1.0.0</p>
            </div>
        </aside>
    );
};