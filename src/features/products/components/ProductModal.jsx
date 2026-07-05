import { X, UtensilsCrossed, ImagePlus, Store, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useSaveProduct } from "../hooks/useSaveProduct";
import { useProductsStore } from "../store/productsStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useCategoriesStore } from "../../categories/store/categoriesStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { RestaurantPickerModal } from "../../../shared/components/ui/RestaurantPickerModal";

export const ProductModal = ({ isOpen, onClose, product = null, restauranteId = null, onSaved }) => {
    const isEditing = !!product;
    const { saveProduct } = useSaveProduct();
    const loading = useProductsStore((state) => state.loading);
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const categories = useCategoriesStore((state) => state.categories);
    const getCategories = useCategoriesStore((state) => state.getCategories);

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [preview, setPreview] = useState(null);
    const [existingPhoto, setExistingPhoto] = useState(null);

    const [selectedRestId, setSelectedRestId] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const prevRestaurantId = useRef(null);
    const skipPick = useRef(false);

    const selectedRestaurantObj = useMemo(
        () => restaurants.find((r) => r._id === selectedRestId),
        [restaurants, selectedRestId]
    );

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm();

    const selectedRestaurant = watch("id_restaurante");
    const watchedFoto = watch("foto");

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getCategories({ activo: true, limit: 200 });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!selectedRestaurant) { setFilteredCategories([]); return; }
        const cats = categories.filter(
            (c) => (c.id_restaurante?._id || c.id_restaurante) === selectedRestaurant && c.activo
        );
        setFilteredCategories(cats);
        if (!isEditing) setValue("categoria", cats[0]?._id || "");
    }, [selectedRestaurant, categories]);

    // Preview de nueva imagen seleccionada
    useEffect(() => {
        if (!watchedFoto || watchedFoto.length === 0) { setPreview(null); return; }
        const url = URL.createObjectURL(watchedFoto[0]);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [watchedFoto]);

    // Poblar formulario al abrir
    useEffect(() => {
        if (isOpen) {
            setPreview(null);
            const initialRestId = product
                ? (product?.id_restaurante?._id || product?.id_restaurante || "")
                : (restauranteId || "");
            setSelectedRestId(initialRestId);
            prevRestaurantId.current = null;
            skipPick.current = false;
            if (product) {
                setExistingPhoto(product.foto_url?.[0] ?? null);
                reset({
                    id_restaurante: initialRestId,
                    nombre: product?.nombre || "",
                    descripcion: product?.descripcion || "",
                    categoria: product?.categoria?._id || product?.categoria || "",
                    precio: product?.precio || "",
                    disponibilidad: product?.disponibilidad ?? true,
                });
            } else {
                setExistingPhoto(null);
                reset({
                    id_restaurante: restauranteId || "",
                    nombre: "",
                    descripcion: "",
                    categoria: "",
                    precio: "",
                    disponibilidad: true,
                });
            }
        }
    }, [isOpen, product, restauranteId, reset]);

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
            setValue("id_restaurante", selectedRestId, { shouldValidate: true });
            prevRestaurantId.current = selectedRestId;
        }
    }, [selectedRestId, setValue]);

    const handleRestaurantPick = (restaurant) => {
        skipPick.current = true;
        setSelectedRestId(restaurant._id);
        setValue("id_restaurante", restaurant._id, { shouldValidate: true });
        if (errors.id_restaurante) {
            trigger("id_restaurante");
        }
    };

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    const ALLOWED_LABEL = 'JPEG, JPG, PNG, WEBP o AVIF';

    const onSubmit = async (data) => {
        // Validar tipo de imagen en cliente antes de enviar
        const file = data.foto?.[0];
        if (file && !ALLOWED_TYPES.includes(file.type)) {
            showError(`Formato no permitido: "${file.type || file.name}". Solo se aceptan ${ALLOWED_LABEL}.`);
            return;
        }

        try {
            await saveProduct(data, product?._id ?? null);
            showSuccess(isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
            reset();
            setPreview(null);
            setExistingPhoto(null);
            onSaved?.();
            onClose();
        } catch (error) {
            const data = error?.response?.data;
            const mensaje = data?.message
                || (data?.errors ? data.errors.map(e => e.msg).join(", ") : null)
                || "Error al guardar el producto";
            showError(mensaje);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <UtensilsCrossed size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Producto" : "Nuevo Producto"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">

                    {/* Restaurante */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        {selectedRestId && selectedRestaurantObj ? (
                            <button type="button" disabled={isEditing} onClick={() => !isEditing && setPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#E67E22] bg-[#E67E22]/5 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-[#E67E22]/10" : "cursor-not-allowed opacity-60"}`}>
                                <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                                    <Store size={12} className="text-[#E67E22]" />
                                </div>
                                <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedRestaurantObj.nombre}</span>
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
                        {errors.id_restaurante && <span className="text-red-500 text-xs mt-1">{errors.id_restaurante.message}</span>}
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                    </div>

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Producto *</label>
                        <input
                            placeholder="Ej: Burger Clásica"
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors
                                ${errors.nombre ? "border-red-400" : "border-[#E8D8C3]"}`}
                            {...register("nombre", {
                                required: "El nombre es obligatorio",
                                minLength: { value: 2, message: "Debe tener al menos 2 caracteres" },
                            })}
                        />
                        {errors.nombre && <span className="text-red-500 text-xs mt-1">{errors.nombre.message}</span>}
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Descripción</label>
                        <textarea
                            rows={2}
                            placeholder="Describe el producto..."
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none
                                ${errors.descripcion ? "border-red-400" : "border-[#E8D8C3]"}`}
                            {...register("descripcion", {
                                maxLength: { value: 300, message: "Máximo 300 caracteres" },
                            })}
                        />
                        {errors.descripcion && <span className="text-red-500 text-xs mt-1">{errors.descripcion.message}</span>}
                    </div>

                    {/* Categoría + Precio */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Categoría *</label>
                            <select
                                disabled={!selectedRestaurant}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors
                                    ${errors.categoria ? "border-red-400" : "border-[#E8D8C3]"}
                                    ${!selectedRestaurant ? "opacity-50 cursor-not-allowed" : ""}`}
                                {...register("categoria", { required: "La categoría es obligatoria" })}
                            >
                                <option value="">
                                    {!selectedRestaurant
                                        ? "Selecciona un restaurante primero"
                                        : filteredCategories.length === 0
                                            ? "Sin categorías para este restaurante"
                                            : "Seleccionar categoría..."}
                                </option>
                                {filteredCategories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.nombre}</option>
                                ))}
                            </select>
                            {errors.categoria && <span className="text-red-500 text-xs mt-1">{errors.categoria.message}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Precio (Q) *</label>
                            <input
                                type="number"
                                placeholder="Ej: 55"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors
                                    ${errors.precio ? "border-red-400" : "border-[#E8D8C3]"}`}
                                {...register("precio", {
                                    required: "El precio es obligatorio",
                                    min: { value: 0.01, message: "Debe ser mayor a 0" },
                                })}
                            />
                            {errors.precio && <span className="text-red-500 text-xs mt-1">{errors.precio.message}</span>}
                        </div>
                    </div>

                    {/* Disponibilidad + Estado */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Disponibilidad</label>
                            <select
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("disponibilidad")}
                            >
                                <option value="true">Disponible</option>
                                <option value="false">No disponible</option>
                            </select>
                        </div>
                        {isEditing && (
                            <div className="flex flex-col">
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                                <select
                                    className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                    {...register("activo")}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* IMAGEN */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-2">
                            Imagen del Producto
                        </label>

                        {/* Foto existente en edición (solo si no hay nueva seleccionada) */}
                        {isEditing && existingPhoto && !preview && (
                            <div className="mb-3">
                                <p className="text-[10px] text-[#6B6B6B] mb-2">Foto actual — se reemplazará si subes una nueva</p>
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E8D8C3]">
                                    <img src={existingPhoto} alt="foto-actual" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Preview de nueva imagen */}
                        {preview && (
                            <div className="mb-3">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#E67E22]">
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Input de archivo */}
                        <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#E8D8C3] rounded-xl cursor-pointer hover:border-[#E67E22] hover:bg-[#FDF6EE] transition-colors group">
                            <ImagePlus size={18} className="text-[#6B6B6B] group-hover:text-[#E67E22] transition-colors shrink-0" />
                            <span className="text-sm text-[#6B6B6B] group-hover:text-[#E67E22] transition-colors">
                                {preview
                                    ? "Imagen seleccionada — clic para cambiar"
                                    : "Seleccionar imagen..."}
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                                className="hidden"
                                {...register("foto")}
                            />
                        </label>
                    </div>

                    {/* BOTONES */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button
                            type="button"
                            onClick={() => { reset(); setPreview(null); setExistingPhoto(null); onClose(); }}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Producto"}
                        </button>
                    </div>
                </div>
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