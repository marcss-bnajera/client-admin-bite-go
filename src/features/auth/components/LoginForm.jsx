import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export const LoginForm = ({ onForgot }) => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const res = await login(data.emailOrUsername, data.password);
        if (res?.success) {
            navigate("/dashboard");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Email o Usuario
                </label>
                <input
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    type="text"
                    placeholder="correo@ejemplo.com o usuario"
                    {...register("emailOrUsername", {
                        required: "Este campo es obligatorio"
                    })}
                />
                {errors.emailOrUsername && (
                    <p className="text-red-500 text-xs mt-1">{errors.emailOrUsername.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password", {
                            required: "La contraseña es obligatoria"
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6F00] hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>

            <div className="text-center text-sm">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-[#FF6F00] hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </form>
    );
};
