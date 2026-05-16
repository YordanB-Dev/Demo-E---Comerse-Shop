import repo from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/types/AppError.js";

interface User {
  id: number;
  email: string;
  password: string;
  username: string
}

export const register = async (email: string, password: string, username: string) => {
  if (!email?.trim() || !password?.trim() || !username.trim()) {
    throw new AppError("Email and password also and username are required", 400);
  }

  const existingUser = await repo.findUserByEmail(email);
  if (existingUser) {
    throw new AppError("This email is already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await repo.createUser(email, hashedPassword, username);

  return {
    id: user.id,
    email: email
  };
};

export const login = async (email: string, password: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password); 
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET is not defined", 500);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: "1h" }
  );

  return { 
    token,
    user: { id: user.id, email: user.email }
  };
};

export default {
  register,
  login
};