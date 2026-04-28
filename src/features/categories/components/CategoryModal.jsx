import { X, Tag } from "lucide-react";
import { useState, useEffect } from "react";

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

const initialForm = {
    nombre: "",
    descripcion: "",
    id_restaurante: "",
};

export const CategoryModal = ({ isOpen, onClose, category = null }) => {
    const isEditing = !!category;
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            setForm(
                category
                    ? {
                        nombre: category.nombre || "",
                        descripcion: category.descripcion || "",
                        // Normalizar objeto a _id
                        id_restaurante: category.id_restaurante?._id || category.id_restaurante || "",
                    }
                    : initialForm
            );
        }
    }, [isOpen, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!form.id_restaurante) newErrors.id_restaurante = "Selecciona un restaurante";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            id_restaurante: form.id_restaurante,
        };
        console.log(isEditing ? "Payload → PUT /categories/:id:" : "Payload → POST /categories:", payload);
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
                            <Tag size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
                        </h3>
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
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Restaurante *
                        </label>
                        <select
                            name="id_restaurante"
                            value={form.id_restaurante}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.id_restaurante ? "border-red-400" : "border-[#E8D8C3]"}`}
                        >
                            <option value="">Seleccionar restaurante...</option>
                            {restaurantes.map((r) => (
                                <option key={r._id} value={r._id}>{r.nombre}</option>
                            ))}
                        </select>
                        {errors.id_restaurante && <p className="text-[10px] text-red-500 mt-1">{errors.id_restaurante}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Nombre de la Categoría *
                        </label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Menú Ejecutivo, Desayunos..."
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors ${errors.nombre ? "border-red-400" : "border-[#E8D8C3]"}`}
                        />
                        {errors.nombre && <p className="text-[10px] text-red-500 mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe brevemente esta categoría..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none"
                        />
                    </div>

                    {/* Footer */}
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
                            {isEditing ? "Guardar Cambios" : "Crear Categoría"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};