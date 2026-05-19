import { useState } from "react";
import { Plus, Search, Pencil, PowerOff, Table, MapPin, Phone, Clock, Mail } from "lucide-react";
import { RestaurantModal } from "./RestaurantModal";
import { TableModal } from "../../tables/components/TableModal.jsx";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useRestaurants } from "../hooks/useRestaurants";
import { useRestaurantsStore } from "../store/restaurantsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const LIMIT = 6;

const RestaurantCard = ({ restaurant: r, onEdit, onToggleActive, onAddTable }) => (
    <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between min-w-0 w-full">
        <div>
            <div className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0">
                    <h3 className="font-extrabold text-[#2B2B2B] text-base truncate">{r.nombre}</h3>
                    <p className="text-xs text-[#6B6B6B] truncate">{r.categoria_gastronomica}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${r.activo ? "bg-[#A8D5BA] text-green-900" : "bg-[#E6A5A5] text-red-900"}`}>
                    {r.activo ? "Activo" : "Inactivo"}
                </span>
            </div>

            <div className="space-y-1.5 mb-4 min-w-0">
                <div className="flex items-start gap-2 text-sm text-[#6B6B6B] min-w-0">
                    <MapPin size={13} className="text-[#E67E22] shrink-0 mt-0.5" />
                    <span className="break-words line-clamp-2 text-xs sm:text-sm">{r.direccion?.texto}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] min-w-0">
                    <Clock size={13} className="text-[#E67E22] shrink-0" />
                    <span className="truncate text-xs sm:text-sm">{r.horarios_atencion}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] min-w-0">
                    <Phone size={13} className="text-[#E67E22] shrink-0" />
                    <span className="truncate text-xs sm:text-sm">{r.informacion_contacto?.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] min-w-0">
                    <Mail size={13} className="text-[#E67E22] shrink-0" />
                    <span className="truncate break-all text-xs sm:text-sm">{r.informacion_contacto?.email}</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg shrink-0">{r.mesas?.length ?? 0} mesas</span>
                <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg shrink-0">{r.eventos?.length ?? 0} eventos</span>
                <span className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#2B2B2B] text-[11px] sm:text-xs font-semibold px-2 py-1 rounded-lg shrink-0">Precio prom: <span className="text-[#E67E22] font-bold">Q{r.precio_promedio}</span></span>
            </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E8D8C3] pt-3 mt-auto">
            <button onClick={() => onAddTable(r)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#6B6B6B] hover:text-[#E67E22] transition-colors active:scale-95" title="Agregar Mesa">
                <Table size={15} />
            </button>
            <button onClick={() => onEdit(r)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-95" title="Editar">
                <Pencil size={15} />
            </button>
            <button
                onClick={() => onToggleActive(r)}
                className={`p-2 rounded-lg transition-colors active:scale-95 ${r.activo ? "hover:bg-red-50 text-[#C0392B]" : "hover:bg-green-50 text-green-700"}`}
                title={r.activo ? "Desactivar" : "Activar"}
            >
                <PowerOff size={15} />
            </button>
        </div>
    </div>
);

export const Restaurants = () => {
    const { restaurants, loading, getRestaurants } = useRestaurants();
    const { deleteRestaurant, activateRestaurant } = useRestaurantsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [tableModalOpen, setTableModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filtered = (restaurants ?? []).filter((r) =>
        r.nombre.toLowerCase().includes(search.toLowerCase()) ||
        r.categoria_gastronomica?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedRestaurant(null); setModalOpen(true); };
    const handleEdit = (r) => { setSelectedRestaurant(r); setModalOpen(true); };
    const handleAddTable = (r) => { setSelectedRestaurant(r); setTableModalOpen(true); };

    const handleToggleActive = (r) => {
        if (r.activo) {
            showConfirmToast({
                title: "Desactivar restaurante",
                message: `¿Desactivar "${r.nombre}"?`,
                type: "deactivate",
                onConfirm: () => deleteRestaurant(r._id),
            });
        } else {
            showConfirmToast({
                title: "Reactivar restaurante",
                message: `¿Reactivar "${r.nombre}"?`,
                type: "activate",
                onConfirm: () => activateRestaurant(r._id),
            });
        }
    };

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0 overflow-x-hidden">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#E8D8C3] sm:border-0 shadow-sm sm:shadow-none">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Restaurantes</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Red de restaurantes Bite & Go</p>
                </div>
                <button onClick={handleNew} className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors w-full sm:w-auto active:scale-98 shrink-0">
                    <Plus size={16} /> Nuevo Restaurante
                </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2.5 w-full sm:max-w-md shadow-sm focus-within:border-[#E67E22] transition-colors">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar restaurante o categoría..."
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                {loading ? (
                    <p className="text-[#6B6B6B] text-sm col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 font-medium">Cargando restaurantes...</p>
                ) : paginated.length === 0 ? (
                    <p className="text-[#6B6B6B] text-sm col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 font-medium">No hay restaurantes registrados</p>
                ) : paginated.map((r) => (
                    <RestaurantCard key={r._id} restaurant={r} onEdit={handleEdit} onToggleActive={handleToggleActive} onAddTable={handleAddTable} />
                ))}
            </div>

            {/* Pagination footer */}
            <div className="pt-2 overflow-x-auto w-full flex justify-center sm:justify-start">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <RestaurantModal
                key={selectedRestaurant?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedRestaurant(null); }}
                restaurant={selectedRestaurant}
                onSaved={() => getRestaurants()}
            />

            <TableModal
                key={selectedRestaurant?._id ? `table-${selectedRestaurant._id}` : "table-new"}
                isOpen={tableModalOpen}
                onClose={() => { setTableModalOpen(false); setSelectedRestaurant(null); }}
                restaurantId={selectedRestaurant?._id}
                restaurantName={selectedRestaurant?.nombre}
                existingTables={selectedRestaurant?.mesas ?? []}
            />
        </div>
    );
};