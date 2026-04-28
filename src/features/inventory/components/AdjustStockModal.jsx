import { X, SlidersHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export const AdjustStockModal = ({ isOpen, onClose, insumo = null }) => {
    const [form, setForm] = useState({
        tipo: "entrada",
        cantidad: "",
        motivo: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cantidad = form.tipo === "entrada"
            ? Number(form.cantidad)
            : -Number(form.cantidad);

        console.log("Payload Ajuste Stock → PUT /suppliesInventory/:id:", {
            cantidad,
            // motivo es solo para UI, el backend solo recibe cantidad
        });
        onClose();
    };

    if (!isOpen || !insumo) return null;

    const stockResultante = Number(insumo.stock_actual) + (
        form.cantidad
            ? form.tipo === "entrada"
                ? Number(form.cantidad)
                : -Number(form.cantidad)
            : 0
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <SlidersHorizontal size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">Ajustar Stock</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Info del insumo */}
                    <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl p-3">
                        <p className="text-xs text-[#6B6B6B] font-medium">Insumo seleccionado</p>
                        <p className="text-sm font-extrabold text-[#2B2B2B] mt-0.5">{insumo.nombre_insumo}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-[#6B6B6B]">
                                Stock actual: <strong className="text-[#2B2B2B]">{insumo.stock_actual}</strong>
                            </span>
                            <span className="text-xs text-[#6B6B6B]">
                                Mínimo: <strong className="text-[#2B2B2B]">{insumo.stock_minimo}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Tipo de ajuste */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-2">
                            Tipo de Ajuste *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, tipo: "entrada" })}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${form.tipo === "entrada"
                                    ? "border-green-500 bg-[#A8D5BA]/30 text-green-800"
                                    : "border-[#E8D8C3] text-[#6B6B6B] hover:border-green-300"
                                    }`}
                            >
                                <TrendingUp size={15} />
                                Entrada / Compra
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, tipo: "salida" })}
                                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${form.tipo === "salida"
                                    ? "border-[#C0392B] bg-[#E6A5A5]/30 text-red-800"
                                    : "border-[#E8D8C3] text-[#6B6B6B] hover:border-red-300"
                                    }`}
                            >
                                <TrendingDown size={15} />
                                Salida / Merma
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Cantidad *
                        </label>
                        <input
                            name="cantidad"
                            value={form.cantidad}
                            onChange={handleChange}
                            required
                            type="number"
                            min="1"
                            placeholder="Ej: 10"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Motivo
                        </label>
                        <input
                            name="motivo"
                            value={form.motivo}
                            onChange={handleChange}
                            placeholder="Ej: Compra semanal, Merma por vencimiento..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    {/* Preview del stock resultante */}
                    {form.cantidad && (
                        <div className={`rounded-xl p-3 border ${stockResultante < insumo.stock_minimo ? "bg-[#E6A5A5]/20 border-[#E6A5A5]" : "bg-[#A8D5BA]/20 border-[#A8D5BA]"}`}>
                            <p className="text-xs font-bold text-[#2B2B2B]">Stock resultante</p>
                            <p className={`text-2xl font-extrabold mt-1 ${stockResultante < insumo.stock_minimo ? "text-[#C0392B]" : "text-green-700"}`}>
                                {stockResultante}
                            </p>
                            {stockResultante < insumo.stock_minimo && (
                                <p className="text-xs text-[#C0392B] mt-1">⚠️ Quedará por debajo del stock mínimo</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors"
                        >
                            Aplicar Ajuste
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};