import { User } from "../schema/user";
import type { Request, Response } from "express";
import { connectToDatabase, disconnectFromDatabase } from "../db/connect";

export const getUser = async (req: Request, res: Response) => {};
export const deleteUser = async (req: Request, res: Response) => {};