import { X, FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveRecipeItem } from "../hooks/useSaveRecipeItem";
import { useProductsStore } from "../../products/store/productsStore";
import { useInventoryStore } from "../../inventory/store/inventoryStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const RecipeModal = ({ isOpen, onClose, ingredient = null, productId = null, idRestaurante = null, onSaved }) => {
    const isEditing = !!ingredient;
    const { saveRecipeItem } = useSaveRecipeItem();
    const loading = useProductsStore((state) => state.loading);

    const inventory = useInventoryStore((state) => state.inventory);
    const getInventoryByRestaurant = useInventoryStore((state) => state.getInventoryByRestaurant);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Cargar insumos del restaurante al abrir
    useEffect(() => {
        if (isOpen && idRestaurante) {
            getInventoryByRestaurant(idRestaurante, { activo: true });
        }
    }, [isOpen, idRestaurante]);

    useEffect(() => {
        if (isOpen) {
            if (ingredient) {
                reset({
                    // Al editar, id_insumo viene populado como objeto
                    id_insumo: ingredient.id_insumo?._id ?? ingredient.id_insumo ?? "",
                    cantidad_requerida: ingredient.cantidad_requerida || "",
                });
            } else {
                reset({ id_insumo: "", cantidad_requerida: "" });
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
            const mensaje = error?.response?.data?.message || "Error al guardar el ingrediente";
            showError(mensaje);
        }
    };

    if (!isOpen) return null;

    const insumosActivos = inventory.filter((i) => i.activo);

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
                    {/* SELECT de insumo desde inventario */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Insumo del Inventario *
                        </label>
                        {insumosActivos.length === 0 ? (
                            <div className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm text-amber-700 bg-amber-50">
                                ⚠️ No hay insumos activos en el inventario de este restaurante. Crea uno primero.
                            </div>
                        ) : (
                            <select
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("id_insumo", { required: "Debes seleccionar un insumo" })}
                            >
                                <option value="">Seleccionar insumo...</option>
                                {insumosActivos.map((insumo) => (
                                    <option key={insumo._id} value={insumo._id}>
                                        {insumo.nombre_insumo} — Stock actual: {insumo.stock_actual}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.id_insumo && <span className="text-red-500 text-xs mt-1">{errors.id_insumo.message}</span>}
                        <p className="text-[10px] text-[#6B6B6B] mt-1">Solo aparecen insumos activos del inventario de este restaurante</p>
                    </div>

                    {/* Cantidad requerida */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cantidad Requerida *</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Ej: 2"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("cantidad_requerida", {
                                required: "La cantidad es obligatoria",
                                min: { value: 0.01, message: "Debe ser mayor a 0" }
                            })}
                        />
                        {errors.cantidad_requerida && <span className="text-red-500 text-xs mt-1">{errors.cantidad_requerida.message}</span>}
                        <p className="text-[10px] text-[#6B6B6B] mt-1">Esta cantidad se descontará del inventario al procesar un pedido</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={loading || insumosActivos.length === 0} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
