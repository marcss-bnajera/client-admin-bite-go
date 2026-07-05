import { X, FlaskConical, Package, Check, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSaveRecipeItem } from "../hooks/useSaveRecipeItem";
import { useProductsStore } from "../../products/store/productsStore";
import { useInventoryStore } from "../../inventory/store/inventoryStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { SupplyPickerModal } from "./SupplyPickerModal";

export const RecipeModal = ({ isOpen, onClose, ingredient = null, productId = null, idRestaurante = null, onSaved }) => {
    const isEditing = !!ingredient;
    const { saveRecipeItem } = useSaveRecipeItem();
    const loading = useProductsStore((state) => state.loading);

    const inventory = useInventoryStore((state) => state.inventory);
    const getInventoryByRestaurant = useInventoryStore((state) => state.getInventoryByRestaurant);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [pickerInsumo, setPickerInsumo] = useState(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    const insumosActivos = useMemo(() => inventory.filter((i) => i.activo), [inventory]);

    const ingredientKey = ingredient?._id ?? "new";
    const selectedInsumo = useMemo(() => {
        if (pickerInsumo) return pickerInsumo;
        if (!ingredient) return null;
        const nombre = ingredient.nombre_insumo;
        if (!nombre) return null;
        return inventory.find((i) => i.nombre_insumo === nombre) || { nombre_insumo: nombre, stock_actual: "?" };
    }, [pickerInsumo, ingredient, inventory]);

    useEffect(() => {
        if (isOpen && idRestaurante) {
            getInventoryByRestaurant(idRestaurante, { activo: true });
        }
    }, [isOpen, idRestaurante, getInventoryByRestaurant]);

    useEffect(() => {
        if (!isOpen) return;
        if (ingredient) {
            reset({
                nombre_insumo: ingredient.nombre_insumo ?? "",
                cantidad_requerida: ingredient.cantidad_requerida || "",
            });
        } else {
            reset({ nombre_insumo: "", cantidad_requerida: "" });
        }
    }, [isOpen, ingredient, ingredientKey, reset]);

    const handleSelectInsumo = (insumo) => {
        setPickerInsumo(insumo);
        setValue("nombre_insumo", insumo.nombre_insumo, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            await saveRecipeItem(data, productId, ingredient?._id ?? null);
            showSuccess(isEditing ? "Ingrediente actualizado correctamente" : "Ingrediente agregado correctamente");
            onSaved?.();
            reset();
            setPickerInsumo(null);
            onClose();
        } catch (error) {
            const mensaje = error?.response?.data?.message || "Error al guardar el ingrediente";
            showError(mensaje);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
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
                    {/* Picker de insumo */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Insumo del Inventario *
                        </label>
                        {insumosActivos.length === 0 ? (
                            <div className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm text-amber-700 bg-amber-50 flex items-center gap-2">
                                <AlertTriangle size={14} className="shrink-0" />
                                No hay insumos activos. Crea uno en Inventario primero.
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setPickerOpen(true)}
                                className={`w-full text-left px-4 py-2.5 border rounded-xl text-sm transition-colors ${
                                    errors.nombre_insumo
                                        ? "border-red-400 bg-red-50"
                                        : selectedInsumo
                                            ? "border-[#E67E22] bg-[#E67E22]/5"
                                            : "border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0]"
                                }`}
                            >
                                {selectedInsumo ? (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-lg bg-[#A8D5BA] flex items-center justify-center shrink-0">
                                                <Check size={12} className="text-green-800" />
                                            </div>
                                            <span className="font-semibold text-[#2B2B2B] truncate">{selectedInsumo.nombre_insumo}</span>
                                        </div>
                                        <span className="text-[10px] text-[#6B6B6B] shrink-0">Stock: {selectedInsumo.stock_actual}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                                        <Package size={14} className="shrink-0" />
                                        <span>Seleccionar insumo...</span>
                                    </div>
                                )}
                            </button>
                        )}
                        <input type="hidden" {...register("nombre_insumo", { required: "Debes seleccionar un insumo" })} />
                        {errors.nombre_insumo && <span className="text-red-500 text-xs mt-1 block">{errors.nombre_insumo.message}</span>}
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
                        <button type="button" onClick={() => { reset(); setPickerInsumo(null); onClose(); }} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={loading || insumosActivos.length === 0} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Agregar Ingrediente"}
                        </button>
                    </div>
                </div>
            </div>

            <SupplyPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                insumos={inventory}
                onSelect={handleSelectInsumo}
                selectedName={selectedInsumo?.nombre_insumo}
            />
        </div>
    );
};
