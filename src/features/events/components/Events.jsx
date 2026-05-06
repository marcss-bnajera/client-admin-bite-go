import { useState } from "react";
import { Plus, Search, Pencil, Trash2, CalendarDays, Store, Tag } from "lucide-react";
import { EventModal } from "./EventModal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useRestaurants } from "../../restaurants/hooks/useRestaurants";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";

const LIMIT = 6;

export const Events = () => {
    const { restaurants, loading } = useRestaurants();
    const { deleteEvento } = useRestaurantsStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const allEventos = restaurants.flatMap((r) =>
        (r.eventos ?? []).map((e) => ({ ...e, id_restaurante: { _id: r._id, nombre: r.nombre } }))
    );

    const filtered = allEventos.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase()) ||
        e.id_restaurante.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / LIMIT);
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    const handleNew = () => { setSelectedEvent(null); setModalOpen(true); };
    const handleEdit = (evt) => { setSelectedEvent(evt); setModalOpen(true); };
    const handleDelete = (evt) => deleteEvento(evt.id_restaurante._id, evt._id);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#2B2B2B]">Eventos Gastronómicos</h2>
                    <p className="text-sm text-[#6B6B6B] mt-1">Eventos especiales por restaurante</p>
                </div>
                <button onClick={handleNew} className="flex items-center gap-2 bg-[#C0392B] hover:bg-[#A93226] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors self-start sm:self-auto">
                    <Plus size={16} /> Nuevo Evento
                </button>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-4 py-2 max-w-md">
                <Search size={16} className="text-[#6B6B6B] shrink-0" />
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                    placeholder="Buscar evento o restaurante..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                    <p className="text-[#6B6B6B] text-sm col-span-3 text-center py-10">Cargando eventos...</p>
                ) : paginated.length === 0 ? (
                    <p className="text-[#6B6B6B] text-sm col-span-3 text-center py-10">No hay eventos registrados</p>
                ) : paginated.map((evento) => (
                    <div key={evento._id} className="bg-white rounded-2xl border border-[#E8D8C3] shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="font-extrabold text-[#2B2B2B] text-base">{evento.nombre}</h3>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(evento)} className="p-2 rounded-lg hover:bg-[#F2E6D9] text-[#E67E22] transition-colors" title="Editar">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(evento)} className="p-2 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors" title="Eliminar">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-[#6B6B6B] mb-4">{evento.descripcion}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                                <Store size={13} className="text-[#E67E22] shrink-0" />
                                {evento.id_restaurante.nombre}
                            </div>
                            <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                                <CalendarDays size={13} className="text-[#E67E22] shrink-0 mt-0.5" />
                                <div className="flex flex-wrap gap-1">
                                    {evento.fechas.map((f, i) => (
                                        <span key={i} className="bg-[#F5EFE6] border border-[#E8D8C3] text-[#E67E22] text-xs font-semibold px-2 py-0.5 rounded-lg">
                                            {new Date(f).toLocaleDateString()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#E8D8C3] pt-3">
                            <p className="text-xs text-[#6B6B6B] font-bold uppercase tracking-wide mb-2">Servicios</p>
                            <div className="flex flex-wrap gap-1">
                                {evento.servicios.map((s, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-[#E8D8C3] text-[#2B2B2B] text-xs font-medium px-2 py-1 rounded-lg">
                                        <Tag size={10} /> {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages || 1}
                total={filtered.length}
                itemsShown={paginated.length}
                onPageChange={setPage}
            />

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