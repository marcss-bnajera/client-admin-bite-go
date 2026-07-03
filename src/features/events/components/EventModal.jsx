import { X, PartyPopper, Plus, Trash2, Store, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSaveEvento } from "../hooks/useSaveEvento";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { DatePicker } from "../../../shared/ui/DatePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { RestaurantPickerModal } from "../../../shared/components/ui/RestaurantPickerModal";

const toDateInput = (fecha) => {
    if (!fecha) return null;
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? null : d;
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
        fechas: [null],
        servicios: [""],
    });

    const [formErrors, setFormErrors] = useState({});

    const [selectedRestId, setSelectedRestId] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const prevRestaurantId = useRef(null);
    const skipPick = useRef(false);

    const selectedRestaurant = useMemo(
        () => restaurants.find((r) => r._id === selectedRestId),
        [restaurants, selectedRestId]
    );

    useEffect(() => {
        if (isOpen) {
            const initialRestId = resolvedRestauranteId;
            setSelectedRestId(initialRestId);
            prevRestaurantId.current = null;
            skipPick.current = false;
            setFormErrors({});
            setForm({
                id_restaurante: initialRestId,
                nombre: event?.nombre || "",
                descripcion: event?.descripcion || "",
                fechas: event?.fechas?.length ? event.fechas.map(toDateInput).filter(Boolean) : [null],
                servicios: event?.servicios?.length ? event.servicios : [""],
            });
        }
    }, [isOpen, event]);

    useEffect(() => {
        if (prevRestaurantId.current === null) {
            prevRestaurantId.current = selectedRestId;
            return;
        }
        if (skipPick.current) {
            skipPick.current = false;
            prevRestaurantId.current = selectedRestId;
            return;
        }
        if (prevRestaurantId.current !== selectedRestId) {
            setForm((prev) => ({ ...prev, id_restaurante: selectedRestId }));
            prevRestaurantId.current = selectedRestId;
        }
    }, [selectedRestId]);

    const handleRestaurantPick = (restaurant) => {
        skipPick.current = true;
        setSelectedRestId(restaurant._id);
        setForm((prev) => ({ ...prev, id_restaurante: restaurant._id }));
        if (formErrors.id_restaurante) setFormErrors((prev) => ({ ...prev, id_restaurante: "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFechaChange = (index, dateObj) => {
        const nuevasFechas = [...form.fechas];
        nuevasFechas[index] = dateObj;
        setForm({ ...form, fechas: nuevasFechas });
        if (formErrors.fechas) setFormErrors((prev) => ({ ...prev, fechas: "" }));
    };

    const addFecha = () => setForm({ ...form, fechas: [...form.fechas, null] });
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
        const newErrors = {};
        if (!form.id_restaurante) newErrors.id_restaurante = "Selecciona un restaurante";
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (form.fechas.every((f) => !f)) newErrors.fechas = "Agrega al menos una fecha";

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        try {
            const originalRestaurantId = typeof event?.id_restaurante === "object"
                ? event?.id_restaurante?._id
                : event?.id_restaurante;

            const formToSend = {
                ...form,
                fechas: form.fechas.filter(Boolean).map(d => d.toISOString()),
            };

            await saveEvento(formToSend, form.id_restaurante, event?._id ?? null, originalRestaurantId);
            showSuccess(isEditing ? "Evento actualizado" : "Evento creado");
            onSaved?.();
            onClose();
        } catch (err) {
            const msg = err.response?.data?.error?.[0]?.message
                || err.response?.data?.message
                || "Error al guardar el evento";
            showError(msg);
        }
    };

    if (!isOpen) return null;

    const inputClass = (name) =>
        `w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${formErrors[name] ? "border-red-400" : "border-[#E8D8C3]"}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[95vh] overflow-y-auto">
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

                <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">

                    {!restauranteId && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                            {selectedRestId && selectedRestaurant ? (
                                <button type="button" disabled={isEditing} onClick={() => !isEditing && setPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#E67E22] bg-[#E67E22]/5 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-[#E67E22]/10" : "cursor-not-allowed opacity-60"}`}>
                                    <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                                        <Store size={12} className="text-[#E67E22]" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedRestaurant.nombre}</span>
                                    {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                                </button>
                            ) : (
                                <button type="button" onClick={() => setPickerOpen(true)} className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm transition-colors ${formErrors.id_restaurante ? "border-red-400 bg-red-50" : "border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0]"}`}>
                                    <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                        <Store size={14} className="text-[#6B6B6B]" />
                                    </div>
                                    <span className="text-[#6B6B6B]">Seleccionar restaurante...</span>
                                </button>
                            )}
                            {formErrors.id_restaurante && <p className="text-[10px] text-red-500 mt-1">{formErrors.id_restaurante}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Evento *</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Noche de Tapas"
                            className={inputClass("nombre")}
                        />
                        {formErrors.nombre && <p className="text-[10px] text-red-500 mt-1">{formErrors.nombre}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">Descripción</label>
                            <span className={`text-[10px] ${form.descripcion.length > 450 ? "text-[#C0392B] font-bold" : "text-[#6B6B6B]"}`}>
                                {form.descripcion.length}/500
                            </span>
                        </div>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            maxLength={500}
                            rows={3}
                            placeholder="Describe el evento..."
                            className={inputClass("descripcion")}
                            style={{ resize: "none" }}
                        />
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
                                    <div className="flex-1">
                                        <DatePicker
                                            value={fecha}
                                            onChange={(date) => handleFechaChange(index, date)}
                                            placeholder="Seleccionar fecha"
                                        />
                                        {fecha && (
                                            <p className="text-[10px] text-[#E67E22] mt-1 font-semibold">
                                                {format(fecha, "EEE d MMM, yyyy", { locale: es })}
                                            </p>
                                        )}
                                    </div>
                                    {form.fechas.length > 1 && (
                                        <button type="button" onClick={() => removeFecha(index)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {formErrors.fechas && <p className="text-[10px] text-red-500 mt-1">{formErrors.fechas}</p>}
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
                                    <input
                                        type="text"
                                        value={servicio}
                                        onChange={(e) => handleServicioChange(index, e.target.value)}
                                        placeholder="Ej: Música en vivo..."
                                        className="flex-1 px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                    />
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

            <RestaurantPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleRestaurantPick}
                selectedId={selectedRestId}
            />
        </div>
    );
};