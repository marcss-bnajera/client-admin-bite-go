import { useState, useEffect } from "react";
import { Plus, Search, Pencil, AlertTriangle, PowerOff, Filter } from "lucide-react";
import { InventoryModal } from "./InventoryModal";
import { AdjustStockModal } from "./AdjustStockModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useInventoryStore } from "../store/inventoryStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const LIMIT = 6;

export const Inventory = () => {
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const { inventory, alerts, loading, getInventoryByRestaurant, getLowStockAlerts, deleteInsumo, activateInsumo } = useInventoryStore();

    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [modalOpen, setModalOpen] = useState(false);
    const [adjustOpen, setAdjustOpen] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => { getRestaurants(); }, []);

    useEffect(() => {
        if (filterRestaurant) {
            getInventoryByRestaurant(filterRestaurant);
            getLowStockAlerts(filterRestaurant);
        }
    }, [filterRestaurant]);

    const filtered = (inventory ?? []).filter((i) => {
        const matchSearch = i.nombre_insumo?.toLowerCase().includes(search.toLowerCase());
        const matchActivo = filterActivo === "activo" ? i.activo : filterActivo === "inactivo" ? !i.activo : true;
        return matchSearch && matchActivo;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedInsumo(null); setModalOpen(true); };
    const handleEdit = (insumo) => { setSelectedInsumo(insumo); setModalOpen(true); };

    const handleToggle = (insumo) => {
        if (insumo.activo) {
            showConfirmToast({
                title: "Desactivar insumo",
                message: `¿Desactivar "${insumo.nombre_insumo}"?`,
                type: "deactivate",
                onConfirm: () => deleteInsumo(insumo._id, insumo.id_restaurante?._id || insumo.id_restaurante),
            });
        } else {
            showConfirmToast({
                title: "Reactivar insumo",
                message: `¿Reactivar "${insumo.nombre_insumo}"?`,
                type: "activate",
                onConfirm: () => activateInsumo(insumo._id),
            });
        }
    };

    const refreshInventory = () => {
        if (filterRestaurant) {
            getInventoryByRestaurant(filterRestaurant);
            getLowStockAlerts(filterRestaurant);
        }
    };

    const selectClass = "outline-none text-sm bg-transparent text-[#6B6B6B]";

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Inventario de Insumos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Control de stock y alertas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    disabled={!filterRestaurant}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={16} /> Nuevo Insumo
                </button>
            </div>

            {/* FILTROS */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-[#E8D8C3]">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <Filter size={14} className="text-[#6B6B6B] shrink-0" />
                    <select value={filterRestaurant} onChange={(e) => { setFilterRestaurant(e.target.value); setPage(1); }} className={selectClass}>
                        <option value="">Seleccionar restaurante...</option>
                        {restaurants.map((r) => (
                            <option key={r._id} value={r._id}>{r.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <select value={filterActivo} onChange={(e) => { setFilterActivo(e.target.value); setPage(1); }} className={selectClass}>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                        <option value="">Todos</option>
                    </select>
                </div>
                {filterRestaurant && (
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9 flex-1 min-w-[160px] max-w-xs">
                        <Search size={14} className="text-[#6B6B6B] shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                            placeholder="Buscar insumo..."
                        />
                    </div>
                )}
            </div>

            {/* ALERTA STOCK BAJO */}
            {alerts.length > 0 && filterActivo !== "inactivo" && (
                <div className="flex items-center gap-3 bg-[#E6A5A5]/30 border border-[#E6A5A5] rounded-xl px-4 py-3">
                    <AlertTriangle size={18} className="text-[#C0392B] shrink-0" />
                    <p className="text-sm font-semibold text-[#C0392B]">
                        {alerts.length} insumo{alerts.length > 1 ? "s" : ""} por debajo del stock mínimo:{" "}
                        <span className="font-extrabold">{alerts.map((i) => i.nombre_insumo).join(", ")}</span>
                    </p>
                </div>
            )}

            {!filterRestaurant ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#6B6B6B]">
                    <Filter size={32} className="opacity-40" />
                    <p className="text-sm">Seleccioná un restaurante para ver su inventario</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-[#3A2E2A] text-white">
                                <tr>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Insumo</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Stock Actual</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Stock Mínimo</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Estado Stock</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">Cargando inventario...</td></tr>
                                ) : paginated.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">No hay insumos para mostrar</td></tr>
                                ) : paginated.map((insumo, index) => {
                                    const bajo = insumo.stock_actual <= insumo.stock_minimo;
                                    return (
                                        <tr
                                            key={insumo._id}
                                            className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${!insumo.activo ? "opacity-50" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-[#2B2B2B]">{insumo.nombre_insumo}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold text-lg ${bajo ? "text-[#C0392B]" : "text-[#2B2B2B]"}`}>
                                                    {insumo.stock_actual}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[#6B6B6B]">{insumo.stock_minimo}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${!insumo.activo ? "bg-[#D6D6D6] text-gray-600" : bajo ? "bg-[#E6A5A5] text-red-900" : "bg-[#A8D5BA] text-green-900"}`}>
                                                    {!insumo.activo ? "Inactivo" : bajo ? "Stock bajo" : "Normal"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleEdit(insumo)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar">
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(insumo)}
                                                        className={`p-2 rounded-lg transition-colors ${insumo.activo ? "hover:bg-red-50 text-[#C0392B]" : "hover:bg-[#E1F5EE] text-[#0F6E56]"}`}
                                                        title={insumo.activo ? "Desactivar" : "Reactivar"}
                                                    >
                                                        <PowerOff size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                </>
            )}

            <InventoryModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedInsumo(null); }}
                insumo={selectedInsumo}
                selectedRestaurantId={filterRestaurant}
                onSaved={refreshInventory}
            />
            <AdjustStockModal
                isOpen={adjustOpen}
                onClose={() => { setAdjustOpen(false); setSelectedInsumo(null); }}
                insumo={selectedInsumo}
                onSaved={refreshInventory}
            />
        </div>
    );
};