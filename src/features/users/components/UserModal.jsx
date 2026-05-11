import { X, Users, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveUser } from "../hooks/useSaveUser";
import { useUsersStore } from "../store/usersStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const roles = ["SuperAdmin", "Admin_Restaurante", "Mesero", "Repartidor", "Cocinero", "Cliente"];
const rolesConRestaurante = ["Admin_Restaurante", "Mesero", "Repartidor", "Cocinero"];

export const UserModal = ({ isOpen, onClose, user = null, onSaved }) => {
    const isEditing = !!user;
    const { saveUser } = useSaveUser();
    const loading = useUsersStore((state) => state.loading);

    const restaurantes = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    const rolActual = watch("rol", "Cliente");
    const requiereRestaurante = rolesConRestaurante.includes(rolActual);
    const showPasswordSection = !isEditing || changePassword;

    useEffect(() => {
        if (isOpen) getRestaurants();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setChangePassword(false);
            reset(user ? {
                nombre: user.nombre || "",
                email: user.email || "",
                password: "",
                confirmPassword: "",
                telefono: user.telefono || "",
                direccion: user.direccion || "",
                dpi: user.dpi || "",
                rol: user.rol || "Cliente",
                id_restaurante: user.id_restaurante?._id || user.id_restaurante || "",
            } : {
                nombre: "", email: "", password: "", confirmPassword: "",
                telefono: "", direccion: "", dpi: "", rol: "Cliente", id_restaurante: "",
            });
        }
    }, [isOpen, user, reset]);

    const onSubmit = async (data) => {
        if (isEditing && !changePassword) {
            delete data.password;
            delete data.confirmPassword;
        }
        try {
            await saveUser(data, user?._id ?? null);
            showSuccess(isEditing ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar el usuario");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Users size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">

                    {/* Nombre + DPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre Completo *</label>
                            <input
                                placeholder="Ej: Juan Pérez"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.nombre ? "border-red-400" : "border-[#E8D8C3]"}`}
                                {...register("nombre", {
                                    required: "El nombre es obligatorio",
                                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                })}
                            />
                            {errors.nombre && <p className="text-[10px] text-red-500 mt-1">{errors.nombre.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">DPI *</label>
                            <input
                                placeholder="Ej: 1234567890101"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.dpi ? "border-red-400" : "border-[#E8D8C3]"}`}
                                {...register("dpi", {
                                    required: "El DPI es obligatorio",
                                    pattern: { value: /^\d{13}$/, message: "El DPI debe tener exactamente 13 dígitos" },
                                })}
                            />
                            {errors.dpi && <p className="text-[10px] text-red-500 mt-1">{errors.dpi.message}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Correo Electrónico *</label>
                        <input
                            type="email"
                            disabled={isEditing}
                            placeholder="Ej: usuario@biteandgo.com"
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""} ${errors.email ? "border-red-400" : ""}`}
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido" },
                            })}
                        />
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El correo no puede modificarse</p>}
                        {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Toggle cambiar contraseña */}
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <input
                                id="changePassword"
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => {
                                    setChangePassword(e.target.checked);
                                    reset({ ...watch(), password: "", confirmPassword: "" });
                                }}
                                className="accent-[#C0392B] w-4 h-4"
                            />
                            <label htmlFor="changePassword" className="text-xs font-semibold text-[#6B6B6B] cursor-pointer">
                                Cambiar contraseña
                            </label>
                        </div>
                    )}

                    {/* Contraseña */}
                    {showPasswordSection && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                    {isEditing ? "Nueva Contraseña" : "Contraseña *"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.password ? "border-red-400" : "border-[#E8D8C3]"}`}
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 8, message: "Mínimo 8 caracteres" },
                                        })}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2B2B2B]">
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Confirmar Contraseña *</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Repite la contraseña"
                                        className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.confirmPassword ? "border-red-400" : "border-[#E8D8C3]"}`}
                                        {...register("confirmPassword", {
                                            required: "Confirma la contraseña",
                                            validate: (value) => value === watch("password") || "Las contraseñas no coinciden",
                                        })}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2B2B2B]">
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* Teléfono + Rol */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Teléfono</label>
                            <input
                                placeholder="Ej: 5555-1234"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.telefono ? "border-red-400" : "border-[#E8D8C3]"}`}
                                {...register("telefono", {
                                    pattern: { value: /^\d{8}$/, message: "Debe tener 8 dígitos" },
                                })}
                            />
                            {errors.telefono && <p className="text-[10px] text-red-500 mt-1">{errors.telefono.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Rol *</label>
                            <select
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                {...register("rol", { required: "El rol es obligatorio" })}
                            >
                                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.rol && <p className="text-[10px] text-red-500 mt-1">{errors.rol.message}</p>}
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Dirección</label>
                        <input
                            placeholder="Ej: Zona 10, Guatemala"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            {...register("direccion")}
                        />
                    </div>

                    {/* Restaurante condicional */}
                    {requiereRestaurante && (
                        <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl p-3">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante Asignado *</label>
                            <select
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-white transition-colors ${errors.id_restaurante ? "border-red-400" : "border-[#E8D8C3]"}`}
                                {...register("id_restaurante", {
                                    validate: (value) => !requiereRestaurante || !!value || "Selecciona un restaurante",
                                })}
                            >
                                <option value="">Seleccionar restaurante...</option>
                                {restaurantes.map((r) => <option key={r._id} value={r._id}>{r.nombre}</option>)}
                            </select>
                            {errors.id_restaurante
                                ? <p className="text-[10px] text-red-500 mt-1">{errors.id_restaurante.message}</p>
                                : <p className="text-[10px] text-[#6B6B6B] mt-1">El rol <strong>{rolActual}</strong> requiere restaurante asignado</p>
                            }
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Registrar Usuario"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};