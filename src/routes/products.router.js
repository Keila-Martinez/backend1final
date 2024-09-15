import express from "express";
import productController from "../controllers/products.controller.js";  
const router = express.Router();

// Ruta para obtener productos con paginación
router.get("/", productController.getProducts);

// Ruta para obtener un producto por ID
router.get("/:pid", productController.getProductById);

// Ruta para agregar un nuevo producto
router.post("/", productController.addProduct);

// Ruta para actualizar un producto por ID
router.put("/:pid", productController.updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/:pid", productController.deleteProduct);

export default router;
