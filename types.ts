
export interface Team {
  id: string;
  name: string;
  points: number;
}

export interface Game {
  id: string;
  name: string;
  description?: string;
}

export interface MatchResult {
  id: string;
  gameId: string;
  teamAId: string;
  teamBId: string;
  winnerId: string | 'draw'; // ID of team or 'draw'
  pointsAwarded: number;
  timestamp: number;
}

export interface AppState {
  teams: Team[];
  matches: MatchResult[];
  currentGameId: string;
}
