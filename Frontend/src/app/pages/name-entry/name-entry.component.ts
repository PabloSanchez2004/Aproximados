import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import {
  isValidNickname,
  NICKNAME_MAX_LENGTH,
  randomNicknamePlaceholder,
  sanitizeNickname,
} from '@core/player/nickname';
import { isValidRoomCode, sanitizeRoomCode } from '@core/room/room-code';
import { EntryMode, RoomService } from '@core/room/room.service';

@Component({
  selector: 'app-name-entry',
  templateUrl: './name-entry.component.html',
  styleUrl: './name-entry.component.scss',
})
export class NameEntryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly rooms = inject(RoomService);

  readonly maxLength = NICKNAME_MAX_LENGTH;
  readonly placeholder = randomNicknamePlaceholder();

  readonly mode = toSignal(
    this.route.queryParamMap.pipe(
      map((params): EntryMode => (params.get('modo') === 'unir' ? 'unir' : 'crear')),
    ),
    { initialValue: 'crear' as EntryMode },
  );

  readonly joinCode = toSignal(
    this.route.queryParamMap.pipe(map((params) => sanitizeRoomCode(params.get('codigo') ?? ''))),
    { initialValue: '' },
  );

  readonly isHost = computed(() => this.mode() === 'crear');

  readonly title = computed(() =>
    this.isHost() ? '¿Quién manda aquí?' : 'Identifícate',
  );

  readonly subtitle = computed(() =>
    this.isHost()
      ? 'Ponle nombre a la leyenda que va a abrir la sala.'
      : `Vas a entrar a ${this.joinCode() || 'una sala'}. Que sepan cómo gritarte.`,
  );

  readonly cta = computed(() => (this.isHost() ? 'Vamos lío' : 'Entrar'));

  readonly nickname = signal(this.rooms.currentNickname());
  readonly submitting = signal(false);
  readonly error = signal('');

  readonly canSubmit = computed(() => isValidNickname(this.nickname()) && !this.submitting());

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const clean = sanitizeNickname(input.value);
    input.value = clean;
    this.nickname.set(clean);
    this.error.set('');
  }

  confirm(): void {
    const name = this.nickname().trim();
    if (!isValidNickname(name)) {
      this.error.set('Mínimo 2 letras. Un apodo, no un suspiro.');
      return;
    }

    if (!this.isHost() && !isValidRoomCode(this.joinCode())) {
      this.error.set('Ese código no pinta bien. Vuelve y mételo otra vez.');
      return;
    }

    this.submitting.set(true);
    this.rooms.setNickname(name);

    const code = this.isHost() ? this.rooms.createRoom() : this.joinCode();
    void this.rooms.goToRoom(code, this.isHost());
  }

  back(): void {
    void this.rooms.goHome();
  }
}
