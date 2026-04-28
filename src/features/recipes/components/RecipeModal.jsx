import { X, FlaskConical } from "lucide-react";
import { useState } from "react";

const productos = [
    { _id: "prod_001", nombre: "Burger Clásica" },
    { _id: "prod_002", nombre: "Pasta Alfredo" },
    { _id: "prod_003", nombre: "Alitas BBQ" },
];

export const RecipeModal = ({ isOpen, onClose, ingredient = null, productId = null }) => {
    const isEditing = !!ingredient;

    const [form, setForm] = useState({
        nombre_insumo: ingredient?.nombre_insumo || "",
        cantidad_requerida: ingredient?.cantidad_requerida || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // PUT /recipes/:productId/:recipeId — preserva _id en el $set
            console.log("PUT /recipes/:productId/:recipeId →", {
                nombre_insumo: form.nombre_insumo,
                cantidad_requerida: Number(form.cantidad_requerida),
            });
        } else {
            // POST /recipes/:id — $push a receta, body = recetaSchema fields
            console.log("POST /recipes/:id →", {
                nombre_insumo: form.nombre_insumo,
                cantidad_requerida: Number(form.cantidad_requerida),
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <FlaskConical size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Ingrediente" : "Agregar Ingrediente"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Se muestra solo si no viene productId desde la vista (flujo alternativo) */}
                    {!productId && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Producto *
                            </label>
                            <select
                                name="id_producto"
                                value={form.id_producto}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="">Seleccionar producto...</option>
                                {productos.map((p) => (
                                    <option key={p._id} value={p._id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* nombre_insumo: required, trim en recetaSchema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Nombre del Insumo *
                        </label>
                        <input
                            name="nombre_insumo"
                            value={form.nombre_insumo}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Carne de res, Lechuga..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                        <p className="text-[10px] text-[#6B6B6B] mt-1">
                            Debe coincidir exactamente con el nombre del insumo en Inventario
                        </p>
                    </div>

                    {/* cantidad_requerida: required, min 0 en recetaSchema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Cantidad Requerida *
                        </label>
                        <input
                            name="cantidad_requerida"
                            value={form.cantidad_requerida}
                            onChange={handleChange}
                            required
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Ej: 2"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                        <p className="text-[10px] text-[#6B6B6B] mt-1">
                            Esta cantidad se descontará del inventario al procesar un pedido
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors"
                        >
                            {isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};