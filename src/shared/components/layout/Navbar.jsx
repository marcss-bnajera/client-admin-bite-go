import { useNavigate } from "react-router-dom";
import imgLogo from "../../../assets/img/Bite&GoLogo.png";
import { AvatarUser } from "../../../shared/ui/AvatarUser";
import { Menu } from "lucide-react";

export const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <nav className="bg-[#F5EFE6] shadow-sm border-b border-[#E8D8C3] sticky top-0 z-50">
            <div className="mx-auto px-3 sm:px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo + título */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 -ml-1 sm:-ml-2 min-w-0">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-xl hover:bg-[#E8D8C3] text-[#2B2B2B] transition-colors shrink-0"
                    >
                        <Menu size={20} />
                    </button>
                    <img
                        src={imgLogo}
                        alt="Bite & Go Logo"
                        className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform hover:scale-105 object-left shrink-0"
                    />
                    <div className="h-6 w-[2px] bg-[#E8D8C3] hidden md:block"></div>
                    <h1 className="font-extrabold text-[#2B2B2B] text-lg md:text-xl tracking-tight hidden md:block whitespace-nowrap">
                        ADMIN <span className="text-[#E67E22]">PANEL</span>
                    </h1>
                </div>

                {/* Botones + Avatar */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                    <button
                        onClick={() => navigate("/dashboard/pedidos?action=new")}
                        className="bg-[#C0392B] text-white px-2.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-bold hover:bg-[#A93226] transition-colors shadow-md whitespace-nowrap"
                    >
                        + Nuevo Pedido
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/reservaciones?action=new")}
                        className="border border-[#E8D8C3] text-[#6B6B6B] px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#E8D8C3] transition-colors hidden sm:block whitespace-nowrap"
                    >
                        + Reservacion
                    </button>
                    <AvatarUser />
                </div>
            </div>
        </nav>
    );
};