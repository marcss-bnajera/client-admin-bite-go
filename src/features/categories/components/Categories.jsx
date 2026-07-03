import { useState } from "react";
import { Plus, Pencil, TagIcon, Store, Tags, FileText } from "lucide-react";
import { CategoryModal } from "./CategoryModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useCategories } from "../hooks/useCategories";
import { useCategoriesStore } from "../store/categoriesStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const LIMIT = 10;

export const Categories = () => {
    const { categories, loading, getCategories } = useCategories();
    const { deleteCategory, activateCategory } = useCategoriesStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurante, setFilterRestaurante] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [page, setPage] = useState(1);

    const filtered = (categories ?? []).filter((c) => {
        const matchSearch =
            c.nombre.toLowerCase().includes(search.toLowerCase()) ||
            c.id_restaurante?.nombre?.toLowerCase().includes(search.toLowerCase());
        const matchRestaurante = filterRestaurante ? c.id_restaurante?._id === filterRestaurante : true;
        const matchActivo =
            filterActivo === "activo" ? c.activo :
                filterActivo === "inactivo" ? !c.activo : true;
        return matchSearch && matchRestaurante && matchActivo;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedCategory(null); setModalOpen(true); };
    const handleEdit = (cat) => { setSelectedCategory(cat); setModalOpen(true); };

    const handleToggleActivo = (cat) => {
        if (cat.activo) {
            showConfirmToast({
                title: "Desactivar categoría",
                message: `¿Desactivar "${cat.nombre}"?`,
                type: "deactivate",
                onConfirm: async () => {
                    await deleteCategory(cat._id);
                    getCategories();
                },
            });
        } else {
            showConfirmToast({
                title: "Reactivar categoría",
                message: `¿Reactivar "${cat.nombre}"?`,
                type: "activate",
                onConfirm: async () => {
                    await activateCategory(cat._id);
                    getCategories();
                },
            });
        }
    };

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Categorías</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Clasificación de productos por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto shrink-0"
                >
                    <Plus size={16} /> Nueva Categoría
                </button>
            </div>

            {/* FILTROS */}
            <RestaurantFilterBar
                filterRestaurant={filterRestaurante}
                onRestaurantChange={setFilterRestaurante}
                showSucursal={false}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar categoría o restaurante..."
                filterActivo={filterActivo}
                onActivoChange={setFilterActivo}
                showActiveFilter
                onPageReset={setPage}
                showEmptyState={false}
            />

            {/* VISTA EN TARJETAS PARA DISPOSITIVOS MÓVILES (Móvil hasta lg:hidden) */}
            <div className="block lg:hidden space-y-3">
                {loading ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">Cargando categorías...</div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8D8C3] text-center text-[#6B6B6B] text-sm font-medium">No se encontraron categorías</div>
                ) : paginated.map((cat) => (
                    <div
                        key={cat._id}
                        className={`bg-white rounded-2xl p-4 border border-[#E8D8C3] shadow-sm space-y-3 transition-colors ${!cat.activo ? "opacity-60" : ""}`}
                    >
                        {/* Cabecera de la Card: Nombre y Estado */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                                    <Tags size={14} className="text-[#E67E22]" />
                                </div>
                                <span className="font-bold text-[#2B2B2B] truncate text-sm">{cat.nombre}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${cat.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                {cat.activo ? "Activa" : "Inactiva"}
                            </span>
                        </div>

                        {/* Detalles de la Card */}
                        <div className="space-y-2 text-xs border-t border-b border-[#E8D8C3]/60 py-2.5">
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Restaurante</p>
                                <div className="flex items-center gap-1.5 text-[#6B6B6B]">
                                    <Store size={12} className="shrink-0 text-[#A0A0A0]" />
                                    <span className="truncate">{cat.id_restaurante?.nombre ?? "—"}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[#A0A0A0] font-medium mb-0.5">Descripción</p>
                                <div className="flex items-start gap-1.5 text-[#6B6B6B]">
                                    <FileText size={12} className="shrink-0 mt-0.5 text-[#A0A0A0]" />
                                    <p className="line-clamp-2 text-balance">{cat.descripcion || "Sin descripción disponible"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="p-2 rounded-xl bg-[#F5EFE6] text-[#E67E22] hover:bg-[#E8D8C3] transition-colors"
                                title="Editar"
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                onClick={() => handleToggleActivo(cat)}
                                className={`p-2 rounded-xl transition-colors ${cat.activo ? "bg-red-50 text-[#C0392B] hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                                title={cat.activo ? "Desactivar categoría" : "Activar categoría"}
                            >
                                <TagIcon size={15} className={!cat.activo ? "text-green-600" : ""} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* VISTA EN TABLA PARA PANTALLAS GRANDES (Oculta hasta lg:block) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-hidden">
                <table className="w-full text-sm table-auto">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Categoría</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Descripción</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-[#6B6B6B]">Cargando categorías...</td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">No se encontraron categorías</td></tr>
                        ) : paginated.map((cat, index) => (
                            <tr
                                key={cat._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${!cat.activo ? "opacity-60" : ""} ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                                            <Tags size={13} className="text-[#E67E22]" />
                                        </div>
                                        <span className="font-semibold text-[#2B2B2B]">{cat.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B] max-w-xs">
                                    <span className="line-clamp-1">{cat.descripcion || "—"}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Store size={13} className="shrink-0" />
                                        {cat.id_restaurante?.nombre ?? "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                        {cat.activo ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActivo(cat)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                            title={cat.activo ? "Desactivar categoría" : "Activar categoría"}
                                        >
                                            <TagIcon size={15} className={!cat.activo ? "text-green-600" : ""} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SECCIÓN DE PAGINACIÓN ADAPTATIVA */}
            <div className="w-full py-1">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <CategoryModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedCategory(null); }}
                category={selectedCategory}
                onSaved={() => getCategories()}
            />
        </div>
    );
};