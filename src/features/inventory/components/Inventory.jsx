import { useState } from "react";
import { Plus, Search, Pencil, AlertTriangle, SlidersHorizontal, PowerOff } from "lucide-react";
import { InventoryModal } from "./InventoryModal";
import { AdjustStockModal } from "./AdjustStockModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

const insumos = [
    { _id: "ins_001", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, nombre_insumo: "Carne de res", stock_actual: 15, stock_minimo: 10, activo: true },
    { _id: "ins_002", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, nombre_insumo: "Pan de hamburguesa", stock_actual: 50, stock_minimo: 20, activo: true },
    { _id: "ins_003", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, nombre_insumo: "Lechuga", stock_actual: 5, stock_minimo: 8, activo: true },
    { _id: "ins_004", id_restaurante: { _id: "rest_003", nombre: "Bite Sur" }, nombre_insumo: "Queso cheddar", stock_actual: 30, stock_minimo: 15, activo: true },
    { _id: "ins_005", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, nombre_insumo: "Salsa BBQ", stock_actual: 3, stock_minimo: 10, activo: true },
];

const LIMIT = 6;

export const Inventory = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [adjustOpen, setAdjustOpen] = useState(false);
    const [selectedInsumo, setSelectedInsumo] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const stockBajos = insumos.filter((i) => i.stock_actual <= i.stock_minimo);

    const filtered = insumos.filter((i) =>
        i.nombre_insumo.toLowerCase().includes(search.toLowerCase()) ||
        i.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedInsumo(null); setModalOpen(true); };
    const handleEdit = (insumo) => { setSelectedInsumo(insumo); setModalOpen(true); };
    const handleAdjust = (insumo) => { setSelectedInsumo(insumo); setAdjustOpen(true); };

    // Soft delete — deleteInsumo pone activo:false
    const handleDeactivate = (insumo) => {
        console.log(`DELETE /suppliesInventory/${insumo._id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Inventario de Insumos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Control de stock y alertas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Insumo
                </button>
            </div>

            {/* Alerta — refleja getLowStockAlerts: stock_actual <= stock_minimo */}
            {stockBajos.length > 0 && (
                <div className="flex items-center gap-3 bg-[#E6A5A5]/30 border border-[#E6A5A5] rounded-xl px-4 py-3">
                    <AlertTriangle size={18} className="text-[#C0392B] shrink-0" />
                    <p className="text-sm font-semibold text-[#C0392B]">
                        {stockBajos.length} insumo{stockBajos.length > 1 ? "s" : ""} por debajo del stock minimo:{" "}
                        <span className="font-extrabold">{stockBajos.map((i) => i.nombre_insumo).join(", ")}</span>
                    </p>
                </div>
            )}

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar insumo o restaurante..."
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Insumo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Stock Actual</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Stock Minimo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((insumo, index) => {
                            const bajo = insumo.stock_actual <= insumo.stock_minimo;
                            return (
                                <tr
                                    key={insumo._id}
                                    className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                                >
                                    <td className="px-6 py-4 font-semibold text-[#2B2B2B]">{insumo.nombre_insumo}</td>
                                    <td className="px-6 py-4 text-[#6B6B6B]">{insumo.id_restaurante.nombre}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold text-lg ${bajo ? "text-[#C0392B]" : "text-[#2B2B2B]"}`}>
                                            {insumo.stock_actual}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#6B6B6B]">{insumo.stock_minimo}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bajo ? "bg-[#E6A5A5] text-red-900" : "bg-[#A8D5BA] text-green-900"}`}>
                                            {bajo ? "Stock bajo" : "Normal"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* adjustStock PUT /suppliesInventory/:id con { cantidad } */}
                                            <button onClick={() => handleAdjust(insumo)} className="p-2 rounded-lg hover:bg-[#A9C7E8]/30 text-blue-600 transition-colors" title="Ajustar stock">
                                                <SlidersHorizontal size={15} />
                                            </button>
                                            <button onClick={() => handleEdit(insumo)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar">
                                                <Pencil size={15} />
                                            </button>
                                            {/* Soft delete — activo:false */}
                                            <button onClick={() => handleDeactivate(insumo)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors" title="Desactivar">
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
                totalPages={totalPages}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            <InventoryModal
                key={selectedInsumo?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                insumo={selectedInsumo}
            />
            <AdjustStockModal
                key={selectedInsumo?._id ? `adj-${selectedInsumo._id}` : "adj-new"}
                isOpen={adjustOpen}
                onClose={() => setAdjustOpen(false)}
                insumo={selectedInsumo}
            />
        </div>
    );
};