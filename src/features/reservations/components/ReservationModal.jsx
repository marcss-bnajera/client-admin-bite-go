import { X, CalendarDays } from "lucide-react";
import { useState } from "react";

const usuarios = [
    { _id: "user_001", nombre: "Juan Pérez", email: "juan@gmail.com" },
    { _id: "user_002", nombre: "María López", email: "maria@gmail.com" },
    { _id: "user_003", nombre: "Carlos Ruiz", email: "carlos@gmail.com" },
];

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

const mesas = [
    { _id: "mesa_001", numero: 1, ubicacion: "Terraza", capacidad: 2, id_restaurante: "rest_001" },
    { _id: "mesa_002", numero: 2, ubicacion: "Interior", capacidad: 4, id_restaurante: "rest_001" },
    { _id: "mesa_003", numero: 1, ubicacion: "Barra", capacidad: 2, id_restaurante: "rest_002" },
    { _id: "mesa_004", numero: 3, ubicacion: "Interior", capacidad: 6, id_restaurante: "rest_002" },
    { _id: "mesa_005", numero: 5, ubicacion: "Salón privado", capacidad: 8, id_restaurante: "rest_003" },
];

export const ReservationModal = ({ isOpen, onClose, reservation = null }) => {
    const isEditing = !!reservation;

    const [form, setForm] = useState({
        userId: reservation?.userId?._id || reservation?.userId || "",
        restaurantId: reservation?.restaurantId?._id || reservation?.restaurantId || "",
        tableId: reservation?.tableId || "",
        reservationDate: reservation?.reservationDate
            ? new Date(reservation.reservationDate).toISOString().slice(0, 16)
            : "",
        peopleCount: reservation?.peopleCount || "",
        status: reservation?.status || "Confirmed",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "restaurantId") {
            setForm({ ...form, restaurantId: value, tableId: "" });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const mesasFiltradas = mesas.filter(m => m.id_restaurante === form.restaurantId);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Payload Reservación:", {
            userId: form.userId,
            restaurantId: form.restaurantId,
            tableId: form.tableId,
            reservationDate: form.reservationDate,
            peopleCount: Number(form.peopleCount),
            ...(isEditing && { status: form.status }),
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <CalendarDays size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Reservación" : "Nueva Reservación"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cliente *</label>
                        <select name="userId" value={form.userId} onChange={handleChange} required
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors">
                            <option value="">Seleccionar cliente...</option>
                            {usuarios.map(u => (
                                <option key={u._id} value={u._id}>{u.nombre} — {u.email}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        <select name="restaurantId" value={form.restaurantId} onChange={handleChange} required
                            disabled={isEditing}
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <option value="">Seleccionar restaurante...</option>
                            {restaurantes.map(r => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Mesa *</label>
                        <select name="tableId" value={form.tableId} onChange={handleChange} required
                            disabled={!form.restaurantId}
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${!form.restaurantId ? "opacity-50 cursor-not-allowed" : ""}`}>
                            <option value="">{form.restaurantId ? "Seleccionar mesa..." : "Primero selecciona un restaurante"}</option>
                            {mesasFiltradas.map(m => (
                                <option key={m._id} value={m._id}>
                                    Mesa {m.numero} — {m.ubicacion} (cap. {m.capacidad} personas)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Fecha y Hora *</label>
                            <input name="reservationDate" value={form.reservationDate} onChange={handleChange} required
                                type="datetime-local"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Personas *</label>
                            <input name="peopleCount" value={form.peopleCount} onChange={handleChange} required
                                type="number" min="1" placeholder="Ej: 4"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors" />
                        </div>
                    </div>

                    {isEditing && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado *</label>
                            <select name="status" value={form.status} onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors">
                                <option value="Confirmed">Confirmada</option>
                                <option value="Attended">Atendida</option>
                                <option value="Cancelled">Cancelada</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit"
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors">
                            {isEditing ? "Guardar Cambios" : "Crear Reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};