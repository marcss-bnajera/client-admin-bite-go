import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Armchair } from "lucide-react";
import { TableModal } from "./TableModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const estadoColor = {
    Disponible: "bg-[#A8D5BA] text-green-900",
    Ocupada: "bg-[#E6A5A5] text-red-900",
    Reservada: "bg-[#A9C7E8] text-blue-900",
    Mantenimiento: "bg-[#EAD7A4] text-yellow-800",
};

const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Disponible", label: "Disponible" },
    { value: "Ocupada", label: "Ocupada" },
    { value: "Reservada", label: "Reservada" },
    { value: "Mantenimiento", label: "Mantenimiento" },
];

const LIMIT = 6;

export const Tables = () => {
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const loading = useRestaurantsStore((state) => state.loading);
    const { deleteMesa, deleteMesaSucursal } = useRestaurantsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [filterSucursal, setFilterSucursal] = useState("");
    const [filterEstado, setFilterEstado] = useState("Disponible");
    const [page, setPage] = useState(1);

    const selectedRestaurant = restaurants.find((r) => r._id === filterRestaurant);
    const tieneSucursales = selectedRestaurant?.tiene_sucursales ?? false;

    useEffect(() => {
        setFilterSucursal("");
    }, [filterRestaurant]);

    const allMesas = (() => {
        if (!filterRestaurant) return [];
        const r = selectedRestaurant;
        if (!r) return [];

        const rootMesas = (!tieneSucursales ? (r.mesas ?? []) : []).map((m) => ({
            ...m,
            id_restaurante: { _id: r._id, nombre: r.nombre },
            _sucursalId: null,
            _sucursalNombre: null,
        }));

        const sucursalMesas = (r.sucursales ?? [])
            .filter((s) => !filterSucursal || s._id === filterSucursal)
            .flatMap((s) =>
                (s.mesas ?? []).map((m) => ({
                    ...m,
                    id_restaurante: { _id: r._id, nombre: r.nombre },
                    _sucursalId: s._id,
                    _sucursalNombre: s.nombre,
                }))
            );

        return [...rootMesas, ...sucursalMesas];
    })();

    const filtered = allMesas.filter((m) => {
        if (selectedTable && m._id === selectedTable._id) return true;
        const matchSearch =
            m.ubicacion.toLowerCase().includes(search.toLowerCase()) ||
            m.numero?.toString().includes(search);
        const matchEstado = filterEstado ? m.estado === filterEstado : true;
        return matchSearch && matchEstado;
    });

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedTable(null); setModalOpen(true); };
    const handleEdit = (table) => { setSelectedTable(table); setModalOpen(true); };
    const handleClose = () => { setModalOpen(false); setSelectedTable(null); };

    const handleDelete = (mesa) => {
        const sucursalText = mesa._sucursalNombre ? ` (Sucursal: ${mesa._sucursalNombre})` : "";
        showConfirmToast({
            title: "Eliminar mesa",
            message: `¿Eliminar la Mesa ${mesa.numero} de ${mesa.id_restaurante.nombre}${sucursalText}?`,
            type: "delete",
            onConfirm: () => {
                if (mesa._sucursalId) {
                    deleteMesaSucursal(mesa.id_restaurante._id, mesa._sucursalId, mesa._id);
                } else {
                    deleteMesa(mesa.id_restaurante._id, mesa._id);
                }
            },
        });
    };

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#E8D8C3] sm:border-0 shadow-sm sm:shadow-none">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Mesas</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Administración de mesas por restaurante</p>
                </div>
                <button onClick={handleNew} disabled={!filterRestaurant} className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors w-full sm:w-auto active:scale-98 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus size={16} /> Nueva Mesa
                </button>
            </div>

            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                filterSucursal={filterSucursal}
                onSucursalChange={setFilterSucursal}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar por ubicación o número..."
                showStatusFilter={true}
                filterStatus={filterEstado}
                onStatusChange={setFilterEstado}
                statusOptions={estadoOptions}
                onPageReset={setPage}
                emptyMessage="Seleccioná un restaurante para ver sus mesas"
            />

            {!filterRestaurant ? null : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                    {loading ? (
                        <p className="text-[#6B6B6B] text-sm col-span-1 sm:col-span-2 xl:col-span-3 text-center py-12 font-medium">Cargando mesas...</p>
                    ) : paginated.length === 0 ? (
                        <p className="text-[#6B6B6B] text-sm col-span-1 sm:col-span-2 xl:col-span-3 text-center py-12 font-medium">No hay mesas registradas</p>
                    ) : paginated.map((mesa) => (
                        <div key={mesa._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between min-w-0 w-full">
                            <div>
                                <div className="flex items-start justify-between mb-4 gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-[#3A2E2A] flex items-center justify-center shrink-0 shadow-sm">
                                            <Armchair size={18} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-extrabold text-[#2B2B2B] text-sm sm:text-base truncate">Mesa {mesa.numero}</h3>
                                            {mesa._sucursalNombre && (
                                                <p className="text-[10px] text-[#E67E22] font-semibold truncate">{mesa._sucursalNombre}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 shadow-sm ${estadoColor[mesa.estado]}`}>
                                        {mesa.estado}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4 w-full">
                                    <div className="bg-[#F5EFE6] rounded-xl p-2.5 sm:p-3 text-center border border-[#F0E4D4]/60 min-w-0">
                                        <p className="text-[11px] sm:text-xs text-[#6B6B6B] font-medium truncate">Capacidad</p>
                                        <p className="text-lg sm:text-xl font-extrabold text-[#2B2B2B] leading-tight my-0.5">{mesa.capacidad}</p>
                                        <p className="text-[10px] sm:text-xs text-[#6B6B6B] truncate">personas</p>
                                    </div>
                                    <div className="bg-[#F5EFE6] rounded-xl p-2.5 sm:p-3 text-center border border-[#F0E4D4]/60 flex flex-col justify-center min-w-0">
                                        <p className="text-[11px] sm:text-xs text-[#6B6B6B] font-medium truncate">Ubicación</p>
                                        <p className="text-xs sm:text-sm font-bold text-[#2B2B2B] mt-1 truncate break-words line-clamp-2">{mesa.ubicacion}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-[#E8D8C3] pt-3 mt-auto">
                                <button onClick={() => handleEdit(mesa)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-95" title="Editar">
                                    <Pencil size={15} />
                                </button>
                                <button onClick={() => handleDelete(mesa)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors active:scale-95" title="Eliminar">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-2 overflow-x-auto w-full flex justify-center sm:justify-start">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <TableModal
                key={selectedTable?._id ?? "new"}
                isOpen={modalOpen}
                onClose={handleClose}
                table={selectedTable}
                onSaved={() => { }}
            />
        </div>
    );
};