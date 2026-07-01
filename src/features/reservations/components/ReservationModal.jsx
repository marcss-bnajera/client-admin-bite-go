import { X, CalendarDays, AlertTriangle, Store, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSaveReservation } from "../hooks/useSaveReservations";
import { useReservationsStore } from "../store/reservationsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useUsersStore } from "../../users/store/usersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { getTablesAvailability } from "../../../shared/api/admin";
import { DatePicker, TimePicker } from "../../../shared/ui/DatePicker";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { RestaurantPickerModal } from "../../../shared/components/ui/RestaurantPickerModal";
import { SucursalPickerModal } from "../../../shared/components/ui/SucursalPickerModal";

const fromUTCtoLocalInput = (isoString) => {
    const date = new Date(isoString);
    const gt = new Date(date.getTime() - 6 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${gt.getUTCFullYear()}-${pad(gt.getUTCMonth() + 1)}-${pad(gt.getUTCDate())}T${pad(gt.getUTCHours())}:${pad(gt.getUTCMinutes())}`;
};

export const ReservationModal = ({ isOpen, onClose, reservation = null, restauranteId = null, onSaved }) => {
    const isEditing = !!reservation;
    const { saveReservation } = useSaveReservation();
    const loading = useReservationsStore((state) => state.loading);

    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const users = useUsersStore((state) => state.users);
    const getUsers = useUsersStore((state) => state.getUsers);

    const [fechaReserva, setFechaReserva] = useState(null);
    const [horaReserva, setHoraReserva] = useState("");
    const [idSucursal, setIdSucursal] = useState("");
    const [tableAvailability, setTableAvailability] = useState(null);

    const [selectedRestId, setSelectedRestId] = useState("");
    const [selectedSucId, setSelectedSucId] = useState("");
    const [restPickerOpen, setRestPickerOpen] = useState(false);
    const [sucPickerOpen, setSucPickerOpen] = useState(false);
    const prevRestId = useRef(null);
    const prevSucId = useRef(null);

    const selectedRestaurantObj = useMemo(
        () => restaurants.find((r) => r._id === selectedRestId),
        [restaurants, selectedRestId]
    );
    const tieneSucursales = selectedRestaurantObj?.tiene_sucursales && selectedRestaurantObj?.sucursales?.length > 0;
    const sucursales = tieneSucursales ? (selectedRestaurantObj?.sucursales ?? []) : [];
    const selectedSucursalObj = useMemo(
        () => selectedSucId ? sucursales.find((s) => s._id === selectedSucId) : null,
        [sucursales, selectedSucId]
    );

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm();

    const restaurantId = watch("restaurantId");
    const tableId = watch("tableId");
    const peopleCount = watch("peopleCount");

    const horariosAdmin = selectedSucursalObj?.horarios_atencion || selectedRestaurantObj?.horarios_atencion || "";
    let openingTimeAdmin = "";
    let closingTimeAdmin = "";
    if (horariosAdmin) {
        const [aperturaStr, cierreStr] = horariosAdmin.split(" - ");
        openingTimeAdmin = aperturaStr;
        const [cH, cM] = cierreStr.split(":").map(Number);
        const cierreDate = new Date();
        cierreDate.setHours(cH, cM, 0, 0);
        cierreDate.setMinutes(cierreDate.getMinutes() - 90);
        closingTimeAdmin = `${String(cierreDate.getHours()).padStart(2, "0")}:${String(cierreDate.getMinutes()).padStart(2, "0")}`;
    }

    const mesasFuente = selectedSucursalObj
        ? (selectedSucursalObj.mesas ?? [])
        : (selectedRestaurantObj?.mesas ?? []);

    const mesasDisponibles = tableAvailability
        ? tableAvailability.mesas.filter((m) => m.disponible)
        : mesasFuente.filter((m) => m.estado !== "Mantenimiento");

    const mesasOcupadas = tableAvailability
        ? tableAvailability.mesas.filter((m) => !m.disponible && m.estado !== "Mantenimiento")
        : [];

    const mesasEnMantenimiento = tableAvailability
        ? tableAvailability.mesas.filter((m) => m.estado === "Mantenimiento")
        : mesasFuente.filter((m) => m.estado === "Mantenimiento");

    // Mesa actualmente seleccionada para mostrar hints dinámicos
    const mesaSeleccionada = mesasDisponibles.find((m) => m._id === tableId);
    const excedCapacidad = mesaSeleccionada && peopleCount > mesaSeleccionada.capacidad;

    const clientes = users.filter((u) => u.rol === "Cliente");

    const prevRestaurantId = useRef(restaurantId);
    const skipRestaurantReset = useRef(false);

    useEffect(() => {
        if (prevRestId.current === null) {
            prevRestId.current = selectedRestId;
            return;
        }
        if (prevRestId.current !== selectedRestId) {
            setIdSucursal("");
            setSelectedSucId("");
            setValue("restaurantId", selectedRestId, { shouldValidate: true });
            setValue("tableId", "");
            prevRestId.current = selectedRestId;
        }
    }, [selectedRestId, setValue]);

    useEffect(() => {
        if (prevSucId.current === null) {
            prevSucId.current = selectedSucId;
            return;
        }
        if (prevSucId.current !== selectedSucId) {
            setIdSucursal(selectedSucId);
            setValue("id_sucursal", selectedSucId);
            setValue("tableId", "");
            prevSucId.current = selectedSucId;
        }
    }, [selectedSucId, setValue]);

    const handleRestaurantPick = (restaurant) => {
        setSelectedRestId(restaurant._id);
        setSelectedSucId("");
        setIdSucursal("");
        setValue("restaurantId", restaurant._id, { shouldValidate: true });
        setValue("tableId", "");
        setValue("id_sucursal", "");
    };

    const handleSucursalPick = (sucursal) => {
        setSelectedSucId(sucursal._id);
        setIdSucursal(sucursal._id);
        setValue("id_sucursal", sucursal._id);
        setValue("tableId", "");
    };

    const fetchAvailability = useCallback(async () => {
        if (!restaurantId || !fechaReserva || !horaReserva) {
            setTableAvailability(null);
            return;
        }
        try {
            const [h, m] = horaReserva.split(":");
            const dt = new Date(fechaReserva);
            dt.setHours(parseInt(h), parseInt(m), 0, 0);
            const isoStr = dt.toISOString();

            const params = { id_restaurante: restaurantId, fecha_reserva: isoStr };
            if (idSucursal) params.id_sucursal = idSucursal;

            const { data } = await getTablesAvailability(params);
            setTableAvailability(data);
        } catch {
            setTableAvailability(null);
        }
    }, [restaurantId, fechaReserva, horaReserva, idSucursal]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getUsers({ activo: true, limit: 200 });
            const initialRestId = reservation?.restaurantId?._id || reservation?.restaurantId || restauranteId || "";
            const initialSucId = reservation?.id_sucursal || "";
            setSelectedRestId(initialRestId);
            setSelectedSucId(initialSucId);
            setIdSucursal(initialSucId);
            prevRestId.current = null;
            prevSucId.current = null;
            if (reservation?.reservationDate) {
                const localDate = fromUTCtoLocalInput(reservation.reservationDate);
                const [datePart, timePart] = localDate.split("T");
                const [y, mo, d] = datePart.split("-").map(Number);
                setFechaReserva(new Date(y, mo - 1, d));
                setHoraReserva(timePart || "");
            } else {
                setFechaReserva(null);
                setHoraReserva("");
            }
            skipRestaurantReset.current = true;
            reset({
                userId: reservation?.userId?._id || reservation?.userId || "",
                restaurantId: initialRestId,
                tableId: reservation?.tableId || "",
                peopleCount: reservation?.peopleCount || "",
                status: reservation?.status || "Confirmed",
                id_sucursal: initialSucId,
            });
        }
    }, [isOpen, reservation, restauranteId, reset]);

    const onSubmit = async (data) => {
        if (!fechaReserva || !horaReserva) {
            showError("Selecciona fecha y hora de la reservación");
            return;
        }
        if (mesaSeleccionada && Number(data.peopleCount) > mesaSeleccionada.capacidad) {
            showError(
                `La mesa #${mesaSeleccionada.numero} tiene capacidad máxima de ${mesaSeleccionada.capacidad} persona(s). Reduce la cantidad o elige otra mesa.`
            );
            return;
        }

        try {
            const [h, m] = horaReserva.split(":");
            const dt = new Date(fechaReserva);
            dt.setHours(parseInt(h), parseInt(m), 0, 0);
            const gtOffset = dt.getTime() + 6 * 60 * 60 * 1000;
            const isoStr = new Date(gtOffset).toISOString().replace("Z", "-06:00");

            await saveReservation(
                { ...data, reservationDate: isoStr, id_sucursal: idSucursal },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
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
                        {selectedRestId && selectedRestaurantObj ? (
                            <button type="button" disabled={isEditing} onClick={() => !isEditing && setRestPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#E67E22] bg-[#E67E22]/5 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-[#E67E22]/10" : "cursor-not-allowed opacity-60"}`}>
                                <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                                    <Store size={12} className="text-[#E67E22]" />
                                </div>
                                <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedRestaurantObj.nombre}</span>
                                {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                            </button>
                        ) : (
                            <button type="button" onClick={() => setRestPickerOpen(true)} className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm transition-colors ${errors.restaurantId ? "border-red-400 bg-red-50" : "border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0]"}`}>
                                <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                    <Store size={14} className="text-[#6B6B6B]" />
                                </div>
                                <span className="text-[#6B6B6B]">Seleccionar restaurante...</span>
                            </button>
                        )}
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                        {errors.restaurantId && <span className="text-red-500 text-xs mt-1 block">{errors.restaurantId.message}</span>}

                        {/* Sucursal */}
                        {tieneSucursales && sucursales.length > 0 && (
                            <div className="mt-3">
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Sucursal</label>
                                {selectedSucId && selectedSucursalObj ? (
                                    <button type="button" disabled={isEditing} onClick={() => !isEditing && setSucPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#A9C7E8] bg-blue-50 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-blue-100" : "cursor-not-allowed opacity-60"}`}>
                                        <div className="w-6 h-6 rounded-lg bg-[#A9C7E8]/30 flex items-center justify-center shrink-0">
                                            <MapPin size={12} className="text-blue-700" />
                                        </div>
                                        <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedSucursalObj.nombre}</span>
                                        {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setSucPickerOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 border border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0] rounded-xl text-sm transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                            <MapPin size={14} className="text-[#6B6B6B]" />
                                        </div>
                                        <span className="text-[#6B6B6B]">Seleccionar sucursal...</span>
                                    </button>
                                )}
                                {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">La sucursal no puede modificarse</p>}
                            </div>
                        )}
                    </div>

                    {/* Mesa */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Mesa *</label>
                        <select
                            disabled={!restaurantId || !fechaReserva || !horaReserva}
                            className={`${inputClass("tableId")} ${!restaurantId || !fechaReserva || !horaReserva ? "opacity-50 cursor-not-allowed" : ""}`}
                            {...register("tableId", { required: "Selecciona una mesa" })}
                        >
                            <option value="">
                                {!restaurantId
                                    ? "Primero selecciona un restaurante"
                                    : !fechaReserva || !horaReserva
                                        ? "Selecciona fecha y hora primero"
                                        : mesasDisponibles.length === 0
                                            ? "Sin mesas disponibles"
                                            : "Seleccionar mesa..."}
                            </option>
                            {mesasDisponibles.map((m) => (
                                <option key={m._id} value={m._id}>
                                    Mesa {m.numero} — {m.ubicacion} · cap. {m.capacidad} · Disponible
                                </option>
                            ))}
                            {mesasOcupadas.length > 0 && (
                                <optgroup label="Ocupadas">
                                    {mesasOcupadas.map((m) => (
                                        <option key={m._id} value={m._id} disabled>
                                            Mesa {m.numero} — Ocupada
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                        {errors.tableId && <span className="text-red-500 text-xs mt-1 block">{errors.tableId.message}</span>}

                        {/* Resumen de disponibilidad */}
                        {tableAvailability && fechaReserva && horaReserva && (
                            <div className={`flex items-center gap-1.5 mt-1.5 rounded-lg px-3 py-2 ${tableAvailability.disponibles === 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                                <p className={`text-[11px] ${tableAvailability.disponibles === 0 ? "text-red-700" : "text-green-700"}`}>
                                    {tableAvailability.disponibles === 0
                                        ? "No hay mesas disponibles para esta fecha y hora"
                                        : `${tableAvailability.disponibles} de ${tableAvailability.total} mesa(s) disponible(s)`}
                                    {mesasOcupadas.length > 0 && ` · ${mesasOcupadas.length} ocupada(s)`}
                                </p>
                            </div>
                        )}

                        {/* Aviso de mesas en mantenimiento */}
                        {mesasEnMantenimiento.length > 0 && restaurantId && (
                            <div className="flex items-start gap-1.5 mt-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-amber-700">
                                    {mesasEnMantenimiento.length === 1
                                        ? `La mesa #${mesasEnMantenimiento[0].numero} está en mantenimiento.`
                                        : `${mesasEnMantenimiento.length} mesas en mantenimiento.`}
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
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Fecha *</label>
                            <DatePicker
                                value={fechaReserva}
                                onChange={setFechaReserva}
                                placeholder="Seleccionar fecha"
                            />
                            {fechaReserva && (
                                <p className="text-[10px] text-[#E67E22] mt-1 font-semibold">
                                    {format(fechaReserva, "EEE d MMM, yyyy", { locale: es })}
                                </p>
                            )}
                            <p className="text-[10px] text-[#6B6B6B] mt-1">La mesa se bloquea ±2h alrededor de esta hora</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Hora *</label>
                            <TimePicker
                                value={horaReserva}
                                onChange={setHoraReserva}
                                placeholder="Seleccionar hora"
                                selectedDate={fechaReserva}
                                openingTime={openingTimeAdmin}
                                closingTime={closingTimeAdmin}
                            />
                        </div>
                    </div>

                    {/* Personas */}
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

                        {excedCapacidad && (
                            <div className="flex items-center gap-1 mt-1">
                                <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                                <span className="text-[11px] text-amber-700">
                                    Excede la capacidad de la mesa ({mesaSeleccionada.capacidad} máx.)
                                </span>
                            </div>
                        )}
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

            <RestaurantPickerModal
                isOpen={restPickerOpen}
                onClose={() => setRestPickerOpen(false)}
                onSelect={handleRestaurantPick}
                selectedId={selectedRestId}
            />
            <SucursalPickerModal
                isOpen={sucPickerOpen}
                onClose={() => setSucPickerOpen(false)}
                onSelect={handleSucursalPick}
                sucursales={selectedRestaurantObj?.sucursales ?? []}
                selectedId={selectedSucId}
            />
        </div>
    );
};