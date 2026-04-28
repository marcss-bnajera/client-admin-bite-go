import { useState } from "react";
import { Plus, Search, Pencil, PowerOff, Table } from "lucide-react";
import { RestaurantModal } from "./RestaurantModal";
import { TableModal } from "../../tables/components/TableModal.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination";

// Mock data alineado al modelo (incluye activos e inactivos para admin)
const restaurantes = [
    {
        _id: "rest_001",
        nombre: "Bite Central",
        direccion: { texto: "Zona 10, Ciudad de Guatemala" },
        horarios_atencion: "8:00 - 22:00",
        categoria_gastronomica: "Comida Rápida",
        precio_promedio: 75,
        informacion_contacto: { telefono: "2345-6789", email: "central@bite.com" },
        mesas: [
            { numero: 1, capacidad: 4, ubicacion: "Interior", estado: "Disponible" },
            { numero: 2, capacidad: 2, ubicacion: "Terraza", estado: "Ocupada" },
        ],
        eventos: [{ nombre: "Noche de Tapas", descripcion: "", fechas: [], servicios: [] }],
        activo: true,
    },
    {
        _id: "rest_002",
        nombre: "Bite Norte",
        direccion: { texto: "Zona 15, Ciudad de Guatemala" },
        horarios_atencion: "9:00 - 21:00",
        categoria_gastronomica: "Americana",
        precio_promedio: 90,
        informacion_contacto: { telefono: "2345-6790", email: "norte@bite.com" },
        mesas: [{ numero: 1, capacidad: 6, ubicacion: "Interior", estado: "Disponible" }],
        eventos: [],
        activo: true,
    },
    {
        _id: "rest_003",
        nombre: "Bite Sur",
        direccion: { texto: "Zona 1, Ciudad de Guatemala" },
        horarios_atencion: "7:00 - 20:00",
        categoria_gastronomica: "Fusión",
        precio_promedio: 60,
        informacion_contacto: { telefono: "2345-6791", email: "sur@bite.com" },
        mesas: [],
        eventos: [],
        activo: false, // Desactivado por soft delete
    },
];

const LIMIT = 6; // Equivalente al limit del controller

export const Restaurants = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // El controller filtra activo:true por defecto, pero admin ve todos
    const filtered = restaurantes.filter((r) =>
        r.nombre.toLowerCase().includes(search.toLowerCase()) ||
        r.categoria_gastronomica.toLowerCase().includes(search.toLowerCase())
    );

    // Paginación local (refleja lógica skip/limit del controller)
    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedRestaurant(null); setModalOpen(true); };
    const handleEdit = (r) => { setSelectedRestaurant(r); setModalOpen(true); };
    const handleAddTable = (r) => { setSelectedRestaurant(r); setTableModalOpen(true); };

    // Soft delete — refleja deleteRestaurant que pone activo:false
    const handleToggleActive = (r) => {
        console.log(`${r.activo ? "Desactivar" : "Activar"} restaurante:`, r._id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Restaurantes</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Red de restaurantes Bite & Go</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Restaurante
                </button>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar restaurante o categoría..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map((r) => (
                    <RestaurantCard
                        key={r._id}
                        restaurant={r}
                        onEdit={handleEdit}
                        onToggleActive={handleToggleActive}
                        onAddTable={handleAddTable}
                    />
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

            {/* Key fuerza re-mount del modal para reiniciar el form al cambiar restaurante */}
            <RestaurantModal
                key={selectedRestaurant?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                restaurant={selectedRestaurant}
            />

            <TableModal
                key={selectedRestaurant?._id ? `table-${selectedRestaurant._id}` : "table-new"}
                isOpen={tableModalOpen}
                onClose={() => setTableModalOpen(false)}
                restaurantId={selectedRestaurant?._id}
                restaurantName={selectedRestaurant?.nombre}
                existingTables={selectedRestaurant?.mesas ?? []}
            />
        </div>
    );
};

// ─── Subcomponente card ────────────────────────────────────────────────────────
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const RestaurantCard = ({ restaurant: r, onEdit, onToggleActive, onAddTable }) => (
    <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
            <div>
                <h3 className="font-extrabold text-[#2B2B2B] text-base">{r.nombre}</h3>
                <span className="text-xs text-[#6B6B6B]">{r.categoria_gastronomica}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                {r.activo ? "Activo" : "Inactivo"}
            </span>
        </div>

        <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                <MapPin size={13} className="text-[#E67E22] shrink-0" />
                {r.direccion.texto}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                <Clock size={13} className="text-[#E67E22] shrink-0" />
                {r.horarios_atencion}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                <Phone size={13} className="text-[#E67E22] shrink-0" />
                {r.informacion_contacto.telefono}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                <Mail size={13} className="text-[#E67E22] shrink-0" />
                {r.informacion_contacto.email}
            </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-xs font-semibold px-2 py-1 rounded-lg">
                {r.mesas.length} mesas
            </span>
            <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-xs font-semibold px-2 py-1 rounded-lg">
                {r.eventos.length} eventos
            </span>
            <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-xs font-semibold px-2 py-1 rounded-lg">
                Precio prom: <span className="text-[#E67E22]">Q{r.precio_promedio}</span>
            </span>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E8D8C3] pt-3">
            {/* Agregar mesa — endpoint separado addTable POST /restaurants/:id/tables */}
            <button
                onClick={() => onAddTable(r)}
                className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#6B6B6B] hover:text-[#E67E22] transition-colors"
                title="Agregar Mesa"
            >
                <Table size={15} />
            </button>
            <button
                onClick={() => onEdit(r)}
                className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors"
                title="Editar"
            >
                <Pencil size={15} />
            </button>
            {/* Soft delete — el controller pone activo:false, no elimina */}
            <button
                onClick={() => onToggleActive(r)}
                className={`p-2 rounded-lg transition-colors ${r.activo
                    ? "hover:bg-red-50 text-[#C0392B]"
                    : "hover:bg-green-50 text-green-700"
                    }`}
                title={r.activo ? "Desactivar" : "Activar"}
            >
                <PowerOff size={15} />
            </button>
        </div>
    </div>
);
