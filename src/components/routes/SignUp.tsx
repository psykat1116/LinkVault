import axios from "axios";
import { toast } from "sonner";
import { EyeOff, Eye, Vault } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useTransition } from "react";

import { Button } from "../ui/button";
import { BackendURL, EmailRegex, PasswordRegex } from "../../../data";

const SignUp = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleSignUp = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EmailRegex.test(email)) {
      toast.error("Please Give an valid Email");
      setEmail("");
      return;
    }
    if (!PasswordRegex.test(password)) {
      setError(true);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password doesn't match");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    startTransition(async () => {
      try {
        const response = await axios.post(`${BackendURL}/api/auth/signup`, {
          email,
          username,
          password,
          confirmPassword,
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/auth/signin");
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Unknown Error Occurred";
        toast.error(message);
      } finally {
        setEmail("");
        setPassword("");
        setError(false);
        setConfirmPassword("");
      }
    });
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border p-8 space-y-6 bg-card text-card-foreground rounded-xl shadow flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            <Vault />
          </div>
          <span className="font-semibold text-lg">Linkvault</span>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start sharing pastes
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2 flex flex-col text-sm">
            <label htmlFor="name">Username</label>
            <input
              autoFocus
              id="name"
              type="text"
              value={username}
              placeholder="john_doe"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background p-2 border rounded-md outline-none"
            />
          </div>
          <div className="space-y-2 flex flex-col text-sm">
            <label htmlFor="email">Email</label>
            <input
              autoFocus
              id="email"
              type="email"
              value={email}
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background p-2 border rounded-md outline-none"
            />
          </div>
          <div className="space-y-2 flex flex-col text-sm">
            <label htmlFor="password">Password</label>
            <div className="relative flex items-center bg-background border rounded-md">
              <input
                id="password"
                value={password}
                className="p-2 outline-none"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (min 8 chars)"
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
            {error && (
              <ul className="flex flex-col gap-0.5 text-xs text-destructive">
                <li>• Password must be atleast 8 characters</li>
                <li>• Password must contain atleast one digit</li>
                <li>• Password must contain atleast one special character</li>
                <li>• Password must contain atleast one uppercase letter</li>
                <li>• Password must contain atleast one lowercase letter</li>
              </ul>
            )}
          </div>
          <div className="space-y-2 flex flex-col text-sm">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative bg-background border rounded-md">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
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
            className="w-full p-2 text-sm rounded"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <a
            href="/auth/signin"
            className="text-primary hover:underline font-semibold"
          >
            Sign in
          </a>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
