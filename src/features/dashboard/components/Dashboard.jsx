import { useEffect, useMemo } from "react";
import {
    ShoppingBag, UtensilsCrossed, CalendarDays, Users,
    AlertTriangle, Store, TrendingUp, TrendingDown,
    Clock, ChevronRight, Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useOrders } from "../../orders/hooks/useOrders";
import { useProducts } from "../../products/hooks/useProducts";
import { useReservations } from "../../reservations/hooks/useReservations";
import { useUsers } from "../../users/hooks/useUsers";
import { useRestaurants } from "../../restaurants/hooks/useRestaurants";
import { useInventoryStore } from "../../inventory/store/inventoryStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";

const estadoConfig = {
    Pendiente: { cls: "bg-[#EAD7A4] text-yellow-800", dot: "bg-yellow-500" },
    Preparacion: { cls: "bg-[#A9C7E8] text-blue-900", dot: "bg-blue-500" },
    Listo: { cls: "bg-[#A8D5BA] text-green-900", dot: "bg-green-500" },
    Entregado: { cls: "bg-[#D6D6D6] text-gray-700", dot: "bg-gray-400" },
    Cancelado: { cls: "bg-[#E6A5A5] text-red-900", dot: "bg-red-500" },
};

const reservaConfig = {
    Confirmed: { cls: "bg-[#A9C7E8] text-blue-900", label: "Confirmada" },
    Attended: { cls: "bg-[#A8D5BA] text-green-900", label: "Atendida" },
    Cancelled: { cls: "bg-[#E6A5A5] text-red-900", label: "Cancelada" },
};

const formatTime = (iso) => {
    if (!iso) return "—";
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (diff < 1) return "hace un momento";
    if (diff < 60) return `hace ${diff} min`;
    return `hace ${Math.floor(diff / 60)}h`;
};

