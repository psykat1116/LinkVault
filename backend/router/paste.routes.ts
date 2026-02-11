import multer from "multer";
import { Router } from "express";
import * as PasteController from "../controller/paste.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/:pasteId", PasteController.getPaste);
router.put("/:pasteId", PasteController.updatePaste);
router.delete("/:pasteId", PasteController.deletePaste);
router.get("/download/:pasteId", PasteController.downloadPaste);
router.post("/", upload.single("file"), PasteController.createPaste);
router.get("/:pasteId/verify/:password", PasteController.verifyPastePassword);

export default router;
