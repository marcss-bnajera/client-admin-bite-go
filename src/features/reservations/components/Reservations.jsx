import { useState } from "react";
import { Plus, Search, Pencil, PowerOff, User, CalendarDays, Filter, Store, Users } from "lucide-react";
import { ReservationModal } from "./ReservationModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useReservations } from "../hooks/useReservations";
import { useReservationsStore } from "../store/reservationsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const statusColor = {
    Confirmed: "bg-[#A9C7E8] text-blue-900",
    Attended: "bg-[#A8D5BA] text-green-900",
    Cancelled: "bg-[#E6A5A5] text-red-900",
};

const statusLabel = {
    Confirmed: "Confirmada",
    Attended: "Atendida",
    Cancelled: "Cancelada",
};

const LIMIT = 6;

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("es-GT", {
        timeZone: "America/Guatemala",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

export const Reservations = () => {
    const { reservations, loading, getReservations } = useReservations();
    const { deleteReservation } = useReservationsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);

    const filtered = (reservations ?? []).filter((r) => {
        const matchSearch =
            r.userId?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            r.restaurantId?.nombre?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus ? r.status === filterStatus : true;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedReservation(null); setModalOpen(true); };
    const handleEdit = (r) => { setSelectedReservation(r); setModalOpen(true); };

    const handleCancel = (r) => {
        showConfirmToast({
            title: "Cancelar reservación",
            message: `¿Cancelar la reservación de ${r.userId?.nombre ?? "este cliente"}?`,
            type: "deactivate",
            onConfirm: async () => {
                await deleteReservation(r._id);
            },
        });
    };

    const selectClass = "outline-none text-sm bg-transparent text-[#6B6B6B] cursor-pointer";

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Reservaciones</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestión de reservas de mesas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto shrink-0"
                >
                    <Plus size={16} /> Nueva Reservación
                </button>
            </div>

            {/* FILTROS (Compactos y alineados a la izquierda) */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center pb-4 border-b border-[#E8D8C3]">
                {/* Input de Búsqueda */}
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 sm:h-10 w-full sm:w-auto sm:flex-1 sm:max-w-xs shadow-sm focus-within:border-[#E67E22] transition-colors">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por cliente o restaurante..."
                    />
                </div>

                {/* Contenedor de Select para mantener consistencia en celulares */}
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    {/* Filtro por Estado */}
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 sm:h-10 shadow-sm flex-1 sm:flex-none focus-within:border-[#E67E22] transition-colors">
                        <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                            className={`${selectClass} w-full cursor-pointer`}
                        >
                            <option value="">Todos los estados</option>
                            <option value="Confirmed">Confirmada</option>
                            <option value="Attended">Atendida</option>
                            <option value="Cancelled">Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* VISTA EN TARJETAS PARA CELULARES Y IPAD (Móvil hasta lg:hidden) */}
            <div className="block lg:hidden space-y-3">
                {loading ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">Cargando reservaciones...</div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">No se encontraron reservaciones</div>
                ) : paginated.map((r) => (
                    <div
                        key={r._id}
                        className={`bg-white rounded-2xl p-4 border border-[#E8D8C3] shadow-sm space-y-3 transition-colors ${r.status === "Cancelled" ? "opacity-60" : ""}`}
                    >
                        {/* Fila Superior: Info Cliente y Estado */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                    <User size={12} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[#2B2B2B] font-bold truncate text-sm">{r.userId?.nombre || "—"}</p>
                                    <p className="text-xs text-[#6B6B6B] truncate">{r.userId?.email || "—"}</p>
                                </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${statusColor[r.status] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                {statusLabel[r.status] ?? r.status}
                            </span>
                        </div>

                        {/* Detalles Intermedios */}
                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E8D8C3]/60 py-2.5">
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Restaurante</p>
                                <div className="flex items-center gap-1 text-[#6B6B6B]">
                                    <Store size={12} className="shrink-0 text-[#A0A0A0]" />
                                    <span className="truncate">{r.restaurantId?.nombre || "—"}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Fecha &amp; Hora</p>
                                <div className="flex items-center gap-1 text-[#6B6B6B]">
                                    <CalendarDays size={12} className="shrink-0 text-[#A0A0A0]" />
                                    <span>{formatDate(r.reservationDate)}</span>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Cantidad de Personas</p>
                                <div className="flex items-center gap-1 text-[#2B2B2B] font-bold">
                                    <Users size={12} className="text-[#6B6B6B]" />
                                    <span>{r.peopleCount} <span className="font-normal text-[#6B6B6B] text-[11px]">personas</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Acciones Inferiores */}
                        <div className="flex items-center justify-end gap-1 pt-1">
                            <button
                                onClick={() => handleEdit(r)}
                                className="p-2 rounded-xl bg-[#F5EFE6] text-[#E67E22] transition-colors"
                                title="Editar"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={() => handleCancel(r)}
                                disabled={r.status === "Cancelled"}
                                className={`p-2 rounded-xl transition-colors ${r.status === "Cancelled" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-50 text-[#C0392B]"}`}
                                title="Cancelar reservación"
                            >
                                <PowerOff size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABLA TRADICIONAL PARA ESCRITORIO (Oculta hasta lg:block) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-hidden">
                <table className="w-full text-sm table-auto">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Cliente</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Fecha &amp; Hora</th>
                            <th className="text-center px-6 py-4 font-bold tracking-wide">Personas</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">Cargando reservaciones...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">No se encontraron reservaciones</td></tr>
                        ) : paginated.map((r, index) => (
                            <tr
                                key={r._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${r.status === "Cancelled" ? "opacity-60" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2B2B2B]">{r.userId?.nombre || "—"}</p>
                                            <p className="text-xs text-[#6B6B6B]">{r.userId?.email || "—"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B] whitespace-nowrap">{r.restaurantId?.nombre || "—"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <CalendarDays size={13} className="shrink-0" />
                                        {formatDate(r.reservationDate)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-[#2B2B2B] whitespace-nowrap">{r.peopleCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[r.status] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                        {statusLabel[r.status] ?? r.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(r)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar">
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleCancel(r)}
                                            disabled={r.status === "Cancelled"}
                                            className={`p-2 rounded-lg transition-colors ${r.status === "Cancelled" ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50 text-[#C0392B]"}`}
                                            title="Cancelar reservación"
                                        >
                                            <PowerOff size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="w-full py-1">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <ReservationModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedReservation(null); }}
                reservation={selectedReservation}
                onSaved={getReservations}
            />
        </div>
    );
};