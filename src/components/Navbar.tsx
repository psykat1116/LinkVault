import { LogIn, User, Vault } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const data = localStorage.getItem("userData");
  const token = localStorage.getItem("userToken");

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    navigate("/auth/signin");
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <p className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            <Vault />
          </p>
          <p className="font-semibold text-lg">Linkvault</p>
        </a>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {data && token && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <User size={16} />
              {JSON.parse(data).email}
            </Button>
          )}
          {data && token ? (
            <Button
              size="sm"
              variant="destructive"
              className="rounded-sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <a
              href="auth/signin"
              className="rounded hover:bg-accent flex items-center justify-center hover:text-accent-foreground transition duration-300"
            >
              <Button size="sm" className="rounded-sm">
                Sign In
                <LogIn />
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
