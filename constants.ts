
import { Team, Game } from './types';

export const STAFF_PIN = "1234";
export const MASTER_PIN = "0000";

export const GAMES: Game[] = [
  { id: '1', name: 'Código Secreto' },
  { id: '2', name: 'Fútbol 5' },
  { id: '3', name: 'Voley Mixto' },
  { id: '4', name: 'Carrera 100m' },
  { id: '5', name: 'Tiro al Blanco' },
  { id: '6', name: 'Concurso de TikTok' }
];

export const INITIAL_TEAMS: Team[] = Array.from({ length: 15 }, (_, i) => ({
  id: `team-${i + 1}`,
  name: `Equipo ${String.fromCharCode(65 + i)}`,
  points: 0
}));

export const POINTS_CONFIG = {
  WIN: 3,
  DRAW: 1,
  LOSS: 0
};

// Default General end time (4 hours from now)
export const DEFAULT_GENERAL_END_TIME = Date.now() + (1000 * 60 * 60 * 4);

// Default Game end time (2 hours from now)
export const DEFAULT_GAME_END_TIME = Date.now() + (1000 * 60 * 60 * 2);
