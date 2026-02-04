
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import HeroRanking from './components/HeroRanking';
import StaffGameController from './components/StaffGameController';
import { Team, MatchResult } from './types';
import { INITIAL_TEAMS, POINTS_CONFIG, DEFAULT_GENERAL_END_TIME, DEFAULT_GAME_END_TIME } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'staff'>('public');
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('sj_games_teams');
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch (e) {
      return INITIAL_TEAMS;
    }
  });
  const [matches, setMatches] = useState<MatchResult[]>(() => {
    try {
      const saved = localStorage.getItem('sj_games_matches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [generalEndTime, setGeneralEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sj_games_general_timer');
      return saved ? parseInt(saved) : DEFAULT_GENERAL_END_TIME;
    } catch (e) {
      return DEFAULT_GENERAL_END_TIME;
    }
  });

  const [gameEndTime, setGameEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sj_games_game_timer');
      return saved ? parseInt(saved) : DEFAULT_GAME_END_TIME;
    } catch (e) {
      return DEFAULT_GAME_END_TIME;
    }
  });

  useEffect(() => {
    localStorage.setItem('sj_games_teams', JSON.stringify(teams));
    localStorage.setItem('sj_games_matches', JSON.stringify(matches));
    localStorage.setItem('sj_games_general_timer', generalEndTime.toString());
    localStorage.setItem('sj_games_game_timer', gameEndTime.toString());
  }, [teams, matches, generalEndTime, gameEndTime]);

  const handleAddResult = useCallback((gameId: string, teamAId: string, teamBId: string, winnerId: string | 'draw') => {
    const actualPointsAwarded = winnerId === 'draw' ? POINTS_CONFIG.DRAW : POINTS_CONFIG.WIN;

    const newMatch: MatchResult = {
      id: Math.random().toString(36).substr(2, 9),
      gameId,
      teamAId,
      teamBId,
      winnerId,
      pointsAwarded: actualPointsAwarded,
      timestamp: Date.now()
    };

    setMatches(prev => [...prev, newMatch]);
    setTeams(prevTeams => {
      return prevTeams.map(team => {
        if (winnerId === 'draw') {
          if (team.id === teamAId || team.id === teamBId) {
            return { ...team, points: team.points + POINTS_CONFIG.DRAW };
          }
        } else {
          if (team.id === winnerId) {
            return { ...team, points: team.points + POINTS_CONFIG.WIN };
          }
        }
        return team;
      });
    });
  }, []);

  // Nueva función para manejar puntos de múltiples equipos (como en Código Secreto)
  const handleBatchPoints = useCallback((gameId: string, pointAssignments: { teamId: string, points: number }[]) => {
    const timestamp = Date.now();

    // Registramos cada asignación como un "match" individual para el historial
    const newMatches: MatchResult[] = pointAssignments.map(pa => ({
      id: Math.random().toString(36).substr(2, 9),
      gameId,
      teamAId: pa.teamId,
      teamBId: 'none',
      winnerId: pa.teamId,
      pointsAwarded: pa.points,
      timestamp
    }));

    setMatches(prev => [...prev, ...newMatches]);
    setTeams(prevTeams => {
      const teamPointsMap = new Map(pointAssignments.map(pa => [pa.teamId, pa.points]));
      return prevTeams.map(team => {
        const extraPoints = teamPointsMap.get(team.id);
        if (extraPoints !== undefined) {
          return { ...team, points: team.points + extraPoints };
        }
        return team;
      });
    });
  }, []);

  return (
    <div className="min-h-screen relative bg-white">
      <main className="pb-32">
        {view === 'public' ? (
          <HeroRanking teams={teams} endTime={generalEndTime} />
        ) : (
          <StaffGameController
            teams={teams}
            onAddResult={handleAddResult}
            onBatchPoints={handleBatchPoints}
            generalEndTime={generalEndTime}
            gameEndTime={gameEndTime}
            onUpdateGeneralTimer={setGeneralEndTime}
            onUpdateGameTimer={setGameEndTime}
          />
        )}
      </main>

      <nav className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-[95%] sm:w-auto min-w-[300px] sm:min-w-[400px] bg-black/90 backdrop-blur-xl border border-white/10 p-2 flex gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] rounded-[2rem]">
        <button
          onClick={() => setView('public')}
          className={`relative flex-1 py-3 sm:py-4 rounded-[1.5rem] flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${view === 'public' ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' : 'text-white/40 font-bold hover:text-white hover:bg-white/5'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest hidden xs:block">RANKING</span>
          {view === 'public' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-1 w-8 h-1 bg-black rounded-full" />
          )}
        </button>

        <button
          onClick={() => setView('staff')}
          className={`relative flex-1 py-3 sm:py-4 rounded-[1.5rem] flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${view === 'staff' ? 'bg-[#DE0A0A] text-white shadow-[0_10px_20px_rgba(222,10,10,0.2)]' : 'text-white/40 font-bold hover:text-white hover:bg-white/5'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest hidden xs:block">PRO PANEL</span>
          {view === 'staff' && (
            <motion.div layoutId="nav-indicator" className="absolute -bottom-1 w-8 h-1 bg-white rounded-full" />
          )}
        </button>
      </nav>

      <div className="fixed top-1/2 -left-12 -rotate-90 text-[10px] font-black tracking-[1em] text-black/10 uppercase hidden xl:block">PERFORMANCE DATA STREAM</div>
      <div className="fixed top-1/2 -right-12 rotate-90 text-[10px] font-black tracking-[1em] text-black/10 uppercase hidden xl:block">SJ GAMES OFFICIAL TRACKING</div>
    </div>
  );
};

export default App;
