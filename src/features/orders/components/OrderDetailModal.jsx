import { X, User, Store, MapPin, Armchair, Bike, ShoppingBag, Clock, CreditCard, Banknote, StickyNote } from "lucide-react";
import { useOrdersStore } from "../store/ordersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const estadoConfig = {
    Pendiente:     { bg: "bg-[#EAD7A4]", text: "text-yellow-800", next: ["Preparacion", "Cancelado"] },
    Preparacion:   { bg: "bg-[#A9C7E8]", text: "text-blue-900",  next: ["Listo", "Cancelado"] },
    Listo:         { bg: "bg-[#A8D5BA]", text: "text-green-900", next: ["Servido", "Cancelado"] },
    Servido:       { bg: "bg-[#D6D6D6]", text: "text-gray-700",  next: ["Entregado"] },
    Entregado:     { bg: "bg-[#D6D6D6]", text: "text-gray-700",  next: [] },
    Cancelado:     { bg: "bg-[#E6A5A5]", text: "text-red-900",   next: [] },
};

const tipoIcons = {
    "Comer aquí": <Armchair size={15} />,
    "Domicilio": <Bike size={15} />,
    "Para llevar": <ShoppingBag size={15} />,
};

export const OrderDetailModal = ({ isOpen, onClose, order, onStatusChange }) => {
    const updateOrder = useOrdersStore((s) => s.updateOrder);
    if (!isOpen || !order) return null;

    const cfg = estadoConfig[order.estado] ?? estadoConfig.Pendiente;

    const handleStatus = async (nuevoEstado) => {
        try {
            await updateOrder(order._id, { estado: nuevoEstado });
            showSuccess(`Estado cambiado a "${nuevoEstado === "Preparacion" ? "En Preparación" : nuevoEstado}"`);
            onStatusChange?.();
            onClose();
        } catch {
            showError("No se pudo cambiar el estado");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                            {order.estado}
                        </span>
                        <h3 className="text-white font-extrabold text-sm">
                            Pedido #{order._id.slice(-5).toUpperCase()}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-[#6B6B6B]">
                            <User size={14} className="text-[#E67E22] shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Cliente</p>
                                <p className="text-[#2B2B2B] font-semibold">{order.cliente_nombre || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#6B6B6B]">
                            <Store size={14} className="text-[#E67E22] shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Restaurante</p>
                                <p className="text-[#2B2B2B] font-semibold">{order.id_restaurante?.nombre || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#6B6B6B]">
                            {tipoIcons[order.tipo_servicio]}
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Tipo</p>
                                <p className="text-[#2B2B2B] font-semibold">{order.tipo_servicio}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#6B6B6B]">
                            <CreditCard size={14} className="text-[#E67E22] shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Total</p>
                                <p className="text-[#C0392B] font-extrabold">Q{order.total?.toFixed(2) ?? "0.00"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dirección si aplica */}
                    {order.direccion_entrega && (
                        <div className="flex items-start gap-2 text-sm bg-[#F5EFE6] rounded-xl px-4 py-3">
                            <MapPin size={14} className="text-[#E67E22] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Dirección de entrega</p>
                                <p className="text-[#2B2B2B]">{order.direccion_entrega}</p>
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    {order.notas && (
                        <div className="flex items-start gap-2 text-sm bg-[#F5EFE6] rounded-xl px-4 py-3">
                            <StickyNote size={14} className="text-[#E67E22] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-[#A0A0A0]">Notas</p>
                                <p className="text-[#2B2B2B]">{order.notas}</p>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <p className="text-xs font-black text-[#6B6B6B] uppercase tracking-widest mb-2">Items</p>
                        <div className="space-y-2">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white border border-[#E8D8C3] rounded-xl px-4 py-2.5">
                                    <div>
                                        <p className="text-sm font-semibold text-[#2B2B2B]">{item.nombre_historico}</p>
                                        <p className="text-xs text-[#6B6B6B]">x{item.cantidad} — Q{item.precio_historico} c/u</p>
                                    </div>
                                    <span className="text-sm font-bold text-[#E67E22]">Q{(item.precio_historico * item.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CAMBIO DE ESTADO — botones grandes para tablet */}
                    {cfg.next.length > 0 && (
                        <div>
                            <p className="text-xs font-black text-[#6B6B6B] uppercase tracking-widest mb-3">Cambiar Estado</p>
                            <div className="flex flex-wrap gap-2">
                                {cfg.next.map((est) => (
                                    <button
                                        key={est}
                                        onClick={() => handleStatus(est)}
                                        className={`flex-1 min-w-[120px] py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
                                            est === "Cancelado"
                                                ? "bg-[#C0392B] text-white hover:bg-[#A93226]"
                                                : "bg-[#E67E22] text-white hover:bg-[#D35400]"
                                        }`}
                                    >
                                        {est === "Preparacion" ? "En Preparación" : est}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
