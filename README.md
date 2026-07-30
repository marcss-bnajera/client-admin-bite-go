# ⚙️ Bite&Go Admin — Frontend Web

Panel de administración web para la plataforma Bite&Go. Gestiona restaurantes, pedidos, reservas, productos, inventario, usuarios staff y más.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-5-000000?logo=react)

---

## 📋 Descripción

Panel de administración para gestores y staff de Bite&Go. Consume la API del `admin-service` (Node, puerto 3002) para realizar operaciones CRUD sobre restaurantes, sucursales, productos, inventario, pedidos, reservas y usuarios. Requiere rol `SuperAdmin` o `Admin_Restaurante`.

---

## ⚙️ Stack

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `react` | ^18.2.0 | UI library |
| `react-dom` | ^18.2.0 | Renderizado DOM |
| `vite` | ^8.0.4 | Build y HMR |
| `tailwindcss` | ^4.2.2 | Estilos utility-first |
| `@tailwindcss/vite` | ^4.2.2 | Plugin Vite |
| `@material-tailwind/react` | ^2.1.10 | Componentes Material Design |
| `zustand` | ^5.0.12 | Estado global (9 stores) |
| `react-router-dom` | ^7.14.0 | Navegación SPA |
| `react-hook-form` | ^7.74.0 | Formularios |
| `react-hot-toast` | ^2.6.0 | Notificaciones toast |
| `axios` | ^1.14.0 | HTTP client |
| `date-fns` | ^4.4.0 | Manipulación de fechas |
| `react-day-picker` | ^10.0.1 | DatePicker |
| `lucide-react` | ^1.8.0 | Iconos SVG |
| `@heroicons/react` | ^2.2.0 | Iconos UI |

---

## 🏗️ Estructura del Proyecto

```
client-admin-bite-go/
├── src/
│   ├── app/
│   │   ├── main.jsx                   # Entry point (StrictMode > ThemeProvider > BrowserRouter)
│   │   ├── App.jsx                    # Root: Toaster + AppRoutes
│   │   ├── layouts/
│   │   │   └── DashboardPage.jsx      # Wrapper con DashboardContainer
│   │   └── router/
│   │       └── AppRouter.jsx          # Definición de rutas + control de acceso
│   │
│   ├── features/                      # 9 módulos funcionales
│   │   ├── auth/                      # Login + ForgotPassword
│   │   │   ├── store/authStore.js     # Store persistida (zustand/middleware/persist)
│   │   │   ├── pages/AuthPage.jsx
│   │   │   └── components/ (LoginForm, ForgotPasswordForm)
│   │   │
│   │   ├── dashboard/                 # Dashboard principal
│   │   │   └── components/Dashboard.jsx
│   │   │
│   │   ├── restaurants/               # CRUD restaurantes + sucursales + eventos
│   │   │   ├── store/restaurantsStore.js
│   │   │   ├── components/ (Restaurants, RestaurantModal, SucursalModal)
│   │   │   └── hooks/ (useRestaurants, useSaveRestaurant)
│   │   │
│   │   ├── orders/                    # CRUD pedidos
│   │   │   ├── store/ordersStore.js
│   │   │   ├── components/ (Orders, OrderModal, OrderDetailModal)
│   │   │   └── hooks/ (useOrders, useSaveOrder)
│   │   │
│   │   ├── reservations/              # CRUD reservas + check-in
│   │   │   ├── store/reservationsStore.js
│   │   │   ├── components/ (Reservations, ReservationModal)
│   │   │   └── hooks/ (useReservations, useSaveReservations)
│   │   │
│   │   ├── products/                  # CRUD productos + recetas
│   │   │   ├── store/productsStore.js
│   │   │   ├── components/ (Products, ProductModal)
│   │   │   └── hooks/ (useProducts, useSaveProduct)
│   │   │
│   │   ├── categories/                # CRUD categorías
│   │   │   ├── store/categoriesStore.js
│   │   │   ├── components/ (Categories, CategoryModal)
│   │   │   └── hooks/ (useCategories, useSaveCategory)
│   │   │
│   │   ├── users/                     # CRUD usuarios staff (SuperAdmin only)
│   │   │   ├── store/usersStore.js
│   │   │   ├── components/ (Users, UserModal)
│   │   │   └── hooks/ (useUsers, useSaveUser)
│   │   │
│   │   ├── inventory/                 # Inventario + alertas stock bajo
│   │   │   ├── store/inventoryStore.js
│   │   │   ├── components/ (Inventory, InventoryModal, AdjustStockModal)
│   │   │   └── hooks/ (useInventory, useSaveInsumo)
│   │   │
│   │   ├── items/                     # Items de pedidos
│   │   │   ├── store/itemsStore.js
│   │   │   ├── components/ (Items, ItemModal)
│   │   │   └── hooks/ (useItems, useSaveItem)
│   │   │
│   │   ├── recipes/                   # Recetas (ingredientes)
│   │   │   └── components/ (Recipes, RecipeModal, SupplyPickerModal)
│   │   │
│   │   ├── tables/                    # Mesas
│   │   │   └── components/ (Tables, TableModal)
│   │   │
│   │   └── events/                    # Eventos gastronómicos
│   │       └── components/ (Events, EventModal)
│   │
│   └── shared/
│       ├── api/                       # Clientes Axios + endpoints
│       │   ├── api.js                 # axiosAuth + axiosAdmin + interceptors
│       │   ├── auth.js                # Auth-service endpoints
│       │   └── admin.js               # Admin-service endpoints
│       ├── components/
│       │   ├── layout/                # DashboardContainer, Navbar, Sidebar
│       │   └── ui/                    # Pagination, SearchableSelect, RestaurantPicker, etc.
│       ├── ui/                        # DatePicker, AvatarUser
│       └── utils/                     # toast, confirmToast
│
├── .env                               # VITE_AUTH_URL, VITE_API_URL
├── Dockerfile                         # node:20-alpine, EXPOSE 5173
├── vercel.json                        # SPA routing
└── vite.config.js
```

