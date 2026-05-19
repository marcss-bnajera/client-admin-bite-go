import { useState } from "react";
import { Plus, Search, Filter, Eye, Pencil, Trash2, PowerOff, User, Store, Armchair, Bike, ShoppingBag } from "lucide-react";
import { OrderModal } from "./OrderModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useOrders } from "../hooks/useOrders";
import { useOrdersStore } from "../store/ordersStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const estadoColor = {
    Pendiente: "bg-[#EAD7A4] text-yellow-800",
    Preparacion: "bg-[#A9C7E8] text-blue-900",
    Listo: "bg-[#A8D5BA] text-green-900",
    Servido: "bg-[#D6D6D6] text-gray-700",
    Entregado: "bg-[#D6D6D6] text-gray-700",
    Cancelado: "bg-[#E6A5A5] text-red-900",
};

const TipoIcon = ({ tipo }) => {
    const icons = {
        "Comer aquí": <Armchair size={13} className="shrink-0" />,
        "Domicilio": <Bike size={13} className="shrink-0" />,
        "Para llevar": <ShoppingBag size={13} className="shrink-0" />,
    };
    return (
        <span className="flex items-center gap-1.5 text-[#6B6B6B]">
            {icons[tipo]}
            {tipo}
        </span>
    );
};

const AsignadoCell = ({ order }) => {
    if (order.tipo_servicio === "Comer aquí" && order.id_mesero_asignado) {
        return <span className="text-[#6B6B6B] text-xs">{order.id_mesero_asignado.nombre}</span>;
    }
    if (order.tipo_servicio === "Domicilio" && order.id_repartidor_asignado) {
        return <span className="text-[#6B6B6B] text-xs">{order.id_repartidor_asignado.nombre}</span>;
    }
    return <span className="text-[#C0C0C0] text-xs italic">—</span>;
};

const LIMIT = 10;
const estados = ["Pendiente", "Preparacion", "Listo", "Servido", "Entregado", "Cancelado"];

