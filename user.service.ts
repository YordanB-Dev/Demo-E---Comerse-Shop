import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/types/AppError.js";
import userRepository from "../repositories/user.repository.js";


interface User {
  id: number,
  email: string,
  password: string,
  username: string;
}

export const register = async (email: string, password: string, username: string) => {
  if (!email?.trim() || !password?.trim() || !username?.trim()) {
    throw new AppError(`Missing required fields`, 404);
  }

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError(`Email alredy in use`, 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser(email, hashedPassword, username);

  return {
    id: user.id,
    email: user.email
  };
};

const login = async (email: string, password: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError(`Invalid user`, 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(`Invalid password`, 400);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(`JWT_SECRET  is not defined`, 500);
  }

  const token = jwt.sign(
    {id: user.id, email: user.email, role: user.role},
    secret,
    {expiresIn: `1d`}
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