---

## 🧭 Rutas

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | AuthPage | Público |
| `/dashboard` | Dashboard | Protegido |
| `/dashboard/pedidos` | Orders | Protegido |
| `/dashboard/productos` | Products | Protegido |
| `/dashboard/inventario` | Inventory | Protegido |
| `/dashboard/reservaciones` | Reservations | Protegido |
| `/dashboard/restaurantes` | Restaurants | Protegido |
| `/dashboard/usuarios` | Users | SuperAdmin only |
| `/dashboard/recetas` | Recipes | Protegido |
| `/dashboard/eventos` | Events | Protegido |
| `/dashboard/mesas` | Tables | Protegido |
| `/dashboard/categorias` | Categories | Protegido |
| `/dashboard/items` | Items | Protegido |

---

## 🏪 Zustand Stores

| Store | Archivo | Acciones principales |
|-------|---------|---------------------|
| `useAuthStore` | `auth/store/authStore.js` | login, logout, checkAuth |
| `useRestaurantsStore` | `restaurants/store/restaurantsStore.js` | CRUD restaurantes + sucursales + mesas + eventos |
| `useOrdersStore` | `orders/store/ordersStore.js` | CRUD pedidos |
| `useReservationsStore` | `reservations/store/reservationsStore.js` | CRUD reservas + check-in (mapea EN→ES) |
| `useProductsStore` | `products/store/productsStore.js` | CRUD productos + recetas |
| `useCategoriesStore` | `categories/store/categoriesStore.js` | CRUD categorías |
| `useUsersStore` | `users/store/usersStore.js` | CRUD usuarios staff |
| `useInventoryStore` | `inventory/store/inventoryStore.js` | Inventario + alertas + ajustes |
| `useItemsStore` | `items/store/itemsStore.js` | Items de pedidos |

---

## 📡 Conexiones API

| Cliente | Base URL | Timeout | Servicio |
|---------|----------|:-------:|----------|
| `axiosAuth` | `VITE_AUTH_URL` (default `http://localhost:3000`) | 8000ms | Auth-service .NET |
| `axiosAdmin` | `VITE_API_URL` (default `http://localhost:3002/bite-and-go/v1`) | 8000ms | Admin-service Node |

### Interceptores
- **Request**: Agregan `Authorization: Bearer <token>` automáticamente
- **Response 401**: Intenta refresh token; si falla, logout
- **Response 429**: Rate limit — respuesta silenciosa (no rompe polling)

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar
cd client-admin-bite-go
npm install

# 2. Variables de entorno
#    VITE_AUTH_URL=http://localhost:3000
#    VITE_API_URL=http://localhost:3002/bite-and-go/v1

# 3. Iniciar
npm run dev    # http://localhost:5173
npm run build  # Build producción
```

### Docker

```bash
# Desde la raíz del monorepo:
docker compose up --build client-admin
```

---

## 🚢 Despliegue (Vercel)

```bash
npm run build
vercel --prod
```

**Variables de entorno en Vercel:**
```
VITE_AUTH_URL=https://auth-service.onrender.com
VITE_API_URL=https://admin-service.onrender.com/bite-and-go/v1
```

---

## 🎨 Paleta de Colores

| Uso | Color |
|-----|-------|
| Primary | `#E67E22` |
| Dark primary | `#D35400` |
| Brown | `#3A2E2A` |
| Creams | `#F5EFE6`, `#E8D8C3` |
| Grays | `#2B2B2B`, `#6B6B6B` |
| Sidebar | `#08316d` (main-blue) |

---

## 👤 Usuarios por Defecto (Desarrollo)

| Email | Rol |
|-------|-----|
| `superadmin@bitego.local` | SuperAdmin |
| Cualquier otro registrado vía admin | Admin_Restaurante, Mesero, Cocinero, Repartidor |
