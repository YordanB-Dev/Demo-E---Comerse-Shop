import { getDefaultHighWaterMark } from "node:stream";
import db from "../db.js";
import type { QueryResult } from "pg";

interface User {
    id: number
    name: string,
    email: string,
    password: string,
    username: string;
}

export const createUser = async (
    email: string,
    password: string,
    username: string
): Promise<User> => {
    const result: QueryResult<User> = await db.query(
        `INSER INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING id, email, password, username`,
        [email, password, username]
    );

    return result.rows[0]!;
};

export const findUserByEmail = async (email: string): Promise<User> => {
    const result: QueryResult<User> = await db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );

    return result.rows[0]!;
};

export default {
    createUser,
    findUserByEmail
};