import {
  Eye,
  Copy,
  Home,
  Lock,
  Plus,
  Vault,
  Upload,
  EyeOff,
  Trash2,
  FileBox,
  FileImage,
  FileVideo,
  FileAudio,
  ArrowLeft,
  ArrowUpRight,
  FileCodeCorner,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useTransition } from "react";

import {
  BackendURL,
  MaxFileSize,
  ViewLimitOptions,
  ExpirationOptions,
  VisibilityOptions,
  SupportedLanguages,
  DownloadLimitOptions,
} from "../../../data";
import Menu from "../main/Menu";
import Toggle from "../main/Toggle";
import { Button } from "../ui/button";
import type { Language, Visibility } from "../../../types";

const Create = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState<string>("");
  const [pasteId, setPasteId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [maxViews, setMaxViews] = useState<string>("-1");
  const [language, setLanguage] = useState<Language>("text");
  const [expiration, setExpiration] = useState<string>("10");
  const [maxDownloads, setMaxDownloads] = useState<string>("-1");
  const [visibility, setVisibility] = useState<Visibility>("public");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isOneTimeView, setIsOneTimeView] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);

  const handleModeChange = (mode: "text" | "file") => {
    setContent("");
    setInputMode(mode);
    setUploadedFile(null);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/link/${pasteId}`;
    navigator.clipboard.writeText(url);
    toast.info("Paste URL copied to clipboard.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MaxFileSize) {
      setUploadedFile(null);
      toast.error(
        `Maximum file size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
      return;
    }
    setContent("");
    setUploadedFile(file);
    toast.success(
      `File ${file.name} (${(file.size / 1024).toFixed(2)}KB) uploaded`,
    );
  };

  const handleCreatePaste = () => {
    if (inputMode === "text" && !content.trim()) {
      toast.error("Please paste some content");
      return;
    }
    if (inputMode === "file" && !uploadedFile) {
      toast.error("Please upload a file");
      return;
    }
    if (isPasswordProtected && !password) {
      toast.error("Password is required for protected pastes");
      return;
    }
    if (isPasswordProtected && password.length < 8) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    const user = localStorage.getItem("userData");
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (user) formData.append("userId", JSON.parse(user).id);
        if (uploadedFile) formData.append("file", uploadedFile);
        if (title.length > 0) formData.append("title", title);
        if (content.length > 0) formData.append("content", content);
        if (expiration !== "-1") formData.append("expiration", expiration);
        if (password.length > 0) formData.append("password", password);
        if (maxDownloads !== "-1")
          formData.append("maxDownloads", maxDownloads);

        formData.append("language", language);
        formData.append("visibility", visibility);
        formData.append(
          "maxViews",
          isOneTimeView ? "1" : maxViews !== "-1" ? maxViews : "",
        );

        const res = await axios.post(`${BackendURL}/api/paste`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) {
          setPasteId(res.data.pasteId);
          toast.success("Paste Created Successfully");
        } else {
          toast.error(res.data.message);
        }
      } catch (error: any) {
        setTitle("");
        setContent("");
        setUploadedFile(null);
        toast.error(error.response.data.message);
        if (error.response.status === 401) navigate("/auth/signin");
      }
    });
  };

  if (pasteId) {
    return (
      <main className="min-h-screen bg-accent">
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
                <Button size="sm">
                  <Plus />
                  New Paste
                </Button>
              </a>
            </div>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="p-8 text-left space-y-6 border border-primary/20 bg-card rounded-md shadow">
            <div className="w-full rounded-sm flex gap-2 items-center font-semibold">
              <Vault className="bg-primary h-8 w-8 text-primary-foreground p-1 rounded-sm" />
              LinkVault
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Paste Created!</h1>
              <p className="text-muted-foreground">
                Your paste has been created and is ready to share.
              </p>
            </div>
            <div className="bg-background rounded-lg border border-border p-4 space-y-3">
              <div className="space-y-2 flex flex-col items-start">
                <label className="text-xs text-muted-foreground">
                  Paste URL
                </label>
                <div className="flex gap-2 w-full justify-between items-center">
                  <input
                    readOnly
                    className="font-poppins text-sm border w-full px-2 py-1.5 rounded-sm select-none"
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/link/${pasteId}`}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="gap-2 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="bg-transparent"
                  >
                    <a
                      target="_blank"
                      href={`${typeof window !== "undefined" ? window.location.origin : ""}/link/${pasteId}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
              {(isPasswordProtected ||
                isOneTimeView ||
                maxViews !== "-1" ||
                maxDownloads !== "-1") && (
                <div className="pt-3 border-t border-border space-y-2 text-sm">
                  {isPasswordProtected && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Lock className="w-4 h-4" />
                      Password protected
                    </Button>
                  )}
                  {isOneTimeView && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Eye className="w-4 h-4" />
                      One-time view only
                    </Button>
                  )}
                  {maxViews !== "-1" && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Eye className="w-4 h-4" />
                      Max {maxViews} views
                    </Button>
                  )}
                  {maxDownloads !== "-1" && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Upload className="w-4 h-4" />
                      Max {maxDownloads} downloads
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1 group">
                <a href="/new">
                  <Plus className="group-hover:scale-110" />
                  Create Another
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <a href="/">
                  <Home />
                  Back to Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-accent">
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
          <div className="flex items-center gap-4 group">
            <a href="/">
              <Button className="gap-2" size="sm" variant="ghost">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition duration-300" />
                Back
              </Button>
            </a>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2 flex flex-col text-sm">
              <input
                id="title"
                value={title}
                placeholder="My code snippet"
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border p-2 rounded-md"
              />
            </div>
            <div className="flex gap-2 p-2 bg-input rounded-lg">
              <Button
                variant="ghost"
                onClick={() => handleModeChange("text")}
                className={`flex-1 py-2 px-4 rounded font-medium text-sm transition-colors ${
                  inputMode === "text" && "bg-accent text-accent-foreground"
                }`}
              >
                Paste Text
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleModeChange("file")}
                className={`flex-1 py-2 px-4 rounded font-medium text-sm transition-colors ${
                  inputMode === "file" && "bg-accent text-accent-foreground"
                }`}
              >
                Upload File
              </Button>
            </div>
            {inputMode === "text" && (
              <div className="space-y-2 flex flex-col text-sm">
                <label htmlFor="content" className="font-semibold">
                  Paste Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your code or text here..."
                  className="h-100 bg-background resize-none p-3 border rounded-md"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {content.length} characters
                </p>
              </div>
            )}
            {inputMode === "file" && (
              <div className="space-y-2">
                {uploadedFile ? (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg text-center cursor-pointer hover:border-primary/50 bg-card flex justify-center items-center h-20 px-4">
                    <div className="flex items-center w-full justify-between gap-1">
                      <div className="flex gap-1 items-center">
                        {uploadedFile.type.startsWith("image/") && (
                          <FileImage size={40} />
                        )}
                        {uploadedFile.type.startsWith("video/") && (
                          <FileVideo size={30} />
                        )}
                        {uploadedFile.type.startsWith("audio/") && (
                          <FileAudio size={30} />
                        )}
                        {uploadedFile.type.startsWith("application/") && (
                          <FileBox size={30} />
                        )}
                        {uploadedFile.type.startsWith("text/") && (
                          <FileCodeCorner size={30} />
                        )}
                        <div className="flex flex-col items-start min-w-0">
                          <p className="font-semibold text-sm wrap-break-word">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        type="button"
                        variant="destructive"
                        onClick={() => setUploadedFile(null)}
                      >
                        <Trash2 />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="file" className="block">
                    <div className="border-2 border-dashed border-primary/30 rounded-lg text-center cursor-pointer hover:border-primary/50 h-110 bg-card flex justify-center items-center">
                      <div className="flex flex-col gap-2">
                        <Upload className="w-5 h-5 text-muted-foreground mx-auto" />
                        <p className="text-sm font-medium">Upload a file</p>
                        <p className="text-xs text-muted-foreground">
                          Max Uploaded File is 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {inputMode === "text" && (
              <Menu
                value={language}
                deafultvalue="text"
                disabled={isPending}
                onChange={setLanguage}
                data={SupportedLanguages}
                label="Syntax Highlighting"
              />
            )}
            <Menu
              deafultvalue="-1"
              label="Expiration"
              value={expiration}
              disabled={isPending}
              onChange={setExpiration}
              data={ExpirationOptions}
            />
            <Menu
              label="Visibility"
              value={visibility}
              disabled={isPending}
              deafultvalue="public"
              onChange={setVisibility}
              data={VisibilityOptions}
            />
            <div className="space-y-3 rounded-md">
              <Toggle
                label="Password"
                disabled={isPending}
                value={isPasswordProtected}
                description1="Disable Password"
                description2="Enable Password"
                setValue={setIsPasswordProtected}
              />
              {isPasswordProtected && (
                <div className="relative bg-card">
                  <input
                    value={password}
                    className="pr-10 w-full p-2 border rounded-md text-sm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password (min 8 chars)"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            <Toggle
              disabled={isPending}
              label="One-Time View"
              value={isOneTimeView}
              setValue={setIsOneTimeView}
              description2="Enable Burn After Read"
              description1="Disable Burn After Read"
            />
            {!isOneTimeView && (
              <>
                <Menu
                  label="Max Views"
                  value={maxViews}
                  deafultvalue="-1"
                  disabled={isPending}
                  onChange={setMaxViews}
                  data={ViewLimitOptions}
                />
                {inputMode === "file" && (
                  <Menu
                    deafultvalue="-1"
                    label="Max Downloads"
                    disabled={isPending}
                    value={maxDownloads}
                    onChange={setMaxDownloads}
                    data={DownloadLimitOptions}
                  />
                )}
              </>
            )}
            <Button
              size="lg"
              className="w-full"
              onClick={handleCreatePaste}
              disabled={isPending || (!content.trim() && !uploadedFile)}
            >
              {isPending ? "Creating..." : "Create Paste"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Create;
