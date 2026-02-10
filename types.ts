import type { LucideIcon } from "lucide-react";

const Visibility = {
  PUBLIC: "public",
  PRIVATE: "private",
  UNLISTED: "unlisted",
};

const Language = {
  GO: "go",
  CPP: "cpp",
  CSS: "css",
  PHP: "php",
  TEXT: "text",
  JAVA: "java",
  RUBY: "ruby",
  HTML: "html",
  JSON: "json",
  BASH: "bash",
  CSHARP: "csharp",
  PYTHON: "python",
  MARKDOWN: "markdown",
  TYPESCRIPT: "typescript",
  JAVASCRIPT: "javascript",
};

export type Language = (typeof Language)[keyof typeof Language];
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

export type FeatureItemType = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type CTAItemType = {
  icon: LucideIcon;
  href: string;
  title: string;
  btitle: string;
  description: string;
  active?: boolean;
};

export type PasteResponseType = {
  user:
    | {
        id: string | undefined;
        email: string | undefined;
        username: string | undefined;
      }
    | undefined;
  fileUrl:
    | {
        fileid: string;
        bucketId: string;
        filename: string;
        mimeType: string;
        filesize: string;
      }
    | undefined;
  updatedAt: Date;
  createdAt: Date;
  isOwner: boolean;
  viewCount: number;
  language: Language;
  visibility: Visibility;
  title: string | undefined;
  content: string | undefined;
  expiresAt: Date | undefined;
  maxViews: number | undefined;
};
