import { useState } from "react";
import { Plus, Search, Pencil, Eye, EyeOff, Filter, UserCircle2 } from "lucide-react";
import { UserModal } from "./UserModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useUsers } from "../hooks/useUsers";
import { useUsersStore } from "../store/usersStore";

const rolColor = {
    SuperAdmin: "bg-[#E6A5A5] text-red-900",
    Admin_Restaurante: "bg-[#A9C7E8] text-blue-900",
    Mesero: "bg-[#EAD7A4] text-yellow-800",
    Repartidor: "bg-[#EAD7A4] text-yellow-900",
    Cocinero: "bg-[#A8D5BA] text-green-900",
    Cliente: "bg-[#D6D6D6] text-gray-700",
};

const roles = ["SuperAdmin", "Admin_Restaurante", "Mesero", "Repartidor", "Cocinero", "Cliente"];

const LIMIT = 10;

export const Users = () => {
    const { users, loading, getUsers } = useUsers();
    const { deleteUser, activateUser } = useUsersStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRol, setFilterRol] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [page, setPage] = useState(1);

    const filtered = (users ?? []).filter((u) => {
        if (!u) return false;
        const matchSearch =
            u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRol = filterRol ? u.rol === filterRol : true;
        return matchSearch && matchRol;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedUser(null); setModalOpen(true); };
    const handleEdit = (user) => { setSelectedUser(user); setModalOpen(true); };
    const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
    const handleRolChange = (e) => { setFilterRol(e.target.value); setPage(1); };

    const handleActivoChange = (e) => {
        const val = e.target.value;
        setFilterActivo(val);
        setPage(1);
        if (val === "activo") getUsers({ activo: true });
        else if (val === "inactivo") getUsers({ activo: false });
        else getUsers();
    };

    const handleToggleActivo = async (u) => {
        if (u.activo) await deleteUser(u._id);
        else await activateUser(u._id);
        if (filterActivo === "activo") getUsers({ activo: true });
        else if (filterActivo === "inactivo") getUsers({ activo: false });
        else getUsers();
    };

    const selectClass = "outline-none text-sm bg-transparent text-[#6B6B6B]";

    return (
        <div className="space-y-6">

            {/* HEADER */}
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

            {/* FILTROS */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-[#E8D8C3]">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9 flex-1 min-w-[160px] max-w-xs">
                    <Search size={14} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={handleSearchChange}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por nombre o correo..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <Filter size={14} className="text-[#6B6B6B] shrink-0" />
                    <select value={filterRol} onChange={handleRolChange} className={selectClass}>
                        <option value="">Todos los roles</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9">
                    <select value={filterActivo} onChange={handleActivoChange} className={selectClass}>
                        <option value="">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* TABLA */}
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
                        {loading ? (
                            <tr><td colSpan={9} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">Cargando usuarios...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={9} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">No se encontraron usuarios</td></tr>
                        ) : paginated.map((u, index) => (
                            <tr
                                key={u._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                            <UserCircle2 size={16} className="text-white" />
                                        </div>
                                        <span className="font-semibold text-[#2B2B2B]">{u.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B]">{u.email}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden md:table-cell">{u.telefono || "—"}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden xl:table-cell">{u.direccion || "—"}</td>
                                <td className="px-6 py-4 text-[#6B6B6B] hidden md:table-cell">{u.dpi || "—"}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${rolColor[u.rol] ?? "bg-[#D6D6D6] text-gray-700"}`}>
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
                                            onClick={() => handleToggleActivo(u)}
                                            className={`p-2 rounded-lg transition-colors
                                                ${u.activo
                                                    ? "hover:bg-red-50 text-[#C0392B]"
                                                    : "hover:bg-[#E1F5EE] text-[#0F6E56]"
                                                }`}
                                            title={u.activo ? "Desactivar usuario" : "Activar usuario"}
                                        >
                                            {u.activo ? <EyeOff size={15} /> : <Eye size={15} />}
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
                totalPages={totalPages || 1}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            <UserModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedUser(null); }}
                user={selectedUser}
                onSaved={getUsers}
            />
        </div>
    );
};