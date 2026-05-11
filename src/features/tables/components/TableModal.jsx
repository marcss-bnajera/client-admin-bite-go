import { X, Armchair } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveMesa } from "../hooks/useSaveMesa";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const ESTADOS = ["Disponible", "Ocupada", "Reservada", "Mantenimiento"];

const resolveRestId = (table, restauranteId) =>
    restauranteId
    || (typeof table?.id_restaurante === "object" ? table?.id_restaurante?._id : table?.id_restaurante)
    || "";

export const TableModal = ({ isOpen, onClose, table = null, restauranteId = null, onSaved }) => {
    const isEditing = !!table;
    const { saveMesa } = useSaveMesa();
    const loading = useRestaurantsStore((state) => state.loading);
    const restaurants = useRestaurantsStore((state) => state.restaurants);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                id_restaurante: resolveRestId(table, restauranteId),
                numero: table?.numero || "",
                capacidad: table?.capacidad || "",
                ubicacion: table?.ubicacion || "",
                estado: table?.estado || "Disponible",
            });
        }
    }, [isOpen, table, restauranteId, reset]);

    const onSubmit = async (data) => {
        try {
            const originalRestaurantId = typeof table?.id_restaurante === "object"
                ? table?.id_restaurante?._id
                : table?.id_restaurante;

            await saveMesa(data, data.id_restaurante, table?._id ?? null, originalRestaurantId);
            showSuccess(isEditing ? "Mesa actualizada" : "Mesa creada");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar la mesa");
        }
    };

    if (!isOpen) return null;

    const inputClass = (name) =>
        `w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors[name] ? "border-red-400" : "border-[#E8D8C3]"}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Armchair size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Mesa" : "Nueva Mesa"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">

                    {!restauranteId && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                            <select
                                className={inputClass("id_restaurante")}
                                {...register("id_restaurante", { required: "Selecciona un restaurante" })}
                            >
                                <option value="">Seleccionar restaurante...</option>
                                {restaurants.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                            {errors.id_restaurante && <p className="text-[10px] text-red-500 mt-1">{errors.id_restaurante.message}</p>}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Número *</label>
                            <input
                                type="number"
                                placeholder="Ej: 1"
                                className={inputClass("numero")}
                                {...register("numero", {
                                    required: "El número es obligatorio",
                                    min: { value: 1, message: "Debe ser mayor a 0" },
                                })}
                            />
                            {errors.numero && <p className="text-[10px] text-red-500 mt-1">{errors.numero.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Capacidad *</label>
                            <input
                                type="number"
                                placeholder="Ej: 4"
                                className={inputClass("capacidad")}
                                {...register("capacidad", {
                                    required: "La capacidad es obligatoria",
                                    min: { value: 1, message: "Debe ser mayor a 0" },
                                    max: { value: 20, message: "Capacidad máxima es 20 personas" },
                                })}
                            />
                            {errors.capacidad && <p className="text-[10px] text-red-500 mt-1">{errors.capacidad.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Ubicación *</label>
                        <input
                            placeholder="Ej: Terraza, Interior, Barra..."
                            className={inputClass("ubicacion")}
                            {...register("ubicacion", { required: "La ubicación es obligatoria" })}
                        />
                        {errors.ubicacion && <p className="text-[10px] text-red-500 mt-1">{errors.ubicacion.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                        <select
                            className={inputClass("estado")}
                            {...register("estado")}
                        >
                            {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Mesa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};