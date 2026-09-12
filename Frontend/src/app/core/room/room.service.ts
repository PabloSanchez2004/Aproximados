import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { generateRoomCode } from './room-code';

const NICKNAME_STORAGE_KEY = 'aproximados.nickname';

export type EntryMode = 'crear' | 'unir';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private readonly router = inject(Router);
  private readonly nickname = signal(this.readStoredNickname());

  currentNickname(): string {
    return this.nickname();
  }

  hasNickname(): boolean {
    return this.nickname().length > 0;
  }

  setNickname(name: string): void {
    const clean = name.trim();
    this.nickname.set(clean);
    try {
      sessionStorage.setItem(NICKNAME_STORAGE_KEY, clean);
    } catch {
      // Safari privado a veces revienta. El signal sigue vivo en esta sesión.
    }
  }

  createRoom(): string {
    return generateRoomCode();
  }

  goToNameEntry(mode: EntryMode, code?: string): Promise<boolean> {
    return this.router.navigate(['/nombre'], {
      queryParams: {
        modo: mode,
        ...(code ? { codigo: code } : {}),
      },
    });
  }

  goToRoom(code: string, asHost = false): Promise<boolean> {
    return this.router.navigate(['/sala', code], {
      queryParams: asHost ? { host: 1 } : undefined,
    });
  }

  goHome(): Promise<boolean> {
    return this.router.navigate(['/']);
  }

  private readStoredNickname(): string {
    try {
      return sessionStorage.getItem(NICKNAME_STORAGE_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }
}
