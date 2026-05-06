import { X, FlaskConical } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveRecipeItem } from "../hooks/useSaveRecipeItem";
import { useProductsStore } from "../../products/store/productsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const RecipeModal = ({ isOpen, onClose, ingredient = null, productId = null, onSaved }) => {
    const isEditing = !!ingredient;
    const { saveRecipeItem } = useSaveRecipeItem();
    const loading = useProductsStore((state) => state.loading);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen) {
            if (ingredient) {
                reset({
                    nombre_insumo: ingredient.nombre_insumo || "",
                    cantidad_requerida: ingredient.cantidad_requerida || "",
                });
            } else {
                reset({ nombre_insumo: "", cantidad_requerida: "" });
            }
        }
    }, [isOpen, ingredient, reset]);

    const onSubmit = async (data) => {
        try {
            await saveRecipeItem(data, productId, ingredient?._id ?? null);
            showSuccess(isEditing ? "Ingrediente actualizado correctamente" : "Ingrediente agregado correctamente");
            onSaved?.();
            reset();
            onClose();
        } catch (error) {
            showError("Error al guardar el ingrediente");
        }
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
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Insumo *</label>
                        <input
                            placeholder="Ej: Carne de res, Lechuga..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("nombre_insumo", { required: "El nombre del insumo es obligatorio" })}
                        />
                        {errors.nombre_insumo && <span className="text-red-500 text-xs mt-1">{errors.nombre_insumo.message}</span>}
                        <p className="text-[10px] text-[#6B6B6B] mt-1">Debe coincidir exactamente con el nombre del insumo en Inventario</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cantidad Requerida *</label>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Ej: 2"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("cantidad_requerida", {
                                required: "La cantidad es obligatoria",
                                min: { value: 0, message: "Debe ser mayor o igual a 0" }
                            })}
                        />
                        {errors.cantidad_requerida && <span className="text-red-500 text-xs mt-1">{errors.cantidad_requerida.message}</span>}
                        <p className="text-[10px] text-[#6B6B6B] mt-1">Esta cantidad se descontará del inventario al procesar un pedido</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};