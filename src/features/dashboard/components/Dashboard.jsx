import { useEffect, useMemo, useRef } from "react";
import {
    ShoppingBag, UtensilsCrossed, CalendarDays, Users,
    AlertTriangle, Store, TrendingUp, TrendingDown,
    Clock, ChevronRight, Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useOrdersStore } from "../../orders/store/ordersStore";
import { useReservationsStore } from "../../reservations/store/reservationsStore";
import { useProductsStore } from "../../products/store/productsStore";
import { useUsersStore } from "../../users/store/usersStore";
import { useInventoryStore } from "../../inventory/store/inventoryStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useAuthStore } from "../../auth/store/authStore";

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
    const orders = useOrdersStore((state) => state.orders);
    const getOrders = useOrdersStore((state) => state.getOrders);
    const reservations = useReservationsStore((state) => state.reservations);
    const getReservations = useReservationsStore((state) => state.getReservations);
    const products = useProductsStore((state) => state.products);
    const getProducts = useProductsStore((state) => state.getProducts);
    const users = useUsersStore((state) => state.users);
    const getUsers = useUsersStore((state) => state.getUsers);
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const alerts = useInventoryStore((state) => state.alerts);
    const getLowStockAlerts = useInventoryStore((state) => state.getLowStockAlerts);

    useEffect(() => {
        const load = async () => {
            await Promise.allSettled([
                getOrders({ limit: 100 }),
                getReservations({ limit: 100 }),
                getRestaurants({ limit: 100 }),
            ]);
            await Promise.allSettled([
                getProducts({ limit: 100 }),
                getUsers({ limit: 100 }),
            ]);
        };
        load();
    }, []);

    useEffect(() => {
        if (restaurants.length > 0) {
            restaurants.forEach((r) => getLowStockAlerts(r._id));
        }
    }, [restaurants.length]);

    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            if (document.visibilityState === "visible" && mountedRef.current) {
                getOrders({ limit: 100 }, true);
                getReservations({ limit: 100 }, true);
                restaurants.forEach((r) => getLowStockAlerts(r._id));
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isAuthenticated, getOrders, getReservations, getLowStockAlerts, restaurants]);

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
        <div className="space-y-6 max-w-full px-1 sm:px-0 overflow-x-hidden">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#E8D8C3] sm:border-0 shadow-sm sm:shadow-none">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Dashboard</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Resumen general de operaciones — Bite & Go</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B6B6B] bg-white border border-[#E8D8C3] px-3 py-2 rounded-xl self-start sm:self-auto w-full sm:w-auto justify-center sm:justify-start shadow-sm sm:shadow-none font-medium shrink-0">
                    <Activity size={13} className="text-green-500 shrink-0 animate-pulse" />
                    Sistema operando con normalidad
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col justify-between min-w-0">
                            <div>
                                <div className="flex items-start justify-between mb-4 gap-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                                        <Icon size={17} className="text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg shrink-0 ${stat.up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                        {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                        <span className="truncate">{stat.trend}</span>
                                    </div>
                                </div>
                                <p className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B] truncate">{stat.value}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-[#E8D8C3]/40">
                                <p className="text-xs text-[#6B6B6B] font-medium truncate">{stat.label}</p>
                                <p className="text-[10px] text-[#A0A0A0] mt-0.5 font-medium tracking-wide uppercase">{stat.trendLabel}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Reservaciones + pedidos recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

                {/* Pedidos recientes */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8D8C3] shadow-sm overflow-hidden max-w-full">
                    <div className="px-4 py-4 md:px-6 border-b border-[#E8D8C3] flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-[#2B2B2B] text-base md:text-lg truncate">Pedidos Recientes</h3>
                            <p className="text-xs text-[#6B6B6B] mt-0.5">Últimas órdenes</p>
                        </div>
                        <NavLink to="/dashboard/pedidos" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 shrink-0 bg-[#E67E22]/10 px-2.5 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                            Ver todos <ChevronRight size={12} />
                        </NavLink>
                    </div>

                    {/* VISTA MÓVIL DE PEDIDOS RECIENTES (Oculta en md:) */}
                    <div className="block md:hidden divide-y divide-[#E8D8C3]/60">
                        {pedidosRecientes.length === 0 ? (
                            <div className="px-4 py-8 text-center text-[#6B6B6B] text-sm">
                                Sin pedidos recientes
                            </div>
                        ) : pedidosRecientes.map((p) => {
                            const cfg = estadoConfig[p.estado] ?? estadoConfig.Pendiente;
                            return (
                                <div key={p._id} className="p-4 space-y-2.5 hover:bg-[#F2E6D9]/30 transition-colors">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-[#2B2B2B] text-sm truncate">{p.cliente_nombre || "—"}</span>
                                        <span className="font-extrabold text-[#2B2B2B] text-sm shrink-0">Q{p.total?.toFixed(2) ?? "0.00"}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-xs text-[#6B6B6B]">
                                        <span className="truncate max-w-[60%]">{p.id_restaurante?.nombre || "—"}</span>
                                        <div className="flex items-center gap-1 shrink-0 text-[11px]">
                                            <Clock size={11} className="text-[#A0A0A0]" />
                                            {formatTime(p.createdAt)}
                                        </div>
                                    </div>
                                    <div className="pt-0.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.cls}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            {p.estado}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* VISTA DESKTOP DE PEDIDOS RECIENTES (Oculta en móvil) */}
                    <div className="hidden md:block overflow-x-auto w-full">
                        <table className="w-full text-sm table-auto">
                            <thead className="bg-[#F5EFE6]">
                                <tr>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs tracking-wider">Cliente</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs tracking-wider">Restaurante</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs tracking-wider">Estado</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs tracking-wider">Total</th>
                                    <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] text-xs tracking-wider">Tiempo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosRecientes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-[#6B6B6B] text-sm">
                                            Sin pedidos recientes
                                        </td>
                                    </tr>
                                ) : pedidosRecientes.map((p, index) => {
                                    const cfg = estadoConfig[p.estado] ?? estadoConfig.Pendiente;
                                    return (
                                        <tr key={p._id} className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}>
                                            <td className="px-6 py-3 font-medium text-[#2B2B2B] truncate max-w-[140px]">
                                                {p.cliente_nombre || "—"}
                                            </td>
                                            <td className="px-6 py-3 text-[#6B6B6B] text-xs truncate max-w-[150px]">
                                                {p.id_restaurante?.nombre || "—"}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.cls}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-bold text-[#2B2B2B] whitespace-nowrap">
                                                Q{p.total?.toFixed(2) ?? "0.00"}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
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
                <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 md:p-5 max-w-full">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-[#2B2B2B] text-base md:text-lg truncate">Reservas Hoy</h3>
                        </div>
                        <NavLink to="/dashboard/reservaciones" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 shrink-0 bg-[#E67E22]/10 px-2.5 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                            Ver todas <ChevronRight size={12} />
                        </NavLink>
                    </div>

                    {reservacionesProximas.length === 0 ? (
                        <p className="text-sm text-[#6B6B6B] text-center py-8">Sin reservaciones hoy</p>
                    ) : (
                        <div className="space-y-3 divide-y divide-[#E8D8C3]/30 sm:divide-y-0">
                            {reservacionesProximas.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE6] transition-colors min-w-0 pt-3 sm:pt-2 first:pt-2">
                                    <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {r.userId?.nombre?.charAt(0) ?? "?"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#2B2B2B] truncate">{r.userId?.nombre || "—"}</p>
                                        <p className="text-[10px] text-[#6B6B6B] truncate">{r.restaurantId?.nombre || "—"} · {r.peopleCount} pers.</p>
                                    </div>
                                    <div className="text-right shrink-0 flex flex-col items-end gap-0.5">
                                        <p className="text-xs font-extrabold text-[#E67E22] whitespace-nowrap">
                                            {new Date(r.reservationDate).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${reservaConfig[r.status]?.cls ?? ""}`}>
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
                <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 md:p-5 max-w-full">
                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-[#2B2B2B] text-base md:text-lg truncate">Alertas de Inventario</h3>
                        </div>
                        <NavLink to="/dashboard/inventario" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 shrink-0 bg-[#E67E22]/10 px-2.5 py-1.5 rounded-lg sm:bg-transparent sm:p-0">
                            Ir a inventario <ChevronRight size={12} />
                        </NavLink>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {alerts.slice(0, 4).map((ins) => {
                            const pct = Math.min((ins.stock_actual / ins.stock_minimo) * 100, 100);
                            return (
                                <div key={ins._id} className="flex items-center gap-4 p-3 bg-[#E6A5A5]/15 border border-[#E6A5A5] rounded-xl min-w-0">
                                    <AlertTriangle size={16} className="text-[#C0392B] shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className="text-sm font-bold text-[#2B2B2B] truncate">{ins.nombre_insumo}</p>
                                            <p className="text-xs text-[#C0392B] font-bold shrink-0">{ins.stock_actual}/{ins.stock_minimo}</p>
                                        </div>
                                        <div className="w-full bg-[#E8D8C3] rounded-full h-1.5 overflow-hidden">
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