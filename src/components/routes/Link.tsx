import {
  X,
  Eye,
  Copy,
  Lock,
  Plus,
  Check,
  Globe,
  Vault,
  ListX,
  Share2,
  Trash2,
  EyeOff,
  Loader,
  FileBox,
  Calendar,
  ArrowLeft,
  FileImage,
  FileVideo,
  FileAudio,
  AlertCircle,
  CloudDownload,
  FileCodeCorner,
  HardDriveDownload,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useTransition } from "react";

import Error from "./Error";
import { Button } from "../ui/button";
import { BackendURL } from "../../../data";
import { storage } from "../../lib/storage";
import type { PasteResponseType } from "../../../types";

const Paste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hadFetched = useRef(false);
  const token = localStorage.getItem("userToken");
  const [isPending, startTransition] = useTransition();

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);
  const [PasteDetails, setPasteDetails] = useState<
    PasteResponseType | undefined
  >(undefined);

  useEffect(() => {
    if (hadFetched.current) return;
    hadFetched.current = true;

    const fetchLink = async () => {
      try {
        const res = await axios.get(`${BackendURL}/api/paste/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.isProtected === true) {
          setIsPasswordProtected(true);
        } else {
          console.log(res.data.data);
          setPasteDetails(res.data.data);
        }
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message || "An error occurred";
        if (status === 401) {
          navigate("/auth/signin");
          localStorage.removeItem("userData");
          localStorage.removeItem("userToken");
          toast.error("Session expired. Please login again.");
        } else if (status === 403) {
          return <Error code={403} />;
        } else {
          toast.error(message);
        }
      }
    };

    fetchLink();
  }, [id, token]);

  const handlePasswordSubmit = () => {
    startTransition(async () => {
      try {
        const res = await axios.get(
          `${BackendURL}/api/paste/${id}/verify/${passwordInput}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.status !== 200) {
          toast.error(`${res.status} - ${res.data.message}`);
        } else {
          setPasswordInput("");
          setShowPassword(false);
          setIsPasswordProtected(false);
          setPasteDetails(res.data);
          toast.success("Password Verified");
        }
      } catch (error: any) {
        toast.error(
          error.response.data.message || "Password Verification Failed",
        );
      }
    });
  };

  const handleDeletePaste = () => {
    startTransition(async () => {
      try {
        if (PasteDetails?.fileUrl) {
          storage.deleteFile({
            bucketId: PasteDetails?.fileUrl.bucketId,
            fileId: PasteDetails?.fileUrl.fileid,
          });
        }

        const res = await axios.delete(`${BackendURL}/api/paste/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }

        navigate("/");
        setShowDeleteConfirm(false);
      } catch (error: any) {
        toast.error(error.response.data.message || "Paste Delete Error!!");
      }
    });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(PasteDetails?.content || "");
    setIsCopied(true);
    toast.success("Paste content copied to clipboard.");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyUrl = () => {
    const url = `${typeof window !== "undefined" ? window.location.href : ""}`;
    navigator.clipboard.writeText(url);
    toast.info("Paste URL copied to clipboard.");
  };

  const handleDownload = () => {
    startTransition(async () => {
      await axios.get(`${BackendURL}/api/paste/download/${id}`);
    });
  };

  const formatDate = (date: string | Date) => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (isPasswordProtected && !PasteDetails) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-border p-8 space-y-6 shadow rounded-md bg-accent">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              <Vault />
            </div>
            <span className="font-semibold text-lg">Linkvault</span>
          </div>
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">This paste is protected</h1>
            <p className="text-sm text-muted-foreground">
              Enter the password to view this paste
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <div className="relative flex justify-between items-center bg-background rounded">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordSubmit();
                    }
                  }}
                  className="p-2 focus-visible:outline-none"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button onClick={handlePasswordSubmit} className="w-full" size="lg">
              Unlock Paste
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!PasteDetails && !isPasswordProtected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader />
        </div>
        <span className="ml-2">Loading Paste...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              <Vault />
            </div>
            <span className="font-semibold text-lg">Linkvault</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/new">
              <Button size="sm" variant="default" disabled={isPending}>
                <Plus />
                New Paste
              </Button>
            </a>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-2 mb-6">
          <div className="space-y-4">
            <a
              href="/"
              className="inline-flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors justify-end"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </a>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl font-bold wrap-break-word">
                    {PasteDetails?.title || "Untitled"}
                  </h1>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow">
                  <Eye className="w-4 h-4" />
                  {PasteDetails?.viewCount} views
                </div>
                <div className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow">
                  <HardDriveDownload className="w-4 h-4" />
                  {PasteDetails?.viewCount} views
                </div>
                <div className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow">
                  {PasteDetails?.visibility === "public" ? (
                    <>
                      <Globe className="h-3 w-3" />
                      Public
                    </>
                  ) : PasteDetails?.visibility === "private" ? (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  ) : (
                    <>
                      <ListX className="w-3 h-3" />
                      Unlisted
                    </>
                  )}
                </div>
                {/* {PasteDetails?. && (
                  <Badge variant="outline" className="gap-1.5">
                    <Lock className="w-3 h-3" />
                    Password Protected
                  </Badge>
                )} */}
                {PasteDetails?.maxViews === 1 && (
                  <div className="gap-1.5 border-destructive/50 text-destructive flex border rounded-sm items-center p-1 text-xs shadow">
                    <Eye className="w-3 h-3" />
                    One-Time View
                  </div>
                )}
                {PasteDetails?.createdAt && (
                  <div className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow">
                    <Calendar className="w-3 h-3" />
                    {formatDate(PasteDetails.createdAt)}
                  </div>
                )}
                {PasteDetails?.expiresAt && (
                  <div className="gap-1.5 border-destructive/50 text-destructive flex border rounded-sm items-center p-1 text-xs shadow">
                    Expires {formatDate(PasteDetails.expiresAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {PasteDetails?.content && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={handleCopyContent}
                className="gap-2 bg-transparent shadow"
              >
                <Copy className="w-4 h-4" />
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={handleCopyUrl}
              className="gap-2 bg-transparent shadow"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            {PasteDetails?.isOwner && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 bg-transparent text-destructive hover:text-destructive shadow"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
          {showDeleteConfirm && (
            <div className="p-4 border border-destructive/50 space-y-3 rounded-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Delete this paste?</p>
                  <p className="text-xs text-muted-foreground">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  className="bg-transparent"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <X />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={isPending}
                  variant="destructive"
                  onClick={handleDeletePaste}
                >
                  <Check />
                  Delete Permanently
                </Button>
              </div>
            </div>
          )}
        </div>
        {PasteDetails?.fileUrl ? (
          <div className="border border-border overflow-hidden rounded-md shadow bg-card">
            <div className="bg-muted shadow mt-6 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                {PasteDetails.fileUrl.filename}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {(
                  parseInt(PasteDetails.fileUrl.filesize) /
                  1024 /
                  1024
                ).toFixed(2)}
                MB
              </span>
            </div>
            <div className="overflow-x-auto p-6 bg-muted my-6 text-foreground shadow leading-relaxed flex items-center justify-between gap-2">
              {PasteDetails.fileUrl.mimeType.startsWith("image/") && (
                <FileImage size={30} />
              )}
              {PasteDetails.fileUrl.mimeType.startsWith("video/") && (
                <FileVideo size={30} />
              )}
              {PasteDetails.fileUrl.mimeType.startsWith("audio/") && (
                <FileAudio size={30} />
              )}
              {PasteDetails.fileUrl.mimeType.startsWith("application/") && (
                <FileBox size={30} />
              )}
              {PasteDetails.fileUrl.mimeType.startsWith("text/") && (
                <FileCodeCorner size={30} />
              )}
              <Button onClick={handleDownload} size="sm" variant="outline">
                Download
                <CloudDownload />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-border overflow-hidden rounded-md shadow bg-card">
            <div className="bg-muted shadow mt-6 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {PasteDetails?.language}
                </span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {PasteDetails?.content?.split("\n").length} lines
              </span>
            </div>
            <p className="overflow-x-auto p-6 bg-muted my-6 text-foreground shadow leading-relaxed">
              {PasteDetails?.language === "text" ? (
                <p className="font-poppins">{PasteDetails.content}</p>
              ) : (
                <code>{PasteDetails?.content}</code>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Paste;
