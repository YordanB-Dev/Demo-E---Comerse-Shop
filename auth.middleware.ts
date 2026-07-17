import type { Request, Response, NextFunction } from "express";
import Jwt  from "jsonwebtoken";

interface JwtPayload {
  id: number;
}

const authMiddleware = (
  req: Request & {user?: JwtPayload},
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: `Unauthoriez`});
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: `Invalid token`});
    return;
  }

  const secret = process.env.JWT_SECRET as string;

  try {
    const decoded = Jwt.verify (
      token,
      secret
    );

    if (typeof decoded === "string") {
      res.status(401).json({ message: `Invalid token`});
      return;
    }

    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: `Invalid token`});
    return;
  }
};

export default authMiddleware;
