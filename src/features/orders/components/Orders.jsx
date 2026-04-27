import { useState } from "react";
import { Plus, Search, Filter, Eye, Pencil, Trash2, User, Store, Armchair, Bike, ShoppingBag } from "lucide-react";
import { OrderModal } from "./OrderModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

const pedidos = [
    {
        _id: "ord_001",
        id_usuario_cliente: { nombre: "Juan Pérez" },
        id_restaurante: { nombre: "Bite Central" },
        id_mesero_asignado: null,
        id_repartidor_asignado: null,
        estado: "Preparacion",
        tipo_servicio: "Comer aquí",
        total: 85,
        activo: true,
        items: [{ nombre_historico: "Burger Clásica", cantidad: 1, precio_historico: 55, notas: "" }],
    },
    {
        _id: "ord_002",
        id_usuario_cliente: { nombre: "María López" },
        id_restaurante: { nombre: "Bite Norte" },
        id_mesero_asignado: null,
        id_repartidor_asignado: { nombre: "Pedro Repartidor" },
        estado: "Pendiente",
        tipo_servicio: "Domicilio",
        total: 120,
        activo: true,
        items: [],
    },
    {
        _id: "ord_003",
        id_usuario_cliente: { nombre: "Carlos Ruiz" },
        id_restaurante: { nombre: "Bite Sur" },
        id_mesero_asignado: null,
        id_repartidor_asignado: null,
        estado: "Listo",
        tipo_servicio: "Para llevar",
        total: 60,
        activo: true,
        items: [],
    },
    {
        _id: "ord_004",
        id_usuario_cliente: { nombre: "Ana Torres" },
        id_restaurante: { nombre: "Bite Central" },
        id_mesero_asignado: null,
        id_repartidor_asignado: { nombre: "Luis Repartidor" },
        estado: "Entregado",
        tipo_servicio: "Domicilio",
        total: 200,
        activo: true,
        items: [],
    },
    {
        _id: "ord_005",
        id_usuario_cliente: { nombre: "Luis Gomez" },
        id_restaurante: { nombre: "Bite Norte" },
        id_mesero_asignado: { nombre: "Marco Mesero" },
        id_repartidor_asignado: null,
        estado: "Cancelado",
        tipo_servicio: "Comer aquí",
        total: 45,
        activo: false,
        items: [],
    },
];

const estadoColor = {
    Pendiente: "bg-[#EAD7A4] text-yellow-800",
    Preparacion: "bg-[#A9C7E8] text-blue-900",
    Listo: "bg-[#A8D5BA] text-green-900",
    Servido: "bg-[#D6D6D6] text-gray-700",   // ← faltaba
    Entregado: "bg-[#D6D6D6] text-gray-700",
    Cancelado: "bg-[#E6A5A5] text-red-900",
};

// Íconos Lucide en lugar de emojis
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

// Muestra mesero o repartidor según el tipo de servicio
const AsignadoCell = ({ order }) => {
    if (order.tipo_servicio === "Comer aquí" && order.id_mesero_asignado) {
        return <span className="text-[#6B6B6B] text-xs">{order.id_mesero_asignado.nombre}</span>;
    }
    if (order.tipo_servicio === "Domicilio" && order.id_repartidor_asignado) {
        return <span className="text-[#6B6B6B] text-xs">{order.id_repartidor_asignado.nombre}</span>;
    }
    return <span className="text-[#C0C0C0] text-xs italic">—</span>;
};

export const Orders = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [filterEstado, setFilterEstado] = useState("");
    const [page, setPage] = useState(1);

    const estados = ["Pendiente", "Preparacion", "Listo", "Servido", "Entregado", "Cancelado"];

    const filtered = pedidos.filter((p) => {
        const matchSearch =
            p.id_usuario_cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase());
        const matchEstado = filterEstado ? p.estado === filterEstado : true;
        return matchSearch && matchEstado;
    });

    const handleNew = () => { setSelectedOrder(null); setModalOpen(true); };
    const handleView = (order) => { setSelectedOrder(order); setModalOpen(true); };
    const handleEdit = (order) => { setSelectedOrder(order); setModalOpen(true); };

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 flex-1">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por cliente o restaurante..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos los estados</option>
                        {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                </div>
            </div>

            {/* Tabla */}
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
                        {filtered.map((p, index) => (
                            <tr
                                key={p._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <span className="text-[#2B2B2B] font-medium">{p.id_usuario_cliente.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Store size={13} className="shrink-0" />
                                        {p.id_restaurante.nombre}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <TipoIcon tipo={p.tipo_servicio} />
                                </td>
                                <td className="px-6 py-4">
                                    <AsignadoCell order={p} />
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-[#2B2B2B]">
                                    {p.items.length}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor[p.estado]}`}>
                                        {p.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#2B2B2B]">
                                    Q{p.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(p)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Ver detalle"
                                        >
                                            <Eye size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Editar estado"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                            title="Cancelar pedido"
                                        >
                                            <Trash2 size={15} />
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
                totalPages={1}
                total={filtered.length}
                itemsShown={filtered.length}
                onPageChange={setPage}
            />

            <OrderModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};