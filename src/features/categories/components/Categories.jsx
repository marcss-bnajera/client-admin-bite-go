import { useState } from "react";
import { Plus, Search, Pencil, TagIcon, Store, Filter, Tags } from "lucide-react";
import { CategoryModal } from "./CategoryModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

const categorias = [
    { _id: "cat_001", nombre: "Combos Especiales", descripcion: "Combos del día con bebida incluida", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, activo: true },
    { _id: "cat_002", nombre: "Menú Ejecutivo", descripcion: "Platos rápidos para el almuerzo de trabajo", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, activo: true },
    { _id: "cat_003", nombre: "Desayunos", descripcion: "Opciones de desayuno hasta las 11am", id_restaurante: { _id: "rest_003", nombre: "Bite Sur" }, activo: true },
    { _id: "cat_004", nombre: "Para Compartir", descripcion: "Porciones grandes para grupos", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, activo: false },
    { _id: "cat_005", nombre: "Vegano & Saludable", descripcion: "Opciones plant-based y bajas en calorías", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, activo: true },
];

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

const LIMIT = 10;

export const Categories = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurante, setFilterRestaurante] = useState("");
    const [filterActivo, setFilterActivo] = useState("activo");
    const [page, setPage] = useState(1);

    const filtered = categorias.filter((c) => {
        const matchSearch =
            c.nombre.toLowerCase().includes(search.toLowerCase()) ||
            c.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase());
        const matchRestaurante = filterRestaurante ? c.id_restaurante._id === filterRestaurante : true;
        const matchActivo =
            filterActivo === "activo" ? c.activo :
                filterActivo === "inactivo" ? !c.activo : true;
        return matchSearch && matchRestaurante && matchActivo;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedCategory(null); setModalOpen(true); };
    const handleEdit = (cat) => { setSelectedCategory(cat); setModalOpen(true); };

    const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };
    const handleRestauranteChange = (e) => { setFilterRestaurante(e.target.value); setPage(1); };
    const handleActivoChange = (e) => { setFilterActivo(e.target.value); setPage(1); };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Categorías</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Clasificación de productos por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nueva Categoría
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
                        placeholder="Buscar categoría o restaurante..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                    <select
                        value={filterRestaurante}
                        onChange={handleRestauranteChange}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos los restaurantes</option>
                        {restaurantes.map(r => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <select
                        value={filterActivo}
                        onChange={handleActivoChange}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todas</option>
                        <option value="activo">Activas</option>
                        <option value="inactivo">Inactivas</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[540px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Categoría</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide hidden md:table-cell">Descripción</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Estado</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-[#6B6B6B] text-sm">
                                    No se encontraron categorías
                                </td>
                            </tr>
                        ) : paginated.map((cat, index) => (
                            <tr
                                key={cat._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                                            <Tags size={13} className="text-[#E67E22]" />
                                        </div>
                                        <span className="font-semibold text-[#2B2B2B]">{cat.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B] max-w-xs hidden md:table-cell">
                                    <span className="line-clamp-1">{cat.descripcion || "—"}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Store size={13} className="shrink-0" />
                                        {cat.id_restaurante.nombre}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cat.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                        {cat.activo ? "Activa" : "Inactiva"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                            title={cat.activo ? "Desactivar categoría" : "Categoría ya inactiva"}
                                            disabled={!cat.activo}
                                        >
                                            <TagIcon size={15} className={!cat.activo ? "opacity-30" : ""} />
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

            <CategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={selectedCategory} />
        </div>
    );
};