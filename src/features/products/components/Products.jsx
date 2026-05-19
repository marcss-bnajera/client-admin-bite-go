import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Pencil, ImageOff, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductModal } from "./ProductModal";
import { useProducts } from "../hooks/useProducts";
import { useProductsStore } from "../store/productsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

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
    const { deleteProduct, activateProduct } = useProductsStore();
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

    const handleToggle = (p) => {
        if (p.activo) {
            showConfirmToast({
                title: "Desactivar producto",
                message: `¿Desactivar "${p.nombre}"?`,
                type: "deactivate",
                onConfirm: () => deleteProduct(p._id),
            });
        } else {
            showConfirmToast({
                title: "Reactivar producto",
                message: `¿Reactivar "${p.nombre}"?`,
                type: "activate",
                onConfirm: () => activateProduct(p._id),
            });
        }
    };

    // Estilos optimizados: Quitamos el truncado forzoso y permitimos flexibilidad controlada
    const selectClass = "h-11 lg:h-10 px-3 text-xs sm:text-sm border border-[#E8D8C3] rounded-xl bg-white text-[#2B2B2B] outline-none focus:border-[#E67E22] transition-colors cursor-pointer w-full bg-no-repeat pr-8";

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0 overflow-x-hidden">

            {/* HEADER RESPONSIVO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#E8D8C3] sm:border-0 shadow-sm sm:shadow-none">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Productos & Menú</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Catálogo visual por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors w-full sm:w-auto active:scale-98 shrink-0"
                >
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            {/* TOOLBAR */}
            <div className="flex flex-col gap-2 pb-4 border-b border-[#E8D8C3] w-full transition-all duration-500 ease-in-out">

                {/* FILA PRINCIPAL*/}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full transition-all duration-500 ease-in-out">

                    {/* Buscador*/}
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-11 lg:h-10 w-full sm:max-w-xs shadow-sm focus-within:border-[#E67E22] transition-colors shrink-0">
                        <Search size={16} className="text-[#6B6B6B] shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                            placeholder="Buscar producto..."
                        />
                    </div>

                    <div className="hidden lg:flex lg:items-center gap-2 transition-all duration-500">
                        <div className="w-[200px] shrink-0">
                            <select value={filterRest} onChange={handleFilter(setFilterRest)} className={selectClass}>
                                <option value="">Todos los restaurantes</option>
                                {restaurants.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-[110px] shrink-0">
                            <select value={filterEstado} onChange={handleFilter(setFilterEstado)} className={selectClass}>
                                <option value="activo">Activos</option>
                                <option value="inactivo">Inactivos</option>
                                <option value="">Todos</option>
                            </select>
                        </div>
                        <div className="w-[140px] shrink-0">
                            <select value={filterDisp} onChange={handleFilter(setFilterDisp)} className={selectClass}>
                                <option value="">Disponibilidad</option>
                                <option value="si">Disponible</option>
                                <option value="no">No disponible</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* FILA SECUNDARIA*/}
                <div className="flex flex-col xs:flex-row gap-2 w-full lg:hidden transition-all duration-500 ease-in-out transform origin-top">

                    {/* Selector de Restaurantes completo en iPad */}
                    <div className="w-full xs:w-[200px] shrink-0 transition-all duration-300">
                        <select value={filterRest} onChange={handleFilter(setFilterRest)} className={selectClass}>
                            <option value="">Todos los restaurantes</option>
                            {restaurants.map((r) => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selectores Secundarios juntos en iPad */}
                    <div className="grid grid-cols-2 xs:flex xs:flex-row gap-2 w-full xs:w-auto shrink-0 transition-all duration-300">
                        <div className="w-full xs:w-[110px] shrink-0">
                            <select value={filterEstado} onChange={handleFilter(setFilterEstado)} className={selectClass}>
                                <option value="activo">Activos</option>
                                <option value="inactivo">Inactivos</option>
                                <option value="">Todos</option>
                            </select>
                        </div>

                        <div className="w-full xs:w-[140px] shrink-0">
                            <select value={filterDisp} onChange={handleFilter(setFilterDisp)} className={selectClass}>
                                <option value="">Disponibilidad</option>
                                <option value="si">Disponible</option>
                                <option value="no">No disponible</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>

            {/* CONTENIDO PRINCIPAL */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-[#6B6B6B] text-sm font-medium">Cargando productos...</div>
            ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-[#6B6B6B]">
                    <ImageOff size={32} className="opacity-40" />
                    <p className="text-sm font-medium">No hay productos que mostrar</p>
                </div>
            ) : (
                <div className="space-y-8 w-full">
                    {Object.entries(byCategory).map(([cat, prods]) => {
                        const colors = categoriaColor[cat] ?? categoriaColor.Otros;
                        return (
                            <div key={cat} className="min-w-0 w-full">
                                <div className="flex items-center gap-3 mb-4 w-full">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 shadow-sm ${colors.bg} ${colors.text}`}>{cat}</span>
                                    <div className="flex-1 h-px bg-[#E8D8C3]" />
                                    <span className="text-xs text-[#6B6B6B] font-medium shrink-0">{prods.length} producto{prods.length !== 1 ? "s" : ""}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                    {prods.map((p) => (
                                        <ProductCard key={p._id} product={p} onEdit={handleEdit} onToggle={handleToggle} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PAGINACIÓN ADAPTATIVA */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 w-full border-t border-[#E8D8C3]/40">
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6] disabled:opacity-30 transition-colors active:scale-95">
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-1 max-w-[200px] overflow-x-auto px-1 py-0.5 scrollbar-none">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 ${n === page ? "bg-[#C0392B] text-white shadow-sm" : "border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6]"}`}>{n}</button>
                            ))}
                        </div>

                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-xl border border-[#E8D8C3] text-[#6B6B6B] hover:bg-[#F5EFE6] disabled:opacity-30 transition-colors active:scale-95">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <span className="text-xs text-[#6B6B6B] font-medium w-full sm:w-auto text-center sm:ml-1 mt-1 sm:mt-0">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
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

const ProductCard = ({ product: p, onEdit, onToggle }) => {
    return (
        <div className={`bg-white border border-[#E8D8C3] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md min-w-0 w-full ${!p.activo ? "opacity-60 bg-gray-50/50" : "shadow-sm"}`}>
            <div>
                <div className="w-full aspect-video bg-[#F5EFE6] flex items-center justify-center overflow-hidden relative border-b border-[#E8D8C3]/40">
                    {p.foto_url?.length > 0
                        ? <img src={p.foto_url[0]} alt={p.nombre} className="w-full h-full object-cover" loading="lazy" />
                        : <ImageOff size={28} className="text-[#C8B89A]" />
                    }
                    <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${p.disponibilidad ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                        {p.disponibilidad ? "Disponible" : "No disponible"}
                    </span>
                    {!p.activo && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2B2B2B]/80 text-white shadow-sm">Inactivo</span>
                    )}
                </div>

                <div className="p-4 flex flex-col gap-1.5 min-w-0">
                    <p className="font-extrabold text-[#2B2B2B] text-sm sm:text-base leading-snug truncate" title={p.nombre}>{p.nombre}</p>
                    {p.descripcion && (
                        <p className="text-xs text-[#6B6B6B] leading-relaxed line-clamp-2 break-words min-h-[2rem]">
                            {p.descripcion}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1 min-w-0">
                        {p.receta?.length > 0 && (
                            <span className="px-2 py-0.5 border border-[#A8D5BA]/60 rounded-full text-[10px] font-bold bg-[#A8D5BA]/40 text-green-900 shrink-0 whitespace-nowrap">{p.receta.length} insumo{p.receta.length !== 1 ? "s" : ""}</span>
                        )}
                        {p.variaciones?.length > 0 && (
                            <span className="px-2 py-0.5 border border-[#A9C7E8]/60 rounded-full text-[10px] font-bold bg-[#A9C7E8]/40 text-blue-900 shrink-0 whitespace-nowrap">{p.variaciones.length} variación{p.variaciones.length !== 1 ? "es" : ""}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8D8C3] bg-white mt-auto gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                    <p className="text-base font-extrabold text-[#C0392B] truncate">Q{p.precio.toFixed(2)}</p>
                    <p className="text-[10px] text-[#6B6B6B] font-medium truncate" title={p.id_restaurante?.nombre}>{p.id_restaurante?.nombre || "—"}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => onEdit(p)} className="p-2 rounded-xl border border-[#E8D8C3] text-[#E67E22] hover:bg-[#FDF6EE] hover:border-[#FAC775] transition-colors active:scale-95" title="Editar">
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onToggle(p)}
                        className={`p-2 rounded-xl border transition-colors active:scale-95 ${p.activo ? "border-[#E8D8C3] text-[#C0392B] hover:bg-red-50 hover:border-[#F09595]" : "border-[#E8D8C3] text-[#0F6E56] hover:bg-[#E1F5EE] hover:border-[#5DCAA5]"}`}
                        title={p.activo ? "Desactivar" : "Reactivar"}
                    >
                        {p.activo ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};