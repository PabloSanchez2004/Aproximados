import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoomService } from './room.service';

/** Sin apodo no hay lobby. Te mandamos a identificarte, borracho o no. */
export const nicknameGuard: CanActivateFn = (route) => {
  const rooms = inject(RoomService);
  if (rooms.hasNickname()) return true;

  const code = route.paramMap.get('code');
  const asHost = route.queryParamMap.get('host') === '1';

  return inject(Router).createUrlTree(['/nombre'], {
    queryParams: {
      modo: asHost ? 'crear' : 'unir',
      ...(code ? { codigo: code } : {}),
    },
  });
};
