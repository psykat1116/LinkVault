import type { IFile } from "../type";
import { Schema, model } from "mongoose";

export const fileSchema = new Schema<IFile>(
  {
    fileid: {
      type: String,
      required: true,
      unique: true,
    },
    filesize: {
      type: Number,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    bucketId: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const File = model<IFile>("File", fileSchema);