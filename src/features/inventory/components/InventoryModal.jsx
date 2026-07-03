import { X, Package, Store, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useInventoryStore } from "../store/inventoryStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useSaveInsumo } from "../hooks/useSaveInsumo";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { RestaurantPickerModal } from "../../../shared/components/ui/RestaurantPickerModal";
import { SucursalPickerModal } from "../../../shared/components/ui/SucursalPickerModal";

export const InventoryModal = ({ isOpen, onClose, insumo = null, selectedRestaurantId = "", selectedSucursalId = "", onSaved }) => {
    const isEditing = !!insumo;
    const loading = useInventoryStore((state) => state.loading);
    const { saveInsumo } = useSaveInsumo();
    const restaurants = useRestaurantsStore((state) => state.restaurants);

    const [form, setForm] = useState({
        id_restaurante: "",
        id_sucursal: "",
        nombre_insumo: "",
        stock_actual: "",
        stock_minimo: "",
    });

    const [selectedRestId, setSelectedRestId] = useState("");
    const [selectedSucId, setSelectedSucId] = useState("");
    const [restPickerOpen, setRestPickerOpen] = useState(false);
    const [sucPickerOpen, setSucPickerOpen] = useState(false);
    const prevRestId = useRef(null);
    const prevSucId = useRef(null);

    const selectedRestaurantObj = useMemo(
        () => restaurants.find((r) => r._id === selectedRestId),
        [restaurants, selectedRestId]
    );
    const tieneSucursales = selectedRestaurantObj?.tiene_sucursales && selectedRestaurantObj?.sucursales?.length > 0;
    const sucursales = tieneSucursales ? (selectedRestaurantObj?.sucursales ?? []) : [];
    const selectedSucursalObj = useMemo(
        () => selectedSucId ? sucursales.find((s) => s._id === selectedSucId) : null,
        [sucursales, selectedSucId]
    );

    useEffect(() => {
        if (isOpen) {
            const initialRestId = insumo?.id_restaurante?._id || insumo?.id_restaurante || selectedRestaurantId;
            const initialSucId = insumo?.id_sucursal || selectedSucursalId;
            setSelectedRestId(initialRestId);
            setSelectedSucId(initialSucId);
            prevRestId.current = null;
            prevSucId.current = null;
            setForm({
                id_restaurante: initialRestId,
                id_sucursal: initialSucId,
                nombre_insumo: insumo?.nombre_insumo || "",
                stock_actual: insumo?.stock_actual ?? "",
                stock_minimo: insumo?.stock_minimo ?? "",
            });
        }
    }, [isOpen, insumo, selectedRestaurantId, selectedSucursalId]);

    useEffect(() => {
        if (prevRestId.current === null) {
            prevRestId.current = selectedRestId;
            return;
        }
        if (prevRestId.current !== selectedRestId) {
            setForm((prev) => ({ ...prev, id_restaurante: selectedRestId, id_sucursal: "" }));
            setSelectedSucId("");
            prevRestId.current = selectedRestId;
        }
    }, [selectedRestId]);

    useEffect(() => {
        if (prevSucId.current === null) {
            prevSucId.current = selectedSucId;
            return;
        }
        if (prevSucId.current !== selectedSucId) {
            setForm((prev) => ({ ...prev, id_sucursal: selectedSucId }));
            prevSucId.current = selectedSucId;
        }
    }, [selectedSucId]);

    const handleRestaurantPick = (restaurant) => {
        setSelectedRestId(restaurant._id);
        setSelectedSucId("");
        setForm((prev) => ({ ...prev, id_restaurante: restaurant._id, id_sucursal: "" }));
    };

    const handleSucursalPick = (sucursal) => {
        setSelectedSucId(sucursal._id);
        setForm((prev) => ({ ...prev, id_sucursal: sucursal._id }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveInsumo(form, insumo?._id ?? null);
            showSuccess(isEditing ? "Insumo actualizado correctamente" : "Insumo creado correctamente");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar el insumo");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D8C3]">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <Package size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Insumo" : "Nuevo Insumo"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

                    {/* Restaurante — bloqueado al editar por index único */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                        {selectedRestId && selectedRestaurantObj ? (
                            <button type="button" disabled={isEditing} onClick={() => !isEditing && setRestPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#E67E22] bg-[#E67E22]/5 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-[#E67E22]/10" : "cursor-not-allowed opacity-60"}`}>
                                <div className="w-6 h-6 rounded-lg bg-[#E67E22]/20 flex items-center justify-center shrink-0">
                                    <Store size={12} className="text-[#E67E22]" />
                                </div>
                                <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedRestaurantObj.nombre}</span>
                                {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                            </button>
                        ) : (
                            <button type="button" onClick={() => setRestPickerOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 border border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0] rounded-xl text-sm transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                    <Store size={14} className="text-[#6B6B6B]" />
                                </div>
                                <span className="text-[#6B6B6B]">Seleccionar restaurante...</span>
                            </button>
                        )}
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El restaurante no puede modificarse</p>}
                    </div>

                    {/* Sucursal */}
                    {tieneSucursales && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Sucursal *</label>
                            {selectedSucId && selectedSucursalObj ? (
                                <button type="button" disabled={isEditing} onClick={() => !isEditing && setSucPickerOpen(true)} className={`w-full flex items-center gap-2 px-4 py-2.5 border border-[#A9C7E8] bg-blue-50 rounded-xl text-left transition-colors ${!isEditing ? "cursor-pointer hover:bg-blue-100" : "cursor-not-allowed opacity-60"}`}>
                                    <div className="w-6 h-6 rounded-lg bg-[#A9C7E8]/30 flex items-center justify-center shrink-0">
                                        <MapPin size={12} className="text-blue-700" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#2B2B2B] truncate flex-1">{selectedSucursalObj.nombre}</span>
                                    {!isEditing && <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />}
                                </button>
                            ) : (
                                <button type="button" onClick={() => setSucPickerOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 border border-[#E8D8C3] bg-[#F5EFE6]/50 hover:border-[#D3C4B0] rounded-xl text-sm transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                        <MapPin size={14} className="text-[#6B6B6B]" />
                                    </div>
                                    <span className="text-[#6B6B6B]">Seleccionar sucursal...</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Nombre insumo — bloqueado al editar */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Nombre del Insumo *</label>
                        <input
                            name="nombre_insumo"
                            value={form.nombre_insumo}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            placeholder="Ej: Carne de res, Lechuga..."
                            className={`w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        {isEditing && <p className="text-[10px] text-[#6B6B6B] mt-1">El nombre no puede modificarse — usá Ajustar Stock para cambiar cantidades</p>}
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Stock Actual *</label>
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
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Stock Mínimo *</label>
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
                            Cuando el <strong>stock actual</strong> sea menor o igual al <strong>stock mínimo</strong>, el sistema generará una alerta automática.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3]">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60">
                            {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Insumo"}
                        </button>
                    </div>
                </form>
            </div>

            <RestaurantPickerModal
                isOpen={restPickerOpen}
                onClose={() => setRestPickerOpen(false)}
                onSelect={handleRestaurantPick}
                selectedId={selectedRestId}
            />
            <SucursalPickerModal
                isOpen={sucPickerOpen}
                onClose={() => setSucPickerOpen(false)}
                onSelect={handleSucursalPick}
                sucursales={selectedRestaurantObj?.sucursales ?? []}
                selectedId={selectedSucId}
            />
        </div>
    );
};