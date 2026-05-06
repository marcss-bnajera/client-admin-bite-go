import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Pencil, ImageOff, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductModal } from "./ProductModal";
import { useProducts } from "../hooks/useProducts";
import { useProductsStore } from "../store/productsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const categoriaColor = {
    Entradas: { bg: "bg-[#EAD7A4]", text: "text-yellow-800" },
    Platos: { bg: "bg-[#A9C7E8]", text: "text-blue-900" },
    Bebidas: { bg: "bg-[#A8D5BA]", text: "text-green-900" },
    Postres: { bg: "bg-[#E6A5A5]", text: "text-red-900" },
    Otros: { bg: "bg-[#D6D6D6]", text: "text-gray-700" },
};

const PAGE_SIZE = 9;

export const Products = () => {
    const { products, loading, getProducts } = useProducts();
    const { deleteProduct, toggleProduct } = useProductsStore();
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [filterRest, setFilterRest] = useState("");
    const [filterEstado, setFilterEstado] = useState("activo");
    const [filterDisp, setFilterDisp] = useState("");

    useEffect(() => { getRestaurants(); }, []);

    const filtered = useMemo(() => {
        return (products ?? []).filter((p) => {
            const q = search.toLowerCase();
            if (q && !p.nombre.toLowerCase().includes(q) && !p.descripcion?.toLowerCase().includes(q)) return false;
            if (filterRest && (p.id_restaurante?._id || p.id_restaurante) !== filterRest) return false;
            if (filterEstado === "activo" && !p.activo) return false;
            if (filterEstado === "inactivo" && p.activo) return false;
            if (filterDisp === "si" && !p.disponibilidad) return false;
            if (filterDisp === "no" && p.disponibilidad) return false;
            return true;
        });
    }, [products, search, filterRest, filterEstado, filterDisp]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const byCategory = useMemo(() => {
        return paginated.reduce((acc, p) => {
            const cat = p.categoria?.nombre || "Otros";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
        }, {});
    }, [paginated]);

    const handleNew = () => { setSelectedProduct(null); setModalOpen(true); };
    const handleEdit = (p) => { setSelectedProduct(p); setModalOpen(true); };
    const handleFilter = (setter) => (e) => { setter(e.target.value); setPage(1); };

    const handleToggle = async (id) => {
        const product = (products ?? []).find(p => p._id === id);
        if (!product) return;
        try {
            if (product.activo) {
                await deleteProduct(id);
                showSuccess("Producto desactivado");
            } else {
                await toggleProduct(id, true); s
                showSuccess("Producto reactivado");
            }
        } catch {
            showError("Error al actualizar el producto");
        }
    };

    const handleToggleExecute = async () => {
        const product = (products ?? []).find(p => p._id === confirmId);
        if (!product) return;
        try {
            if (product.activo) {
                await deleteProduct(confirmId);
                showSuccess("Producto desactivado");
            } else {
                await toggleProduct(confirmId, true);
                showSuccess("Producto reactivado");
            }
        } catch {
            showError("Error al actualizar el producto");
        } finally {
            setConfirmId(null);
        }
    };

    const selectClass = "h-9 px-3 text-sm border border-[#E8D8C3] rounded-xl bg-white text-[#2B2B2B] outline-none focus:border-[#E67E22] transition-colors cursor-pointer";

    return (
        <div className="space-y-5">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Productos & Menú</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Catálogo visual por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-wrap gap-2 items-center pb-4 border-b border-[#E8D8C3]">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-9 flex-1 min-w-[160px] max-w-xs">
                    <Search size={14} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar producto..."
                    />
                </div>
                <select value={filterRest} onChange={handleFilter(setFilterRest)} className={selectClass}>
                    <option value="">Todos los restaurantes</option>
                    {restaurants.map((r) => (
                        <option key={r._id} value={r._id}>{r.nombre}</option>
                    ))}
                </select>
                <select value={filterEstado} onChange={handleFilter(setFilterEstado)} className={selectClass}>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                    <option value="">Todos</option>
                </select>
                <select value={filterDisp} onChange={handleFilter(setFilterDisp)} className={selectClass}>
                    <option value="">Disponibilidad</option>
                    <option value="si">Disponible</option>
                    <option value="no">No disponible</option>
                </select>
            </div>

            {/* CONTENIDO */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-[#6B6B6B] text-sm">
                    Cargando productos...
                </div>
            ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#6B6B6B]">
                    <ImageOff size={32} className="opacity-40" />
                    <p className="text-sm">No hay productos que mostrar</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(byCategory).map(([cat, prods]) => {
                        const colors = categoriaColor[cat] ?? categoriaColor.Otros;
                        return (
                            <div key={cat}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                                        {cat}
                                    </span>
                                    <div className="flex-1 h-px bg-[#E8D8C3]" />
                                    <span className="text-xs text-[#6B6B6B]">{prods.length} producto{prods.length !== 1 ? "s" : ""}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {prods.map((p) => (
                                        <ProductCard
                                            key={p._id}
                                            product={p}
                                            onEdit={handleEdit}
                                            onToggle={handleToggle}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6] disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-8 h-8 rounded-xl text-sm font-bold transition-colors
                                ${n === page ? "bg-[#C0392B] text-white" : "border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6]"}`}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-xl border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6] disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <span className="text-xs text-[#6B6B6B] ml-1">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
                </div>
            )}

            <ProductModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedProduct(null); }}
                product={selectedProduct}
                onSaved={getProducts}
            />
        </div>
    );
};

/* ── Card individual ── */
const ProductCard = ({ product: p, onEdit, onToggle }) => {
    const colors = categoriaColor[p.categoria?.nombre] ?? categoriaColor.Otros;

    return (
        <div className={`bg-white border border-[#E8D8C3] rounded-2xl overflow-hidden flex flex-col transition-opacity ${!p.activo ? "opacity-55" : ""}`}>

            {/* Imagen */}
            <div className="w-full aspect-video bg-[#F5EFE6] flex items-center justify-center overflow-hidden relative">
                {p.foto_url?.length > 0
                    ? <img src={p.foto_url[0]} alt={p.nombre} className="w-full h-full object-cover" />
                    : <ImageOff size={28} className="text-[#C8B89A]" />
                }
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold
                    ${p.disponibilidad ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                    {p.disponibilidad ? "Disponible" : "No disponible"}
                </span>
                {!p.activo && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2B2B2B]/70 text-white">
                        Inactivo
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col gap-1.5 flex-1">
                <p className="font-extrabold text-[#2B2B2B] text-sm leading-tight">{p.nombre}</p>
                {p.descripcion && (
                    <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2">{p.descripcion}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.receta?.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A8D5BA] text-green-900">
                            {p.receta.length} insumo{p.receta.length !== 1 ? "s" : ""}
                        </span>
                    )}
                    {p.variaciones?.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A9C7E8] text-blue-900">
                            {p.variaciones.length} variación{p.variaciones.length !== 1 ? "es" : ""}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#E8D8C3]">
                <div>
                    <p className="text-base font-extrabold text-[#C0392B]">Q{p.precio.toFixed(2)}</p>
                    <p className="text-[10px] text-[#6B6B6B]">{p.id_restaurante?.nombre || "—"}</p>
                </div>
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onEdit(p)}
                        className="p-2 rounded-xl border border-[#E8D8C3] text-[#E67E22] hover:bg-[#FDF6EE] hover:border-[#FAC775] transition-colors"
                        title="Editar"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onToggle(p._id)}
                        className={`p-2 rounded-xl border transition-colors
                            ${p.activo
                                ? "border-[#E8D8C3] text-[#C0392B] hover:bg-red-50 hover:border-[#F09595]"
                                : "border-[#E8D8C3] text-[#0F6E56] hover:bg-[#E1F5EE] hover:border-[#5DCAA5]"
                            }`}
                        title={p.activo ? "Desactivar" : "Reactivar"}
                    >
                        {p.activo ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};