import { Router } from "express";
import * as PasteController from "../controller/paste.controller";

const router = Router();

router.post("/", PasteController.createPaste);
router.get("/:pasteId", PasteController.getPaste);
router.put("/:pasteId", PasteController.updatePaste);
router.delete("/:pasteId", PasteController.deletePaste);
router.get("/:pasteId/verify/:password", PasteController.verifyPastePassword);

export default router;
