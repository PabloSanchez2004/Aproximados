import { Routes } from '@angular/router';
import { nicknameGuard } from '@core/room/nickname.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Aproximados',
  },
  {
    path: 'nombre',
    loadComponent: () =>
      import('./pages/name-entry/name-entry.component').then((m) => m.NameEntryComponent),
    title: 'Tu nombre · Aproximados',
  },
  {
    path: 'sala/:code',
    canActivate: [nicknameGuard],
    loadComponent: () => import('./pages/lobby/lobby.component').then((m) => m.LobbyComponent),
    title: 'Lobby · Aproximados',
  },
  { path: '**', redirectTo: '' },
];
