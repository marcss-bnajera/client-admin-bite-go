export const ForgotPasswordForm = ({ onSwitch }) => {
    return (
        <form className="bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center mb-4">
                <p className="text-gray-600">Ingresa tu correo.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    placeholder="ejemplo@biteandgo.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6F00] outline-none transition-colors"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#FF6F00] hover:bg-[#e66500] text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest"
            >
                Enviar Correo
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-sm font-semibold text-gray-500 hover:text-[#FF6F00] transition-colors"
                >
                    Volver al inicio de sesión
                </button>
            </div>
        </form>
    );
};