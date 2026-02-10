import { File } from "../schema/file";
import type { Request, Response } from "express";

export const createFile = async (req: Request, res: Response) => {
  try {
    const { fileid, filesize, filename, bucketId, mimeType } = req.body;
    if (!fileid || !filesize || !filename || !bucketId || !mimeType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newFile = await File.create({
      fileid,
      filesize,
      filename,
      bucketId,
      mimeType,
    });

    return res.status(201).json({ fileId: newFile._id });
  } catch (error) {
    console.error("Error creating file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
