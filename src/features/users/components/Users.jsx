import { useState } from "react";
import { Plus, Pencil, Eye, EyeOff, UserCircle2, Store, Phone, Mail, MapPin } from "lucide-react";
import { UserModal } from "./UserModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useUsers } from "../hooks/useUsers";
import { useUsersStore } from "../store/usersStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

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

const getDireccion = (u) => {
    if (u.direccion) return u.direccion;
    const pred = u.direcciones?.find(d => d.predeterminada);
    if (pred) return pred.direccion;
    return u.direcciones?.[0]?.direccion || "";
};

export const Users = () => {
    const { users, loading, getUsers } = useUsers();
    const { deleteUser, activateUser } = useUsersStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [filterRol, setFilterRol] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [page, setPage] = useState(1);

    const filtered = (users ?? []).filter((u) => {
        if (!u) return false;
        const matchSearch =
            u.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRestaurant = filterRestaurant ? (u.id_restaurante?._id || u.id_restaurante) === filterRestaurant : true;
        const matchRol = filterRol ? u.rol === filterRol : true;
        return matchSearch && matchRestaurant && matchRol;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedUser(null); setModalOpen(true); };
    const handleEdit = (user) => { setSelectedUser(user); setModalOpen(true); };

    const handleToggleActivo = (u) => {
        if (u.activo) {
            showConfirmToast({
                title: "Desactivar usuario",
                message: `¿Desactivar a ${u.nombre}?`,
                type: "deactivate",
                onConfirm: async () => {
                    await deleteUser(u._id);
                    if (filterActivo === "activo") getUsers({ activo: true });
                    else if (filterActivo === "inactivo") getUsers({ activo: false });
                    else getUsers();
                },
            });
        } else {
            showConfirmToast({
                title: "Reactivar usuario",
                message: `¿Reactivar a ${u.nombre}?`,
                type: "activate",
                onConfirm: async () => {
                    await activateUser(u._id);
                    if (filterActivo === "activo") getUsers({ activo: true });
                    else if (filterActivo === "inactivo") getUsers({ activo: false });
                    else getUsers();
                },
            });
        }
    };

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0">

            {/* HEADER (Tu original intacto) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Usuarios</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Gestión de usuarios y roles del sistema</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all duration-300 active:scale-95 self-start sm:self-auto shrink-0"
                >
                    <Plus size={16} /> Nuevo Usuario
                </button>
            </div>

            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                showSucursal={false}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar por nombre o correo..."
                filterActivo={filterActivo}
                onActivoChange={setFilterActivo}
                showActiveFilter
                onPageReset={setPage}
                showEmptyState={false}
                extraFilters={
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-10 w-full sm:w-[180px] focus-within:border-[#E67E22] transition-colors">
                        <select
                            value={filterRol}
                            onChange={(e) => { setFilterRol(e.target.value); setPage(1); }}
                            className="outline-none text-sm bg-transparent text-[#6B6B6B] w-full cursor-pointer"
                        >
                            <option value="">Todos los roles</option>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                }
            />

            {/* VISTA EN TARJETAS PARA DISPOSITIVOS MÓVILES (Tu versión original que está de 10) */}
            <div className="block lg:hidden space-y-3 transition-all duration-300">
                {loading ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-semibold">Cargando usuarios...</div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm">No se encontraron usuarios</div>
                ) : paginated.map((u) => (
                    <div
                        key={u._id}
                        className={`bg-white rounded-2xl p-4 border border-[#E8D8C3] shadow-sm space-y-3 transition-all duration-300 ${!u.activo ? "opacity-60" : ""}`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0 shadow-sm">
                                    <UserCircle2 size={16} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-[#2B2B2B] text-sm truncate">{u.nombre}</p>
                                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${rolColor[u.rol] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                        {u.rol}
                                    </span>
                                </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 shadow-sm ${u.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                {u.activo ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-b border-[#E8D8C3]/60 py-2.5">
                            <div className="flex items-center gap-1.5 text-[#6B6B6B] min-w-0"><Mail size={13} className="text-[#A0A0A0] shrink-0" /><span className="truncate">{u.email}</span></div>
                            <div className="flex items-center gap-1.5 text-[#6B6B6B] min-w-0"><Phone size={13} className="text-[#A0A0A0] shrink-0" /><span className="truncate">{u.telefono || "—"}</span></div>
                            <div className="flex items-center gap-1.5 text-[#6B6B6B] min-w-0 sm:col-span-2"><MapPin size={13} className="text-[#A0A0A0] shrink-0" /><span className="truncate">{getDireccion(u) || "—"}</span></div>
                            <div className="flex items-center gap-1.5 text-[#6B6B6B] min-w-0"><Store size={13} className="text-[#A0A0A0] shrink-0" /><span className="truncate">{u.id_restaurante?.nombre || "—"}</span></div>
                        </div>

                        <div className="flex items-center justify-end gap-1 pt-0.5">
                            <button onClick={() => handleEdit(u)} className="p-2 rounded-xl bg-[#F5EFE6] hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-90" title="Editar">
                                <Pencil size={15} />
                            </button>
                            <button onClick={() => handleToggleActivo(u)} className={`p-2 rounded-xl transition-colors active:scale-90 ${u.activo ? "bg-red-50 text-[#C0392B] hover:bg-red-100" : "bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#cbeee2]"}`}>{u.activo ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* TABLA DE ESCRITORIO CON EQUILIBRIO PERFECTO */}
            {/* Decoramos la barra: scrollbar-thin (fina), scrollbar-thumb (el color del agarre), scrollbar-track (el fondo) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-hidden w-full">
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#3A2E2A]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#3A2E2A]/60 transition-colors duration-300">
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-[#3A2E2A] text-white">
                            <tr>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Usuario</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Correo</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Teléfono</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Dirección</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Rol</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide hidden lg:table-cell">Restaurante</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                                <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="px-6 py-10 text-center text-[#6B6B6B] font-semibold">Cargando usuarios...</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-10 text-center text-[#6B6B6B]">No se encontraron usuarios</td></tr>
                            ) : paginated.map((u, index) => (
                                <tr
                                    key={u._id}
                                    className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${!u.activo ? "opacity-60" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#3A2E2A] flex items-center justify-center shrink-0 shadow-sm">
                                                <UserCircle2 size={16} className="text-white" />
                                            </div>
                                            <span className="font-semibold text-[#2B2B2B]">{u.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[#6B6B6B] whitespace-nowrap">{u.email}</td>
                                    <td className="px-6 py-4 text-[#6B6B6B] whitespace-nowrap">{u.telefono || "—"}</td>
                                    <td className="px-6 py-4 text-[#6B6B6B] max-w-xs truncate" title={getDireccion(u) || "—"}>{getDireccion(u) || "—"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm inline-block text-center min-w-[110px] ${rolColor[u.rol] ?? "bg-[#D6D6D6] text-gray-700"}`}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#6B6B6B] hidden lg:table-cell whitespace-nowrap">{u.id_restaurante?.nombre || "—"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block text-center min-w-[80px] ${u.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                            {u.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(u)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-90" title="Editar">
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActivo(u)}
                                                className={`p-2 rounded-lg transition-colors active:scale-90 ${u.activo ? "hover:bg-red-50 text-[#C0392B]" : "hover:bg-[#E1F5EE] text-[#0F6E56]"}`}
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
            </div>

            {/* CONTROL DE PAGINACIÓN */}
            <div className="w-full py-1">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <UserModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedUser(null); }}
                user={selectedUser}
                onSaved={getUsers}
            />
        </div>
    );
};