export const Orders = () => {
    const { orders, loading, getOrders } = useOrders();
    const { deleteOrder, activateOrder } = useOrdersStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [filterEstado, setFilterEstado] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [page, setPage] = useState(1);

    const filtered = (orders ?? []).filter((o) => {
        const q = search.toLowerCase();
        const matchSearch =
            o.id_usuario_cliente?.nombre?.toLowerCase().includes(q) ||
            o.id_restaurante?.nombre?.toLowerCase().includes(q);
        const matchEstado = filterEstado ? o.estado === filterEstado : true;
        return matchSearch && matchEstado;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedOrder(null); setModalOpen(true); };
    const handleEdit = (order) => { setSelectedOrder(order); setModalOpen(true); };

    const handleActivoChange = (e) => {
        const val = e.target.value;
        setFilterActivo(val);
        setPage(1);
        if (val === "activo") getOrders({ activo: true });
        else if (val === "inactivo") getOrders({ activo: false });
        else getOrders();
    };

    const handleToggle = (o) => {
        if (o.activo) {
            showConfirmToast({
                title: "Desactivar pedido",
                message: `¿Desactivar el pedido de ${o.id_usuario_cliente?.nombre ?? "este cliente"}?`,
                type: "deactivate",
                onConfirm: () => deleteOrder(o._id),
            });
        } else {
            showConfirmToast({
                title: "Reactivar pedido",
                message: `¿Reactivar el pedido de ${o.id_usuario_cliente?.nombre ?? "este cliente"}?`,
                type: "activate",
                onConfirm: () => activateOrder(o._id),
            });
        }
    };

    const selectClass = "outline-none text-sm bg-transparent text-[#6B6B6B] cursor-pointer";

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Pedidos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestión de todos los pedidos del sistema</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto shrink-0"
                >
                    <Plus size={16} /> Nuevo Pedido
                </button>
            </div>

            {/* FILTROS */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center pb-4 border-b border-[#E8D8C3]">
                {/* Input de Búsqueda */}
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 sm:h-10 w-full sm:w-auto sm:flex-1 sm:max-w-xs shadow-sm focus-within:border-[#E67E22] transition-colors">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por cliente o restaurante..."
                    />
                </div>

                {/* Contenedor de Selects en Móvil */}
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    {/* Filtro Estado */}
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 sm:h-10 shadow-sm flex-1 sm:flex-none focus-within:border-[#E67E22] transition-colors">
                        <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                        <select value={filterEstado} onChange={(e) => { setFilterEstado(e.target.value); setPage(1); }} className={`${selectClass} w-full`}>
                            <option value="">Todos los estados</option>
                            {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    {/* Filtro Activo */}
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 sm:h-10 shadow-sm flex-1 sm:flex-none focus-within:border-[#E67E22] transition-colors">
                        <select value={filterActivo} onChange={handleActivoChange} className={`${selectClass} w-full`}>
                            <option value="">Todos</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* VISTA EN TARJETAS PARA CELULARES*/}
            <div className="block lg:hidden space-y-3">
                {loading ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">Cargando pedidos...</div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">No se encontraron pedidos</div>
                ) : paginated.map((o) => (
                    <div
                        key={o._id}
                        className={`bg-white rounded-2xl p-4 border border-[#E8D8C3] shadow-sm space-y-3 transition-colors ${!o.activo ? "opacity-55" : ""}`}
                    >
                        {/* Fila superior: Cliente y Estado */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                    <User size={12} className="text-white" />
                                </div>
                                <span className="text-[#2B2B2B] font-bold truncate text-sm">{o.id_usuario_cliente?.nombre || "—"}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${estadoColor[o.estado] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                {o.estado}
                            </span>
                        </div>

                        {/* Detalles intermedios */}
                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E8D8C3]/60 py-2.5">
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Restaurante</p>
                                <div className="flex items-center gap-1 text-[#6B6B6B]">
                                    <Store size={12} className="shrink-0 text-[#A0A0A0]" />
                                    <span className="truncate">{o.id_restaurante?.nombre || "—"}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Tipo Servicio</p>
                                <TipoIcon tipo={o.tipo_servicio} />
                            </div>
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Asignado a</p>
                                <AsignadoCell order={o} />
                            </div>
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Items / Total</p>
                                <p className="text-[#2B2B2B] font-bold">
                                    {o.items?.length ?? 0} <span className="text-[#6B6B6B] font-normal text-[11px]">u.</span> — <span className="text-[#C0392B]">Q{o.total?.toFixed(2) ?? "0.00"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Acciones inferiores */}
                        <div className="flex items-center justify-end gap-1 pt-1">
                            <button onClick={() => handleEdit(o)} className="p-2 rounded-xl bg-[#F5EFE6] text-[#E67E22] transition-colors" title="Ver pedido">
                                <Eye size={15} />
                            </button>
                            <button onClick={() => handleEdit(o)} className="p-2 rounded-xl bg-[#F5EFE6] text-[#E67E22] transition-colors" title="Editar estado">
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={() => handleToggle(o)}
                                className={`p-2 rounded-xl transition-colors ${o.activo ? "bg-red-50 text-[#C0392B]" : "bg-[#E1F5EE] text-[#0F6E56]"}`}
                                title={o.activo ? "Desactivar pedido" : "Reactivar pedido"}
                            >
                                {o.activo ? <Trash2 size={15} /> : <PowerOff size={15} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABLA TRADICIONAL PARA ESCRITORIO (Oculta hasta lg:block) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-hidden">
                <table className="w-full text-sm table-auto">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Cliente</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Tipo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Asignado</th>
                            <th className="text-center px-6 py-4 font-bold tracking-wide">Items</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Total</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">Cargando pedidos...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={8} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">No se encontraron pedidos</td></tr>
                        ) : paginated.map((o, index) => (
                            <tr
                                key={o._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${!o.activo ? "opacity-55" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <span className="text-[#2B2B2B] font-medium">{o.id_usuario_cliente?.nombre || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Store size={13} className="shrink-0" />
                                        {o.id_restaurante?.nombre || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><TipoIcon tipo={o.tipo_servicio} /></td>
                                <td className="px-6 py-4 whitespace-nowrap"><AsignadoCell order={o} /></td>
                                <td className="px-6 py-4 text-center font-semibold text-[#2B2B2B] whitespace-nowrap">{o.items?.length ?? 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor[o.estado] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                        {o.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#2B2B2B] whitespace-nowrap">Q{o.total?.toFixed(2) ?? "0.00"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(o)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Ver pedido">
                                            <Eye size={15} />
                                        </button>
                                        <button onClick={() => handleEdit(o)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar estado">
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleToggle(o)}
                                            className={`p-2 rounded-lg transition-colors ${o.activo ? "hover:bg-red-50 text-[#C0392B]" : "hover:bg-[#E1F5EE] text-[#0F6E56]"}`}
                                            title={o.activo ? "Desactivar pedido" : "Reactivar pedido"}
                                        >
                                            {o.activo ? <Trash2 size={15} /> : <PowerOff size={15} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="w-full py-1">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <OrderModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
                order={selectedOrder}
                onSaved={getOrders}
            />
        </div>
    );
};