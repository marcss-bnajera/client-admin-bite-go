import { X, PartyPopper, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

export const EventModal = ({ isOpen, onClose, event = null, restauranteId = null }) => {
    const isEditing = !!event;

    // Fix: id_restaurante al editar es objeto {_id, nombre}, extraer solo el _id
    const resolvedRestauranteId = restauranteId
        || (typeof event?.id_restaurante === "object" ? event?.id_restaurante?._id : event?.id_restaurante)
        || "";

    const [form, setForm] = useState({
        id_restaurante: resolvedRestauranteId,
        nombre: event?.nombre || "",
        descripcion: event?.descripcion || "",
        // fechas vienen como strings del mock, el schema las guarda como Date — el backend las convierte
        fechas: event?.fechas?.length ? event.fechas : [""],
        servicios: event?.servicios?.length ? event.servicios : [""],
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Payload que recibe req.body en addEvento y updateEvento
        // El schema no tiene id_restaurante dentro del evento — va en el :id de la URL
        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            fechas: form.fechas.filter((f) => f !== ""),
            servicios: form.servicios.filter((s) => s !== ""),
        };

        if (isEditing) {
            // PUT /restaurants/:restId/events/:eventoId
            console.log(`PUT /restaurants/${form.id_restaurante}/events/${event._id}`, payload);
        } else {
            // POST /restaurants/:id/events — $addToSet evita duplicados por valor
            console.log(`POST /restaurants/${form.id_restaurante}/events`, payload);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                {/* Header sticky para scroll largo */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <PartyPopper size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Evento" : "Nuevo Evento"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Restaurante — oculto si viene por prop */}
                    {!restauranteId && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Restaurante *
                            </label>
                            <select
                                name="id_restaurante"
                                value={form.id_restaurante}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="">Seleccionar restaurante...</option>
                                {restaurantes.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Nombre del Evento *
                        </label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Noche de Tapas"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Descripcion
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Describe el evento..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none"
                        />
                    </div>

                    {/* Fechas — schema usa [Date], se envian como strings ISO y mongo convierte */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">
                                Fechas *
                            </label>
                            <button
                                type="button"
                                onClick={addFecha}
                                className="flex items-center gap-1 text-xs text-[#E67E22] font-bold hover:underline"
                            >
                                <Plus size={12} /> Agregar fecha
                            </button>
                        </div>
                        <div className="space-y-2">
                            {form.fechas.map((fecha, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={fecha}
                                        onChange={(e) => handleFechaChange(index, e.target.value)}
                                        required
                                        className="flex-1 px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                    />
                                    {form.fechas.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFecha(index)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Servicios — schema usa [String] */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">
                                Servicios
                            </label>
                            <button
                                type="button"
                                onClick={addServicio}
                                className="flex items-center gap-1 text-xs text-[#E67E22] font-bold hover:underline"
                            >
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
                                        placeholder="Ej: Musica en vivo, Maridaje..."
                                        className="flex-1 px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                    />
                                    {form.servicios.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeServicio(index)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

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
                            {isEditing ? "Guardar Cambios" : "Crear Evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};