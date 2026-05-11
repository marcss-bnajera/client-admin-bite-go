import { X, ClipboardList, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSaveOrder } from "../hooks/useSaveOrder";
import { useOrdersStore } from "../store/ordersStore";
import { useRestaurantsStore } from "../../restaurants/store/restaurantsStore";
import { useProductsStore } from "../../products/store/productsStore";
import { useUsersStore } from "../../users/store/usersStore";
import { showSuccess, showError } from "../../../shared/utils/toast";

const ESTADOS_EDITABLES = ["Pendiente"];

const buildForm = (order) => ({
    id_usuario_cliente: order?.id_usuario_cliente?._id ?? order?.id_usuario_cliente ?? "",
    id_restaurante: order?.id_restaurante?._id ?? order?.id_restaurante ?? "",
    id_mesero_asignado: order?.id_mesero_asignado?._id ?? order?.id_mesero_asignado ?? "",
    id_repartidor_asignado: order?.id_repartidor_asignado?._id ?? order?.id_repartidor_asignado ?? "",
    tipo_servicio: order?.tipo_servicio ?? "Comer aquí",
    estado: order?.estado ?? "Pendiente",
    activo: order?.activo ?? true,
    items: order?.items ?? [],
});

export const OrderModal = ({ isOpen, onClose, order = null, onSaved }) => {
    const isEditing = !!order;
    const { saveOrder } = useSaveOrder();
    const loading = useOrdersStore((state) => state.loading);

    const restaurants = useRestaurantsStore((state) => state.restaurants);
    const getRestaurants = useRestaurantsStore((state) => state.getRestaurants);
    const products = useProductsStore((state) => state.products);
    const getProducts = useProductsStore((state) => state.getProducts);
    const users = useUsersStore((state) => state.users);
    const getUsers = useUsersStore((state) => state.getUsers);

    const [form, setForm] = useState(() => buildForm(order));
    const [nuevoItem, setNuevoItem] = useState({ id_producto: "", cantidad: 1, notas: "" });

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {
        if (isOpen) {
            getRestaurants();
            getProducts({ activo: true, limit: 200 });
            getUsers({ activo: true, limit: 200 });
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const built = buildForm(order);
        setForm(built);
        setNuevoItem({ id_producto: "", cantidad: 1, notas: "" });
        setFormErrors({});
        reset({
            id_usuario_cliente: built.id_usuario_cliente,
            id_restaurante: built.id_restaurante,
        });
    }, [isOpen, order?._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "tipo_servicio") {
            setForm((prev) => ({ ...prev, tipo_servicio: value, id_mesero_asignado: "", id_repartidor_asignado: "" }));
            return;
        }
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "id_usuario_cliente" || name === "id_restaurante") {
            setValue(name, value, { shouldValidate: true });
            if (value) setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleAgregarItem = () => {
        if (!nuevoItem.id_producto) return;
        const producto = products.find((p) => p._id === nuevoItem.id_producto);
        if (!producto) return;
        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id_producto: nuevoItem.id_producto,
                    nombre_historico: producto.nombre,
                    precio_historico: producto.precio,
                    cantidad: Math.max(1, Number(nuevoItem.cantidad)),
                    notas: nuevoItem.notas.trim(),
                },
            ],
        }));
        setNuevoItem({ id_producto: "", cantidad: 1, notas: "" });
    };

    const handleRemoveItem = (index) => {
        setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const total = form.items.reduce((acc, item) => acc + item.precio_historico * item.cantidad, 0);

    const [formErrors, setFormErrors] = useState({});

    const onSubmit = async () => {
        const newErrors = {};
        if (!form.id_usuario_cliente) newErrors.id_usuario_cliente = "Selecciona un cliente";
        if (!form.id_restaurante) newErrors.id_restaurante = "Selecciona un restaurante";
        if (form.items.length === 0) newErrors.items = "Agrega al menos un producto";

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }
        setFormErrors({});

        try {
            await saveOrder({ ...form, total }, order?._id ?? null);
            showSuccess(isEditing ? "Pedido actualizado correctamente" : "Pedido creado correctamente");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al guardar el pedido");
        }
    };

    const handleSoftDelete = async () => {
        try {
            await saveOrder({ ...form, activo: false, total }, order._id);
            showSuccess("Pedido desactivado correctamente");
            onSaved?.();
            onClose();
        } catch {
            showError("Error al desactivar el pedido");
        }
    };

    const clientes = users.filter((u) => u.rol === "Cliente");
    const meseros = users.filter((u) => u.rol === "Mesero");
    const repartidores = users.filter((u) => u.rol === "Repartidor");

    const productosDisponibles = form.id_restaurante
        ? products.filter((p) => (p.id_restaurante?._id || p.id_restaurante) === form.id_restaurante && p.activo && p.disponibilidad)
        : products.filter((p) => p.activo && p.disponibilidad);

    const itemsEditables = !isEditing || ESTADOS_EDITABLES.includes(form.estado);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-[#E8D8C3] max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8D8C3] bg-[#3A2E2A] rounded-t-2xl sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E67E22]/20 flex items-center justify-center">
                            <ClipboardList size={16} className="text-[#E67E22]" />
                        </div>
                        <h3 className="text-white font-extrabold text-base">
                            {isEditing ? `Pedido #${order._id.slice(-5).toUpperCase()}` : "Nuevo Pedido"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-5">

                    {/* Aviso pedido inactivo */}
                    {isEditing && !form.activo && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                            <AlertTriangle size={15} className="shrink-0" />
                            Este pedido está inactivo (cancelado o eliminado).
                        </div>
                    )}

                    {/* DATOS DEL PEDIDO */}
                    <div>
                        <p className="text-xs font-black text-[#6B6B6B] uppercase tracking-widest mb-3">Datos del Pedido</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* Cliente */}
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Cliente *</label>
                                <select
                                    name="id_usuario_cliente"
                                    value={form.id_usuario_cliente}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${!isEditing && formErrors.id_usuario_cliente ? "border-red-400" : "border-[#E8D8C3]"}`}
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {clientes.map((u) => (
                                        <option key={u._id} value={u._id}>{u.nombre}</option>
                                    ))}
                                </select>
                                {!isEditing && formErrors.id_usuario_cliente && <p className="text-[10px] text-red-500 mt-1">{formErrors.id_usuario_cliente}</p>}
                            </div>

                            {/* Restaurante */}
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Restaurante *</label>
                                <select
                                    name="id_restaurante"
                                    value={form.id_restaurante}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${!isEditing && formErrors.id_restaurante ? "border-red-400" : "border-[#E8D8C3]"}`}
                                >
                                    <option value="">Seleccionar restaurante...</option>
                                    {restaurants.map((r) => (
                                        <option key={r._id} value={r._id}>{r.nombre}</option>
                                    ))}
                                </select>
                                {!isEditing && formErrors.id_restaurante && <p className="text-[10px] text-red-500 mt-1">{formErrors.id_restaurante}</p>}
                            </div>

                            {/* Tipo de servicio */}
                            <div>
                                <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Tipo de Servicio *</label>
                                <select
                                    name="tipo_servicio"
                                    value={form.tipo_servicio}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                    className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="Comer aquí">Comer aquí</option>
                                    <option value="Domicilio">Domicilio</option>
                                    <option value="Para llevar">Para llevar</option>
                                </select>
                            </div>

                            {/* Estado solo en edición */}
                            {isEditing && (
                                <div>
                                    <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Estado</label>
                                    <select
                                        name="estado"
                                        value={form.estado}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Preparacion">Preparación</option>
                                        <option value="Listo">Listo</option>
                                        <option value="Servido">Servido</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ASIGNACIONES */}
                    {(form.tipo_servicio === "Comer aquí" || form.tipo_servicio === "Domicilio") && (
                        <div>
                            <p className="text-xs font-black text-[#6B6B6B] uppercase tracking-widest mb-3">Asignaciones (Opcional)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {form.tipo_servicio === "Comer aquí" && (
                                    <div>
                                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Mesero Asignado</label>
                                        <select
                                            name="id_mesero_asignado"
                                            value={form.id_mesero_asignado}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                        >
                                            <option value="">Sin asignar</option>
                                            {meseros.map((m) => (
                                                <option key={m._id} value={m._id}>{m.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {form.tipo_servicio === "Domicilio" && (
                                    <div>
                                        <label className="block text-xs font-bold text-[#2B2B2B] uppercase tracking-wide mb-1">Repartidor Asignado</label>
                                        <select
                                            name="id_repartidor_asignado"
                                            value={form.id_repartidor_asignado}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-[#F5EFE6]/50 transition-colors"
                                        >
                                            <option value="">Sin asignar</option>
                                            {repartidores.map((r) => (
                                                <option key={r._id} value={r._id}>{r.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ITEMS */}
                    <div>
                        <p className="text-xs font-black text-[#6B6B6B] uppercase tracking-widest mb-3">Items del Pedido</p>

                        {itemsEditables && (
                            <div className="bg-[#F5EFE6] border border-[#E8D8C3] rounded-xl p-3 mb-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                    <select
                                        value={nuevoItem.id_producto}
                                        onChange={(e) => setNuevoItem({ ...nuevoItem, id_producto: e.target.value })}
                                        className="px-3 py-2 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-white transition-colors"
                                    >
                                        <option value="">
                                            {!form.id_restaurante ? "Selecciona un restaurante primero" : "Seleccionar producto..."}
                                        </option>
                                        {productosDisponibles.map((p) => (
                                            <option key={p._id} value={p._id}>{p.nombre} — Q{p.precio}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={nuevoItem.cantidad}
                                        onChange={(e) => setNuevoItem({ ...nuevoItem, cantidad: e.target.value })}
                                        placeholder="Cantidad"
                                        className="px-3 py-2 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-white transition-colors"
                                    />
                                    <input
                                        type="text"
                                        value={nuevoItem.notas}
                                        onChange={(e) => setNuevoItem({ ...nuevoItem, notas: e.target.value })}
                                        placeholder="Notas (opcional)"
                                        className="px-3 py-2 border border-[#E8D8C3] rounded-xl text-sm text-[#2B2B2B] outline-none focus:border-[#E67E22] bg-white transition-colors"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAgregarItem}
                                    className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                >
                                    <Plus size={13} /> Agregar Item
                                </button>
                            </div>
                        )}

                        {form.items.length > 0 ? (
                            <div className="space-y-2">
                                {form.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white border border-[#E8D8C3] rounded-xl px-4 py-3">
                                        <div>
                                            <p className="text-sm font-semibold text-[#2B2B2B]">{item.nombre_historico}</p>
                                            <p className="text-xs text-[#6B6B6B]">
                                                x{item.cantidad} — Q{item.precio_historico} c/u
                                                {item.notas && ` · ${item.notas}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-[#E67E22]">
                                                Q{(item.precio_historico * item.cantidad).toFixed(2)}
                                            </span>
                                            {itemsEditables && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#C0392B] transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-end pt-2">
                                    <div className="bg-[#3A2E2A] text-white px-5 py-2 rounded-xl">
                                        <span className="text-xs font-bold uppercase tracking-wide">Total: </span>
                                        <span className="text-base font-extrabold">Q{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-[#6B6B6B] text-sm border border-dashed border-[#E8D8C3] rounded-xl">
                                No hay items agregados aún
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-between items-center gap-3 pt-2 border-t border-[#E8D8C3]">
                        {isEditing && form.activo ? (
                            <button
                                type="button"
                                onClick={handleSoftDelete}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#C0392B] hover:bg-red-50 border border-red-200 transition-colors"
                            >
                                <Trash2 size={13} /> Desactivar Pedido
                            </button>
                        ) : (
                            <span />
                        )}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl border border-[#E8D8C3] text-sm font-semibold text-[#6B6B6B] hover:bg-[#F5EFE6] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-sm font-bold shadow-md transition-colors disabled:opacity-60"
                            >
                                {loading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Pedido"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};