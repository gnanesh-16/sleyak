import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// crypto.randomUUID() is generally preferred and available in modern environments.
// If a fallback or different ID strategy is needed, it can be added here.
// export function generateId() {
//   return Math.random().toString(36).substring(2, 15);
// }
