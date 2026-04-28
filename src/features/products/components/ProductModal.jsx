import { X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const restaurantes = [
    { _id: "rest_001", nombre: "Bite Central" },
    { _id: "rest_002", nombre: "Bite Norte" },
    { _id: "rest_003", nombre: "Bite Sur" },
];

// Enum del productSchema
const categorias = ["Entradas", "Platos", "Bebidas", "Postres", "Otros"];

export const ProductModal = ({ isOpen, onClose, product = null }) => {
    const isEditing = !!product;

    const [form, setForm] = useState({
        id_restaurante: product?.id_restaurante?._id || product?.id_restaurante || "",
        nombre: product?.nombre || "",
        descripcion: product?.descripcion || "",
        categoria: product?.categoria || "Platos",
        precio: product?.precio || "",
        disponibilidad: product?.disponibilidad ?? true,
        // activo: solo editable en modo edición — controller lo descarta en updateProduct
        // pero el modal lo manda para el PUT correcto cuando sea necesario desactivar
        activo: product?.activo ?? true,
        // foto_url: array en schema — se gestiona aparte (upload), solo se muestra info aquí
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // PUT /products/:id — controller descarta receta, activo e id_restaurante
            // Solo se envían los campos que updateProduct acepta en ...data
            console.log("Payload → PUT /products/:id", {
                nombre: form.nombre,
                descripcion: form.descripcion,
                categoria: form.categoria,
                precio: Number(form.precio),
                disponibilidad: form.disponibilidad === "true" || form.disponibilidad === true,
            });
        } else {
            // POST /products — createProduct acepta req.body completo
            console.log("Payload → POST /products", {
                id_restaurante: form.id_restaurante,
                nombre: form.nombre,
                descripcion: form.descripcion,
                categoria: form.categoria,
                precio: Number(form.precio),
                disponibilidad: form.disponibilidad === "true" || form.disponibilidad === true,
                activo: true,
                foto_url: [],
                receta: [],
                variaciones: [],
            });
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <UtensilsCrossed size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? "Editar Producto" : "Nuevo Producto"}
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

                    {/* id_restaurante: required en schema, deshabilitado al editar */}
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

                    {/* nombre: required, trim en schema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Nombre del Producto *
                        </label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Burger Clásica"
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                        />
                    </div>

                    {/* descripcion: opcional, trim en schema */}
                    <div>
                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Describe el producto..."
                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* categoria: enum del schema */}
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Categoría *
                            </label>
                            <select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                {categorias.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        {/* precio: required, min 0 en schema */}
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Precio (Q) *
                            </label>
                            <input
                                name="precio"
                                value={form.precio}
                                onChange={handleChange}
                                required
                                type="number"
                                min="0"
                                placeholder="Ej: 55"
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* disponibilidad: Boolean, default true en schema */}
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Disponibilidad
                            </label>
                            <select
                                name="disponibilidad"
                                value={form.disponibilidad}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                            >
                                <option value="true">Disponible</option>
                                <option value="false">No disponible</option>
                            </select>
                        </div>
                        {/* activo: solo en edición — deleteProduct hace activo:false vía DELETE */}
                        {isEditing && (
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                    Estado
                                </label>
                                <select
                                    name="activo"
                                    value={form.activo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* foto_url: array en schema — gestion de upload va aparte, se indica al usuario */}
                    {isEditing && product?.foto_url?.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">
                                Fotos actuales
                            </label>
                            <p className="text-xs text-[#6B6B6B]">{product.foto_url.length} imagen(es) registrada(s)</p>
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
                            {isEditing ? "Guardar Cambios" : "Crear Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};