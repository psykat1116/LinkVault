import Router from "express";
import * as UserController from "../controller/user.controller";

const router = Router();

router.get("/:id", UserController.getUser);
router.delete("/:id", UserController.deleteUser);

export default router;
