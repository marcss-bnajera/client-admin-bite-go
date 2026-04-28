import { useState } from "react";
import { Plus, Search, Pencil, UserX, User, Shield, Filter } from "lucide-react";
import { UserModal } from "./UserModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

const usuarios = [
    { _id: "u_001", nombre: "Carlos Admin", email: "carlos@biteandgo.com", telefono: "5555-0001", dpi: "1234567890101", direccion: "Zona 1, Guatemala", rol: "Admin_Plataforma", id_restaurante: null, activo: true },
    { _id: "u_002", nombre: "María Resto", email: "maria@biteandgo.com", telefono: "5555-0002", dpi: "1234567890102", direccion: "Zona 10, Guatemala", rol: "Admin_Restaurante", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, activo: true },
    { _id: "u_003", nombre: "Pedro Mesero", email: "pedro@biteandgo.com", telefono: "5555-0003", dpi: "1234567890103", direccion: "Zona 5, Guatemala", rol: "Mesero", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, activo: true },
    { _id: "u_004", nombre: "Luis Reparto", email: "luis@biteandgo.com", telefono: "5555-0004", dpi: "1234567890104", direccion: "Zona 12, Guatemala", rol: "Repartidor", id_restaurante: { _id: "rest_003", nombre: "Bite Sur" }, activo: false },
    { _id: "u_005", nombre: "Ana Cocina", email: "ana@biteandgo.com", telefono: "5555-0005", dpi: "1234567890105", direccion: "Zona 7, Guatemala", rol: "Cocinero", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, activo: true },
    { _id: "u_006", nombre: "Juan Cliente", email: "juan@gmail.com", telefono: "5555-0006", dpi: "1234567890106", direccion: "Zona 15, Guatemala", rol: "Cliente", id_restaurante: null, activo: true },
];

const rolColor = {
    Admin_Plataforma: "bg-[#E6A5A5] text-red-900",
    Admin_Restaurante: "bg-[#A9C7E8] text-blue-900",
    Mesero: "bg-[#EAD7A4] text-yellow-800",
    Repartidor: "bg-[#EAD7A4] text-yellow-900",
    Cocinero: "bg-[#A8D5BA] text-green-900",
    Cliente: "bg-[#D6D6D6] text-gray-700",
};

const roles = ["Admin_Plataforma", "Admin_Restaurante", "Mesero", "Repartidor", "Cocinero", "Cliente"];

const LIMIT = 10;

export const Users = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRol, setFilterRol] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo"); // "activo" | "inactivo" | ""
    const [page, setPage] = useState(1);

    const filtered = usuarios.filter((u) => {
        const matchSearch =
            u.nombre.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchRol = filterRol ? u.rol === filterRol : true;
        const matchActivo =
            filterActivo === "activo" ? u.activo :
                filterActivo === "inactivo" ? !u.activo : true;
        return matchSearch && matchRol && matchActivo;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedUser(null); setModalOpen(true); };
    const handleEdit = (user) => { setSelectedUser(user); setModalOpen(true); };

    const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
    const handleRolChange = (e) => { setFilterRol(e.target.value); setPage(1); };
    const handleActivoChange = (e) => { setFilterActivo(e.target.value); setPage(1); };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Usuarios</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestión de usuarios y roles del sistema</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Usuario
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 flex-1">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={handleSearchChange}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por nombre o correo..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                    <select
                        value={filterRol}
                        onChange={handleRolChange}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos los roles</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <select
                        value={filterActivo}
                        onChange={handleActivoChange}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Usuario</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Correo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide hidden md:table-cell">Teléfono</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide hidden xl:table-cell">Dirección</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide hidden md:table-cell">DPI</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Rol</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide hidden lg:table-cell">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        ) : paginated.map((u, index) => (
                            <tr
                                key={u._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <User size={13} className="text-white" />
                                        </div>
                                        <span className="font-semibold text-[#2B2B2B]">{u.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B]">{u.email}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden md:table-cell">{u.telefono || "—"}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden xl:table-cell">{u.direccion || "—"}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden md:table-cell">{u.dpi || "—"}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${rolColor[u.rol]}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden lg:table-cell">
                                    {u.id_restaurante?.nombre || "—"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                        {u.activo ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                            title={u.activo ? "Desactivar usuario" : "Usuario ya inactivo"}
                                            disabled={!u.activo}
                                        >
                                            <UserX size={15} className={!u.activo ? "opacity-30" : ""} />
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

            <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} user={selectedUser} />
        </div>
    );
};