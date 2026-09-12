export type PlayerVibe = 'ready' | 'waiting';

export interface Player {
  id: string;
  name: string;
  vibe: PlayerVibe;
  /** Texto corto bajo el nombre. Listo, buscando amigos, esperando a alguien… */
  status: string;
  isYou?: boolean;
  isHost?: boolean;
}
