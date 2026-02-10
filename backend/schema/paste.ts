import type { IPaste } from "../type";
import { customAlphabet } from "nanoid";
import { Language, Visibility } from "../type";
import { Schema, model } from "mongoose";

const Alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const genShortId = customAlphabet(Alphabet, 8);

export const pasteSchema = new Schema<IPaste>(
  {
    uniqueid: {
      type: String,
      default: () => genShortId(),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    fileUrl: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: false,
    },
    language: {
      type: String,
      enum: Object.values(Language),
      default: Language.TEXT,
    },
    visibility: {
      type: String,
      enum: Object.values(Visibility),
      default: Visibility.PUBLIC,
    },
    password: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      expires: 0,
      required: false,
    },
    maxViews: {
      type: Number,
      required: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    maxDownloads: {
      type: Number,
      required: false,
    },
    downloadCount: {
      type: Number,
      required: false,
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

export const Paste = model<IPaste>("Paste", pasteSchema);
