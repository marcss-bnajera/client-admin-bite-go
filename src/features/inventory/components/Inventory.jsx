import { useState, useEffect } from "react";
import { Plus, Pencil, AlertTriangle, PowerOff, SlidersHorizontal } from "lucide-react";
import { InventoryModal } from "./InventoryModal";
import { AdjustStockModal } from "./AdjustStockModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useInventoryStore } from "../store/inventoryStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const LIMIT = 6;

export const Inventory = () => {
    const { inventory, alerts, loading, getInventoryByRestaurant, getLowStockAlerts, deleteInsumo, activateInsumo } = useInventoryStore();

    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [filterSucursal, setFilterSucursal] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [modalOpen, setModalOpen] = useState(false);
    const [adjustOpen, setAdjustOpen] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (filterRestaurant) {
            const params = filterActivo === "inactivo" ? {} : { activo: filterActivo === "activo" ? true : undefined };
            if (filterSucursal) params.id_sucursal = filterSucursal;
            getInventoryByRestaurant(filterRestaurant, params);
            const alertParams = filterSucursal ? { id_sucursal: filterSucursal } : {};
            getLowStockAlerts(filterRestaurant, alertParams);
        }
    }, [filterRestaurant, filterActivo, filterSucursal]);

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
            const params = filterActivo === "activo"
                ? { activo: true }
                : filterActivo === "inactivo"
                    ? { activo: false }
                    : {};
            if (filterSucursal) params.id_sucursal = filterSucursal;
            getInventoryByRestaurant(filterRestaurant, params);
            const alertParams = filterSucursal ? { id_sucursal: filterSucursal } : {};
            getLowStockAlerts(filterRestaurant, alertParams);
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B] tracking-tight">Inventario de Insumos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Control de stock y alertas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    disabled={!filterRestaurant}
                    className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shrink-0"
                >
                    <Plus size={16} /> Nuevo Insumo
                </button>
            </div>

            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                filterSucursal={filterSucursal}
                onSucursalChange={setFilterSucursal}
                filterActivo={filterActivo}
                onActivoChange={setFilterActivo}
                showActiveFilter
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar insumo..."
                showSearch={!!filterRestaurant}
                onPageReset={setPage}
                emptyMessage="Seleccioná un restaurante para ver su inventario"
            />

            {/* ALERTA STOCK BAJO RESPONSIVA */}
            {alerts.length > 0 && filterActivo !== "inactivo" && (
                <div className="flex items-start sm:items-center gap-3 bg-[#E6A5A5]/30 border border-[#E6A5A5] rounded-xl px-4 py-3.5">
                    <AlertTriangle size={18} className="text-[#C0392B] shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-sm font-semibold text-[#C0392B] leading-snug">
                        {alerts.length} insumo{alerts.length > 1 ? "s" : ""} por debajo del stock mínimo:{" "}
                        <span className="font-extrabold break-words">{alerts.map((i) => i.nombre_insumo).join(", ")}</span>
                    </p>
                </div>
            )}

            {!filterRestaurant ? null : (
                <>
                    {/*VISTA EN CELULARES Y TABLETS */}
                    <div className="block lg:hidden space-y-3">
                        {loading ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-[#E8D8C3] text-[#6B6B6B] text-sm font-medium">
                                Cargando inventario...
                            </div>
                        ) : paginated.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-[#E8D8C3] text-[#6B6B6B] text-sm font-medium">
                                No hay insumos para mostrar
                            </div>
                        ) : (
                            paginated.map((insumo) => {
                                const bajo = insumo.stock_actual <= insumo.stock_minimo;
                                return (
                                    <div
                                        key={insumo._id}
                                        className={`bg-white rounded-2xl border border-[#E8D8C3] p-4 space-y-3.5 shadow-sm transition-all ${!insumo.activo ? "opacity-60" : ""}`}
                                    >
                                        {/* Nombre y Badge de Estado */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-bold text-[#2B2B2B] text-base leading-tight">{insumo.nombre_insumo}</h4>
                                            <span className={`px-2.5 py-0.5 shrink-0 rounded-full text-[11px] font-bold tracking-wide uppercase ${!insumo.activo ? "bg-[#D6D6D6] text-gray-600" : bajo ? "bg-[#E6A5A5] text-red-900" : "bg-[#A8D5BA] text-green-900"}`}>
                                                {!insumo.activo ? "Inactivo" : bajo ? "Stock bajo" : "Normal"}
                                            </span>
                                        </div>

                                        {/* Grilla de Valores de Stocks */}
                                        <div className="grid grid-cols-2 gap-3 bg-[#F5EFE6]/30 border border-[#E8D8C3]/50 rounded-xl p-3 text-sm">
                                            <div>
                                                <p className="text-[#6B6B6B] font-medium text-xs">Stock Actual</p>
                                                <p className={`text-xl font-extrabold mt-0.5 ${bajo && insumo.activo ? "text-[#C0392B]" : "text-[#2B2B2B]"}`}>
                                                    {insumo.stock_actual}
                                                </p>
                                            </div>
                                            <div className="border-l border-[#E8D8C3] pl-4">
                                                <p className="text-[#6B6B6B] font-medium text-xs">Stock Mínimo</p>
                                                <p className="text-base font-bold text-[#2B2B2B] mt-1">
                                                    {insumo.stock_minimo}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botonera de Acciones Adaptadas al pulgar */}
                                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#E8D8C3]/40">
                                            <button
                                                onClick={() => handleEdit(insumo)}
                                                className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-[#F5EFE6] text-[#E67E22] font-bold text-xs transition-colors active:scale-95"
                                            >
                                                <Pencil size={13} /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleToggle(insumo)}
                                                className={`flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl font-bold text-xs transition-colors active:scale-95 ${insumo.activo ? "bg-red-50 text-[#C0392B]" : "bg-[#E1F5EE] text-[#0F6E56]"}`}
                                            >
                                                <PowerOff size={13} /> {insumo.activo ? "Desactivar" : "Reactivar"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/*VISTA EN ESCRITORIO */}
                    <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-hidden">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-[#3A2E2A] text-white">
                                <tr>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide">Insumo</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide w-40">Stock Actual</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide w-40">Stock Mínimo</th>
                                    <th className="text-left px-6 py-4 font-bold tracking-wide w-44">Estado Stock</th>
                                    <th className="text-center px-6 py-4 font-bold tracking-wide w-32">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B6B6B] text-sm font-medium">Cargando inventario...</td></tr>
                                ) : paginated.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-[#6B6B6B] text-sm font-medium">No hay insumos para mostrar</td></tr>
                                ) : paginated.map((insumo, index) => {
                                    const bajo = insumo.stock_actual <= insumo.stock_minimo;
                                    return (
                                        <tr
                                            key={insumo._id}
                                            className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9]/50 transition-colors ${!insumo.activo ? "opacity-50" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/10"}`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-[#2B2B2B]">{insumo.nombre_insumo}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-extrabold text-lg ${bajo && insumo.activo ? "text-[#C0392B]" : "text-[#2B2B2B]"}`}>
                                                    {insumo.stock_actual}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-[#6B6B6B]">{insumo.stock_minimo}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${!insumo.activo ? "bg-[#D6D6D6] text-gray-600" : bajo ? "bg-[#E6A5A5] text-red-900" : "bg-[#A8D5BA] text-green-900"}`}>
                                                    {!insumo.activo ? "Inactivo" : bajo ? "Stock bajo" : "Normal"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => handleEdit(insumo)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-90" title="Editar">
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedInsumo(insumo); setAdjustOpen(true); }}
                                                        className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#3A2E2A] transition-colors active:scale-90"
                                                        title="Ajustar Stock"
                                                    >
                                                        <SlidersHorizontal size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(insumo)}
                                                        className={`p-2 rounded-lg transition-colors active:scale-90 ${insumo.activo ? "hover:bg-red-50 text-[#C0392B]" : "hover:bg-[#E1F5EE] text-[#0F6E56]"}`}
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

                    {/* PAGINACIÓN CON MARGEN ADECUADO */}
                    <div className="pt-2">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages || 1}
                            total={filtered.length}
                            itemsShown={paginated.length}
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}

            <InventoryModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedInsumo(null); }}
                insumo={selectedInsumo}
                selectedRestaurantId={filterRestaurant}
                selectedSucursalId={filterSucursal}
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