import { X, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useSaveItem } from "../hooks/useSaveItem";
import { useItemsStore } from "../store/itemsStore";
import { useProductsStore } from "../../products/store/productsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const buildForm = (item) => ({
    id_producto: item?.id_producto ?? "",
    nombre_historico: item?.nombre_historico ?? "",
    precio_historico: item?.precio_historico ?? 0,
    cantidad: item?.cantidad ?? 1,
    notas: item?.notas ?? "",
});

export const ItemModal = ({ isOpen, onClose, item = null, orderId = null, onSaved }) => {
    const isEditing = !!item;
    const { saveItem } = useSaveItem();
    const loading = useItemsStore((state) => state.loading);
    const products = useProductsStore((state) => state.products);
    const getProducts = useProductsStore((state) => state.getProducts);

    const [form, setForm] = useState(() => buildForm(item));

    useEffect(() => {
        if (isOpen) getProducts({ activo: true, limit: 200 });
    }, [isOpen]);

    useEffect(() => {
        setForm(buildForm(item));
    }, [isOpen, item?._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Al seleccionar producto, captura nombre y precio del catálogo real
        if (name === "id_producto") {
            const prod = products.find((p) => p._id === value);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveItem(form, orderId, item?._id ?? null);
            showSuccess(isEditing ? "Item actualizado correctamente" : "Item agregado correctamente");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar el item");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Layers size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Item" : "Agregar Item al Pedido"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Producto — bloqueado en edición */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Producto *</label>
                        {isEditing ? (
                            <>
                                <div className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] bg-[#F5EFE6]/50">
                                    {form.nombre_historico}
                                </div>
                                <p className="text-[10px] text-[#6B6B6B] mt-1">El producto no puede modificarse — solo cantidad y notas</p>
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
                                {products.filter((p) => p.activo && p.disponibilidad).map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.nombre} — Q{p.precio?.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Precio — solo lectura */}
                    {form.id_producto && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Precio Unitario</label>
                            <div className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm font-bold text-[#E67E22] bg-[#F5EFE6]/50">
                                Q{Number(form.precio_historico).toFixed(2)}
                                <span className="text-xs text-[#6B6B6B] font-normal ml-2">(no editable)</span>
                            </div>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cantidad *</label>
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

                    {/* Notas */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Notas</label>
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

                    {/* BOTONES */}
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
                            disabled={loading}
                            className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Agregar Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};