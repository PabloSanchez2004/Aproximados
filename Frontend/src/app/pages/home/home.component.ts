import { Component, computed, inject, signal } from '@angular/core';
import { ROOM_CODE_LENGTH } from '@core/room/room.constants';
import { isValidRoomCode, sanitizeRoomCode } from '@core/room/room-code';
import { RoomService } from '@core/room/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly rooms = inject(RoomService);

  readonly codeLength = ROOM_CODE_LENGTH;
  readonly roomCode = signal('');
  readonly canJoin = computed(() => isValidRoomCode(this.roomCode()));
  readonly error = signal('');
  readonly creating = signal(false);

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = sanitizeRoomCode(input.value);
    input.value = clean;
    this.roomCode.set(clean);
    this.error.set('');
  }

  createRoom(): void {
    if (this.creating()) return;
    this.creating.set(true);
    void this.rooms.goToNameEntry('crear');
  }

  joinRoom(): void {
    if (!this.canJoin()) {
      this.error.set(`Son ${ROOM_CODE_LENGTH} letras, campeón. Ni una más ni una menos.`);
      return;
    }
    void this.rooms.goToNameEntry('unir', this.roomCode());
  }
}