export const Dashboard = () => {
    const { orders } = useOrders();
    const { products } = useProducts();
    const { reservations } = useReservations();
    const { users } = useUsers();
    const { restaurants } = useRestaurants();
    const alerts = useInventoryStore((state) => state.alerts);
    const getLowStockAlerts = useInventoryStore((state) => state.getLowStockAlerts);
    const restaurantsList = useRestaurantsStore((state) => state.restaurants);

    // Cargar alertas del primer restaurante activo
    useEffect(() => {
        if (restaurantsList.length > 0) {
            restaurantsList.forEach((r) => getLowStockAlerts(r._id));
        }
    }, [restaurantsList.length]);

    const today = new Date().toDateString();

    const pedidosHoy = useMemo(() =>
        (orders ?? []).filter((o) => new Date(o.createdAt).toDateString() === today),
        [orders]
    );

    const reservacionesHoy = useMemo(() =>
        (reservations ?? []).filter((r) => new Date(r.reservationDate).toDateString() === today),
        [reservations]
    );

    const productosActivos = useMemo(() =>
        (products ?? []).filter((p) => p.activo).length,
        [products]
    );

    const usuariosActivos = useMemo(() =>
        (users ?? []).filter((u) => u.activo).length,
        [users]
    );

    const restaurantesActivos = useMemo(() =>
        (restaurants ?? []).filter((r) => r.activo).length,
        [restaurants]
    );

    const pedidosRecientes = useMemo(() =>
        [...(orders ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
        [orders]
    );

    const reservacionesProximas = useMemo(() =>
        [...reservacionesHoy].sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate)).slice(0, 4),
        [reservacionesHoy]
    );

    const stats = [
        { label: "Pedidos Hoy", value: pedidosHoy.length, icon: ShoppingBag, bg: "bg-[#E67E22]", trend: pedidosHoy.filter(o => o.activo).length, trendLabel: "activos", up: true },
        { label: "Productos Activos", value: productosActivos, icon: UtensilsCrossed, bg: "bg-[#3A2E2A]", trend: restaurantesActivos, trendLabel: "restaurantes", up: true },
        { label: "Reservaciones Hoy", value: reservacionesHoy.length, icon: CalendarDays, bg: "bg-[#C0392B]", trend: reservacionesHoy.filter(r => r.status === "Confirmed").length, trendLabel: "pendientes", up: false },
        { label: "Usuarios Registrados", value: usuariosActivos, icon: Users, bg: "bg-[#5a7a5a]", trend: (users ?? []).length, trendLabel: "total", up: true },
        { label: "Stock Bajo", value: alerts.length, icon: AlertTriangle, bg: "bg-[#8B6914]", trend: "!", trendLabel: "atención", up: false },
        { label: "Restaurantes Activos", value: restaurantesActivos, icon: Store, bg: "bg-[#2E4A6B]", trend: (restaurants ?? []).length, trendLabel: "total", up: true },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Dashboard</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Resumen general de operaciones — Bite & Go</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B] bg-white border border-[#E8D8C3] px-3 py-2 rounded-xl">
                    <Activity size={13} className="text-green-500" />
                    Sistema operando con normalidad
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <Icon size={17} className="text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${stat.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                    {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B]">{stat.value}</p>
                            <p className="text-xs text-[#6B6B6B] mt-1 font-medium">{stat.label}</p>
                            <p className="text-[10px] text-[#A0A0A0] mt-0.5">{stat.trendLabel}</p>
                        </div>
                    );
                })}
            </div>

            {/* Reservaciones + pedidos recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Pedidos recientes — ocupa 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8D8C3] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E8D8C3] flex items-center justify-between">
                        <div>
                            <h3 className="font-extrabold text-[#2B2B2B]">Pedidos Recientes</h3>
                            <p className="text-xs text-[#6B6B6B] mt-0.5">Últimas órdenes</p>
                        </div>
                        <NavLink to="/dashboard/pedidos" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                            Ver todos <ChevronRight size={12} />
                        </NavLink>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[520px]">
                            <thead className="bg-[#F5EFE6]">
                                <tr>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs">Cliente</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs">Restaurante</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs">Estado</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs">Total</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs">Tiempo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosRecientes.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-[#6B6B6B] text-sm">Sin pedidos recientes</td></tr>
                                ) : pedidosRecientes.map((p, index) => {
                                    const cfg = estadoConfig[p.estado] ?? estadoConfig.Pendiente;
                                    return (
                                        <tr key={p._id} className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}>
                                            <td className="px-6 py-3 font-medium text-[#2B2B2B]">{p.id_usuario_cliente?.nombre || "—"}</td>
                                            <td className="px-6 py-3 text-[#6B6B6B] text-xs">{p.id_restaurante?.nombre || "—"}</td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.cls}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-bold text-[#2B2B2B]">Q{p.total?.toFixed(2) ?? "0.00"}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-1 text-xs text-[#6B6B6B]">
                                                    <Clock size={11} />{formatTime(p.createdAt)}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reservaciones hoy */}
                <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-[#2B2B2B]">Reservas Hoy</h3>
                        <NavLink to="/dashboard/reservaciones" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                            Ver todas <ChevronRight size={12} />
                        </NavLink>
                    </div>
                    {reservacionesProximas.length === 0 ? (
                        <p className="text-sm text-[#6B6B6B] text-center py-6">Sin reservaciones hoy</p>
                    ) : (
                        <div className="space-y-3">
                            {reservacionesProximas.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE6] transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {r.userId?.nombre?.charAt(0) ?? "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#2B2B2B] truncate">{r.userId?.nombre || "—"}</p>
                                        <p className="text-[10px] text-[#6B6B6B]">{r.restaurantId?.nombre || "—"} · {r.peopleCount} personas</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-extrabold text-[#E67E22]">
                                            {new Date(r.reservationDate).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${reservaConfig[r.status]?.cls ?? ""}`}>
                                            {reservaConfig[r.status]?.label ?? r.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Alertas de inventario */}
            {alerts.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-extrabold text-[#2B2B2B]">Alertas de Inventario</h3>
                        <NavLink to="/dashboard/inventario" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                            Ir a inventario <ChevronRight size={12} />
                        </NavLink>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {alerts.slice(0, 4).map((ins) => {
                            const pct = Math.min((ins.stock_actual / ins.stock_minimo) * 100, 100);
                            return (
                                <div key={ins._id} className="flex items-center gap-4 p-3 bg-[#E6A5A5]/15 border border-[#E6A5A5] rounded-xl">
                                    <AlertTriangle size={16} className="text-[#C0392B] shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-bold text-[#2B2B2B]">{ins.nombre_insumo}</p>
                                            <p className="text-xs text-[#C0392B] font-bold">{ins.stock_actual}/{ins.stock_minimo}</p>
                                        </div>
                                        <div className="w-full bg-[#E8D8C3] rounded-full h-1.5">
                                            <div className="bg-[#C0392B] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};