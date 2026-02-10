import { Button } from "../ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface ErrorProps {
  code?: number;
}

const Error = ({ code = 404 }: ErrorProps) => {
  return (
    <main className="min-h-screen bg-accent flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="p-12 border border-border text-center space-y-2 bg-card shadow rounded-md">
          <div>
            <div className="text-6xl font-bold text-primary mb-2">{code}</div>
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The paste you're looking for doesn't exist or may have been
              deleted.
            </p>
          </div>
          <div className="space-y-3 pt-4">
            <a href="/" className="block">
              <Button className="w-full gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </a>
            <a href="/new" className="block">
              <Button variant="outline" className="w-full bg-transparent gap-2">
                <ArrowLeft className="w-4 h-4" />
                Create New Paste
              </Button>
            </a>
          </div>
          <div className="border-t pt-4 border-border text-xs text-muted-foreground space-y-1">
            <p>Did you paste the right URL?</p>
            <p className="text-sm break-all">
              {typeof window !== "undefined" ? window.location.href : "URL"}
            </p>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-2 border p-4 bg-card shadow rounded-md">
          <p className="font-semibold">
            Common reasons this page may not exist:
          </p>
          <ul className="space-y-1 max-w-xs">
            <li>• The paste ID in the URL is incorrect</li>
            <li>• The paste has expired or been deleted</li>
            <li>• The paste is private and you don't have access</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Error;
