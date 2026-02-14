import Router from "express";
import * as UserController from "../controller/user.controller";

const router = Router();

router.get("/:id", UserController.getUser);

export default router;
