import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import CartModel from "../dao/models/cart.model.js";


//1) Creamos un nuevo carrito: 
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)
            
        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//3) Agregar productos a distintos carritos.
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//4) Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carritos = await cartManager.getTodosLosCarritos();
        res.json(carritos);
    } catch (error) {
        console.error("Error al obtener los carritos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//5) Borrar carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carritoEliminado = await cartManager.eliminarCarrito(cartId);
        if (!carritoEliminado) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json({ message: "Carrito eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//6) Eliminar producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const carritoActualizado = await cartManager.eliminarProductoDelCarrito(cartId, productId);
        if (carritoActualizado) {
            res.json({
                message: "Producto eliminado del carrito exitosamente",
                carrito: carritoActualizado
            });
        } else {
            res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//7)Actulizar carrito
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products; // Espera un array de productos

    try {
        const carritoActualizado = await cartManager.actualizarCarrito(cartId, products);
        if (!carritoActualizado) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json({
            message: "Carrito actualizado exitosamente",
            carrito: carritoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el carrito", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//8)Actualizar cantidad de prductos en carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body; // Espera la cantidad en el cuerpo de la solicitud

    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
    }

    try {
        const carritoActualizado = await cartManager.actualizarCantidadProductos(cartId, productId, quantity);
        if (!carritoActualizado) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }
        res.json({
            message: "Cantidad de producto actualizada exitosamente",
            carrito: carritoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

export default router;