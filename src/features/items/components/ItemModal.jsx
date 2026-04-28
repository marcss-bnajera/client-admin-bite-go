import { X, Layers } from "lucide-react";
import { useState, useEffect } from "react";

const productos = [
    { _id: "prod_001", nombre: "Burger Clásica", precio: 55 },
    { _id: "prod_002", nombre: "Limonada Natural", precio: 25 },
    { _id: "prod_003", nombre: "Alitas BBQ", precio: 65 },
    { _id: "prod_004", nombre: "Pasta Alfredo", precio: 70 },
];

const buildForm = (item) => ({
    id_producto: item?.id_producto ?? "",
    nombre_historico: item?.nombre_historico ?? "",
    precio_historico: item?.precio_historico ?? 0,
    cantidad: item?.cantidad ?? 1,
    notas: item?.notas ?? "",
});

export const ItemModal = ({ isOpen, onClose, item = null, orderId = null }) => {
    const isEditing = !!item;
    const [form, setForm] = useState(() => buildForm(item));

    // Resetea form al cambiar el item o al abrir/cerrar
    useEffect(() => {
        setForm(buildForm(item));
    }, [item, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Al seleccionar producto nuevo, captura nombre y precio del catálogo
        if (name === "id_producto") {
            const prod = productos.find((p) => p._id === value);
            setForm((prev) => ({
                ...prev,
                id_producto: value,
                nombre_historico: prod?.nombre ?? "",
                precio_historico: prod?.precio ?? 0,
            }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const subtotal = Number(form.precio_historico) * Number(form.cantidad);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // Solo cantidad y notas son editables en un item ya creado
            console.log(`Payload → PUT /orders/${orderId}/items/${item._id}:`, {
                cantidad: Number(form.cantidad),
                notas: form.notas.trim(),
            });
        } else {
            // Payload completo para agregar subdocumento al array items del pedido
            console.log(`Payload → POST /orders/${orderId}/items:`, {
                id_producto: form.id_producto,
                nombre_historico: form.nombre_historico,
                precio_historico: Number(form.precio_historico),
                cantidad: Number(form.cantidad),
                notas: form.notas.trim(),
            });
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Layers size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Item" : "Agregar Item al Pedido"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Producto — bloqueado en edición porque nombre_historico y precio_historico son inmutables */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Producto *
                        </label>
                        {isEditing ? (
                            <>
                                <div className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] bg-[#F5EFE6]/50">
                                    {form.nombre_historico}
                                </div>
                                <p className="text-[10px] text-[#6B6B6B] mt-1">
                                    El producto no puede modificarse — solo cantidad y notas
                                </p>
                            </>
                        ) : (
                            <select
                                name="id_producto"
                                value={form.id_producto}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="">Seleccionar producto...</option>
                                {productos.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.nombre} — Q{p.precio.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Precio — solo lectura, viene del catálogo */}
                    {form.id_producto && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Precio Unitario
                            </label>
                            <div className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm font-bold text-[#E67E22] bg-[#F5EFE6]/50">
                                Q{Number(form.precio_historico).toFixed(2)}
                                <span className="text-xs text-[#6B6B6B] font-normal ml-2">(no editable)</span>
                            </div>
                        </div>
                    )}

                    {/* Cantidad — min:1 según el schema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Cantidad *
                        </label>
                        <input
                            name="cantidad"
                            value={form.cantidad}
                            onChange={handleChange}
                            required
                            type="number"
                            min="1"
                            placeholder="Ej: 2"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    {/* Notas — trim en el schema, opcional */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Notas
                        </label>
                        <input
                            name="notas"
                            value={form.notas}
                            onChange={handleChange}
                            placeholder="Ej: Sin cebolla, extra salsa..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    {/* Preview subtotal */}
                    {form.id_producto && (
                        <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#2B2B2B]">Subtotal</span>
                            <span className="text-lg font-extrabold text-[#E67E22]">Q{subtotal.toFixed(2)}</span>
                        </div>
                    )}

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
                            {isEditing ? "Guardar Cambios" : "Agregar Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};