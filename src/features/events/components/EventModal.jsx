import { X, PartyPopper, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSaveEvento } from "../hooks/useSaveEvento";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const toDateInput = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toISOString().split("T")[0];
};

export const EventModal = ({ isOpen, onClose, event = null, restauranteId = null, onSaved }) => {
    const isEditing = !!event;
    const { saveEvento } = useSaveEvento();
    const loading = useRestaurantsStore((state) => state.loading);
    const restaurants = useRestaurantsStore((state) => state.restaurants);

    const resolvedRestauranteId = restauranteId
        || (typeof event?.id_restaurante === "object" ? event?.id_restaurante?._id : event?.id_restaurante)
        || "";

    const [form, setForm] = useState({
        id_restaurante: "",
        nombre: "",
        descripcion: "",
        fechas: [""],
        servicios: [""],
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                id_restaurante: resolvedRestauranteId,
                nombre: event?.nombre || "",
                descripcion: event?.descripcion || "",
                fechas: event?.fechas?.length ? event.fechas.map(toDateInput) : [""],
                servicios: event?.servicios?.length ? event.servicios : [""],
            });
        }
    }, [isOpen, event]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFechaChange = (index, value) => {
        const nuevasFechas = [...form.fechas];
        nuevasFechas[index] = value;
        setForm({ ...form, fechas: nuevasFechas });
    };

    const addFecha = () => setForm({ ...form, fechas: [...form.fechas, ""] });
    const removeFecha = (index) => setForm({ ...form, fechas: form.fechas.filter((_, i) => i !== index) });

    const handleServicioChange = (index, value) => {
        const nuevosServicios = [...form.servicios];
        nuevosServicios[index] = value;
        setForm({ ...form, servicios: nuevosServicios });
    };

    const addServicio = () => setForm({ ...form, servicios: [...form.servicios, ""] });
    const removeServicio = (index) => setForm({ ...form, servicios: form.servicios.filter((_, i) => i !== index) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const originalRestaurantId = typeof event?.id_restaurante === "object"
                ? event?.id_restaurante?._id
                : event?.id_restaurante;

            await saveEvento(form, form.id_restaurante, event?._id ?? null, originalRestaurantId);
            showSuccess(isEditing ? "Evento actualizado" : "Evento creado");
            onSaved?.();
            onClose();
        } catch (error) {
            showError("Error al guardar el evento");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <PartyPopper size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Evento" : "Nuevo Evento"}
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
                            <select
                                name="id_restaurante"
                                value={form.id_restaurante}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="">Seleccionar restaurante...</option>
                                {restaurants.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Evento *</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Noche de Tapas"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Descripción</label>
                        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={2} placeholder="Describe el evento..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">Fechas *</label>
                            <button type="button" onClick={addFecha} className="flex items-center gap-1 text-xs text-[#E67E22] font-bold hover:underline">
                                <Plus size={12} /> Agregar fecha
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.fechas.map((fecha, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="date" value={fecha} onChange={(e) => handleFechaChange(index, e.target.value)} required
                                        className="flex-1 px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                                    {form.fechas.length > 1 && (
                                        <button type="button" onClick={() => removeFecha(index)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">Servicios</label>
                            <button type="button" onClick={addServicio} className="flex items-center gap-1 text-xs text-[#E67E22] font-bold hover:underline">
                                <Plus size={12} /> Agregar servicio
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.servicios.map((servicio, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" value={servicio} onChange={(e) => handleServicioChange(index, e.target.value)} placeholder="Ej: Música en vivo..."
                                        className="flex-1 px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                                    {form.servicios.length > 1 && (
                                        <button type="button" onClick={() => removeServicio(index)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};