import { urlToHttpOptions } from "node:url";
import pool from "../db.js";
import { AppError } from "../middleware/types/AppError.js";

interface Cart {
    id: number;
    user_id: number;
    created_at: Date;
}

interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    added_at: Date;
}

export const cartRepository = {

    async getOrCreateCart(userId: number): Promise<Cart> {
        const existing = await pool.query<Cart>(
            `SELECT * FROM carts WHERE user_id = $1`,
            [userId]
        );

        if (existing.rows[0]) {
            return existing.rows[0];
        }

        const newCart = await pool.query<Cart>(
            `INSERT INTO carts (user_id) VALUES ($1) RETURNING *`,
            [userId]
        );

        if (!newCart.rows[0]) {
            throw new AppError(`cart is empty`, 400);
        }

        return newCart.rows[0];
    },

    async addItem(cartId: number, productId: number, quantity: number): Promise<CartItem> {
        const existing = await pool.query<CartItem>(
            `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId]
        );

        if (existing.rows[0]) {
            const updated = await pool.query<CartItem>(
                `UPDATE cart_items SET quantity = quantity + $1
                 WHERE cart_id = $2 AND product_id = $3
                 RETURNING *`,
                [quantity, cartId, productId]
            );

            if (!updated.rows[0]) {
                throw new Error("Failed to update cart item");
            }

            return updated.rows[0];
        }

        const added = await pool.query<CartItem>(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [cartId, productId, quantity]
        );

        if (!added.rows[0]) {
            throw new AppError(`Nothing added`, 400);
        }

        return added.rows[0];
    },

    async removeItem(cartId: number, productId: number): Promise<void> {
        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId]
        );
    },

    async getCartWithItems(cartId: number): Promise<CartItem[]> {
        const result = await pool.query<CartItem>(
            `SELECT ci.*, p.name, p.price
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
            [cartId]
        );

        return result.rows;
    },

    async clearCart(cartId: number): Promise<void> {
        await pool.query(
            `DELETE FROM cart_items WHERE cart_id = $1`,
            [cartId]
        );
    }
};

export default cartRepository;