import express from "express";
import userController from "./controllers/user.controller.js";
import authMiddleware from "./middleware/auth.middleware.js";
import productController from "./controllers/product.controller.js";
import validateTask from "./middleware/validateTask.js";

const router = express.Router();

router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);

router.post('/task', authMiddleware, validateTask, productController.create);

router.get('/task', authMiddleware, productController.getAll);
router.get('/task/:id', authMiddleware, productController.getById);

export default router;