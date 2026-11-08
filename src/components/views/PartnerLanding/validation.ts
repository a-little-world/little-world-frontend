const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type PartnerEmailError = 'empty' | 'invalid' | 'domain';

export const validatePartnerEmail = (
  email: string,
  domain: string | null,
): PartnerEmailError | null => {
  const trimmed = email.trim();
  if (!trimmed) return 'empty';
  if (!EMAIL_RE.test(trimmed)) return 'invalid';
  if (domain && trimmed.split('@')[1]?.toLowerCase() !== domain.toLowerCase()) {
    return 'domain';
  }
  return null;
};
