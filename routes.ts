import express from "express";
import userController from "./controllers/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";
import productController from "./controllers/product.controller.js";
import validateTask from "./middleware/validateTask.js";
import orderController from "./controllers/order.controller.js";
import cartController from "./controllers/cart.controller.js";
import { adminMiddleware } from "./middleware/types/adminMiddleware.js";

const router = express.Router();


router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);


router.post("/task", authMiddleware, adminMiddleware, validateTask, productController.create);
router.get("/task", productController.getAll);
router.get("/task/:id", productController.getById);


router.post("/orders", authMiddleware, orderController.createOrder);
router.get("/orders", authMiddleware, orderController.getOrdersByUser);
router.get("/orders/:id", authMiddleware, orderController.getOrderById);


router.get("/cart", authMiddleware, cartController.getCart);
router.post("/cart", authMiddleware, cartController.addItem);
router.delete("/cart/:id", authMiddleware, cartController.removeItem);

export default router;
