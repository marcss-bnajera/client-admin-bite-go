import { X, MapPin, Search, Clock } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

export const SucursalPickerModal = ({ isOpen, onClose, onSelect, sucursales = [], selectedId = null }) => {
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);

    const activas = useMemo(
        () => sucursales.filter((s) => s.activo !== false),
        [sucursales]
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return activas;
        return activas.filter((s) =>
            s.nombre.toLowerCase().includes(q) ||
            (s.direccion?.texto || "").toLowerCase().includes(q)
        );
    }, [activas, search]);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <MapPin size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">Seleccionar Sucursal</h3>
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
                            placeholder="Buscar sucursal..."
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
                            <MapPin size={32} className="opacity-30" />
                            <p className="text-sm font-medium">No se encontraron sucursales</p>
                        </div>
                    ) : (
                        <div className="space-y-1.5 pt-1">
                            {filtered.map((s) => {
                                const isSelected = s._id === selectedId;
                                return (
                                    <button
                                        key={s._id}
                                        onClick={() => { onSelect(s); onClose(); }}
                                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                            isSelected
                                                ? "border-[#E67E22] bg-[#E67E22]/10 ring-1 ring-[#E67E22]/30"
                                                : "border-[#E8D8C3] hover:border-[#D3C4B0] hover:bg-[#F5EFE6]/60"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-[#2B2B2B]">{s.nombre}</p>
                                        {s.direccion?.texto && (
                                            <p className="text-xs text-[#6B6B6B] mt-0.5">{s.direccion.texto}</p>
                                        )}
                                        {s.horarios_atencion && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock size={10} className="text-[#6B6B6B]" />
                                                <p className="text-[11px] text-[#6B6B6B]">{s.horarios_atencion}</p>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-[#E8D8C3] shrink-0">
                    <p className="text-[10px] text-[#6B6B6B] text-center">
                        {filtered.length} sucursal{filtered.length !== 1 ? "es" : ""}
                    </p>
                </div>
            </div>
        </div>
    );
};
