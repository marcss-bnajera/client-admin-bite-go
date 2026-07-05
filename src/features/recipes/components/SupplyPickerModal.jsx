import { X, Package, Search } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

export const SupplyPickerModal = ({ isOpen, onClose, insumos = [], onSelect, selectedName = null }) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        const seen = new Set();
        return insumos.filter((i) => {
            if (!i.activo) return false;
            if (seen.has(i.nombre_insumo)) return false;
            seen.add(i.nombre_insumo);
            if (!q) return true;
            return i.nombre_insumo?.toLowerCase().includes(q);
        });
    }, [insumos, search]);

    useEffect(() => {
        if (isOpen) {
            const el = inputRef.current;
            if (el) {
                el.value = "";
                el.focus();
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Package size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">Seleccionar Insumo</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 pt-4 pb-2 shrink-0">
                    <div className="flex items-center gap-2 bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl px-3 h-10">
                        <Search size={14} className="text-[#6B6B6B] shrink-0" />
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                            placeholder="Buscar insumo..."
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-[#6B6B6B] hover:text-[#2B2B2B] transition-colors shrink-0">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#6B6B6B]">
                            <Package size={32} className="opacity-30" />
                            <p className="text-sm font-medium">
                                {insumos.filter((i) => i.activo).length === 0
                                    ? "No hay insumos activos en el inventario"
                                    : "No se encontraron insumos"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1.5 pt-1">
                            {filtered.map((insumo) => {
                                const isSelected = insumo.nombre_insumo === selectedName;
                                const bajo = insumo.stock_actual <= insumo.stock_minimo;
                                return (
                                    <button
                                        key={insumo._id}
                                        onClick={() => { onSelect(insumo); onClose(); }}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                            isSelected
                                                ? "border-[#E67E22] bg-[#E67E22]/10 ring-1 ring-[#E67E22]/30"
                                                : "border-[#E8D8C3] hover:border-[#D3C4B0] hover:bg-[#F5EFE6]/60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-[#2B2B2B] truncate">
                                                {insumo.nombre_insumo}
                                            </span>
                                            <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                bajo ? "bg-[#E6A5A5] text-red-900" : "bg-[#A8D5BA] text-green-900"
                                            }`}>
                                                Stock: {insumo.stock_actual}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-[#E8D8C3] shrink-0">
                    <p className="text-[10px] text-[#6B6B6B] text-center">
                        {filtered.length} insumo{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </div>
    );
};
