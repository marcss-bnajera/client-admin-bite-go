import { useState, useRef, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/authStore"
import defaultAvatarImg from "../../assets/img/avatar-bite-go.jpg"

export const AvatarUser = () => {
    const { user, logout } = useAuthStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const avatarSrc = user?.profilePicture && user.profilePicture.trim() !== ""
        ? user.profilePicture : defaultAvatarImg;

    return (
        <div className="relative" ref={dropdownRef}>
            <img
                onClick={toggleMenu}
                src={avatarSrc}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatarImg;
                }}
            />
            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-[#3A2E2A] border border-[#5a4a44] rounded-xl shadow-xl animate-fadeIn z-50 overflow-hidden">
                    {/* Header con avatar y datos */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#4a3c38] to-[#3A2E2A] border-b border-[#5a4a44]">
                        <img
                            src={avatarSrc}
                            alt={user?.username}
                            className="w-10 h-10 rounded-full object-cover border border-[#E8D8C3]"
                        />
                        <div>
                            <p className="font-semibold text-white">{user?.username}</p>
                            <p className="text-xs text-[#8a7a72] truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Opciones */}
                    <ul className="p-2 text-sm font-medium space-y-1">
                        <li>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 p-2 rounded-lg transition-all
                               text-[#D1D1D1] hover:bg-[#D35400] hover:text-white"
                            >
                                <svg className="w-4 h-4 text-[#E67E22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-12l2 2m-2-2v8m0 0H5m14 0H5" />
                                </svg>
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/dashboard/usuarios"
                                className="flex items-center gap-2 p-2 rounded-lg transition-all
                               text-[#D1D1D1] hover:bg-[#D35400] hover:text-white"
                            >
                                <svg className="w-4 h-4 text-[#3498DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                </svg>
                                Usuarios
                            </Link>
                        </li>

                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left p-2 rounded-lg transition-all
                               text-red-500 hover:bg-[#D35400] hover:text-white"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0H5m0 0v14h8" />
                                </svg>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            )}

        </div>
    );
};
