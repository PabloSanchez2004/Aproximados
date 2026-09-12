import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { LOBBY_SLOT_COUNT } from '@core/room/room.constants';
import { sanitizeRoomCode } from '@core/room/room-code';
import { Player } from '@core/room/player.model';
import { RoomService } from '@core/room/room.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss',
})
export class LobbyComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly rooms = inject(RoomService);

  readonly code = toSignal(
    this.route.paramMap.pipe(map((params) => sanitizeRoomCode(params.get('code') ?? ''))),
    { initialValue: '' },
  );

  readonly isHost = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('host') === '1')),
    { initialValue: false },
  );

  readonly copied = signal(false);
  readonly starting = signal(false);

  /** Mock de previa hasta que el backend mande la lista real. */
  readonly players = computed(() => this.mockPlayers(this.isHost()));

  readonly connectedCount = computed(() => this.players().length);

  readonly connectedLabel = computed(() => {
    const n = this.connectedCount();
    return n === 1 ? '1 jugador conectado' : `${n} jugadores conectados`;
  });

  readonly slots = computed<(Player | null)[]>(() => {
    const filled = this.players();
    return Array.from({ length: LOBBY_SLOT_COUNT }, (_, i) => filled[i] ?? null);
  });

  async copyCode(): Promise<void> {
    const value = this.code();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Sin clipboard API no pasa nada: el código ya está en pantalla a tamaño cartel.
    }

    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1800);
  }

  startGame(): void {
    if (!this.isHost() || this.starting()) return;
    this.starting.set(true);
    // TODO: navegar a /sala/:code/juego cuando exista la partida.
  }

  leave(): void {
    void this.rooms.goHome();
  }

  private mockPlayers(asHost: boolean): Player[] {
    const youName = this.rooms.currentNickname() || 'Tú';
    const you: Player = asHost
      ? { id: '1', name: youName, vibe: 'ready', status: 'Listo', isYou: true, isHost: true }
      : { id: '1', name: youName, vibe: 'ready', status: 'Listo', isYou: true };

    const rest: Player[] = asHost
      ? [
          { id: '2', name: 'Pablo', vibe: 'ready', status: 'Listo' },
          { id: '3', name: 'Javi', vibe: 'waiting', status: 'Buscando amigos' },
          { id: '4', name: 'Sofi', vibe: 'waiting', status: 'Esperando a María' },
        ]
      : [
          { id: '2', name: 'Kira', vibe: 'ready', status: 'Listo', isHost: true },
          { id: '3', name: 'Javi', vibe: 'waiting', status: 'Buscando amigos' },
          { id: '4', name: 'Sofi', vibe: 'waiting', status: 'Esperando a María' },
        ];

    return asHost ? [you, ...rest] : [rest[0], you, ...rest.slice(1)];
  }
}
