import { useState } from "react";
import { Pencil, Trash2, Layers, ChevronUp, ChevronDown } from "lucide-react";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { ItemModal } from "./ItemModal";
import { useOrders } from "../../orders/hooks/useOrders";
import { useItemsStore } from "../store/itemsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const estadoColor = {
    Pendiente: "bg-[#EAD7A4] text-yellow-800",
    Preparacion: "bg-[#A9C7E8] text-blue-900",
    Listo: "bg-[#A8D5BA] text-green-900",
    Servido: "bg-[#D6D6D6] text-gray-700",
    Entregado: "bg-[#D6D6D6] text-gray-700",
    Cancelado: "bg-[#E6A5A5] text-red-900",
};

const ESTADOS_EDITABLES = ["Pendiente"];
const LIMIT = 10;

export const Items = () => {
    const { orders, loading, getOrders } = useOrders();
    const { deleteItem } = useItemsStore();

    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [filterSucursal, setFilterSucursal] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [page, setPage] = useState(1);

    const filtered = (orders ?? []).filter((o) => {
        const matchRestaurant = filterRestaurant
            ? o.id_restaurante?._id === filterRestaurant
            : true;
        const matchSucursal = filterSucursal
            ? o.id_sucursal === filterSucursal
            : true;
        const matchSearch =
            o.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
            o.id_restaurante?.nombre?.toLowerCase().includes(search.toLowerCase());
        return matchRestaurant && matchSucursal && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleEditItem = (item, orderId) => {
        setSelectedItem(item);
        setSelectedOrderId(orderId);
        setItemModalOpen(true);
    };

    const handleDeleteItem = (orderId, item) => {
        showConfirmToast({
            title: "Eliminar item",
            message: `¿Eliminar "${item.nombre_historico}" del pedido?`,
            type: "delete",
            onConfirm: () => deleteItem(orderId, item._id),
        });
    };

    const toggleExpand = (orderId) =>
        setExpandedOrder((prev) => (prev === orderId ? null : orderId));

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0">

            {/* HEADER (Adaptable y limpio) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Items de Pedidos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">
                        Subdocumentos de cada pedido. Para agregar items, gestiona desde Pedidos.
                    </p>
                </div>
            </div>

            {/* FILTROS */}
            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                filterSucursal={filterSucursal}
                onSucursalChange={setFilterSucursal}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar por cliente..."
                showActiveFilter={false}
                showStatusFilter={false}
                onPageReset={setPage}
                emptyMessage="Seleccioná un restaurante para ver sus items"
                showEmptyState={false}
            />

            {/* LISTA */}
            {loading ? (
                <div className="bg-white p-10 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-semibold">Cargando pedidos...</div>
            ) : paginated.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm">No hay pedidos registrados</div>
            ) : (
                <div className="space-y-4">
                    {paginated.map((pedido) => {
                        const isExpanded = expandedOrder === pedido._id;
                        const puedeEditar = ESTADOS_EDITABLES.includes(pedido.estado);
                        const items = pedido.items ?? [];

                        return (
                            <div key={pedido._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm overflow-hidden transition-all duration-300">

                                {/* CABECERA DE LA TARJETA (Flexible para romper a columna en pantallas mini) */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 cursor-pointer hover:bg-[#F5EFE6] transition-colors"
                                    onClick={() => toggleExpand(pedido._id)}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-[#3A2E2A] flex items-center justify-center shrink-0 shadow-sm">
                                            <Layers size={15} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#2B2B2B] text-sm sm:text-base truncate">{pedido.cliente_nombre || "—"}</p>
                                            <p className="text-xs text-[#6B6B6B] truncate">{pedido.id_restaurante?.nombre || "—"}</p>
                                        </div>
                                    </div>

                                    {/* Indicadores de Estado y Cantidad */}
                                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8D8C3]/60">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block text-center min-w-[95px] ${estadoColor[pedido.estado] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                            {pedido.estado}
                                        </span>
                                        <span className="text-xs text-[#6B6B6B] font-bold bg-[#F5EFE6] px-2.5 py-1 rounded-lg shrink-0">
                                            {items.length} item{items.length !== 1 ? "s" : ""}
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} className="text-[#2B2B2B]" /> : <ChevronDown size={16} className="text-[#2B2B2B]" />}
                                    </div>
                                </div>

                                {/* DETALLE DESPLEGABLE (Híbrido: Tarjetas en móvil, Tabla impecable en PC) */}
                                {isExpanded && (
                                    <div className="border-t border-[#E8D8C3] bg-white transition-all duration-500">
                                        {items.length === 0 ? (
                                            <p className="text-center text-sm text-[#6B6B6B] py-6 italic">Este pedido no tiene items</p>
                                        ) : (
                                            <>
                                                {/*VISTA EN CELULARES Y TABLETS CHICAS */}
                                                <div className="block lg:hidden divide-y divide-[#E8D8C3]/60">
                                                    {items.map((item) => (
                                                        <div key={item._id} className="p-4 space-y-3 bg-white">
                                                            {/* Fila Superior: Nombre del Producto */}
                                                            <div className="flex justify-between items-start gap-2">
                                                                <p className="font-bold text-[#2B2B2B] text-sm">{item.nombre_historico}</p>
                                                                <span className="text-xs font-bold text-[#6B6B6B] bg-[#F5EFE6] px-2 py-0.5 rounded-md">
                                                                    Cant: {item.cantidad}
                                                                </span>
                                                            </div>

                                                            {/* Fila Central: Desglose de Precios */}
                                                            <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E8D8C3]/40 py-2 bg-[#F5EFE6]/20 px-2 rounded-xl">
                                                                <div>
                                                                    <p className="text-[#6B6B6B] font-medium">Precio Unit.</p>
                                                                    <p className="text-[#2B2B2B] font-semibold mt-0.5">Q{item.precio_historico?.toFixed(2)}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[#6B6B6B] font-medium">Subtotal</p>
                                                                    <p className="text-[#E67E22] font-extrabold mt-0.5">Q{(item.precio_historico * item.cantidad).toFixed(2)}</p>
                                                                </div>
                                                            </div>

                                                            {/* Notas si existen */}
                                                            {item.notas && (
                                                                <div className="text-xs text-[#6B6B6B] italic bg-gray-50 p-2 rounded-lg border border-dashed border-[#E8D8C3]">
                                                                    <span className="font-semibold not-italic block text-[10px] text-[#A0A0A0] uppercase tracking-wider mb-0.5">Notas:</span>
                                                                    "{item.notas}"
                                                                </div>
                                                            )}

                                                            {/* Acciones y estado del Item */}
                                                            <div className="flex items-center justify-between pt-1">
                                                                <div>
                                                                    {!puedeEditar && (
                                                                        <span className="text-[11px] text-[#BCBCBC] italic font-medium bg-gray-100 px-2 py-1 rounded-md">No editable</span>
                                                                    )}
                                                                </div>
                                                                {puedeEditar && (
                                                                    <div className="flex items-center gap-2">
                                                                        <button onClick={() => handleEditItem(item, pedido._id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F5EFE6] text-[#E67E22] font-bold text-xs transition-colors active:scale-90">
                                                                            <Pencil size={13} /> Editar
                                                                        </button>
                                                                        <button onClick={() => handleDeleteItem(pedido._id, item)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-[#C0392B] font-bold text-xs transition-colors active:scale-90">
                                                                            <Trash2 size={13} /> Eliminar
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Footer del Total en Móvil */}
                                                    <div className="bg-[#F5EFE6]/60 p-4 flex justify-between items-center border-t border-[#E8D8C3]">
                                                        <span className="font-bold text-[#2B2B2B] text-sm">Total del pedido:</span>
                                                        <span className="font-extrabold text-[#E67E22] text-base">Q{pedido.total?.toFixed(2) ?? "0.00"}</span>
                                                    </div>
                                                </div>

                                                {/*VISTA EN ESCRITORIO*/}
                                                <div className="hidden lg:block w-full overflow-hidden">
                                                    <table className="w-full text-sm border-collapse">
                                                        <thead className="bg-[#F5EFE6] text-[#6B6B6B]">
                                                            <tr>
                                                                <th className="text-left px-6 py-3 font-bold tracking-wide">Producto</th>
                                                                <th className="text-center px-6 py-3 font-bold tracking-wide w-24">Cantidad</th>
                                                                <th className="text-left px-6 py-3 font-bold tracking-wide">Precio Unit.</th>
                                                                <th className="text-left px-6 py-3 font-bold tracking-wide">Subtotal</th>
                                                                <th className="text-left px-6 py-3 font-bold tracking-wide max-w-xs">Notas</th>
                                                                <th className="text-center px-6 py-3 font-bold tracking-wide w-28">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items.map((item, idx) => (
                                                                <tr
                                                                    key={item._id}
                                                                    className={`border-t border-[#E8D8C3]/60 hover:bg-[#F2E6D9]/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/10"}`}
                                                                >
                                                                    <td className="px-6 py-3 font-semibold text-[#2B2B2B]">{item.nombre_historico}</td>
                                                                    <td className="px-6 py-3 text-center font-extrabold text-[#2B2B2B]">{item.cantidad}</td>
                                                                    <td className="px-6 py-3 text-[#6B6B6B]">Q{item.precio_historico?.toFixed(2)}</td>
                                                                    <td className="px-6 py-3 font-bold text-[#E67E22]">Q{(item.precio_historico * item.cantidad).toFixed(2)}</td>
                                                                    <td className="px-6 py-3 text-[#6B6B6B] text-xs italic max-w-xs truncate" title={item.notas || ""}>
                                                                        {item.notas || "—"}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-center">
                                                                        {puedeEditar ? (
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <button onClick={() => handleEditItem(item, pedido._id)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-90" title="Editar item">
                                                                                    <Pencil size={14} />
                                                                                </button>
                                                                                <button onClick={() => handleDeleteItem(pedido._id, item)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors active:scale-90" title="Eliminar item">
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-xs text-[#BCBCBC] italic font-medium select-none">No editable</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot className="bg-[#F5EFE6]/70 border-t border-[#E8D8C3]">
                                                            <tr>
                                                                <td colSpan={3} className="px-6 py-3.5 text-right font-bold text-[#2B2B2B]">Total del pedido:</td>
                                                                <td className="px-6 py-3.5 font-extrabold text-[#E67E22] text-base">Q{pedido.total?.toFixed(2) ?? "0.00"}</td>
                                                                <td colSpan={2} />
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* CONTROL DE PAGINACIÓN */}
            <div className="w-full py-1">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <ItemModal
                isOpen={itemModalOpen}
                onClose={() => { setItemModalOpen(false); setSelectedItem(null); setSelectedOrderId(null); }}
                item={selectedItem}
                orderId={selectedOrderId}
                onSaved={() => getOrders({ activo: true })}
            />
        </div>
    );
};