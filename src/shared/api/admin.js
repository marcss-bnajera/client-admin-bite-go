import { axiosAdmin } from "./api";

// ================= ORDERS =================
export const getOrders = async (params) => {
    return await axiosAdmin.get("/orders", { params });
};
export const getOrderById = async (id) => {
    return await axiosAdmin.get(`/orders/${id}`);
};
export const getOrdersByUser = async (id, params) => {
    return await axiosAdmin.get(`/orders/user/${id}`, { params });
};
export const getOrdersByRestaurant = async (id, params) => {
    return await axiosAdmin.get(`/orders/restaurant/${id}`, { params });
};
export const createOrder = async (data) => {
    return await axiosAdmin.post("/orders", data);
};
export const updateOrder = async (id, data) => {
    return await axiosAdmin.put(`/orders/${id}`, data);
};
export const deleteOrder = async (id) => {
    return await axiosAdmin.delete(`/orders/${id}`);
};
export const activateOrder = async (id) => {
    return await axiosAdmin.patch(`/orders/${id}/activate`);
};
// ================= CATEGORIES =================
export const getCategories = async (params) => {
    return await axiosAdmin.get("/categories", { params });
};
export const createCategory = async (data) => {
    return await axiosAdmin.post("/categories", data);
};
export const updateCategory = async (id, data) => {
    return await axiosAdmin.put(`/categories/${id}`, data);
};
export const deleteCategory = async (id) => {
    return await axiosAdmin.delete(`/categories/${id}`);
};
export const activateCategory = async (id) => {
    return await axiosAdmin.patch(`/categories/${id}/activate`);
};
// ================= USERS =================
export const getUsers = async (params) => {
    return await axiosAdmin.get("/users", { params });
};
export const createUser = async (data) => {
    return await axiosAdmin.post("/users/register", data);
};
export const updateUser = async (id, data) => {
    return await axiosAdmin.put(`/users/${id}`, data);
};
export const deleteUser = async (id) => {
    return await axiosAdmin.delete(`/users/${id}`);
};
export const activateUser = async (id) => {
    return await axiosAdmin.patch(`/users/${id}/activate`);
};
// ================= RESTAURANTS =================
export const getRestaurants = async (params) => {
    return await axiosAdmin.get("/restaurants", { params });
};
export const createRestaurant = async (data) => {
    return await axiosAdmin.post("/restaurants", data);
};
export const updateRestaurant = async (id, data) => {
    return await axiosAdmin.put(`/restaurants/${id}`, data);
};
export const deleteRestaurant = async (id) => {
    return await axiosAdmin.delete(`/restaurants/${id}`);
};
export const activateRestaurant = async (id) => {
    return await axiosAdmin.patch(`/restaurants/${id}/activate`);
};
// ================= TABLES =================
export const getMesas = async (restaurantId) => {
    return await axiosAdmin.get(`/tables/${restaurantId}`);
};
export const addMesa = async (restaurantId, data) => {
    return await axiosAdmin.post(`/tables/${restaurantId}`, data);
};
export const updateMesa = async (restId, mesaId, data) => {
    return await axiosAdmin.put(`/tables/${restId}/${mesaId}`, data);
};
export const deleteMesa = async (restId, mesaId) => {
    return await axiosAdmin.delete(`/tables/${restId}/${mesaId}`);
};
// ================= GASTRONOMIC EVENTS =================
export const getEventos = async (restaurantId) => {
    return await axiosAdmin.get(`/gastronomicEvents/${restaurantId}`);
};
export const addEvento = async (restaurantId, data) => {
    return await axiosAdmin.post(`/gastronomicEvents/${restaurantId}`, data);
};
export const updateEvento = async (restId, eventoId, data) => {
    return await axiosAdmin.put(`/gastronomicEvents/${restId}/${eventoId}`, data);
};
export const deleteEvento = async (restId, eventoId) => {
    return await axiosAdmin.delete(`/gastronomicEvents/${restId}/${eventoId}`);
};
// ================= PRODUCTS =================
export const getProducts = async (params) => {
    return await axiosAdmin.get("/products", { params });
};
export const createProduct = async (data) => {
    return await axiosAdmin.post("/products", data);
};
export const updateProduct = async (id, data) => {
    return await axiosAdmin.put(`/products/${id}`, data);
};
export const deleteProduct = async (id) => {
    return await axiosAdmin.delete(`/products/${id}`);
};
export const activateProduct = async (id) => {
    return await axiosAdmin.patch(`/products/${id}/activate`);
};
// ================= RECIPES =================
export const getRecipes = async (productId) => {
    return await axiosAdmin.get(`/recipes/${productId}`);
};
export const addRecipeItem = async (productId, data) => {
    return await axiosAdmin.post(`/recipes/${productId}`, data);
};
export const updateRecipeItem = async (productId, recipeId, data) => {
    return await axiosAdmin.put(`/recipes/${productId}/${recipeId}`, data);
};
export const deleteRecipeItem = async (productId, recipeId) => {
    return await axiosAdmin.delete(`/recipes/${productId}/${recipeId}`);
};
// ================= ITEMS =================
export const getItems = async (orderId) => {
    return await axiosAdmin.get(`/items/${orderId}`);
};
export const addItem = async (orderId, data) => {
    return await axiosAdmin.post(`/items/${orderId}`, data);
};
export const updateItem = async (orderId, itemId, data) => {
    return await axiosAdmin.put(`/items/${orderId}/${itemId}`, data);
};
export const deleteItem = async (orderId, itemId) => {
    return await axiosAdmin.delete(`/items/${orderId}/${itemId}`);
};
// ================= INVENTORY =================
export const getInventoryByRestaurant = async (id_restaurante, params) => {
    return await axiosAdmin.get(`/suppliesInventory/restaurant/${id_restaurante}`, { params });
};
export const getLowStockAlerts = async (id_restaurante) => {
    return await axiosAdmin.get(`/suppliesInventory/alerts/${id_restaurante}`);
};
export const createInsumo = async (data) => {
    return await axiosAdmin.post("/suppliesInventory", data);
};
export const adjustStock = async (id, data) => {
    return await axiosAdmin.put(`/suppliesInventory/adjust/${id}`, data);
};
export const updateInsumo = async (id, data) => {
    return await axiosAdmin.put(`/suppliesInventory/${id}`, data);
};
export const deleteInsumo = async (id) => {
    return await axiosAdmin.delete(`/suppliesInventory/${id}`);
};
export const activateInsumo = async (id) => {
    return await axiosAdmin.patch(`/suppliesInventory/${id}/activate`);
};
// ================= RESERVATIONS =================
export const getReservations = async (params) => {
    return await axiosAdmin.get("/reservations", { params });
};
export const createReservation = async (data) => {
    return await axiosAdmin.post("/reservations", data);
};
export const updateReservation = async (id, data) => {
    return await axiosAdmin.put(`/reservations/${id}`, data);
};
export const deleteReservation = async (id) => {
    return await axiosAdmin.delete(`/reservations/${id}`);
};