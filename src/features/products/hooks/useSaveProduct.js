import { useProductsStore } from "../store/productsStore";

export const useSaveProduct = () => {
    const createProduct = useProductsStore((state) => state.createProduct);
    const updateProduct = useProductsStore((state) => state.updateProduct);

    const saveProduct = async (data, productId = null) => {
        const hasImage = data.foto && data.foto.length > 0;

        if (hasImage) {
            const formData = new FormData();

            if (!productId) {
                formData.append("id_restaurante", data.id_restaurante);
                formData.append("activo", true);
            }

            formData.append("nombre", data.nombre);
            formData.append("descripcion", data.descripcion || "");
            formData.append("categoria", data.categoria);
            formData.append("precio", Number(data.precio));
            formData.append("disponibilidad", data.disponibilidad === "true" || data.disponibilidad === true);

            if (productId && data.activo !== undefined) {
                formData.append("activo", data.activo === "true" || data.activo === true);
            }
            formData.append("foto", data.foto[0]);

            if (productId) {
                await updateProduct(productId, formData);
            } else {
                await createProduct(formData);
            }

        } else {
            const payload = productId ? {
                nombre: data.nombre,
                descripcion: data.descripcion,
                categoria: data.categoria,
                precio: Number(data.precio),
                disponibilidad: data.disponibilidad === "true" || data.disponibilidad === true,
            } : {
                id_restaurante: data.id_restaurante,
                nombre: data.nombre,
                descripcion: data.descripcion,
                categoria: data.categoria,
                precio: Number(data.precio),
                disponibilidad: data.disponibilidad === "true" || data.disponibilidad === true,
                activo: true,
                foto_url: [],
                receta: [],
                variaciones: [],
            };

            if (productId) {
                await updateProduct(productId, payload);
            } else {
                await createProduct(payload);
            }
        }
    };

    return { saveProduct };
};