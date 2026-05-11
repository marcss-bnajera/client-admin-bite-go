import { X, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useSaveReservation } from "../hooks/useSaveReservations";
import { useReservationsStore } from "../store/reservationsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useUsersStore } from "../../users/store/usersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const ReservationModal = ({ isOpen, onClose, reservation = null, onSaved }) => {
    const isEditing = !!reservation;
    const { saveReservation } = useSaveReservation();
    const loading = useReservationsStore((state) => state.loading);

    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const users = useUsersStore((state) => state.users);
    const getUsers = useUsersStore((state) => state.getUsers);

    const [form, setForm] = useState({
        userId: "",
        restaurantId: "",
        tableId: "",
        reservationDate: "",
        peopleCount: "",
        status: "Confirmed",
    });

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getUsers({ activo: true, limit: 200 });
            setForm({
                userId: reservation?.userId?._id || reservation?.userId || "",
                restaurantId: reservation?.restaurantId?._id || reservation?.restaurantId || "",
                tableId: reservation?.tableId || "",
                reservationDate: reservation?.reservationDate
                    ? new Date(reservation.reservationDate).toISOString().slice(0, 16)
                    : "",
                originalReservationDate: reservation?.reservationDate
                    ? new Date(reservation.reservationDate).toISOString().slice(0, 16)
                    : "",
                peopleCount: reservation?.peopleCount || "",
                status: reservation?.status || "Confirmed",
            });
        }
    }, [isOpen, reservation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "restaurantId") {
            setForm((prev) => ({ ...prev, restaurantId: value, tableId: "" }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Mesas del restaurante seleccionado — vienen del restaurantsStore sin llamada extra
    const selectedRestaurant = restaurants.find((r) => r._id === form.restaurantId);
    const mesasFiltradas = selectedRestaurant?.mesas ?? [];

    // Solo clientes pueden hacer reservaciones
    const clientes = users.filter((u) => u.rol === "Cliente");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveReservation(form, reservation?._id ?? null);
            showSuccess(isEditing ? "Reservación actualizada correctamente" : "Reservación creada correctamente");
            onSaved?.();
            onClose();
        } catch (err) {
            const validationErrors = err?.response?.data?.error;
            const msg = Array.isArray(validationErrors)
                ? validationErrors.map(e => e.message).join(", ")
                : err?.response?.data?.message || "Error al guardar la reservación";
            showError(msg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
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

                    {/* Cliente */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cliente *</label>
                        <select
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map((u) => (
                                <option key={u._id} value={u._id}>{u.nombre} — {u.email}</option>
                            ))}
                        </select>
                    </div>

                    {/* Restaurante — bloqueado al editar */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        <select
                            name="restaurantId"
                            value={form.restaurantId}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <option value="">Seleccionar restaurante...</option>
                            {restaurants.map((r) => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                    </div>

                    {/* Mesa — filtrada por restaurante seleccionado */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Mesa *</label>
                        <select
                            name="tableId"
                            value={form.tableId}
                            onChange={handleChange}
                            required
                            disabled={!form.restaurantId}
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${!form.restaurantId ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <option value="">
                                {!form.restaurantId
                                    ? "Primero selecciona un restaurante"
                                    : mesasFiltradas.length === 0
                                        ? "Sin mesas registradas"
                                        : "Seleccionar mesa..."}
                            </option>
                            {mesasFiltradas.map((m) => (
                                <option key={m._id} value={m._id}>
                                    Mesa {m.numero} — {m.ubicacion} (cap. {m.capacidad} personas)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha + Personas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Fecha y Hora *</label>
                            <input
                                name="reservationDate"
                                value={form.reservationDate}
                                onChange={handleChange}
                                required
                                type="datetime-local"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Personas *</label>
                            <input
                                name="peopleCount"
                                value={form.peopleCount}
                                onChange={handleChange}
                                required
                                type="number"
                                min="1"
                                max="20"
                                placeholder="Ej: 4"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Estado — solo en edición */}
                    {isEditing && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado *</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="Confirmed">Confirmada</option>
                                <option value="Attended">Atendida</option>
                                <option value="Cancelled">Cancelada</option>
                            </select>
                        </div>
                    )}

                    {/* BOTONES */}
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
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};