import { X, Tag, Store, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useCategoriesStore } from "../store/categoriesStore";
import { useSaveCategory } from "../hooks/useSaveCategory";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { RestaurantPickerModal } from "../../../shared/components/ui/RestaurantPickerModal";

const initialForm = {
    nombre: "",
    descripcion: "",
    id_restaurante: "",
};

export const CategoryModal = ({ isOpen, onClose, category = null, restauranteId = null, onSaved }) => {
    const isEditing = !!category;
    const { saveCategory } = useSaveCategory();
    const loading = useCategoriesStore((state) => state.loading);

    const restaurantes = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const [selectedRestId, setSelectedRestId] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const prevRestaurantId = useRef(null);
    const skipPick = useRef(false);

    const selectedRestaurant = useMemo(
        () => restaurantes.find((r) => r._id === selectedRestId),
        [restaurantes, selectedRestId]
    );

    useEffect(() => {
        if (isOpen) getRestaurants();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const initialRestId = category
            ? (category.id_restaurante?._id || category.id_restaurante || "")
            : (restauranteId || "");
        setSelectedRestId(initialRestId);
        prevRestaurantId.current = null;
        skipPick.current = false;
        setErrors({});
        setForm(
            category
                ? {
                    nombre: category.nombre || "",
                    descripcion: category.descripcion || "",
                    id_restaurante: initialRestId,
                }
                : { ...initialForm, id_restaurante: restauranteId || "" }
        );
    }, [isOpen, category, restauranteId]);

    useEffect(() => {
        if (prevRestaurantId.current === null) {
            prevRestaurantId.current = selectedRestId;
            return;
        }
        if (skipPick.current) {
            skipPick.current = false;
            prevRestaurantId.current = selectedRestId;
            return;
        }
        if (prevRestaurantId.current !== selectedRestId) {
            setForm((prev) => ({ ...prev, id_restaurante: selectedRestId }));
            prevRestaurantId.current = selectedRestId;
        }
    }, [selectedRestId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleRestaurantPick = (restaurant) => {
        skipPick.current = true;
        setSelectedRestId(restaurant._id);
        setForm((prev) => ({ ...prev, id_restaurante: restaurant._id }));
        if (errors.id_restaurante) setErrors((prev) => ({ ...prev, id_restaurante: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio";
        } else if (form.nombre.trim().length < 3) {
            newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
        } else if (form.nombre.trim().length > 30) {
            newErrors.nombre = "El nombre no puede exceder 30 caracteres";
        }
        if (form.descripcion && form.descripcion.trim().length > 100) {
            newErrors.descripcion = "La descripción no puede exceder 100 caracteres";
        }
        if (!form.id_restaurante) newErrors.id_restaurante = "Selecciona un restaurante";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await saveCategory(form, category?._id ?? null);
            showSuccess(isEditing ? "Categoría actualizada" : "Categoría creada");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar la categoría");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Tag size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        {selectedRestId && selectedRestaurant ? (
                            <button type="button" disabled={isEditing} onClick={() => !isEditing && setPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#E67E22] bg-[#E67E22]/5 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-[#E67E22]/10" : "cursor-not-allowed opacity-60"}`}>
                                <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                                    <Store size={12} className="text-[#E67E22]" />
                                </div>
                                <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedRestaurant.nombre}</span>
                                {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                            </button>
                        ) : (
                            <button type="button" onClick={() => setPickerOpen(true)} className={`w-full flex items-center gap-3 px-4 py-2.5 border rounded-xl text-sm transition-colors ${errors.id_restaurante ? "border-red-400 bg-red-50" : "border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0]"}`}>
                                <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                    <Store size={14} className="text-[#6B6B6B]" />
                                </div>
                                <span className="text-[#6B6B6B]">Seleccionar restaurante...</span>
                            </button>
                        )}
                        <input type="hidden" value={selectedRestId} />
                        {errors.id_restaurante && <p className="text-[10px] text-red-500 mt-1">{errors.id_restaurante}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre de la Categoría *</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange}
                            placeholder="Ej: Menú Ejecutivo, Desayunos..."
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.nombre ? "border-red-400" : "border-[#E8D8C3]"}`} />
                        {errors.nombre && <p className="text-[10px] text-red-500 mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Descripción</label>
                        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                            placeholder="Describe brevemente esta categoría..."
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none ${errors.descripcion ? "border-red-400" : "border-[#E8D8C3]"}`} />
                        {errors.descripcion && <p className="text-[10px] text-red-500 mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Categoría"}
                        </button>
                    </div>
                </form>
            </div>

            <RestaurantPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleRestaurantPick}
                selectedId={selectedRestId}
            />
        </div>
    );
};