import { useState } from "react";
import { Plus, Search, Pencil, Trash2, ImageOff, CheckCircle, XCircle } from "lucide-react";
import { ProductModal } from "./ProductModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

// Mock alineado al productSchema completo
const productos = [
    {
        _id: "prod_001",
        id_restaurante: { _id: "rest_001", nombre: "Bite Central" },
        nombre: "Burger Clásica",
        descripcion: "Hamburguesa con carne 100% res",
        categoria: "Platos",
        precio: 55,
        disponibilidad: true,
        foto_url: [],
        activo: true,
        receta: [{ nombre_insumo: "Carne de res", cantidad_requerida: 2 }],
        variaciones: [
            { nombre: "Sin cebolla", precio_adicional: 0, afecta_inventario: false, insumo_relacionado: "", cantidad_insumo: 0 },
        ],
        createdAt: "2024-01-10T10:00:00Z",
    },
    {
        _id: "prod_002",
        id_restaurante: { _id: "rest_002", nombre: "Bite Norte" },
        nombre: "Limonada Natural",
        descripcion: "Limonada fresca con hielo",
        categoria: "Bebidas",
        precio: 25,
        disponibilidad: true,
        foto_url: [],
        activo: true,
        receta: [],
        variaciones: [
            { nombre: "Sin azúcar", precio_adicional: 0, afecta_inventario: false, insumo_relacionado: "", cantidad_insumo: 0 },
        ],
        createdAt: "2024-01-11T10:00:00Z",
    },
    {
        _id: "prod_003",
        id_restaurante: { _id: "rest_003", nombre: "Bite Sur" },
        nombre: "Brownie de Chocolate",
        descripcion: "Brownie casero con nueces",
        categoria: "Postres",
        precio: 35,
        disponibilidad: false,
        foto_url: [],
        activo: true,
        receta: [],
        variaciones: [],
        createdAt: "2024-01-12T10:00:00Z",
    },
    {
        _id: "prod_004",
        id_restaurante: { _id: "rest_001", nombre: "Bite Central" },
        nombre: "Alitas BBQ",
        descripcion: "6 alitas con salsa BBQ",
        categoria: "Entradas",
        precio: 65,
        disponibilidad: true,
        foto_url: [],
        activo: true,
        receta: [{ nombre_insumo: "Alitas de pollo", cantidad_requerida: 6 }],
        variaciones: [
            { nombre: "Picante", precio_adicional: 5, afecta_inventario: true, insumo_relacionado: "Salsa picante", cantidad_insumo: 1 },
        ],
        createdAt: "2024-01-13T10:00:00Z",
    },
];

const categoriaColor = {
    Entradas: "bg-[#EAD7A4] text-yellow-800",
    Platos: "bg-[#A9C7E8] text-blue-900",
    Bebidas: "bg-[#A8D5BA] text-green-900",
    Postres: "bg-[#E6A5A5] text-red-900",
    Otros: "bg-[#D6D6D6] text-gray-700",
};

export const Products = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = productos.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleNew = () => { setSelectedProduct(null); setModalOpen(true); };
    const handleEdit = (product) => { setSelectedProduct(product); setModalOpen(true); };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Productos & Menú</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Catálogo de productos por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar producto o restaurante..."
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#E8D8C3] overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                    <thead className="bg-[#3A2E2A] text-white">
                        <tr>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Producto</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Restaurante</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Categoría</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Precio</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Receta</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Variaciones</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Disponible</th>
                            {/* activo: campo del schema — controla visibilidad en el sistema */}
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Activo</th>
                            <th className="text-left px-6 py-4 font-bold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p, index) => (
                            <tr
                                key={p._id}
                                className={`border-t border-[#E8D8C3] hover:bg-[#F2E6D9] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#F5EFE6]/50"}`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* foto_url: array en schema — si está vacío muestra placeholder */}
                                        <div className="w-9 h-9 rounded-xl bg-[#E8D8C3] flex items-center justify-center shrink-0">
                                            {p.foto_url.length > 0
                                                ? <img src={p.foto_url[0]} alt={p.nombre} className="w-9 h-9 rounded-xl object-cover" />
                                                : <ImageOff size={14} className="text-[#6B6B6B]" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#2B2B2B]">{p.nombre}</p>
                                            <p className="text-xs text-[#6B6B6B]">{p.descripcion}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[#6B6B6B]">{p.id_restaurante.nombre}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoriaColor[p.categoria]}`}>
                                        {p.categoria}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#2B2B2B]">Q{p.precio.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.receta.length > 0 ? "bg-[#A8D5BA] text-green-900" : "bg-[#D6D6D6] text-gray-600"}`}>
                                        {p.receta.length} insumos
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.variaciones.length > 0 ? "bg-[#A9C7E8] text-blue-900" : "bg-[#D6D6D6] text-gray-600"}`}>
                                        {p.variaciones.length} vars
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.disponibilidad ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                                        {p.disponibilidad ? "Sí" : "No"}
                                    </span>
                                </td>
                                {/* activo: indica si el producto existe activamente en el sistema (soft delete) */}
                                <td className="px-6 py-4">
                                    {p.activo
                                        ? <CheckCircle size={16} className="text-green-600" />
                                        : <XCircle size={16} className="text-red-500" />
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar">
                                            <Pencil size={15} />
                                        </button>
                                        {/* Trash2 → llama DELETE /products/:id → activo: false */}
                                        <button className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors" title="Desactivar">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={page} totalPages={1} total={filtered.length} itemsShown={filtered.length} onPageChange={setPage} />

            <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} product={selectedProduct} />
        </div>
    );
};