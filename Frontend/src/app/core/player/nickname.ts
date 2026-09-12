export const NICKNAME_MAX_LENGTH = 16;
export const NICKNAME_MIN_LENGTH = 2;

const NICKNAME_PLACEHOLDERS = ['Ej: Carlos', 'Ej: Mazdaplay', 'Ej: paaco'] as const;

export function randomNicknamePlaceholder(): string {
  const idx = Math.floor(Math.random() * NICKNAME_PLACEHOLDERS.length);
  return NICKNAME_PLACEHOLDERS[idx];
}

/** Recorta espacios raros y deja el apodo a un tamaño de cartel, no de DNI. */
export function sanitizeNickname(raw: string): string {
  return raw.replace(/\s+/g, ' ').replace(/^\s+/, '').slice(0, NICKNAME_MAX_LENGTH);
}

export function isValidNickname(name: string): boolean {
  return name.trim().length >= NICKNAME_MIN_LENGTH;
}
