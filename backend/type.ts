export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
  UNLISTED = "unlisted",
}

export enum Language {
  GO = "go",
  CPP = "cpp",
  CSS = "css",
  PHP = "php",
  TEXT = "text",
  JAVA = "java",
  RUBY = "ruby",
  HTML = "html",
  JSON = "json",
  BASH = "bash",
  CSHARP = "csharp",
  PYTHON = "python",
  MARKDOWN = "markdown",
  TYPESCRIPT = "typescript",
  JAVASCRIPT = "javascript",
}

export interface IPaste extends Document {
  title?: string;
  userId?: string;
  uniqueid: string;
  content?: string;
  fileUrl?: string;
  password?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  maxViews?: number;
  viewCount: number;
  language: Language;
  visibility: Visibility;
  downloadCount?: number;
  maxDownloads?: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile extends Document {
  fileid: string;
  filename: string;
  bucketId: string;
  mimeType: string;
  filesize: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PasteWithFile = Omit<IPaste, "fileUrl"> & {
  fileUrl: IFile | undefined;
};
