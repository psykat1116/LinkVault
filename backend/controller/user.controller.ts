import { User } from "../schema/user";
import type { Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Paste } from "../schema/paste";
import type { PasteWithFile } from "../type";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ message: "User Not Found" });
    }

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

    var payload: any;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_secret_sauce",
      );

      if (payload.userId !== id) {
        return res
          .status(403)
          .json({ message: "Invalid token, authorization denied" });
      }
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const pastes = (await Paste.find({ userId: id })
      .populate({
        path: "fileUrl",
        model: "File",
      })
      .exec()) as PasteWithFile[];

    const PasteDetails = pastes.map((paste) => ({
      title: paste.title,
      language: paste.language,
      maxViews: paste.maxViews,
      uniqueid: paste.uniqueid,
      expiresAt: paste.expiresAt,
      createdAt: paste.createdAt,
      viewCount: paste.viewCount,
      visibility: paste.visibility,
      maxDownloads: paste.maxDownloads,
      downloadCount: paste.downloadCount,
      buckeId: paste.fileUrl?.bucketId,
      fileId: paste.fileUrl?.fileid,
    }));

    return res.status(200).json({ data: PasteDetails });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};
