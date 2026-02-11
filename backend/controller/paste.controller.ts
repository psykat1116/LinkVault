require("dotenv").config();

import { User } from "../schema/user";
import { Paste } from "../schema/paste";
import {
  Visibility,
  Language,
  type IFile,
  type IPaste,
  type PasteWithFile,
} from "../type";

import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { File } from "../schema/file";
import { storage } from "../db/storage";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export const createPaste = async (req: Request, res: Response) => {
  try {
    const {
      title,
      userId,
      content,
      language,
      maxViews,
      password,
      expiration,
      visibility,
      maxDownloads,
    } = req.body;

    let fileUrl: string | undefined = undefined;
    let expiryData: Date | undefined = undefined;
    let hashedPassword: string | undefined = undefined;

    if (req.file) {
      const uploadedFile = await storage.createFile(
        process.env.APPWRITE_BUCKET_ID!,
        ID.unique(),
        InputFile.fromBuffer(req.file.buffer, req.file.originalname),
      );

      console.log(uploadedFile);

      const newFile = await File.create({
        fileid: uploadedFile.$id,
        filename: uploadedFile.name,
        bucketId: uploadedFile.bucketId,
        mimeType: uploadedFile.mimeType,
        filesize: uploadedFile.sizeOriginal,
      });

      fileUrl = newFile._id.toString();
    }
    if (expiration) {
      const durationInMinutes = parseInt(expiration, 10);
      if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
        return res.status(400).json({ message: "Invalid expiration value" });
      }
      expiryData = new Date(Date.now() + durationInMinutes * 60000);
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    if (!Object.values(Visibility).includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility value" });
    }
    if (!Object.values(Language).includes(language)) {
      return res.status(400).json({ message: "Invalid language value" });
    }
    if (visibility === Visibility.PRIVATE && !userId) {
      return res.status(401).json({ message: "Login to create private paste" });
    }

    const newPaste = await Paste.create({
      title,
      userId,
      content,
      fileUrl,
      language,
      maxViews,
      visibility,
      maxDownloads,
      expiresAt: expiryData,
      password: hashedPassword,
      downloadCount: fileUrl ? 0 : undefined,
    });

    return res.status(201).json({ pasteId: newPaste.uniqueid });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const getPaste = async (req: Request, res: Response) => {
  try {
    const { pasteId } = req.params;
    const paste = await Paste.findOne({ uniqueid: pasteId });

    if (!paste) {
      return res.status(403).json({ message: "Paste not found" });
    }
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      await Paste.deleteOne({ uniqueid: pasteId });
      return res.status(403).json({ message: "Paste view limit exceeded" });
    }
    if (paste.expiresAt && paste.expiresAt < new Date()) {
      await Paste.deleteOne({ uniqueid: pasteId });
      return res.status(403).json({ message: "Paste has expired" });
    }

    if (paste.visibility === Visibility.PRIVATE) {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ message: "No token, authorization denied" });
      }

      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_secret_sauce",
      );
      if (!paste.userId) {
        return res.status(401).json({ message: "Access denied to this paste" });
      }
      if ((payload as any).userId !== paste.userId) {
        return res.status(401).json({ message: "Access denied to this paste" });
      }
      if (paste.password) {
        return res.status(200).json({ isProtected: true, data: undefined });
      }

      await Paste.updateOne({ uniqueid: pasteId }, { $inc: { viewCount: 1 } });
      const user = await User.findById(paste.userId);
      const file = paste.fileUrl
        ? await File.findById(paste.fileUrl)
        : undefined;

      return res.status(200).json({
        isProtected: false,
        data: {
          user: {
            id: user?._id,
            email: user?.email,
            username: user?.username,
          },
          fileUrl: file
            ? {
                fileid: file?.fileid,
                bucketId: file?.bucketId,
                filename: file?.filename,
                mimeType: file?.mimeType,
                filesize: file?.filesize,
              }
            : undefined,
          isOwner: true,
          title: paste.title,
          content: paste.content,
          language: paste.language,
          maxViews: paste.maxViews,
          expiresAt: paste.expiresAt,
          createdAt: paste.createdAt,
          updatedAt: paste.updatedAt,
          visibility: paste.visibility,
          viewCount: paste.viewCount + 1,
        },
      });
    }

    if (paste.password)
      return res.status(200).json({ isProtected: true, data: undefined });
    await Paste.updateOne({ uniqueid: pasteId }, { $inc: { viewCount: 1 } });
    const file = paste.fileUrl ? await File.findById(paste.fileUrl) : undefined;

    if (paste.userId) {
      let payload: any = null;
      const user = await User.findById(paste.userId);
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (token) {
        try {
          payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_secret_sauce",
          );
        } catch (err) {
          if (err instanceof TokenExpiredError) {
            return res
              .status(403)
              .json({ message: "Token expired, authorization denied" });
          }
          if (err instanceof JsonWebTokenError) {
            return res
              .status(401)
              .json({ message: "Invalid token, authorization denied" });
          }

          return res.status(500).json({ message: "Server error" });
        }
      }

      return res.status(200).json({
        isProtected: false,
        data: {
          user: user
            ? {
                id: user?._id,
                email: user?.email,
                username: user?.username,
              }
            : undefined,
          fileUrl: file
            ? {
                fileid: file?.fileid,
                bucketId: file?.bucketId,
                filename: file?.filename,
                mimeType: file?.mimeType,
                filesize: file?.filesize,
              }
            : undefined,
          title: paste.title,
          content: paste.content,
          language: paste.language,
          maxViews: paste.maxViews,
          expiresAt: paste.expiresAt,
          createdAt: paste.createdAt,
          updatedAt: paste.updatedAt,
          visibility: paste.visibility,
          viewCount: paste.viewCount + 1,
          isOwner: !!payload && payload.userId === paste.userId.toString(),
        },
      });
    }

    return res.status(200).json({
      isProtected: false,
      data: {
        fileUrl: file
          ? {
              fileid: file?.fileid,
              bucketId: file?.bucketId,
              filename: file?.filename,
              mimeType: file?.mimeType,
              filesize: file?.filesize,
            }
          : undefined,
        isOwner: false,
        user: undefined,
        title: paste.title,
        content: paste.content,
        language: paste.language,
        maxViews: paste.maxViews,
        expiresAt: paste.expiresAt,
        createdAt: paste.createdAt,
        updatedAt: paste.updatedAt,
        visibility: paste.visibility,
        viewCount: paste.viewCount + 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const verifyPastePassword = async (req: Request, res: Response) => {
  try {
    const { pasteId, password } = req.params;

    const paste = await Paste.findOne({ uniqueid: pasteId });
    if (!paste) {
      return res.status(403).json({ message: "Paste not found" });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "This paste is password-protected" });
    }
    if (!paste.password) {
      return res
        .status(400)
        .json({ message: "This paste is not password-protected" });
    }

    const isMatch = await bcrypt.compare(password, paste.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await Paste.updateOne({ uniqueid: pasteId }, { $inc: { viewCount: 1 } });
    const file = paste.fileUrl ? await File.findById(paste.fileUrl) : undefined;

    if (paste.userId) {
      let payload: any = null;
      const user = await User.findById(paste.userId);
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (token) {
        try {
          payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_secret_sauce",
          );
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
      }

      return res.status(200).json({
        user: {
          id: user?._id,
          email: user?.email,
          username: user?.username,
        },
        fileUrl: file
          ? {
              fileid: file?.fileid,
              bucketId: file?.bucketId,
              filename: file?.filename,
              mimeType: file?.mimeType,
              filesize: file?.filesize,
            }
          : undefined,
        title: paste.title,
        content: paste.content,
        language: paste.language,
        maxViews: paste.maxViews,
        expiresAt: paste.expiresAt,
        createdAt: paste.createdAt,
        updatedAt: paste.updatedAt,
        visibility: paste.visibility,
        viewCount: paste.viewCount + 1,
        isOwner: !!payload && paste.userId === payload.id,
      });
    }

    return res.status(200).json({
      fileUrl: file
        ? {
            fileid: file?.fileid,
            bucketId: file?.bucketId,
            filename: file?.filename,
            mimeType: file?.mimeType,
            filesize: file?.filesize,
          }
        : undefined,
      isOwner: false,
      user: undefined,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      maxViews: paste.maxViews,
      expiresAt: paste.expiresAt,
      createdAt: paste.createdAt,
      updatedAt: paste.updatedAt,
      visibility: paste.visibility,
      viewCount: paste.viewCount + 1,
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const deletePaste = async (req: Request, res: Response) => {
  try {
    const { pasteId } = req.params;

    const paste = await Paste.findOne({ uniqueid: pasteId });
    if (!paste) {
      return res.status(403).json({ message: "Paste not found" });
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_sauce",
    );
    if ((payload as any).userId !== paste.userId?.toString()) {
      return res.status(403).json({ message: "Access denied to this paste" });
    }

    if (paste.fileUrl) {
      await File.deleteOne({ _id: paste.fileUrl });
    }
    await Paste.deleteOne({ uniqueid: pasteId });

    return res.status(200).json({ message: "Paste deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const updatePaste = async (req: Request, res: Response) => {
  try {
    const { pasteId } = req.params;

    const paste = await Paste.findOne({ uniqueId: pasteId });
    if (!paste) {
      return res.status(403).json({ message: "Paste not found" });
    }

    await Paste.updateOne(
      { uniqueId: pasteId },
      { $inc: { downloadCount: 1 } },
    );

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Server error",
    });
  }
};

export const downloadPaste = async (req: Request, res: Response) => {
  try {
    const { pasteId } = req.params;
    const paste = (await Paste.findOne({
      uniqueid: pasteId,
    })
      .populate({
        path: "fileUrl",
        model: "File",
      })
      .exec()) as PasteWithFile | null;

    if (!paste || !paste.fileUrl) {
      return res.status(404).json({ message: "Paste not found" });
    }

    if (
      paste.maxDownloads &&
      (paste.downloadCount || 0) >= paste.maxDownloads
    ) {
      return res.status(403).json({
        message: "Maximum download limit reached",
      });
    }

    const fileBuffer = await storage.getFileDownload(
      process.env.APPWRITE_BUCKET_ID!,
      paste.fileUrl.fileid,
    );
    const buffer = Buffer.from(fileBuffer);

    res.setHeader(
      "Content-Type",
      paste.fileUrl.mimeType || "application/octet-stream",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${paste.fileUrl.filename || "download"}"`,
    );
    res
      .send(buffer)
      .on("finish", async () => {
        console.log("Send Successfull");
        await Paste.updateOne(
          { uniqueId: pasteId },
          { $inc: { downloadCount: 1 } },
        );
      })
      .on("error", () => {
        console.error("Response error during download");
      });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};
