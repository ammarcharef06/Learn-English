const BLOCKED_TERMS = Object.freeze(['fuck', 'shit', 'bitch', 'bastard', 'asshole', 'كلب', 'حمار', 'حقير']);

export function containsBlockedLanguage(text) {
  const normalized = String(text || '')
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  const compact = normalized.replace(/\s+/g, '');
  return BLOCKED_TERMS.some((term) => normalized.split(/\s+/u).includes(term) || compact.includes(term));
}
