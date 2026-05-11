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

    const selectClass = "outline-none text-sm bg-transparent text-[#6B6B6B]";

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Pedidos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestión de todos los pedidos del sistema</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Pedido
                </button>
            </div>

            {/* FILTROS */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-[#E8D8C3]">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9 flex-1 min-w-[160px] max-w-xs">
                    <Search size={14} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por cliente o restaurante..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <Filter size={14} className="text-[#6B6B6B] shrink-0" />
                    <select value={filterEstado} onChange={(e) => { setFilterEstado(e.target.value); setPage(1); }} className={selectClass}>
                        <option value="">Todos los estados</option>
                        {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <select value={filterActivo} onChange={handleActivoChange} className={selectClass}>
                        <option value="">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* TABLA */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Cliente</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Tipo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Asignado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Items</th>
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
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <span className="text-[#2B2B2B] font-medium">{o.id_usuario_cliente?.nombre || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Store size={13} className="shrink-0" />
                                        {o.id_restaurante?.nombre || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4"><TipoIcon tipo={o.tipo_servicio} /></td>
                                <td className="px-6 py-4"><AsignadoCell order={o} /></td>
                                <td className="px-6 py-4 text-center font-semibold text-[#2B2B2B]">{o.items?.length ?? 0}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor[o.estado] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                        {o.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#2B2B2B]">Q{o.total?.toFixed(2) ?? "0.00"}</td>
                                <td className="px-6 py-4">
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

            <Pagination
                currentPage={page}
                totalPages={totalPages || 1}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            <OrderModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedOrder(null); }}
                order={selectedOrder}
                onSaved={getOrders}
            />
        </div>
    );
};