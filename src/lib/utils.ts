import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function simpleId(): string {
  return Math.round(Math.random() * 100 * Math.random() * 100 * Math.random() * 100).toString()
}
