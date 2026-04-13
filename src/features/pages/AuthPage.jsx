import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import ByteGoLogo from "../../assets/img/Bite&GoLogo.png";

const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-lg">

                <div className="flex justify-center mb-2">
                    <img
                        src={ByteGoLogo}
                        alt="Bite & Go Logo"
                        className="h-17 w-auto object-contain"
                    />

                </div>

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
                        {isForgot ? "Recuperar Acceso" : "Panel de Control"}
                    </h1>
                    <div className="h-1.5 w-16 bg-[#FF6F00] mx-auto mt-1"></div>

                    <p className="text-gray-500 text-sm mt-3">
                        {isForgot
                            ? "Ingresa tu correo para restablecer tu cuenta"
                            : "Accede al núcleo de administración de Bite&Go"}
                    </p>
                </div>

                <div className="transition-all duration-300">
                    {isForgot ? (
                        <ForgotPasswordForm onSwitch={() => setIsForgot(false)} />
                    ) : (
                        <LoginForm onForgot={() => setIsForgot(true)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export { AuthPage };