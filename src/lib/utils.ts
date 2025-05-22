import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOTP(length = 6): string {
  const digits = '0123456789'
  let otp = ''
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)]
  }
  
  return otp
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatCommentDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatAuthorName(firstName: string | null, lastName: string | null) {
  if (!firstName && !lastName) return "کابر مقالیتو"
  return `${firstName || ""} ${lastName || ""}`.trim()
}

export function formatContent(content: string): string {
  return content
    .split('\n')
    .map(paragraph => {
      if (paragraph.trim() === '') {
        return '<br />';
      }
      return `<p>${paragraph}</p>`;
    })
    .join('');
}

export { slugify }