import { useState } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen, FlaskConical } from "lucide-react";
import { RecipeModal } from "./RecipeModal";

const recetas = [
    {
        _id: "prod_001",
        nombre: "Burger Clásica",
        id_restaurante: { nombre: "Bite Central" },
        receta: [
            { _id: "rec_001", nombre_insumo: "Carne de res", cantidad_requerida: 2 },
            { _id: "rec_002", nombre_insumo: "Pan de hamburguesa", cantidad_requerida: 1 },
            { _id: "rec_003", nombre_insumo: "Lechuga", cantidad_requerida: 1 },
        ],
    },
    {
        _id: "prod_002",
        nombre: "Pasta Alfredo",
        id_restaurante: { nombre: "Bite Norte" },
        receta: [
            { _id: "rec_004", nombre_insumo: "Pasta", cantidad_requerida: 3 },
            { _id: "rec_005", nombre_insumo: "Crema", cantidad_requerida: 2 },
        ],
    },
    {
        _id: "prod_003",
        nombre: "Alitas BBQ",
        id_restaurante: { nombre: "Bite Central" },
        receta: [
            { _id: "rec_006", nombre_insumo: "Alitas de pollo", cantidad_requerida: 6 },
            { _id: "rec_007", nombre_insumo: "Salsa BBQ", cantidad_requerida: 2 },
        ],
    },
];

export const Recipes = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = recetas.filter((r) =>
        r.nombre.toLowerCase().includes(search.toLowerCase()) ||
        r.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddIngredient = (productId) => {
        setSelectedIngredient(null);
        setSelectedProductId(productId);
        setModalOpen(true);
    };

    const handleEditIngredient = (ingredient, productId) => {
        setSelectedIngredient(ingredient);
        setSelectedProductId(productId);
        setModalOpen(true);
    };

    // DELETE /recipes/:productId/:recipeId — necesita ambos IDs
    const handleDeleteIngredient = (productId, recipeId) => {
        console.log("DELETE /recipes/:productId/:recipeId →", { productId, recipeId });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Recetas</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Ingredientes e insumos requeridos por producto</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar por producto o restaurante..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((producto) => (
                    <div key={producto._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#E67E22]/10 flex items-center justify-center shrink-0">
                                    <BookOpen size={16} className="text-[#E67E22]" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-[#2B2B2B] text-sm">{producto.nombre}</h3>
                                    <p className="text-xs text-[#6B6B6B]">{producto.id_restaurante.nombre}</p>
                                </div>
                            </div>
                            {/* POST /recipes/:id */}
                            <button
                                onClick={() => handleAddIngredient(producto._id)}
                                className="flex items-center gap-1 text-xs bg-[#E67E22] hover:bg-[#D35400] text-white px-2 py-1.5 rounded-lg font-bold transition-colors"
                            >
                                <Plus size={11} /> Ingrediente
                            </button>
                        </div>

                        {producto.receta.length === 0 ? (
                            <p className="text-xs text-[#6B6B6B] text-center py-3 border border-dashed border-[#E8D8C3] rounded-xl">
                                Sin ingredientes registrados
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {producto.receta.map((ing) => (
                                    <div key={ing._id} className="flex items-center justify-between bg-[#F5EFE6] rounded-xl px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <FlaskConical size={13} className="text-[#E67E22] shrink-0" />
                                            <span className="text-xs text-[#2B2B2B] font-medium">{ing.nombre_insumo}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#2B2B2B] bg-[#E8D8C3] px-2 py-0.5 rounded-lg">
                                                x{ing.cantidad_requerida}
                                            </span>
                                            {/* PUT /recipes/:productId/:recipeId */}
                                            <button
                                                onClick={() => handleEditIngredient(ing, producto._id)}
                                                className="p-1 rounded-lg hover:bg-[#E8D8C3] text-[#E67E22] transition-colors"
                                                title="Editar ingrediente"
                                            >
                                                <Pencil size={11} />
                                            </button>
                                            {/* DELETE /recipes/:productId/:recipeId */}
                                            <button
                                                onClick={() => handleDeleteIngredient(producto._id, ing._id)}
                                                className="p-1 rounded-lg hover:bg-[#E6A5A5]/30 text-[#C0392B] transition-colors"
                                                title="Eliminar ingrediente"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-[#E8D8C3]">
                            <span className="text-xs text-[#6B6B6B]">
                                Total insumos: <strong className="text-[#2B2B2B]">{producto.receta.length}</strong>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <RecipeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                ingredient={selectedIngredient}
                productId={selectedProductId}
            />
        </div>
    );
};