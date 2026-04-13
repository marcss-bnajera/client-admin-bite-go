export const LoginForm = ({ onForgot }) => {
    return (
        <form className="bg-white border-2 border-gray-100 p-8 rounded-2xl shadow-xl space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Email o Usuario
                </label>
                <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6F00] outline-none transition-colors"
                    type="text"
                    placeholder="admin@biteandgo.com"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Contrasena
                </label>
                <input
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6F00] outline-none transition-colors"
                    type="password"
                    placeholder="••••••••"
                />
            </div>

            <button className="w-full bg-[#FF6F00] hover:bg-[#e66500] text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 uppercase tracking-widest">
                Iniciar Sesión
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-sm font-semibold text-gray-500 hover:text-[#FF6F00] transition-colors"
                >
                    ¿Olvidaste tu contrasena?
                </button>
            </div>
        </form>
    );
};