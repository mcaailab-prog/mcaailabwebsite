export const NEWSLETTER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNewsletterEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidNewsletterEmail(value: string): boolean {
  const normalized = normalizeNewsletterEmail(value);
  return normalized.length > 0 && NEWSLETTER_EMAIL_REGEX.test(normalized);
}
