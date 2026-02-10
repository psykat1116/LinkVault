require("dotenv").config();

import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_sauce",
    );
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
