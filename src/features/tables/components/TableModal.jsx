import { X, Armchair } from "lucide-react";
import { useState, useEffect } from "react";
import { useSaveMesa } from "../hooks/useSaveMesa";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const ESTADOS = ["Disponible", "Ocupada", "Reservada", "Mantenimiento"];

const resolveRestId = (table, restauranteId) =>
    restauranteId
    || (typeof table?.id_restaurante === "object" ? table?.id_restaurante?._id : table?.id_restaurante)
    || "";

export const TableModal = ({ isOpen, onClose, table = null, restauranteId = null, onSaved }) => {
    const isEditing = !!table;
    const { saveMesa } = useSaveMesa();
    const loading = useRestaurantsStore((state) => state.loading);
    const restaurants = useRestaurantsStore((state) => state.restaurants);

    const [form, setForm] = useState({
        id_restaurante: resolveRestId(table, restauranteId),
        numero: table?.numero || "",
        capacidad: table?.capacidad || "",
        ubicacion: table?.ubicacion || "",
        estado: table?.estado || "Disponible",
    });

    useEffect(() => {
        setForm({
            id_restaurante: resolveRestId(table, restauranteId),
            numero: table?.numero || "",
            capacidad: table?.capacidad || "",
            ubicacion: table?.ubicacion || "",
            estado: table?.estado || "Disponible",
        });
    }, [table, restauranteId]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const originalRestaurantId = typeof table?.id_restaurante === "object"
                ? table?.id_restaurante?._id
                : table?.id_restaurante;

            await saveMesa(form, form.id_restaurante, table?._id ?? null, originalRestaurantId);
            showSuccess(isEditing ? "Mesa actualizada" : "Mesa creada");
            onSaved?.();
            onClose();
        } catch (error) {
            showError("Error al guardar la mesa");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Armchair size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Mesa" : "Nueva Mesa"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {!restauranteId && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                            <select name="id_restaurante" value={form.id_restaurante} onChange={handleChange} required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors">
                                <option value="">Seleccionar restaurante...</option>
                                {restaurants.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Número *</label>
                            <input name="numero" type="number" min="1" value={form.numero} onChange={handleChange} required placeholder="Ej: 1"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Capacidad *</label>
                            <input name="capacidad" type="number" min="1" value={form.capacidad} onChange={handleChange} required placeholder="Ej: 4"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Ubicación *</label>
                        <input name="ubicacion" value={form.ubicacion} onChange={handleChange} required placeholder="Ej: Terraza, Interior, Barra..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                        <select name="estado" value={form.estado} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors">
                            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Mesa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};