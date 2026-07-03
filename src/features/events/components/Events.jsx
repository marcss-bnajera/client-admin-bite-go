import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, CalendarDays, Store, Tag } from "lucide-react";
import { EventModal } from "./EventModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { RestaurantFilterBar } from "../../../shared/components/ui/RestaurantFilterBar";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { showConfirmToast } from "../../../shared/utils/confirmToast";

const LIMIT = 6;

export const Events = () => {
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const loading = useRestaurantsStore((state) => state.loading);
    const { deleteEvento } = useRestaurantsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRestaurant, setFilterRestaurant] = useState("");
    const [page, setPage] = useState(1);

    const allEventos = (() => {
        if (!filterRestaurant) return [];
        const r = restaurants.find((r) => r._id === filterRestaurant);
        if (!r) return [];
        return (r.eventos ?? []).map((e) => ({ ...e, id_restaurante: { _id: r._id, nombre: r.nombre } }));
    })();

    const filtered = allEventos.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase()) ||
        e.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedEvent(null); setModalOpen(true); };
    const handleEdit = (evt) => { setSelectedEvent(evt); setModalOpen(true); };
    const handleDelete = (evt) => {
        showConfirmToast({
            title: "Eliminar evento",
            message: `¿Eliminar "${evt.nombre}"?`,
            type: "delete",
            onConfirm: () => deleteEvento(evt.id_restaurante._id, evt._id),
        });
    };

    return (
        <div className="space-y-6 max-w-full px-1 sm:px-0 overflow-x-hidden">
            {/* Cabecera Responsiva */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-[#E8D8C3] sm:border-0 shadow-sm sm:shadow-none">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Eventos Gastronómicos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Eventos especiales por restaurante</p>
                </div>
                <button onClick={handleNew} className="flex items-center justify-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors w-full sm:w-auto active:scale-98 shrink-0">
                    <Plus size={16} /> Nuevo Evento
                </button>
            </div>

            <RestaurantFilterBar
                filterRestaurant={filterRestaurant}
                onRestaurantChange={setFilterRestaurant}
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Buscar evento..."
                showSucursal={false}
                onPageReset={setPage}
                emptyMessage="Seleccioná un restaurante para ver sus eventos"
            />

            {/* Rejilla Adaptativa de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                {loading ? (
                    <p className="text-[#6B6B6B] text-sm col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 font-medium">Cargando eventos...</p>
                ) : paginated.length === 0 ? (
                    <p className="text-[#6B6B6B] text-sm col-span-1 md:col-span-2 xl:col-span-3 text-center py-12 font-medium">No hay eventos registrados</p>
                ) : paginated.map((evento) => (
                    <div key={evento._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between min-w-0 w-full">
                        <div>
                            {/* Título y Acciones */}
                            <div className="flex items-start justify-between mb-3 gap-2">
                                <h3 className="font-extrabold text-[#2B2B2B] text-base line-clamp-2 min-w-0 flex-1 leading-snug">
                                    {evento.nombre}
                                </h3>
                                <div className="flex gap-0.5 shrink-0">
                                    <button onClick={() => handleEdit(evento)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors active:scale-95" title="Editar">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(evento)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors active:scale-95" title="Eliminar">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Descripción con límite de altura para mantener simetría */}
                            <p className="text-xs text-[#6B6B6B] mb-4 line-clamp-3 break-words min-h-[3rem]">
                                {evento.descripcion}
                            </p>

                            {/* Detalles de Información */}
                            <div className="space-y-2.5 mb-4 min-w-0">
                                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] min-w-0">
                                    <Store size={14} className="text-[#E67E22] shrink-0" />
                                    <span className="truncate font-medium">{evento.id_restaurante.nombre}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-[#6B6B6B] min-w-0">
                                    <CalendarDays size={14} className="text-[#E67E22] shrink-0 mt-0.5" />
                                    <div className="flex flex-wrap gap-1 min-w-0">
                                        {evento.fechas.map((f, i) => (
                                            <span key={i} className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#E67E22] text-[11px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-sm">
                                                {new Date(f).toLocaleDateString()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Servicios */}
                        <div className="border-t border-[#E8D8C3] pt-3 mt-auto min-w-0">
                            <p className="text-[10px] sm:text-xs text-[#6B6B6B] font-bold uppercase tracking-wider mb-2">Servicios</p>
                            <div className="flex flex-wrap gap-1 min-w-0">
                                {evento.servicios.map((s, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-[#E8D8C3] text-[#2B2B2B] text-[11px] font-semibold px-2 py-1 rounded-lg max-w-full truncate shadow-sm">
                                        <Tag size={10} className="shrink-0 text-[#2B2B2B]/70" />
                                        <span className="truncate">{s}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación Adaptativa */}
            <div className="pt-2 overflow-x-auto w-full flex justify-center sm:justify-start">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    total={filtered.length}
                    itemsShown={paginated.length}
                    onPageChange={setPage}
                />
            </div>

            <EventModal
                key={selectedEvent?._id ?? "new"}
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
                event={selectedEvent}
                onSaved={() => { }}
            />
        </div>
    );
};