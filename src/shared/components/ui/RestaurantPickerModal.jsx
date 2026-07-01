import { X, Store, Search } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRestaurantsStore } from "../../../features/restaurants/store/restaurantsStore";

export const RestaurantPickerModal = ({ isOpen, onClose, onSelect, selectedId = null }) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);
    const restaurants = useRestaurantsStore((s) => s.restaurants);
    const getRestaurants = useRestaurantsStore((s) => s.getRestaurants);

    useEffect(() => {
        if (isOpen) getRestaurants();
    }, [isOpen]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return restaurants.filter((r) => r.activo !== false);
        return restaurants.filter((r) =>
            r.activo !== false &&
            (r.nombre.toLowerCase().includes(q) ||
             r.categoria_gastronomica?.toLowerCase().includes(q) ||
             r.direccion?.texto?.toLowerCase().includes(q))
        );
    }, [restaurants, search]);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Store size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">Seleccionar Restaurante</h3>
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
                            placeholder="Buscar restaurante..."
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
                            <Store size={32} className="opacity-30" />
                            <p className="text-sm font-medium">No se encontraron restaurantes</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5 pt-1">
                            {filtered.map((r) => {
                                const isSelected = r._id === selectedId;
                                return (
                                    <button
                                        key={r._id}
                                        onClick={() => { onSelect(r); onClose(); }}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                            isSelected
                                                ? "border-[#E67E22] bg-[#E67E22]/10 ring-1 ring-[#E67E22]/30"
                                                : "border-[#E8D8C3] hover:border-[#D3C4B0] hover:bg-[#F5EFE6]/60"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#2B2B2B] truncate">{r.nombre}</p>
                                                {r.direccion?.texto && (
                                                    <p className="text-xs text-[#6B6B6B] truncate mt-0.5">{r.direccion.texto}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {r.tiene_sucursales && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C7E8] text-blue-900">
                                                        {r.sucursales?.length || 0} suc.
                                                    </span>
                                                )}
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8D8C3] text-[#2B2B2B]">
                                                    {r.categoria_gastronomica}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-[#E8D8C3] shrink-0">
                    <p className="text-[10px] text-[#6B6B6B] text-center">
                        {filtered.length} restaurante{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </div>
    );
};
