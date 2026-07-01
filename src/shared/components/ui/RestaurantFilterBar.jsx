import { useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useRestaurantsStore } from "../../../features/restaurants/store/restaurantsStore";
import { SearchableSelect } from "./SearchableSelect";

export const RestaurantFilterBar = ({
    filterRestaurant,
    onRestaurantChange,
    filterSucursal,
    onSucursalChange,
    showSucursal = true,
    search,
    onSearchChange,
    searchPlaceholder = "Buscar...",
    showSearch = true,
    filterActivo,
    onActivoChange,
    showActiveFilter = false,
    filterStatus,
    onStatusChange,
    showStatusFilter = false,
    statusOptions = [],
    extraFilters,
    emptyMessage = "Seleccioná un restaurante para ver los registros",
    onPageReset,
    showEmptyState = true,
}) => {
    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);

    useEffect(() => { getRestaurants(); }, []);

    const selectedRestaurant = restaurants.find((r) => r._id === filterRestaurant);
    const tieneSucursales = selectedRestaurant?.tiene_sucursales ?? false;
    const sucursales = tieneSucursales ? (selectedRestaurant?.sucursales ?? []) : [];

    useEffect(() => {
        if (onSucursalChange) onSucursalChange("");
    }, [filterRestaurant]);

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
        if (onPageReset) onPageReset(1);
    };

    const restaurantOptions = useMemo(() =>
        restaurants.map((r) => ({
            value: r._id,
            label: r.nombre,
            subtitle: r.tiene_sucursales ? `${r.sucursales?.length || 0} sucursales` : undefined,
        })),
    [restaurants]);

    const sucursalOptions = useMemo(() =>
        sucursales.map((s) => ({
            value: s._id,
            label: s.nombre,
            subtitle: s.direccion?.texto || undefined,
        })),
    [sucursales]);

    const hasRestaurant = !!filterRestaurant;

    return (
        <>
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 items-center pb-5 border-b border-[#E8D8C3]">

                <div className="w-full sm:w-auto min-w-[200px]">
                    <SearchableSelect
                        value={filterRestaurant}
                        onChange={(val) => {
                            onRestaurantChange(val);
                            if (onPageReset) onPageReset(1);
                        }}
                        options={restaurantOptions}
                        placeholder="Seleccionar restaurante..."
                        icon={Filter}
                        searchPlaceholder="Buscar restaurante..."
                        emptyText="Sin restaurantes"
                    />
                </div>

                {showSucursal && tieneSucursales && sucursales.length > 0 && (
                    <div className="w-full sm:w-auto min-w-[180px]">
                        <SearchableSelect
                            value={filterSucursal}
                            onChange={(val) => {
                                onSucursalChange(val);
                                if (onPageReset) onPageReset(1);
                            }}
                            options={sucursalOptions}
                            placeholder="Todas las sucursales"
                            searchPlaceholder="Buscar sucursal..."
                            emptyText="Sin sucursales"
                        />
                    </div>
                )}

                {showActiveFilter && (
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-10 w-full sm:w-40 focus-within:border-[#E67E22] transition-colors">
                        <select
                            value={filterActivo}
                            onChange={handleChange(onActivoChange)}
                            className="outline-none text-sm bg-transparent text-[#6B6B6B] cursor-pointer w-full"
                        >
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                            <option value="">Todos</option>
                        </select>
                    </div>
                )}

                {showStatusFilter && statusOptions.length > 0 && (
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-10 w-full sm:w-auto min-w-[160px] focus-within:border-[#E67E22] transition-colors">
                        <Filter size={14} className="text-[#6B6B6B] shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={handleChange(onStatusChange)}
                            className="outline-none text-sm bg-transparent text-[#6B6B6B] cursor-pointer w-full"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {extraFilters}

                {showSearch && (
                    <div className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-10 w-full sm:flex-1 sm:max-w-xs focus-within:border-[#E67E22] transition-colors">
                        <Search size={14} className="text-[#6B6B6B] shrink-0" />
                        <input
                            value={search}
                            onChange={handleChange(onSearchChange)}
                            className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                            placeholder={searchPlaceholder}
                        />
                    </div>
                )}
            </div>

            {showEmptyState && !hasRestaurant && (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#6B6B6B]">
                    <Filter size={36} className="opacity-40 animate-pulse" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
            )}
        </>
    );
};
