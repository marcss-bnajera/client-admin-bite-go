import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Armchair, Filter } from "lucide-react";
import { TableModal } from "./TableModal";
import { Pagination } from "../../../shared/components/ui/Pagination";

const mesas = [
    { _id: "mes_001", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, numero: 1, capacidad: 2, ubicacion: "Terraza", estado: "Disponible" },
    { _id: "mes_002", id_restaurante: { _id: "rest_001", nombre: "Bite Central" }, numero: 2, capacidad: 4, ubicacion: "Interior", estado: "Ocupada" },
    { _id: "mes_003", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, numero: 1, capacidad: 6, ubicacion: "Interior", estado: "Reservada" },
    { _id: "mes_004", id_restaurante: { _id: "rest_002", nombre: "Bite Norte" }, numero: 2, capacidad: 2, ubicacion: "Barra", estado: "Disponible" },
    { _id: "mes_005", id_restaurante: { _id: "rest_003", nombre: "Bite Sur" }, numero: 1, capacidad: 8, ubicacion: "Salón privado", estado: "Mantenimiento" },
    { _id: "mes_006", id_restaurante: { _id: "rest_003", nombre: "Bite Sur" }, numero: 2, capacidad: 4, ubicacion: "Terraza", estado: "Disponible" },
];

const estadoColor = {
    Disponible: "bg-[#A8D5BA] text-green-900",
    Ocupada: "bg-[#E6A5A5] text-red-900",
    Reservada: "bg-[#A9C7E8] text-blue-900",
    Mantenimiento: "bg-[#EAD7A4] text-yellow-800",
};

const LIMIT = 6;

export const Tables = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [search, setSearch] = useState("");
    const [filterEstado, setFilterEstado] = useState("");
    const [page, setPage] = useState(1);

    const filtered = mesas.filter((m) => {
        const matchSearch =
            m.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase()) ||
            m.ubicacion.toLowerCase().includes(search.toLowerCase());
        const matchEstado = filterEstado ? m.estado === filterEstado : true;
        return matchSearch && matchEstado;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedTable(null); setModalOpen(true); };
    const handleEdit = (table) => { setSelectedTable(table); setModalOpen(true); };

    // Hard delete — deleteMesa usa $pull, elimina permanentemente
    const handleDelete = (mesa) => {
        console.log(`DELETE /restaurants/${mesa.id_restaurante._id}/tables/${mesa._id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Mesas</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Administración de mesas por restaurante</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nueva Mesa
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 flex-1">
                    <Search size={16} className="text-[#6B6B6B] shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                        placeholder="Buscar por restaurante o ubicación..."
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2">
                    <Filter size={16} className="text-[#6B6B6B] shrink-0" />
                    <select
                        value={filterEstado}
                        onChange={(e) => { setFilterEstado(e.target.value); setPage(1); }}
                        className="outline-none text-sm bg-transparent text-[#6B6B6B]"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupada">Ocupada</option>
                        <option value="Reservada">Reservada</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map((mesa) => (
                    <div key={mesa._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#3A2E2A] flex items-center justify-center shrink-0">
                                    <Armchair size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-[#2B2B2B]">Mesa {mesa.numero}</h3>
                                    <p className="text-xs text-[#6B6B6B]">{mesa.id_restaurante.nombre}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${estadoColor[mesa.estado]}`}>
                                {mesa.estado}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-[#F5EFE6] rounded-xl p-3 text-center">
                                <p className="text-xs text-[#6B6B6B] font-medium">Capacidad</p>
                                <p className="text-xl font-extrabold text-[#2B2B2B]">{mesa.capacidad}</p>
                                <p className="text-xs text-[#6B6B6B]">personas</p>
                            </div>
                            <div className="bg-[#F5EFE6] rounded-xl p-3 text-center">
                                <p className="text-xs text-[#6B6B6B] font-medium">Ubicación</p>
                                <p className="text-sm font-bold text-[#2B2B2B] mt-1">{mesa.ubicacion}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#E8D8C3] pt-3">
                            <button
                                onClick={() => handleEdit(mesa)}
                                className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                                title="Editar"
                            >
                                <Pencil size={15} />
                            </button>
                            {/* Hard delete — $pull en el controller */}
                            <button
                                onClick={() => handleDelete(mesa)}
                                className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            {/* key fuerza re-mount para resetear form al cambiar de mesa */}
            <TableModal
                key={selectedTable?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                table={selectedTable}
            />
        </div>
    );
};