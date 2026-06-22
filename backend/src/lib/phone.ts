// Normalize a phone number for storage and matching: keep digits only and take
// the last 10 (India). Ensures a parent's typed number matches the stored
// student.parentPhone regardless of spaces, +91, leading 0, etc.
export function normalizePhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function isValidPhone(raw: string): boolean {
  return normalizePhone(raw).length === 10;
}
