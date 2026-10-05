/** Live input: keep hyphens (including trailing) while typing "memorize-notes" */
export const normalizeSlugInput = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '');

/** Final URL-safe slug: "Basic Chords" / "memorize-notes-" → "basic-chords" / "memorize-notes" */
export const slugify = (value: string): string =>
  normalizeSlugInput(value).replace(/-+$/g, '');

/** Prefer human slug; fall back to Firestore id */
export const getPracticePath = (practice: { id?: string; slug?: string }): string => {
  const key = practice.slug?.trim() || practice.id;
  if (!key) return '/practices';
  return `/practice/${key}`;
};
