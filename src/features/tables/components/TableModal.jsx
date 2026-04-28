import { X, Table } from "lucide-react";
import { useState } from "react";

// Refleja el endpoint addTable: POST /restaurants/:id/tables
// El controller valida numero duplicado en el mismo restaurante
export const TableModal = ({ isOpen, onClose, restaurantId, restaurantName, existingTables = [] }) => {
    const [form, setForm] = useState({
        numero: "",
        capacidad: "",
        ubicacion: "",
        estado: "Disponible",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación local que replica la del controller
        const numeroDuplicado = existingTables.some((m) => m.numero === Number(form.numero));
        if (numeroDuplicado) {
            setError("El número de mesa ya está registrado en este restaurante.");
            return;
        }

        const payload = {
            numero: Number(form.numero),
            capacidad: Number(form.capacidad),
            ubicacion: form.ubicacion,
            estado: form.estado,
        };

        console.log(`POST /restaurants/${restaurantId}/tables`, payload);
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
                            <Table size={16} className="text-[#E67E22]" />
                        </div>
                        <div>
                            <h3 className="text-white font-extrabold text-base">Agregar Mesa</h3>
                            {restaurantName && (
                                <p className="text-[#E67E22] text-xs font-semibold">{restaurantName}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Número de Mesa *
                            </label>
                            <input
                                name="numero"
                                value={form.numero}
                                onChange={handleChange}
                                required
                                type="number"
                                min="1"
                                placeholder="Ej: 5"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Capacidad *
                            </label>
                            <input
                                name="capacidad"
                                value={form.capacidad}
                                onChange={handleChange}
                                required
                                type="number"
                                min="1"
                                placeholder="Ej: 4"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Ubicación *
                        </label>
                        <input
                            name="ubicacion"
                            value={form.ubicacion}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Interior, Terraza, Jardín..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="Ocupada">Ocupada</option>
                            <option value="Reservada">Reservada</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                        </select>
                    </div>

                    {/* Mesas existentes */}
                    {existingTables.length > 0 && (
                        <div className="bg-[#F5EFE6] rounded-xl p-3 border border-[#E8D8C3]">
                            <p className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wide mb-2">
                                Mesas registradas
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {existingTables.map((m) => (
                                    <span
                                        key={m.numero}
                                        className="bg-white border border-[#E8D8C3] text-[#2B2B2B] text-xs font-semibold px-2 py-0.5 rounded-lg"
                                    >
                                        #{m.numero} · {m.capacidad}p · {m.ubicacion}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-xs font-semibold text-[#C0392B] bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-[#E8D8C3] mt-2">
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
                            Agregar Mesa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};