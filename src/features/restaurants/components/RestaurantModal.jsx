import { X, Store, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveRestaurant } from "../hooks/useSaveRestaurant";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { uploadRestaurantPhoto } from "../../../shared/api/admin";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { TimePicker } from "../../../shared/ui/DatePicker";

export const RestaurantModal = ({ isOpen, onClose, restaurant = null, onSaved }) => {
    const isEditing = !!restaurant;
    const { saveRestaurant } = useSaveRestaurant();
    const loading = useRestaurantsStore((state) => state.loading);

    const [horarioApertura, setHorarioApertura] = useState("08:00");
    const [horarioCierre, setHorarioCierre] = useState("22:00");
    const [tieneSucursales, setTieneSucursales] = useState(false);
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            if (restaurant) {
                const [apertura = "08:00", cierre = "22:00"] = (restaurant.horarios_atencion || "08:00 - 22:00").split(" - ");
                setHorarioApertura(apertura);
                setHorarioCierre(cierre);
                setTieneSucursales(restaurant.tiene_sucursales ?? false);
                setFotoFile(null);
                setFotoPreview(restaurant.fotos_url?.[0] || null);
                reset({
                    nombre: restaurant.nombre || "",
                    direccion_texto: restaurant.direccion?.texto || "",
                    categoria_gastronomica: restaurant.categoria_gastronomica || "",
                    precio_promedio: restaurant.precio_promedio || "",
                    telefono: restaurant.informacion_contacto?.telefono || "",
                    email: restaurant.informacion_contacto?.email || "",
                    activo: restaurant.activo ?? true,
                });
            } else {
                setHorarioApertura("08:00");
                setHorarioCierre("22:00");
                setTieneSucursales(false);
                setFotoFile(null);
                setFotoPreview(null);
                reset({
                    nombre: "",
                    direccion_texto: "",
                    categoria_gastronomica: "",
                    precio_promedio: "",
                    telefono: "",
                    email: "",
                    activo: true,
                });
            }
        }
    }, [isOpen, restaurant, reset]);

    const handleFotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            horarios_atencion: `${horarioApertura} - ${horarioCierre}`,
            tiene_sucursales: tieneSucursales,
        };
        try {
            const savedRestaurant = await saveRestaurant(payload, restaurant?._id ?? null);

            showSuccess(isEditing ? "Restaurante actualizado correctamente" : "Restaurante creado correctamente");
            reset();
            onClose();

            onSaved?.(savedRestaurant);

            if (fotoFile && savedRestaurant?._id) {
                const formData = new FormData();
                formData.append("foto", fotoFile);
                uploadRestaurantPhoto(savedRestaurant._id, formData).catch(() => {
                    showError("Error al subir la foto. Puedes intentar desde Editar.");
                });
            }
        } catch (error) {
            showError("Error al guardar el restaurante");
        }
    };

    if (!isOpen) return null;

    const inputClass = (name) =>
        `w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none bg-[#F5EFE6]/50 transition-colors ${errors[name]
            ? "border-red-400 focus:border-red-500"
            : "border-[#E8D8C3] focus:border-[#E67E22]"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
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

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">

                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-[#E8D8C3] bg-[#F5EFE6]/50 flex items-center justify-center">
                            {fotoPreview ? (
                                <img src={fotoPreview} alt="Vista previa" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Camera size={28} className="text-[#6B6B6B] mx-auto" />
                                    <span className="text-[10px] text-[#6B6B6B] mt-1 block">Foto del restaurante</span>
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer px-4 py-2 rounded-xl border border-[#E8D8C3] text-xs font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            {fotoPreview ? "Cambiar foto" : "Subir foto"}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp,image/avif"
                                className="hidden"
                                onChange={handleFotoChange}
                            />
                        </label>
                        <p className="text-[10px] text-[#6B6B6B]">JPEG, PNG, WEBP (máx. 10MB)</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Restaurante *</label>
                        <input
                            placeholder="Ej: Bite Central"
                            className={inputClass("nombre")}
                            {...register("nombre", {
                                required: "El nombre es obligatorio",
                                minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
                            })}
                        />
                        {errors.nombre && <span className="text-red-500 text-xs mt-1 block">{errors.nombre.message}</span>}
                    </div>

                    {!tieneSucursales && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Dirección *</label>
                            <input
                                placeholder="Ej: Zona 10, Ciudad de Guatemala"
                                className={inputClass("direccion_texto")}
                                {...register("direccion_texto", !tieneSucursales ? { required: "La dirección es obligatoria" } : {})}
                            />
                            {errors.direccion_texto && <span className="text-red-500 text-xs mt-1 block">{errors.direccion_texto.message}</span>}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Abre *</label>
                            <TimePicker value={horarioApertura} onChange={setHorarioApertura} placeholder="Hora apertura" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cierra *</label>
                            <TimePicker value={horarioCierre} onChange={setHorarioCierre} placeholder="Hora cierre" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Precio Promedio (Q) *</label>
                            <input
                                type="number" min="0" placeholder="Ej: 75"
                                className={inputClass("precio_promedio")}
                                {...register("precio_promedio", {
                                    required: "El precio es obligatorio",
                                    min: { value: 0, message: "Debe ser mayor o igual a 0" }
                                })}
                            />
                            {errors.precio_promedio && <span className="text-red-500 text-xs mt-1 block">{errors.precio_promedio.message}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Categoría *</label>
                            <input
                                placeholder="Ej: Comida Rápida, Fusión..."
                                className={inputClass("categoria_gastronomica")}
                                {...register("categoria_gastronomica", { required: "La categoría es obligatoria" })}
                            />
                            {errors.categoria_gastronomica && <span className="text-red-500 text-xs mt-1 block">{errors.categoria_gastronomica.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Teléfono *</label>
                            <input placeholder="Ej: 2345-6789" className={inputClass("telefono")} {...register("telefono", { required: "El teléfono es obligatorio" })} />
                            {errors.telefono && <span className="text-red-500 text-xs mt-1 block">{errors.telefono.message}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Correo *</label>
                            <input type="email" placeholder="Ej: contacto@bite.com" className={inputClass("email")} {...register("email", { required: "El correo es obligatorio", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido" } })} />
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                        </div>
                    </div>

                    {isEditing && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                            <select className={inputClass("activo")} {...register("activo")}>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                    )}

                    <div className="border border-[#E8D8C3] rounded-xl p-4 bg-[#F5EFE6]/30">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={tieneSucursales}
                                onChange={(e) => setTieneSucursales(e.target.checked)}
                                className="w-4 h-4 accent-[#E67E22] rounded"
                            />
                            <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wide">Este restaurante tiene sucursales</span>
                        </label>
                        <p className="text-[11px] text-[#6B6B6B] mt-1 ml-7">
                            {tieneSucursales
                                ? "Las sucursales se gestionan desde la tarjeta del restaurante"
                                : "Al activar, la dirección principal se omite (cada sucursal tiene la suya)"}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3] mt-2">
                        <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Restaurante"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
