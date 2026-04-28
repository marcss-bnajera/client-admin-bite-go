import { useState, useEffect } from "react";
import { Plus, Search, Pencil, PowerOff, User, CalendarDays, Filter } from "lucide-react";
import { ReservationModal } from "./ReservationModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useSearchParams } from "react-router-dom";

// active:false significa cancelada — el controller pone active:false + status:'Cancelled'
const reservaciones = [
    {
        _id: "res_001",
        userId: { _id: "user_001", nombre: "Juan Perez", email: "juan@gmail.com" },
        restaurantId: { _id: "rest_001", nombre: "Bite Central" },
        tableId: "mesa_001",
        reservationDate: "2026-04-21T19:00:00",
        peopleCount: 4,
        status: "Confirmed",
        active: true,
    },
    {
        _id: "res_002",
        userId: { _id: "user_002", nombre: "Maria Lopez", email: "maria@gmail.com" },
        restaurantId: { _id: "rest_002", nombre: "Bite Norte" },
        tableId: "mesa_003",
        reservationDate: "2026-04-22T13:00:00",
        peopleCount: 2,
        status: "Confirmed",
        active: true,
    },
    {
        _id: "res_003",
        userId: { _id: "user_003", nombre: "Carlos Ruiz", email: "carlos@gmail.com" },
        restaurantId: { _id: "rest_003", nombre: "Bite Sur" },
        tableId: "mesa_005",
        reservationDate: "2026-04-20T20:00:00",
        peopleCount: 6,
        status: "Attended",
        active: true,
    },
    {
        _id: "res_004",
        userId: { _id: "user_004", nombre: "Ana Torres", email: "ana@gmail.com" },
        restaurantId: { _id: "rest_001", nombre: "Bite Central" },
        tableId: "mesa_002",
        reservationDate: "2026-04-19T12:00:00",
        peopleCount: 3,
        status: "Cancelled",
        active: false, // deleteReservation puso active:false + status:Cancelled
    },
];

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

export const Reservations = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("action") === "new") {
            setModalOpen(true);
        }
    }, []);

    const filtered = reservaciones.filter((r) => {
        const matchSearch =
            r.userId.nombre.toLowerCase().includes(search.toLowerCase()) ||
            r.restaurantId.nombre.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus ? r.status === filterStatus : true;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedReservation(null); setModalOpen(true); };
    const handleEdit = (r) => { setSelectedReservation(r); setModalOpen(true); };

    // deleteReservation: active:false + status:Cancelled
    const handleCancel = (r) => {
        console.log(`DELETE /reservations/${r._id}`, { active: false, status: "Cancelled" });
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("es-GT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Reservaciones</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestion de reservas de mesas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nueva Reservacion
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 flex-1">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por cliente o restaurante..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Confirmed">Confirmada</option>
                        <option value="Attended">Atendida</option>
                        <option value="Cancelled">Cancelada</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Cliente</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Fecha & Hora</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Personas</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((r, index) => (
                            <tr
                                key={r._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={12} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#2B2B2B]">{r.userId.nombre}</p>
                                            <p className="text-xs text-[#6B6B6B]">{r.userId.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B]">{r.restaurantId.nombre}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <CalendarDays size={13} className="shrink-0" />
                                        {formatDate(r.reservationDate)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-[#2B2B2B]">{r.peopleCount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor[r.status]}`}>
                                        {statusLabel[r.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        {/* deleteReservation: active:false + status:Cancelled — no elimina */}
                                        <button
                                            onClick={() => handleCancel(r)}
                                            disabled={r.status === "Cancelled"}
                                            className={`p-2 rounded-lg transition-colors ${r.status === "Cancelled" ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50 text-[#C0392B]"}`}
                                            title="Cancelar reservacion"
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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            <ReservationModal
                key={selectedReservation?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                reservation={selectedReservation}
            />
        </div>
    );
};