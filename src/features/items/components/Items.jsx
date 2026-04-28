import { useState } from "react";
import { Search, Pencil, Trash2, Layers, ChevronUp, ChevronDown } from "lucide-react";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { ItemModal } from "./ItemModal";

const itemsPorPedido = [
    {
        orderId: "ord_001",
        cliente: "Juan Pérez",
        restaurante: "Bite Central",
        estado: "Preparacion",
        items: [
            { _id: "item_001", id_producto: "prod_001", nombre_historico: "Burger Clásica", cantidad: 2, precio_historico: 55, notas: "Sin cebolla" },
            { _id: "item_002", id_producto: "prod_002", nombre_historico: "Limonada Natural", cantidad: 2, precio_historico: 25, notas: "" },
        ],
    },
    {
        orderId: "ord_002",
        cliente: "María López",
        restaurante: "Bite Norte",
        estado: "Pendiente",
        items: [
            { _id: "item_003", id_producto: "prod_004", nombre_historico: "Alitas BBQ", cantidad: 1, precio_historico: 65, notas: "Extra salsa" },
        ],
    },
];

const estadoColor = {
    Pendiente: "bg-[#EAD7A4] text-yellow-800",
    Preparacion: "bg-[#A9C7E8] text-blue-900",
    Listo: "bg-[#A8D5BA] text-green-900",
    Servido: "bg-[#D6D6D6] text-gray-700",
    Entregado: "bg-[#D6D6D6] text-gray-700",
    Cancelado: "bg-[#E6A5A5] text-red-900",
};

// Solo en Pendiente tiene sentido editar items
const ESTADOS_EDITABLES = ["Pendiente"];

export const Items = () => {
    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [search, setSearch] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [page, setPage] = useState(1);

    const filtered = itemsPorPedido.filter((p) =>
        p.cliente.toLowerCase().includes(search.toLowerCase()) ||
        p.restaurante.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditItem = (item, orderId) => {
        setSelectedItem(item);
        setSelectedOrderId(orderId);
        setItemModalOpen(true);
    };

    const toggleExpand = (orderId) =>
        setExpandedOrder((prev) => (prev === orderId ? null : orderId));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Items de Pedidos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">
                        Subdocumentos de cada pedido. Para agregar items, gestiona desde Pedidos.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar por cliente o restaurante..."
                />
            </div>

            <div className="space-y-4">
                {filtered.map((pedido) => {
                    const isExpanded = expandedOrder === pedido.orderId;
                    const puedeEditar = ESTADOS_EDITABLES.includes(pedido.estado);

                    return (
                        <div key={pedido.orderId} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm overflow-hidden">
                            {/* Header colapsable */}
                            <div
                                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[#F5EFE6] transition-colors"
                                onClick={() => toggleExpand(pedido.orderId)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                        <Layers size={14} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2B2B2B] text-sm">{pedido.cliente}</p>
                                        <p className="text-xs text-[#6B6B6B]">{pedido.restaurante}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${estadoColor[pedido.estado]}`}>
                                        {pedido.estado}
                                    </span>
                                    <span className="text-xs text-[#6B6B6B] font-semibold">
                                        {pedido.items.length} item{pedido.items.length !== 1 ? "s" : ""}
                                    </span>
                                    {isExpanded
                                        ? <ChevronUp size={15} className="text-[#6B6B6B]" />
                                        : <ChevronDown size={15} className="text-[#6B6B6B]" />
                                    }
                                </div>
                            </div>

                            {/* Items expandidos */}
                            {isExpanded && (
                                <div className="border-t border-[#E8D8C3]">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#F5EFE6]">
                                            <tr>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Producto</th>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Cantidad</th>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Precio Unit.</th>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Subtotal</th>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Notas</th>
                                                <th className="text-left px-6 py-3 font-bold text-[#6B6B6B] tracking-wide">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.items.map((item, idx) => (
                                                <tr
                                                    key={item._id}
                                                    className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/30"}`}
                                                >
                                                    <td className="px-6 py-3 font-semibold text-[#2B2B2B]">{item.nombre_historico}</td>
                                                    <td className="px-6 py-3 text-center font-bold text-[#2B2B2B]">{item.cantidad}</td>
                                                    <td className="px-6 py-3 text-[#6B6B6B]">Q{item.precio_historico.toFixed(2)}</td>
                                                    <td className="px-6 py-3 font-bold text-[#E67E22]">
                                                        Q{(item.precio_historico * item.cantidad).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-3 text-[#6B6B6B] text-xs italic">
                                                        {item.notas || "—"}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {puedeEditar ? (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditItem(item, pedido.orderId)}
                                                                    className="p-1.5 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                                                    title="Editar item"
                                                                >
                                                                    <Pencil size={13} />
                                                                </button>
                                                                <button
                                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                                                    title="Eliminar item"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-[#C0C0C0] italic">No editable</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-[#F5EFE6]">
                                            <tr>
                                                <td colSpan={3} className="px-6 py-3 text-right font-bold text-[#2B2B2B]">
                                                    Total del pedido:
                                                </td>
                                                <td className="px-6 py-3 font-extrabold text-[#E67E22]">
                                                    Q{pedido.items.reduce((acc, i) => acc + i.precio_historico * i.cantidad, 0).toFixed(2)}
                                                </td>
                                                <td colSpan={2} />
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <Pagination
                currentPage={page}
                totalPages={1}
                total={filtered.length}
                itemsShown={filtered.length}
                onPageChange={setPage}
            />

            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => setItemModalOpen(false)}
                item={selectedItem}
                orderId={selectedOrderId}
            />
        </div>
    );
};