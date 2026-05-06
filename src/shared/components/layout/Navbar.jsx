import { useNavigate } from "react-router-dom";
import imgLogo from "../../../assets/img/Bite&GoLogo.png";
import { AvatarUser } from "../../../shared/ui/AvatarUser";

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-[#F5EFE6] shadow-sm border-b border-[#E8D8C3] sticky top-0 z-50">
            <div className="mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo + título */}
                <div className="flex items-center gap-3 md:gap-4 -ml-2">
                    <img
                        src={imgLogo}
                        alt="Bite & Go Logo"
                        className="h-9 md:h-10 w-auto object-contain transition-transform hover:scale-105 object-left"
                    />
                </div>

                {/* Botones + Avatar */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={() => navigate("/dashboard/pedidos?action=new")}
                        className="bg-[#C0392B] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-[#A93226] transition-colors shadow-md"
                    >
                        + Nuevo Pedido
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/reservaciones?action=new")}
                        className="border border-[#E8D8C3] text-[#6B6B6B] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#E8D8C3] transition-colors hidden sm:block"
                    >
                        + Reservacion
                    </button>
                    <AvatarUser />
                </div>
            </div>
        </nav>
    );
};
