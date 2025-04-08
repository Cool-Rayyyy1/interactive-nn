import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InputNodeType, WeightNodeType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
<<<<<<< HEAD
=======
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
>>>>>>> 3d7092e24b27123a05678628be7a94c3df70035c
}

export function range(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(+i.toFixed(2));
  }
  return result;
}

export function sigmoid(x: number): number {
  return (1 / (1 + Math.exp(-x)))
}


export function relu(x: number): number {
  return Math.max(0, x)
}

