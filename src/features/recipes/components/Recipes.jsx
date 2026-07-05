import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, FlaskConical } from "lucide-react";
import { RecipeModal } from "./RecipeModal";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useProducts } from "../../products/hooks/useProducts";
import { useProductsStore } from "../../products/store/productsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

export const Recipes = () => {
    const { products, loading } = useProducts();
    const { deleteRecipeItem } = useProductsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedRestauranteId, setSelectedRestauranteId] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurant, setFilterRestaurant] = useState("");

    const productsWithRecipes = (products ?? []).filter((p) => {
        const matchRestaurant = filterRestaurant
            ? p.id_restaurante?._id === filterRestaurant || p.id_restaurante === filterRestaurant
            : true;
        const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
        return matchRestaurant && matchSearch;
    });

    const handleAddIngredient = (productId, idRestaurante) => { setSelectedIngredient(null); setSelectedProductId(productId); setSelectedRestauranteId(idRestaurante); setModalOpen(true); };
    const handleEditIngredient = (ingredient, productId, idRestaurante) => { setSelectedIngredient(ingredient); setSelectedProductId(productId); setSelectedRestauranteId(idRestaurante); setModalOpen(true); };

    const handleDeleteIngredient = (productId, ing) => {
        const nombreInsumo = ing.nombre_insumo ?? "este ingrediente";
        showConfirmToast({
            title: "Eliminar ingrediente",
            message: `¿Eliminar "${nombreInsumo}" de la receta?`,
            type: "delete",
            onConfirm: () => deleteRecipeItem(productId, ing._id),
        });
    };

    return (
        <div className="space-y-6">
            {/* HEADER RESPONSIVO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#2B2B2B] tracking-tight">Recetas</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Ingredientes e insumos requeridos por producto</p>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar producto..."
                showSucursal={false}
                showActiveFilter={false}
                showStatusFilter={false}
                showEmptyState={false}
            />

            {/* GRID DE RECETAS */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5">
                {loading ? (
                    <p className="text-[#6B6B6B] text-sm col-span-full text-center py-20">Cargando recetas...</p>
                ) : productsWithRecipes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#6B6B6B]">
                        <BookOpen size={48} className="opacity-20 mb-3" />
                        <p className="text-sm">No hay productos con recetas registradas</p>
                    </div>
                ) : productsWithRecipes.map((producto) => (
                    <div key={producto._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5 hover:shadow-md transition-all flex flex-col">

                        {/* ENCABEZADO */}
                        <div className="flex items-center justify-between mb-4 gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                                    <BookOpen size={18} className="text-[#E67E22]" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-extrabold text-[#2B2B2B] text-sm leading-tight lg:truncate" title={producto.nombre}>
                                        {producto.nombre}
                                    </h3>
                                    <p className="text-[11px] font-medium text-[#6B6B6B] uppercase tracking-wide truncate">
                                        {producto.id_restaurante?.nombre ?? "Sin restaurante"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleAddIngredient(producto._id, producto.id_restaurante?._id ?? producto.id_restaurante)}
                                className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs transition-all active:scale-95 shrink-0"
                            >
                                <Plus size={14} /> <span>Ingrediente</span>
                            </button>
                        </div>

                        {producto.receta?.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-xs text-[#A0A0A0] italic py-6 border border-dashed border-[#E8D8C3] rounded-xl bg-[#F5F5F5]/30">
                                Sin ingredientes registrados
                            </div>
                        ) : (
                            <div className="space-y-2 flex-1">
                                {producto.receta?.map((ing) => (
                                    <div key={ing._id} className="flex items-center justify-between bg-[#F5EFE6] rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                            <FlaskConical size={14} className="text-[#E67E22] shrink-0" />
                                            <span className="text-xs text-[#2B2B2B] font-semibold truncate" title={ing.nombre_insumo}>
                                                {ing.nombre_insumo ?? "Insumo sin nombre"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <span className="text-[10px] font-black text-[#8C6D4A] bg-[#E8D8C3]/60 px-2 py-0.5 rounded-md">x{ing.cantidad_requerida}</span>
                                            <button onClick={() => handleEditIngredient(ing, producto._id, producto.id_restaurante?._id ?? producto.id_restaurante)} className="p-1.5 rounded-lg hover:bg-[#E8D8C3] text-[#E67E22] transition-colors" title="Editar">
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => handleDeleteIngredient(producto._id, ing)} className="p-1.5 rounded-lg hover:bg-[#E6A5A5]/30 text-[#C0392B] transition-colors" title="Eliminar">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-[#E8D8C3]/60 flex justify-between items-center">
                            <span className="text-[11px] font-medium text-[#6B6B6B]">Total insumos:</span>
                            <span className="text-xs font-bold text-[#2B2B2B] bg-[#E8D8C3]/30 px-2 py-0.5 rounded-lg">{producto.receta?.length ?? 0}</span>
                        </div>
                    </div>
                ))}
            </div>

            <RecipeModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedIngredient(null); setSelectedProductId(null); setSelectedRestauranteId(null); }}
                ingredient={selectedIngredient}
                productId={selectedProductId}
                idRestaurante={selectedRestauranteId}
                onSaved={() => { }}
            />
        </div>
    );
};