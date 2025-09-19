export const generateCnUtil = (): string => `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
  
export function getUptime(startTime: Date) {
  return Date.now() - startTime.getTime();
}


export function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [
    days ? String(days) + 'd' : '',
    hours ? String(hours) + 'h' : '',
    minutes ? String(minutes) + 'm' : '',
    String(seconds) + 's',
  ].filter(Boolean);
  return parts.join(' ').trim();
}
`;
