import { X, Users, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

const roles = ["Admin_Plataforma", "Admin_Restaurante", "Mesero", "Repartidor", "Cocinero", "Cliente"];
const rolesConRestaurante = ["Admin_Restaurante", "Mesero", "Repartidor", "Cocinero"];

const initialForm = {
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    dpi: "",
    rol: "Cliente",
    id_restaurante: "",
};

export const UserModal = ({ isOpen, onClose, user = null }) => {
    const isEditing = !!user;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // Sincronizar form cuando cambia el user recibido
    useEffect(() => {
        if (isOpen) {
            setChangePassword(false);
            setErrors({});
            setForm(
                user
                    ? {
                        nombre: user.nombre || "",
                        email: user.email || "",
                        password: "",
                        confirmPassword: "",
                        telefono: user.telefono || "",
                        direccion: user.direccion || "",
                        dpi: user.dpi || "",
                        rol: user.rol || "Cliente",
                        // Normalizar: si viene objeto {_id, nombre}, extraer solo _id
                        id_restaurante: user.id_restaurante?._id || user.id_restaurante || "",
                    }
                    : initialForm
            );
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const requiereRestaurante = rolesConRestaurante.includes(form.rol);

    const validate = () => {
        const newErrors = {};
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!form.email.trim()) newErrors.email = "El correo es obligatorio";
        if (!form.dpi.trim()) newErrors.dpi = "El DPI es obligatorio";

        if (!isEditing) {
            if (!form.password) newErrors.password = "La contraseña es obligatoria";
            else if (form.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
            if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (isEditing && changePassword) {
            if (!form.password) newErrors.password = "Ingresa la nueva contraseña";
            else if (form.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
            if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (requiereRestaurante && !form.id_restaurante) {
            newErrors.id_restaurante = "Selecciona un restaurante";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
            direccion: form.direccion,
            dpi: form.dpi,
            rol: form.rol,
            id_restaurante: requiereRestaurante ? form.id_restaurante : null,
        };

        if (!isEditing) {
            payload.password = form.password;
        } else if (changePassword && form.password) {
            payload.password = form.password;
        }

        console.log(isEditing ? "Payload → PUT /users/:id:" : "Payload → POST /users:", payload);
        onClose();
    };

    if (!isOpen) return null;

    const showPasswordSection = !isEditing || changePassword;

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
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Nombre + DPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Nombre Completo *
                            </label>
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Juan Pérez"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.nombre ? "border-red-400" : "border-[#E8D8C3]"}`}
                            />
                            {errors.nombre && <p className="text-[10px] text-red-500 mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                DPI *
                            </label>
                            <input
                                name="dpi"
                                value={form.dpi}
                                onChange={handleChange}
                                placeholder="Ej: 1234567890101"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.dpi ? "border-red-400" : "border-[#E8D8C3]"}`}
                            />
                            {errors.dpi && <p className="text-[10px] text-red-500 mt-1">{errors.dpi}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            disabled={isEditing}
                            placeholder="Ej: usuario@biteandgo.com"
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""} ${errors.email ? "border-red-400" : ""}`}
                        />
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El correo no puede modificarse</p>}
                        {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Toggle cambiar contraseña en edición */}
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <input
                                id="changePassword"
                                type="checkbox"
                                checked={changePassword}
                                onChange={(e) => {
                                    setChangePassword(e.target.checked);
                                    setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                                    setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }));
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
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.password ? "border-red-400" : "border-[#E8D8C3]"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2B2B2B]"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                    Confirmar Contraseña *
                                </label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Repite la contraseña"
                                        className={`w-full px-4 py-2.5 pr-10 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.confirmPassword ? "border-red-400" : "border-[#E8D8C3]"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#2B2B2B]"
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    )}

                    {/* Teléfono + Rol */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Teléfono
                            </label>
                            <input
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                placeholder="Ej: 5555-1234"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Rol *
                            </label>
                            <select
                                name="rol"
                                value={form.rol}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                {roles.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Dirección
                        </label>
                        <input
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            placeholder="Ej: Zona 10, Guatemala"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    {/* Restaurante condicional */}
                    {requiereRestaurante && (
                        <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl p-3">
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Restaurante Asignado *
                            </label>
                            <select
                                name="id_restaurante"
                                value={form.id_restaurante}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-white transition-colors ${errors.id_restaurante ? "border-red-400" : "border-[#E8D8C3]"}`}
                            >
                                <option value="">Seleccionar restaurante...</option>
                                {restaurantes.map((r) => (
                                    <option key={r._id} value={r._id}>{r.nombre}</option>
                                ))}
                            </select>
                            {errors.id_restaurante
                                ? <p className="text-[10px] text-red-500 mt-1">{errors.id_restaurante}</p>
                                : <p className="text-[10px] text-[#6B6B6B] mt-1">El rol <strong>{form.rol}</strong> requiere restaurante asignado</p>
                            }
                        </div>
                    )}

                    {/* Footer */}
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
                            {isEditing ? "Guardar Cambios" : "Registrar Usuario"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};