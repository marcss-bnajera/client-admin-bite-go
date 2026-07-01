import { X, MapPin, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { showSuccess, showError } from "../../../shared/utils/toast";
import { TimePicker } from "../../../shared/ui/DatePicker";

const emptySucursal = () => ({
    _tempId: Date.now(),
    nombre: "",
    direccion_texto: "",
    horarioApertura: "08:00",
    horarioCierre: "22:00",
    telefono: "",
    email: "",
    mesas: [],
});

const emptyMesa = () => ({ numero: "", capacidad: "", ubicacion: "", estado: "Disponible" });

export const SucursalModal = ({ isOpen, onClose, restaurant }) => {
    const addSucursal = useRestaurantsStore((s) => s.addSucursal);
    const updateSucursal = useRestaurantsStore((s) => s.updateSucursal);
    const deleteSucursal = useRestaurantsStore((s) => s.deleteSucursal);
    const addMesaSucursal = useRestaurantsStore((s) => s.addMesaSucursal);
    const deleteMesaSucursal = useRestaurantsStore((s) => s.deleteMesaSucursal);
    const getRestaurants = useRestaurantsStore((s) => s.getRestaurants);

    const [sucursales, setSucursales] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [newMesaMap, setNewMesaMap] = useState({});

    useEffect(() => {
        if (isOpen && restaurant) {
            setSucursales(
                (restaurant.sucursales || []).map((s) => ({
                    ...s,
                    direccion_texto: s.direccion?.texto || "",
                    horarioApertura: (s.horarios_atencion || "08:00 - 22:00").split(" - ")[0] || "08:00",
                    horarioCierre: (s.horarios_atencion || "08:00 - 22:00").split(" - ")[1] || "22:00",
                    telefono: s.informacion_contacto?.telefono || "",
                    email: s.informacion_contacto?.email || "",
                }))
            );
            setExpanded(null);
            setNewMesaMap({});
        }
    }, [isOpen, restaurant]);

    const handleAdd = () => {
        setSucursales((prev) => [...prev, emptySucursal()]);
        setExpanded(sucursales.length);
    };

    const handleRemove = async (index) => {
        const s = sucursales[index];
        if (s._id) {
            try {
                await deleteSucursal(restaurant._id, s._id);
                await getRestaurants();
            } catch {
                showError("Error al eliminar sucursal");
                return;
            }
        }
        setSucursales((prev) => prev.filter((_, i) => i !== index));
        if (expanded === index) setExpanded(null);
    };

    const handleField = (index, field, value) => {
        setSucursales((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };

    const mapServerSucursales = (list) =>
        list.map((sx) => ({
            ...sx,
            direccion_texto: sx.direccion?.texto || "",
            horarioApertura: (sx.horarios_atencion || "08:00 - 22:00").split(" - ")[0] || "08:00",
            horarioCierre: (sx.horarios_atencion || "08:00 - 22:00").split(" - ")[1] || "22:00",
            telefono: sx.informacion_contacto?.telefono || "",
            email: sx.informacion_contacto?.email || "",
        }));

    const handleSaveSucursal = async (index) => {
        const s = sucursales[index];
        if (!s.nombre?.trim()) {
            showError("El nombre de la sucursal es obligatorio");
            return;
        }
        if (!s.direccion_texto?.trim()) {
            showError("La dirección de la sucursal es obligatoria");
            return;
        }

        const payload = {
            nombre: s.nombre,
            direccion: { texto: s.direccion_texto },
            horarios_atencion: `${s.horarioApertura} - ${s.horarioCierre}`,
            informacion_contacto: { telefono: s.telefono, email: s.email },
        };

        try {
            if (s._id) {
                await updateSucursal(restaurant._id, s._id, payload);
            } else {
                await addSucursal(restaurant._id, payload);
            }
            await getRestaurants();
            const updated = useRestaurantsStore.getState().restaurants.find((r) => r._id === restaurant._id);
            if (updated) {
                const unsaved = sucursales.filter((sx) => !sx._id && sucursales.indexOf(sx) !== index);
                setSucursales([...mapServerSucursales(updated.sucursales), ...unsaved]);
            }
            showSuccess(s._id ? "Sucursal actualizada" : "Sucursal creada");
        } catch {
            showError("Error al guardar la sucursal");
        }
    };

    const handleAddMesa = async (sucIndex) => {
        const s = sucursales[sucIndex];
        const mesaData = newMesaMap[sucIndex] || emptyMesa();
        if (!mesaData.numero || !mesaData.capacidad || !mesaData.ubicacion) {
            showError("Completa los datos de la mesa");
            return;
        }
        if (s._id) {
            try {
                await addMesaSucursal(restaurant._id, s._id, mesaData);
                await getRestaurants();
                const updated = useRestaurantsStore.getState().restaurants.find((r) => r._id === restaurant._id);
                if (updated) {
                    const unsaved = sucursales.filter((sx) => !sx._id);
                    setSucursales([...mapServerSucursales(updated.sucursales), ...unsaved]);
                }
            } catch {
                showError("Error al agregar mesa");
                return;
            }
        } else {
            setSucursales((prev) =>
                prev.map((sx, i) =>
                    i === sucIndex ? { ...sx, mesas: [...sx.mesas, { ...mesaData, _tempId: Date.now() }] } : sx
                )
            );
        }
        setNewMesaMap((prev) => ({ ...prev, [sucIndex]: emptyMesa() }));
    };

    const handleRemoveMesa = async (sucIndex, mesaIndex) => {
        const s = sucursales[sucIndex];
        const mesa = s.mesas[mesaIndex];
        if (mesa._id && s._id) {
            try {
                await deleteMesaSucursal(restaurant._id, s._id, mesa._id);
                await getRestaurants();
                const updated = useRestaurantsStore.getState().restaurants.find((r) => r._id === restaurant._id);
                if (updated) {
                    const unsaved = sucursales.filter((sx) => !sx._id);
                    setSucursales([...mapServerSucursales(updated.sucursales), ...unsaved]);
                }
            } catch {
                showError("Error al eliminar mesa");
                return;
            }
        } else {
            setSucursales((prev) =>
                prev.map((sx, i) =>
                    i === sucIndex ? { ...sx, mesas: sx.mesas.filter((_, j) => j !== mesaIndex) } : sx
                )
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-[#E8D8C3] max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <MapPin size={16} className="text-[#E67E22]" />
                        </div>
                        <div>
                            <h3 className="text-white font-extrabold text-base">Sucursales</h3>
                            <p className="text-white/60 text-xs">{restaurant?.nombre}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {sucursales.length === 0 && (
                        <div className="text-center py-10 text-[#6B6B6B] text-sm border border-dashed border-[#E8D8C3] rounded-xl">
                            No hay sucursales. Agrega la primera para comenzar.
                        </div>
                    )}

                    {sucursales.map((s, idx) => {
                        const isExpanded = expanded === idx;
                        return (
                            <div key={s._id || s._tempId} className="border border-[#E8D8C3] rounded-xl bg-[#F5EFE6]/20 overflow-hidden">
                                {/* Sucursal header */}
                                <div className="flex items-center justify-between px-4 py-3">
                                    <div
                                        onClick={() => setExpanded(isExpanded ? null : idx)}
                                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                                    >
                                        <MapPin size={14} className="text-[#E67E22] shrink-0" />
                                        <span className="text-sm font-bold text-[#2B2B2B] truncate">
                                            {s.nombre || `Sucursal ${idx + 1}`}
                                        </span>
                                        <span className="text-[11px] text-[#6B6B6B] shrink-0">
                                            {s.mesas?.length || 0} mesas
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!s._id && (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSucursal(idx)}
                                                className="px-2.5 py-1 rounded-lg bg-[#E67E22] text-white text-[10px] font-bold hover:bg-[#D35400] transition-colors"
                                            >
                                                Guardar
                                            </button>
                                        )}
                                        <span
                                            role="button"
                                            onClick={() => handleRemove(idx)}
                                            className="p-1 rounded hover:bg-red-50 text-[#C0392B] transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={13} />
                                        </span>
                                        <span
                                            role="button"
                                            onClick={() => setExpanded(isExpanded ? null : idx)}
                                            className="p-1 rounded hover:bg-[#F5EFE6] transition-colors cursor-pointer"
                                        >
                                            {isExpanded ? <ChevronUp size={14} className="text-[#6B6B6B]" /> : <ChevronDown size={14} className="text-[#6B6B6B]" />}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded fields */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 space-y-3 border-t border-[#E8D8C3]">
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">Nombre *</label>
                                                <input value={s.nombre} onChange={(e) => handleField(idx, "nombre", e.target.value)} placeholder="Sucursal Central" className="w-full px-3 py-2 border border-[#E8D8C3] rounded-lg text-sm outline-none focus:border-[#E67E22] bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">Dirección *</label>
                                                <input value={s.direccion_texto} onChange={(e) => handleField(idx, "direccion_texto", e.target.value)} placeholder="Zona 4, Ciudad" className="w-full px-3 py-2 border border-[#E8D8C3] rounded-lg text-sm outline-none focus:border-[#E67E22] bg-white" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">Teléfono</label>
                                                <input value={s.telefono} onChange={(e) => handleField(idx, "telefono", e.target.value)} placeholder="2345-6789" className="w-full px-3 py-2 border border-[#E8D8C3] rounded-lg text-sm outline-none focus:border-[#E67E22] bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">Correo</label>
                                                <input value={s.email} onChange={(e) => handleField(idx, "email", e.target.value)} placeholder="sucursal@bite.com" className="w-full px-3 py-2 border border-[#E8D8C3] rounded-lg text-sm outline-none focus:border-[#E67E22] bg-white" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-bold text-[#6B6B6B] uppercase mb-1">Horario</label>
                                                <div className="flex items-center gap-1">
                                                    <TimePicker value={s.horarioApertura} onChange={(v) => handleField(idx, "horarioApertura", v)} placeholder="Apertura" />
                                                    <span className="text-[#6B6B6B] text-xs">—</span>
                                                    <TimePicker value={s.horarioCierre} onChange={(v) => handleField(idx, "horarioCierre", v)} placeholder="Cierre" />
                                                </div>
                                            </div>
                                        </div>

                                        {s._id && (
                                            <div className="border-t border-[#E8D8C3] pt-3 mt-2">
                                                <p className="text-[10px] font-black text-[#6B6B6B] uppercase tracking-widest mb-2">Mesas de esta sucursal</p>
                                                {s.mesas?.length > 0 && (
                                                    <div className="space-y-1 mb-2">
                                                        {s.mesas.map((m, mi) => (
                                                            <div key={m._id || m._tempId} className="flex items-center justify-between bg-white border border-[#E8D8C3] rounded-lg px-3 py-2">
                                                                <span className="text-xs text-[#2B2B2B]">
                                                                    Mesa {m.numero} — {m.ubicacion} · cap. {m.capacidad} · {m.estado}
                                                                </span>
                                                                <span
                                                                    role="button"
                                                                    onClick={() => handleRemoveMesa(idx, mi)}
                                                                    className="p-1 rounded hover:bg-red-100 text-[#C0392B] transition-colors cursor-pointer"
                                                                >
                                                                    <Trash2 size={11} />
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-4 gap-1">
                                                    <input type="number" min="1" placeholder="#" value={newMesaMap[idx]?.numero || ""} onChange={(e) => setNewMesaMap((prev) => ({ ...prev, [idx]: { ...emptyMesa(), ...prev[idx], numero: Number(e.target.value) } }))} className="px-2 py-1.5 border border-[#E8D8C3] rounded-lg text-xs outline-none focus:border-[#E67E22] bg-white" />
                                                    <input type="number" min="1" max="20" placeholder="Cap" value={newMesaMap[idx]?.capacidad || ""} onChange={(e) => setNewMesaMap((prev) => ({ ...prev, [idx]: { ...emptyMesa(), ...prev[idx], capacidad: Number(e.target.value) } }))} className="px-2 py-1.5 border border-[#E8D8C3] rounded-lg text-xs outline-none focus:border-[#E67E22] bg-white" />
                                                    <input type="text" placeholder="Ubicación" value={newMesaMap[idx]?.ubicacion || ""} onChange={(e) => setNewMesaMap((prev) => ({ ...prev, [idx]: { ...emptyMesa(), ...prev[idx], ubicacion: e.target.value } }))} className="px-2 py-1.5 border border-[#E8D8C3] rounded-lg text-xs outline-none focus:border-[#E67E22] bg-white" />
                                                    <button type="button" onClick={() => handleAddMesa(idx)} className="bg-[#E67E22] hover:bg-[#D35400] text-white rounded-lg text-xs font-bold transition-colors">
                                                        +Mesa
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {s._id && (
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveSucursal(idx)}
                                                    className="px-3 py-1.5 rounded-lg bg-[#E67E22] text-white text-xs font-bold hover:bg-[#D35400] transition-colors"
                                                >
                                                    Actualizar Sucursal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#E67E22] text-[#E67E22] rounded-xl py-3 text-sm font-bold hover:bg-[#E67E22]/5 transition-colors"
                    >
                        <Plus size={16} /> Nueva Sucursal
                    </button>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-3 border-t border-[#E8D8C3] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-[#3A2E2A] text-white text-sm font-bold hover:bg-[#2B2B2B] transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
