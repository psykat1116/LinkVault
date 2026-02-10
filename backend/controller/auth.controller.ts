require("dotenv").config();

import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { User } from "../schema/user";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_sauce";
const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!EmailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const CheckSession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Token expired, authorization denied" });
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token expired, authorization denied" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your_secret_sauce");
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return res
          .status(401)
          .json({ message: "Token expired, authorization denied" });
      }
      if (err instanceof JsonWebTokenError) {
        return res
          .status(403)
          .json({ message: "Invalid token, authorization denied" });
      }
      return res.status(500).json({ message: "Server error" });
    }

    return res.status(200).json({ message: "Session is valid" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
