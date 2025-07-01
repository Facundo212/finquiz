/* eslint-disable import/prefer-default-export */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scoreToColor = (score: number) => {
  if (score >= 70) return 'green-600';
  if (score >= 30) return 'yellow-500';
  return 'red-600';
};
