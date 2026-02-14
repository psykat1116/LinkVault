import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import Error from "./Error";
import { Button } from "../ui/button";
import { BackendURL } from "../../../data";
import { formatDate, getRelativeTime } from "../../lib/utils";
import type { UserPastes } from "../../../types";
import { storage } from "../../lib/storage";
import { Skeleton } from "../ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const hadFetched = useRef(false);
  const [isPending, startTransition] = useTransition();

  const [pastes, setPastes] = useState<UserPastes[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filteredPastes, setFilterPastes] = useState<UserPastes[]>([]);
  const [filter, setFilter] = useState<
    "all" | "public" | "private" | "unlisted"
  >("all");

  const data = localStorage.getItem("userData");
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    navigate("/auth/signin");
  };

  const handleFilter = (
    category: "all" | "public" | "private" | "unlisted",
  ) => {
    setFilter(category);
    if (category === "all") {
      setFilterPastes(pastes);
    } else {
      setFilterPastes(pastes.filter((paste) => paste.visibility === category));
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const paste = pastes.find((p) => p.uniqueid === id);
      if (!paste) return;

      try {
        const res = await axios.delete(`${BackendURL}/api/paste/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          if (paste.bucketId && paste.fileId) {
            await storage.deleteFile({
              bucketId: paste.bucketId,
              fileId: paste.fileId,
            });
          }
          toast.success(res.data.message);
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Unknown Error Occurred";
        toast.error(message);
      } finally {
        navigate("/");
        setConfirmDelete(null);
      }
    });
  };

  useEffect(() => {
    if (hadFetched.current) return;
    hadFetched.current = true;

    const fetchUser = async () => {
      if (!data || !token) return;
      setIsFetching(true);
      try {
        const user_id = JSON.parse(data).id;
        const response = await axios.get(`${BackendURL}/api/user/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPastes(response.data.data);
        setFilterPastes(response.data.data);
      } catch (error: any) {
        const status = error.response.status;
        const message =
          error.response?.data?.message || "Unknown Error Occurred";
        if (status === 401) {
          navigate("/auth/signin");
        } else {
          setError(403);
        }
        toast.error(message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [data, token]);

  if (error) {
    return (
      <Error
        code={403}
        message="Access Forbidden"
        description="You do not have permission to view this resource. It may be private or restricted."
      />
    );
  }

  if (!data || !token) {
    return (
      <Error
        code={401}
        message="Unauthorized Access"
        description="You need to be authenticated to access this resource. Please log in and try again."
      />
    );
  }

  if (isFetching) {
    return (
      <main className="min-h-screen bg-background">
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Skeleton className="h-9 w-25 px-4 py-2" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-10 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, ind) => (
                <div className="flex flex-col space-y-2" key={ind}>
                  <div className="p-4 border border-border hover:border-primary/50 bg-background rounded-md shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Skeleton className="h-8 w-20 rounded-md gap-1.5 px-3" />
                          <Skeleton className="h-6 w-10 rounded-md px-2" />
                          <Skeleton className="h-6 w-10 rounded-md px-2" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Skeleton className="h-6 w-12 rounded-md px-2" />
                          <Skeleton className="h-6 w-12 rounded-md px-2" />
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-6 w-12 gap-1 rounded-md px-2" />
                            <Skeleton className="h-6 w-12 gap-1 rounded-md px-2" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Skeleton className="size-8" />
                        <Skeleton className="size-8" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" className="group">
            <a href="/">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition duration-300" />
              <span className="text-sm font-medium">Back</span>
            </a>
          </Button>
          <div className="flex items-center gap-3">
            <a href="/new">
              <Button size="sm">
                <Plus className="w-4 h-4" />
                New Paste
              </Button>
            </a>
            <Button
              size="sm"
              variant="destructive"
              className="rounded-sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Your Pastes</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => handleFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === "public" ? "default" : "outline"}
                onClick={() => handleFilter("public")}
              >
                Public
              </Button>
              <Button
                size="sm"
                variant={filter === "private" ? "default" : "outline"}
                onClick={() => handleFilter("private")}
              >
                Private
              </Button>
              <Button
                size="sm"
                variant={filter === "unlisted" ? "default" : "outline"}
                onClick={() => handleFilter("unlisted")}
              >
                Unlisted
              </Button>
            </div>
          </div>
          {filteredPastes.length > 0 ? (
            <div className="space-y-4">
              {filteredPastes.map((paste) => (
                <div className="flex flex-col space-y-2" key={paste.uniqueid}>
                  <div className="p-4 border border-border hover:border-primary/50 bg-background rounded-md shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a href={`/link/${paste.uniqueid}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                              {paste.title}
                            </h3>
                          </a>
                          <Button variant="outline" size="xs">
                            {paste.visibility === "public"
                              ? "Public"
                              : paste.visibility === "private"
                                ? "Private"
                                : "Unlisted"}
                          </Button>
                          <span className="bg-primary/10 text-xs text-primary px-2 py-1 rounded">
                            {paste.language.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Button size="xs" variant="outline">
                            {"Created " + getRelativeTime(paste.createdAt)}
                          </Button>
                          {paste.expiresAt && (
                            <Button
                              size="xs"
                              variant="outline"
                              className="border-destructive/50 text-destructive"
                            >
                              Expires {formatDate(paste.expiresAt)}
                            </Button>
                          )}
                          <div className="flex items-center gap-4">
                            <Button
                              size="xs"
                              variant="outline"
                              className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow"
                            >
                              <Eye className="w-3 h-3" />
                              {paste.viewCount}
                            </Button>
                            {paste.downloadCount !== undefined && (
                              <Button
                                size="xs"
                                variant="outline"
                                className="gap-1.5 flex border rounded-sm items-center p-1 text-xs shadow"
                              >
                                <Download className="w-3 h-3" />
                                {paste.downloadCount}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button asChild size="icon-sm">
                          <a href={`/link/${paste.uniqueid}`}>
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => setConfirmDelete(paste.uniqueid)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {confirmDelete === paste.uniqueid && (
                    <div className="p-4 border border-destructive/50 space-y-3 rounded-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            Delete this paste?
                          </p>
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
                          onClick={() => setConfirmDelete(null)}
                        >
                          <X />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={isPending}
                          variant="destructive"
                          onClick={() => handleDelete(paste.uniqueid)}
                        >
                          <Check />
                          Delete Permanently
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 border border-border text-center bg-background rounded-md shadow">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No pastes found</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
