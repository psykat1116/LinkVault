import { File } from "../schema/file";
import type { Request, Response } from "express";

export const createFile = async (req: Request, res: Response) => {
  try {
    const { fileid, filesize, filename, bucketId, mimeType, expiration } =
      req.body;
    if (!fileid || !filesize || !filename || !bucketId || !mimeType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    var expiryData = undefined;
    if (expiration) {
      const durationInMinutes = parseInt(expiration, 10);
      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        return res.status(400).json({ message: "Invalid expiration value" });
      }
      expiryData = new Date(Date.now() + durationInMinutes * 60000);
    }

    const newFile = await File.create({
      fileid,
      filesize,
      filename,
      bucketId,
      mimeType,
      expiresAt: expiryData,
    });

    return res.status(201).json({ fileId: newFile._id });
  } catch (error) {
    console.error("Error creating file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
