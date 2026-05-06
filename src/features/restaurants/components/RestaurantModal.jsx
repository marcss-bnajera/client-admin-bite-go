import { X, Store } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveRestaurant } from "../hooks/useSaveRestaurant";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

export const RestaurantModal = ({ isOpen, onClose, restaurant = null, onSaved }) => {
    const isEditing = !!restaurant;
    const { saveRestaurant } = useSaveRestaurant();
    const loading = useRestaurantsStore((state) => state.loading);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            if (restaurant) {
                reset({
                    nombre: restaurant.nombre || "",
                    direccion_texto: restaurant.direccion?.texto || "",
                    horarios_atencion: restaurant.horarios_atencion || "",
                    categoria_gastronomica: restaurant.categoria_gastronomica || "",
                    precio_promedio: restaurant.precio_promedio || "",
                    telefono: restaurant.informacion_contacto?.telefono || "",
                    email: restaurant.informacion_contacto?.email || "",
                    activo: restaurant.activo ?? true,
                });
            } else {
                reset({
                    nombre: "",
                    direccion_texto: "",
                    horarios_atencion: "",
                    categoria_gastronomica: "",
                    precio_promedio: "",
                    telefono: "",
                    email: "",
                    activo: true,
                });
            }
        }
    }, [isOpen, restaurant, reset]);

    const onSubmit = async (data) => {
        try {
            await saveRestaurant(data, restaurant?._id ?? null);
            showSuccess(isEditing ? "Restaurante actualizado correctamente" : "Restaurante creado correctamente");
            reset();
            onSaved?.();
            onClose();
        } catch (error) {
            showError("Error al guardar el restaurante");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Store size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Restaurante" : "Nuevo Restaurante"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Restaurante *</label>
                        <input
                            placeholder="Ej: Bite Central"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("nombre", {
                                required: "El nombre es obligatorio",
                                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
                            })}
                        />
                        {errors.nombre && <span className="text-red-500 text-xs mt-1">{errors.nombre.message}</span>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Dirección *</label>
                        <input
                            placeholder="Ej: Zona 10, Ciudad de Guatemala"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("direccion_texto", { required: "La dirección es obligatoria" })}
                        />
                        {errors.direccion_texto && <span className="text-red-500 text-xs mt-1">{errors.direccion_texto.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Horario *</label>
                            <input
                                placeholder="Ej: 8:00 - 22:00"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("horarios_atencion", { required: "El horario es obligatorio" })}
                            />
                            {errors.horarios_atencion && <span className="text-red-500 text-xs mt-1">{errors.horarios_atencion.message}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Precio Promedio (Q) *</label>
                            <input
                                type="number"
                                min="0"
                                placeholder="Ej: 75"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("precio_promedio", {
                                    required: "El precio es obligatorio",
                                    min: { value: 0, message: "Debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.precio_promedio && <span className="text-red-500 text-xs mt-1">{errors.precio_promedio.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Categoría Gastronómica *</label>
                        <input
                            placeholder="Ej: Comida Rápida, Fusión..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("categoria_gastronomica", { required: "La categoría gastronómica es obligatoria" })}
                        />
                        {errors.categoria_gastronomica && <span className="text-red-500 text-xs mt-1">{errors.categoria_gastronomica.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Teléfono</label>
                            <input
                                placeholder="Ej: 2345-6789"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("telefono")}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Correo</label>
                            <input
                                type="email"
                                placeholder="Ej: contacto@bite.com"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("email", {
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido" }
                                })}
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                        </div>
                        {isEditing && (
                            <div>
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

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3] mt-2">
                        <button
                            type="button"
                            onClick={() => { reset(); onClose(); }}
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
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Restaurante"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};