import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date) => {
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
    return "Unknown Date";
  }
};

export const getRelativeTime = (date: string | Date) => {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const diffMs = d.getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;

    const absDiff = Math.abs(diffSec);

    if (absDiff < MINUTE) {
      return rtf.format(diffSec, "second");
    } else if (absDiff < HOUR) {
      return rtf.format(Math.round(diffSec / MINUTE), "minute");
    } else if (absDiff < DAY) {
      return rtf.format(Math.round(diffSec / HOUR), "hour");
    } else if (absDiff < MONTH) {
      return rtf.format(Math.round(diffSec / DAY), "day");
    } else if (absDiff < YEAR) {
      return rtf.format(Math.round(diffSec / MONTH), "month");
    } else {
      return rtf.format(Math.round(diffSec / YEAR), "year");
    }
  } catch (e) {
    return "Unknown Date";
  }
};
