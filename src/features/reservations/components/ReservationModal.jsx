import { X, CalendarDays, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveReservation } from "../hooks/useSaveReservations";
import { useReservationsStore } from "../store/reservationsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useUsersStore } from "../../users/store/usersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const toGuatemalaISO = (localDatetimeStr) => `${localDatetimeStr}:00-06:00`;

const fromUTCtoLocalInput = (isoString) => {
    const date = new Date(isoString);
    const gt = new Date(date.getTime() - 6 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${gt.getUTCFullYear()}-${pad(gt.getUTCMonth() + 1)}-${pad(gt.getUTCDate())}T${pad(gt.getUTCHours())}:${pad(gt.getUTCMinutes())}`;
};

export const ReservationModal = ({ isOpen, onClose, reservation = null, onSaved }) => {
    const isEditing = !!reservation;
    const { saveReservation } = useSaveReservation();
    const loading = useReservationsStore((state) => state.loading);

    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const users = useUsersStore((state) => state.users);
    const getUsers = useUsersStore((state) => state.getUsers);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm();

    const restaurantId = watch("restaurantId");
    const tableId = watch("tableId");
    const peopleCount = watch("peopleCount");

    const selectedRestaurant = restaurants.find((r) => r._id === restaurantId);

    // Solo mesas que no están en Mantenimiento
    const mesasDisponibles = (selectedRestaurant?.mesas ?? []).filter(
        (m) => m.estado !== "Mantenimiento"
    );
    const mesasEnMantenimiento = (selectedRestaurant?.mesas ?? []).filter(
        (m) => m.estado === "Mantenimiento"
    );

    // Mesa actualmente seleccionada para mostrar hints dinámicos
    const mesaSeleccionada = mesasDisponibles.find((m) => m._id === tableId);
    const excedCapacidad = mesaSeleccionada && peopleCount > mesaSeleccionada.capacidad;

    const clientes = users.filter((u) => u.rol === "Cliente");

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getUsers({ activo: true, limit: 200 });
            reset({
                userId: reservation?.userId?._id || reservation?.userId || "",
                restaurantId: reservation?.restaurantId?._id || reservation?.restaurantId || "",
                tableId: reservation?.tableId || "",
                reservationDate: reservation?.reservationDate
                    ? fromUTCtoLocalInput(reservation.reservationDate)
                    : "",
                peopleCount: reservation?.peopleCount || "",
                status: reservation?.status || "Confirmed",
            });
        }
    }, [isOpen, reservation, reset]);

    const onSubmit = async (data) => {
        // Validación de capacidad en cliente antes de enviar
        if (mesaSeleccionada && Number(data.peopleCount) > mesaSeleccionada.capacidad) {
            showError(
                `La mesa #${mesaSeleccionada.numero} tiene capacidad máxima de ${mesaSeleccionada.capacidad} persona(s). Reduce la cantidad o elige otra mesa.`
            );
            return;
        }

        try {
            await saveReservation(
                { ...data, reservationDate: toGuatemalaISO(data.reservationDate) },
                reservation?._id ?? null
            );
            showSuccess(isEditing ? "Reservación actualizada correctamente" : "Reservación creada correctamente");
            reset();
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

    const inputClass = (name) =>
        `w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none bg-[#F5EFE6]/50 transition-colors ${errors[name]
            ? "border-red-400 focus:border-red-500"
            : excedCapacidad && name === "peopleCount"
                ? "border-amber-400 focus:border-amber-500"
                : "border-[#E8D8C3] focus:border-[#E67E22]"
        }`;

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

                <div className="px-6 py-5 space-y-4">

                    {/* Cliente */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cliente *</label>
                        <select
                            className={inputClass("userId")}
                            {...register("userId", { required: "Selecciona un cliente" })}
                        >
                            <option value="">Seleccionar cliente...</option>
                            {clientes.map((u) => (
                                <option key={u._id} value={u._id}>{u.nombre} — {u.email}</option>
                            ))}
                        </select>
                        {errors.userId && <span className="text-red-500 text-xs mt-1 block">{errors.userId.message}</span>}
                    </div>

                    {/* Restaurante */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        <select
                            disabled={isEditing}
                            className={`${inputClass("restaurantId")} ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                            {...register("restaurantId", { required: "Selecciona un restaurante" })}
                        >
                            <option value="">Seleccionar restaurante...</option>
                            {restaurants.map((r) => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                        {errors.restaurantId && <span className="text-red-500 text-xs mt-1 block">{errors.restaurantId.message}</span>}
                    </div>

                    {/* Mesa */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Mesa *</label>
                        <select
                            disabled={!restaurantId}
                            className={`${inputClass("tableId")} ${!restaurantId ? "opacity-50 cursor-not-allowed" : ""}`}
                            {...register("tableId", { required: "Selecciona una mesa" })}
                        >
                            <option value="">
                                {!restaurantId
                                    ? "Primero selecciona un restaurante"
                                    : mesasDisponibles.length === 0
                                        ? "Sin mesas disponibles"
                                        : "Seleccionar mesa..."}
                            </option>
                            {mesasDisponibles.map((m) => (
                                <option key={m._id} value={m._id}>
                                    Mesa {m.numero} — {m.ubicacion} · cap. {m.capacidad} personas · {m.estado}
                                </option>
                            ))}
                        </select>
                        {errors.tableId && <span className="text-red-500 text-xs mt-1 block">{errors.tableId.message}</span>}

                        {/* Aviso de mesas en mantenimiento */}
                        {mesasEnMantenimiento.length > 0 && restaurantId && (
                            <div className="flex items-start gap-1.5 mt-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-amber-700">
                                    {mesasEnMantenimiento.length === 1
                                        ? `La mesa #${mesasEnMantenimiento[0].numero} está en mantenimiento y no está disponible.`
                                        : `${mesasEnMantenimiento.length} mesas en mantenimiento están ocultas.`}
                                </p>
                            </div>
                        )}

                        {/* Capacidad de la mesa seleccionada */}
                        {mesaSeleccionada && (
                            <p className="text-[11px] text-[#6B6B6B] mt-1">
                                Capacidad máxima: <span className="font-bold text-[#2B2B2B]">{mesaSeleccionada.capacidad} persona(s)</span>
                            </p>
                        )}
                    </div>

                    {/* Fecha + Personas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Fecha y Hora *</label>
                            <input
                                type="datetime-local"
                                className={inputClass("reservationDate")}
                                {...register("reservationDate", { required: "Ingresa la fecha y hora" })}
                            />
                            {errors.reservationDate && <span className="text-red-500 text-xs mt-1 block">{errors.reservationDate.message}</span>}
                            <p className="text-[10px] text-[#6B6B6B] mt-1">La mesa se bloquea ±2h alrededor de esta hora</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Personas *</label>
                            <input
                                type="number"
                                placeholder="Ej: 4"
                                className={inputClass("peopleCount")}
                                {...register("peopleCount", {
                                    required: "Ingresa el número de personas",
                                    min: { value: 1, message: "Mínimo 1 persona" },
                                    max: { value: 20, message: "Máximo 20 personas" }
                                })}
                            />
                            {errors.peopleCount && <span className="text-red-500 text-xs mt-1 block">{errors.peopleCount.message}</span>}

                            {/* Advertencia dinámica de capacidad excedida */}
                            {excedCapacidad && (
                                <div className="flex items-center gap-1 mt-1">
                                    <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                                    <span className="text-[11px] text-amber-700">
                                        Excede la capacidad de la mesa ({mesaSeleccionada.capacidad} máx.)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estado — solo en edición */}
                    {isEditing && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado *</label>
                            <select
                                className={inputClass("status")}
                                {...register("status")}
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
                            onClick={() => { reset(); onClose(); }}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading || excedCapacidad}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Reservación"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};