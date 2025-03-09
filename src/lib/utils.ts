import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InputNodeType, WeightNodeType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function simpleId(): string {
  return Math.round(Math.random() * 100 * Math.random() * 100 * Math.random() * 100).toString()
}

export function isInputNode(
  node: any,
): node is InputNodeType | WeightNodeType {
  return !node || !node.type
    ? false
    : node.type === 'nnInput' || node.type === 'weight';
}
