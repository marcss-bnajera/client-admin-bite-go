import { X, Store } from "lucide-react";
import { useState } from "react";
import { useSaveRestaurant } from "../hooks/useSaveRestaurant";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const RestaurantModal = ({ isOpen, onClose, restaurant = null }) => {
    const isEditing = !!restaurant;
    const { saveRestaurant } = useSaveRestaurant();
    const loading = useRestaurantsStore((state) => state.loading);

    const [form, setForm] = useState({
        nombre: restaurant?.nombre || "",
        direccion_texto: restaurant?.direccion?.texto || "",
        horarios_atencion: restaurant?.horarios_atencion || "",
        categoria_gastronomica: restaurant?.categoria_gastronomica || "",
        precio_promedio: restaurant?.precio_promedio || "",
        telefono: restaurant?.informacion_contacto?.telefono || "",
        email: restaurant?.informacion_contacto?.email || "",
        activo: restaurant?.activo ?? true,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveRestaurant(form, restaurant?._id ?? null);
            showSuccess(isEditing ? "Restaurante actualizado correctamente" : "Restaurante creado correctamente");
            onClose();
        } catch (error) {
            console.log("SUBMIT ERROR:", error);
            showError("Error al guardar el restaurante");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Store size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Restaurante" : "Nuevo Restaurante"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Restaurante *</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Bite Central"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Dirección *</label>
                        <input name="direccion_texto" value={form.direccion_texto} onChange={handleChange} required placeholder="Ej: Zona 10, Ciudad de Guatemala"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Horario *</label>
                            <input name="horarios_atencion" value={form.horarios_atencion} onChange={handleChange} required placeholder="Ej: 8:00 - 22:00"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Precio Promedio (Q) *</label>
                            <input name="precio_promedio" value={form.precio_promedio} onChange={handleChange} required type="number" min="0" placeholder="Ej: 75"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Categoría Gastronómica *</label>
                        <input name="categoria_gastronomica" value={form.categoria_gastronomica} onChange={handleChange} required placeholder="Ej: Comida Rápida, Fusión..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Teléfono</label>
                            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Ej: 2345-6789"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Correo</label>
                            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Ej: contacto@bite.com"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                        {isEditing && (
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                                <select name="activo" value={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.value === "true" })}
                                    className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors">
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3] mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Restaurante"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};