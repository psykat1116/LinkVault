import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Vault } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useTransition } from "react";

import { Button } from "../ui/button";
import { BackendURL } from "../../../data";

const SignIn = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Fields Cannot Be Empty");
      return;
    }
    startTransition(async () => {
      try {
        const response = await axios.post(`${BackendURL}/api/auth/signin`, {
          email,
          password,
        });
        if (response.data.token) {
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          navigate("/new");
        } else {
          toast.error(`${response.status} - ${response.data.message}`);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || "SignIn Failed!");
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <nav className="w-full max-w-md border border-border bg-card text-card-foreground p-8 space-y-6 flex flex-col gap-4 rounded-xl shadow">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            <Vault />
          </div>
          <span className="font-semibold text-lg">Linkvault</span>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        <form onSubmit={(e) => handleSignIn(e)} className="space-y-4">
          <div className="space-y-2 flex flex-col text-sm">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              id="email"
              type="email"
              value={email}
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background p-2 border rounded-md text-sm outline-none"
            />
          </div>
          <div className="space-y-2 flex flex-col text-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <a
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot?
              </a>
            </div>
            <div className="relative bg-background rounded-md border flex items-center">
              <input
                id="password"
                value={password}
                placeholder="Enter password"
                className="p-2 outline-none"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
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
          <Button
            type="submit"
            disabled={isPending}
            className="w-full p-2 rounded-md cursor-pointer text-sm"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a
            href="/auth/signup"
            className="text-primary hover:underline font-semibold"
          >
            Sign up
          </a>
        </div>
      </nav>
    </main>
  );
};

export default SignIn;
