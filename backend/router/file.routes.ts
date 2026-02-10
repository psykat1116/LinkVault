import { Router } from "express";
import * as FileController from "../controller/file.controller";

const router = Router();
router.post("/", FileController.createFile);

export default router;