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

export const downloadFile = (data: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([data], { type: mimeType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
