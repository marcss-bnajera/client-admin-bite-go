import {
    ShoppingBag, UtensilsCrossed, CalendarDays, Users,
    AlertTriangle, Store, TrendingUp, TrendingDown,
    Clock, CheckCircle2, ChevronRight, Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";

const stats = [
    {
        label: "Pedidos Hoy",
        value: "24",
        icon: ShoppingBag,
        bg: "bg-[#E67E22]",
        trend: "+3",
        trendLabel: "vs ayer",
        up: true,
    },
    {
        label: "Productos Activos",
        value: "48",
        icon: UtensilsCrossed,
        bg: "bg-[#3A2E2A]",
        trend: "3",
        trendLabel: "restaurantes",
        up: true,
    },
    {
        label: "Reservaciones Hoy",
        value: "12",
        icon: CalendarDays,
        bg: "bg-[#C0392B]",
        trend: "4",
        trendLabel: "pendientes",
        up: false,
    },
    {
        label: "Usuarios Registrados",
        value: "320",
        icon: Users,
        bg: "bg-[#5a7a5a]",
        trend: "+5",
        trendLabel: "esta semana",
        up: true,
    },
    {
        label: "Stock Bajo",
        value: "2",
        icon: AlertTriangle,
        bg: "bg-[#8B6914]",
        trend: "!",
        trendLabel: "atencion",
        up: false,
    },
    {
        label: "Restaurantes Activos",
        value: "3",
        icon: Store,
        bg: "bg-[#2E4A6B]",
        trend: "100",
        trendLabel: "% operativos",
        up: true,
    },
];

const pedidosRecientes = [
    { id: "#1042", cliente: "Juan Perez", estado: "Preparacion", total: "Q85.00", tipo: "Comer aqui", tiempo: "hace 5 min" },
    { id: "#1041", cliente: "Maria Lopez", estado: "Pendiente", total: "Q120.00", tipo: "Domicilio", tiempo: "hace 12 min" },
    { id: "#1040", cliente: "Carlos Ruiz", estado: "Listo", total: "Q60.00", tipo: "Para llevar", tiempo: "hace 18 min" },
    { id: "#1039", cliente: "Ana Torres", estado: "Entregado", total: "Q200.00", tipo: "Domicilio", tiempo: "hace 34 min" },
    { id: "#1038", cliente: "Pedro Gomez", estado: "Cancelado", total: "Q45.00", tipo: "Comer aqui", tiempo: "hace 51 min" },
];

const reservacionesHoy = [
    { nombre: "Sofia Herrera", restaurante: "Bite Central", hora: "13:00", personas: 4, status: "Confirmed" },
    { nombre: "Luis Mendez", restaurante: "Bite Norte", hora: "14:30", personas: 2, status: "Confirmed" },
    { nombre: "Diana Castillo", restaurante: "Bite Sur", hora: "19:00", personas: 6, status: "Confirmed" },
    { nombre: "Roberto Lima", restaurante: "Bite Central", hora: "20:30", personas: 3, status: "Attended" },
];

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

// Barra de actividad simulada — 7 dias
const actividadSemanal = [
    { dia: "Lun", pedidos: 18 },
    { dia: "Mar", pedidos: 32 },
    { dia: "Mie", pedidos: 27 },
    { dia: "Jue", pedidos: 41 },
    { dia: "Vie", pedidos: 55 },
    { dia: "Sab", pedidos: 62 },
    { dia: "Hoy", pedidos: 24 },
];

const maxPedidos = Math.max(...actividadSemanal.map((d) => d.pedidos));

export const Dashboard = () => {
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

            {/* Stats grid */}
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

            {/* Fila media: grafica + reservaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Grafica de pedidos semanal */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-extrabold text-[#2B2B2B]">Pedidos — Ultimos 7 dias</h3>
                            <p className="text-xs text-[#6B6B6B] mt-0.5">Volumen diario de ordenes</p>
                        </div>
                        <span className="text-xs font-bold text-[#E67E22] bg-[#F5EFE6] px-3 py-1 rounded-lg">Esta semana</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                        {actividadSemanal.map((d) => {
                            const pct = (d.pedidos / maxPedidos) * 100;
                            const esHoy = d.dia === "Hoy";
                            return (
                                <div key={d.dia} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[10px] font-bold text-[#6B6B6B]">{d.pedidos}</span>
                                    <div className="w-full flex items-end" style={{ height: "80px" }}>
                                        <div
                                            className={`w-full rounded-t-lg transition-all ${esHoy ? "bg-[#E67E22]" : "bg-[#E8D8C3] hover:bg-[#D4B896]"}`}
                                            style={{ height: `${pct}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold ${esHoy ? "text-[#E67E22]" : "text-[#6B6B6B]"}`}>{d.dia}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reservaciones de hoy */}
                <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-[#2B2B2B]">Reservas Hoy</h3>
                        <NavLink to="/dashboard/reservaciones" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                            Ver todas <ChevronRight size={12} />
                        </NavLink>
                    </div>
                    <div className="space-y-3">
                        {reservacionesHoy.map((r, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE6] transition-colors">
                                <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {r.nombre.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#2B2B2B] truncate">{r.nombre}</p>
                                    <p className="text-[10px] text-[#6B6B6B]">{r.restaurante} · {r.personas} personas</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-extrabold text-[#E67E22]">{r.hora}</p>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${reservaConfig[r.status].cls}`}>
                                        {reservaConfig[r.status].label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pedidos recientes */}
            <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8D8C3] flex items-center justify-between">
                    <div>
                        <h3 className="font-extrabold text-[#2B2B2B]">Pedidos Recientes</h3>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">Ultimas ordenes del dia</p>
                    </div>
                    <NavLink to="/dashboard/pedidos" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                        Ver todos <ChevronRight size={12} />
                    </NavLink>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[520px]">
                        <thead className="bg-[#F5EFE6]">
                            <tr>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">ID</th>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">Cliente</th>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">Tipo</th>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">Estado</th>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">Total</th>
                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide text-xs">Tiempo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidosRecientes.map((p, index) => {
                                const cfg = estadoConfig[p.estado];
                                return (
                                    <tr
                                        key={p.id}
                                        className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                                    >
                                        <td className="px-6 py-3 font-bold text-[#E67E22]">{p.id}</td>
                                        <td className="px-6 py-3 font-medium text-[#2B2B2B]">{p.cliente}</td>
                                        <td className="px-6 py-3 text-[#6B6B6B] text-xs">{p.tipo}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.cls}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-[#2B2B2B]">{p.total}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1 text-xs text-[#6B6B6B]">
                                                <Clock size={11} />
                                                {p.tiempo}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stock bajo — alerta rapida */}
            <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-[#2B2B2B]">Alertas de Inventario</h3>
                    <NavLink to="/dashboard/inventario" className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1">
                        Ir a inventario <ChevronRight size={12} />
                    </NavLink>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { nombre: "Lechuga", restaurante: "Bite Norte", actual: 5, minimo: 8 },
                        { nombre: "Salsa BBQ", restaurante: "Bite Norte", actual: 3, minimo: 10 },
                    ].map((ins) => {
                        const pct = Math.min((ins.actual / ins.minimo) * 100, 100);
                        return (
                            <div key={ins.nombre} className="flex items-center gap-4 p-3 bg-[#E6A5A5]/15 border border-[#E6A5A5] rounded-xl">
                                <AlertTriangle size={16} className="text-[#C0392B] shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-[#2B2B2B]">{ins.nombre}</p>
                                        <p className="text-xs text-[#C0392B] font-bold">{ins.actual}/{ins.minimo}</p>
                                    </div>
                                    <p className="text-[10px] text-[#6B6B6B] mb-1.5">{ins.restaurante}</p>
                                    <div className="w-full bg-[#E8D8C3] rounded-full h-1.5">
                                        <div
                                            className="bg-[#C0392B] h-1.5 rounded-full"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};