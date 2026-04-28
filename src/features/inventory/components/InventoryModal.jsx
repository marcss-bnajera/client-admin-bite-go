import { X, Package } from "lucide-react";
import { useState } from "react";

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

export const InventoryModal = ({ isOpen, onClose, insumo = null }) => {
    const isEditing = !!insumo;

    // Fix: id_restaurante al editar es objeto {_id, nombre}, extraer solo el _id
    const resolvedRestauranteId =
        typeof insumo?.id_restaurante === "object"
            ? insumo?.id_restaurante?._id
            : insumo?.id_restaurante || "";

    const [form, setForm] = useState({
        id_restaurante: resolvedRestauranteId,
        nombre_insumo: insumo?.nombre_insumo || "",
        stock_actual: insumo?.stock_actual ?? "",
        stock_minimo: insumo?.stock_minimo ?? "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id_restaurante: form.id_restaurante,
            nombre_insumo: form.nombre_insumo,
            stock_actual: Number(form.stock_actual),
            stock_minimo: Number(form.stock_minimo),
        };

        if (isEditing) {
            // PUT — solo stock_actual y stock_minimo cambian
            // id_restaurante y nombre_insumo bloqueados por index unico del schema
            console.log(`PUT /suppliesInventory/${insumo._id}`, {
                stock_actual: payload.stock_actual,
                stock_minimo: payload.stock_minimo,
            });
        } else {
            // POST /suppliesInventory
            console.log("POST /suppliesInventory", payload);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Package size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Insumo" : "Nuevo Insumo"}
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
                    {/* Bloqueado al editar — index unico {id_restaurante, nombre_insumo} en el schema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Restaurante *
                        </label>
                        <select
                            name="id_restaurante"
                            value={form.id_restaurante}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <option value="">Seleccionar restaurante...</option>
                            {restaurantes.map((r) => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                        {isEditing && (
                            <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Nombre del Insumo *
                        </label>
                        <input
                            name="nombre_insumo"
                            value={form.nombre_insumo}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            placeholder="Ej: Carne de res, Lechuga..."
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {isEditing && (
                            <p className="text-[10px] text-[#6B6B6B] mt-1">El nombre no puede modificarse — usa Ajustar Stock para cambiar cantidades</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Stock Actual *
                            </label>
                            <input
                                name="stock_actual"
                                value={form.stock_actual}
                                onChange={handleChange}
                                required
                                type="number"
                                min="0"
                                placeholder="Ej: 50"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Stock Minimo *
                            </label>
                            <input
                                name="stock_minimo"
                                value={form.stock_minimo}
                                onChange={handleChange}
                                required
                                type="number"
                                min="0"
                                placeholder="Ej: 10"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl p-3">
                        <p className="text-xs text-[#6B6B6B]">
                            Cuando el <strong>stock actual</strong> sea menor o igual al <strong>stock minimo</strong>, el sistema generara una alerta automatica.
                        </p>
                    </div>

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
                            {isEditing ? "Guardar Cambios" : "Crear Insumo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};