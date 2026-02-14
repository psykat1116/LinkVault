import type { FeatureItemType, CTAItemType } from "./types";
import { FileText, Lock, Share2, Zap } from "lucide-react";

export const FeatureItems: FeatureItemType[] = [
  {
    icon: Zap,
    title: "Instant Sharing",
    description:
      "Create a paste and share the unique URL instantly with anyone.",
  },
  {
    icon: FileText,
    title: "Syntax Highlighting",
    description:
      "Support for 100+ programming languages with beautiful code formatting.",
  },
  {
    icon: Lock,
    title: "Privacy Control",
    description: "Choose between public and private pastes with full control.",
  },
  {
    icon: Share2,
    title: "Auto Expiration",
    description: 'Set expiration times or enable "burn after reading" mode.',
  },
];

export const CTAItems: CTAItemType[] = [
  {
    icon: Share2,
    href: "/new",
    active: false,
    title: "Quick Share",
    btitle: "Create Now",
    description:
      " Create a paste and instantly share via link. No sign up required.",
  },
  {
    icon: Lock,
    active: true,
    href: "/auth/signup",
    title: "Secure Access",
    btitle: "Sign Up Free",
    description:
      "Create an account for password-protected pastes and full control.",
  },
  {
    icon: Zap,
    active: false,
    href: "/auth/signin",
    title: "Advanced Features",
    btitle: "Sign In",
    description:
      "One-time view, file uploads, expiration timers, and view/download limits.",
  },
];

export const VisibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "unlisted", label: "Unlisted" },
];

export const SupportedLanguages = [
  { value: "text", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "bash", label: "Bash" },
];

export const ExpirationOptions = [
  { value: "-1", label: "Never" },
  { value: "10", label: "10 Minutes" },
  { value: "60", label: "1 Hour" },
  { value: "1440", label: "1 Day" },
  { value: "10080", label: "1 Week" },
  { value: "43200", label: "1 Month" },
  { value: "86400", label: "2 Month" },
  { value: "259200", label: "6 Month" },
  { value: "518400", label: "1 Year" },
];

export const ViewLimitOptions = [
  { value: "-1", label: "Unlimited" },
  { value: "1", label: "1 View" },
  { value: "10", label: "10 Views" },
  { value: "50", label: "50 Views" },
  { value: "100", label: "100 Views" },
  { value: "250", label: "250 Views" },
  { value: "750", label: "750 Views" },
  { value: "1000", label: "1000 Views" },
  { value: "5000", label: "5000 Views" },
];

export const DownloadLimitOptions = [
  { value: "-1", label: "Unlimited" },
  { value: "1", label: "1 Download" },
  { value: "10", label: "10 Downloads" },
  { value: "50", label: "50 Downloads" },
  { value: "100", label: "100 Downloads" },
  { value: "250", label: "250 Downloads" },
  { value: "750", label: "750 Downloads" },
  { value: "1000", label: "1000 Downloads" },
  { value: "5000", label: "5000 Downloads" },
];

export const MaxFileSize = 10 * 1024 * 1024;
export const BackendURL = "http://localhost:3000";
export const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;