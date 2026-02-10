import { Router } from "express";
import { SignUp, SignIn, CheckSession } from "../controller/auth.controller";

const router = Router();

router.post("/signup", SignUp);
router.post("/signin", SignIn);
router.get("/ping", CheckSession);

export default router;
