// Reemplaza imgLogo con la ruta de tu imagen de Bite & Go
import imgLogo from "../../../assets/img/Bite&GoLogo.png";

export const Navbar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-4 -ml-2">
                    <img
                        src={imgLogo}
                        alt="Bite & Go Logo"
                        className="h-10 w-auto object-contain transition-transform hover:scale-105 object-left"
                    />
                    <div className="h-6 w-[2px] bg-gray-200 hidden md:block"></div>
                    <h1 className="font-extrabold text-[#262626] text-xl tracking-tight hidden md:block">
                        ADMIN <span className="text-[#F27405]">PANEL</span>
                    </h1>
                </div>

                {/* Acciones Rápidas */}
                <div className="flex items-center gap-3">
                    <button className="bg-[#F27405] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#D96905] transition-colors shadow-md">
                        + Nuevo Pedido
                    </button>
                    <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                        + Reservación
                    </button>
                    <div className="w-10 h-10 rounded-full border-2 border-gray-100 bg-[#262626] flex items-center justify-center text-white font-bold text-sm">
                        BG
                    </div>
                </div>
            </div>
        </nav>
    );
};