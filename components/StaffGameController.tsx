
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, Game } from '../types';
import { STAFF_PIN, MASTER_PIN, GAMES } from '../constants';

interface StaffGameControllerProps {
  teams: Team[];
  onAddResult: (gameId: string, teamAId: string, teamBId: string, winnerId: string | 'draw') => void;
  onBatchPoints: (gameId: string, pointAssignments: { teamId: string, points: number }[]) => void;
  generalEndTime: number;
  gameEndTime: number;
  onUpdateGeneralTimer: (newTime: number) => void;
  onUpdateGameTimer: (newTime: number) => void;
}

const StaffGameController: React.FC<StaffGameControllerProps> = ({
  teams, onAddResult, onBatchPoints, generalEndTime, gameEndTime, onUpdateGeneralTimer, onUpdateGameTimer
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Master Admin Flag
  const [pin, setPin] = useState('');
  const [selectedGameId, setSelectedGameId] = useState(GAMES[0].id);
  const [now, setNow] = useState(Date.now());

  // Update local 'now' every second to make the countdown run
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Estados para modo Versus (Normal)
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [winner, setWinner] = useState<string | 'draw' | null>(null);

  // Estados para modo Código Secreto (3 equipos)
  const [secretCodeTeams, setSecretCodeTeams] = useState<{ [key: string]: number }>({});

  const [feedback, setFeedback] = useState<string | null>(null);

  const isSecretCodeMode = selectedGameId === '1'; // '1' es el ID de Código Secreto en constants.ts

  useEffect(() => {
    if (!isSecretCodeMode) {
      if (winner !== 'draw' && winner !== teamAId && winner !== teamBId) {
        setWinner(null);
      }
    }
  }, [teamAId, teamBId, winner, isSecretCodeMode]);

  // Lógica de Auto-Save para Código Secreto
  useEffect(() => {
    if (isSecretCodeMode && Object.keys(secretCodeTeams).length === 3) {
      const distance = gameEndTime - now;
      if (distance > -1000 && distance <= 0) {
        setFeedback("AUTO-GUARDANDO PUNTOS... ⏳");
        handleSubmit();
      }
    }
  }, [gameEndTime, now, isSecretCodeMode, secretCodeTeams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setFeedback(null);
    } else if (pin === STAFF_PIN) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      setFeedback(null);
    } else {
      setFeedback("PIN Incorrecto");
      setPin('');
    }
  };

  const handleSecretCodeTeamToggle = (teamId: string) => {
    setSecretCodeTeams(prev => {
      const next = { ...prev };
      if (next[teamId] !== undefined) {
        delete next[teamId];
      } else if (Object.keys(next).length < 3) {
        next[teamId] = 0; // Puntos iniciales
      }
      return next;
    });
  };

  const handleSecretCodePointsChange = (teamId: string, points: number) => {
    setSecretCodeTeams(prev => ({
      ...prev,
      [teamId]: points
    }));
  };

  const handleSubmit = () => {
    if (isSecretCodeMode) {
      const teamIds = Object.keys(secretCodeTeams);
      if (teamIds.length !== 3) {
        setFeedback("Error: Selecciona exactamente 3 equipos");
        return;
      }
      const assignments = teamIds.map(id => ({ teamId: id, points: secretCodeTeams[id] }));
      onBatchPoints(selectedGameId, assignments);
      setSecretCodeTeams({});
      setFeedback("Puntos de Código Secreto asignados ✅");
    } else {
      if (!teamAId || !teamBId || teamAId === teamBId || !winner) {
        setFeedback("Error: Datos incompletos");
        return;
      }
      onAddResult(selectedGameId, teamAId, teamBId, winner!);
      setTeamAId('');
      setTeamBId('');
      setWinner(null);
      setFeedback("Resultado registrado correctamente ✅");
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-sm premium-card p-10 rounded-2xl bg-white border-4 border-black shadow-[12px_12px_0px_#DE0A0A]"
        >
          <h2 className="text-3xl font-black mb-8 text-center italic font-heading uppercase">STAFF ACCESS</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-5 rounded-xl border-4 border-black bg-white text-center text-4xl font-black focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-black text-white font-black py-5 rounded-xl text-xl uppercase tracking-widest shadow-[4px_4px_0px_#DE0A0A]"
            >
              ENTRAR
            </button>
            {feedback && <p className="text-red-600 text-center font-black uppercase text-xs mt-4">{feedback}</p>}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-12 pb-48">
      <div className="flex items-center justify-between mb-12 border-b-8 border-black pb-6">
        <div>
          <h2 className="text-6xl font-black italic font-heading tracking-tighter uppercase leading-none">PRO PANEL</h2>
          <p className="text-[10px] font-black text-[#DE0A0A] uppercase tracking-[0.5em] mt-2">REAL-TIME DATA STREAM • {isAdmin ? 'MASTER ADMIN' : 'JUDGE ACCESS'}</p>
        </div>
        <button
          onClick={() => { setIsAuthenticated(false); setIsAdmin(false); }}
          className="bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase shadow-[4px_4px_0px_#DE0A0A]"
        >
          LOGOUT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 space-y-6">
          {/* GENERAL EVENT TIMER - Only for Admin */}
          {isAdmin && (
            <div className="premium-card p-8 rounded-3xl bg-[#DE0A0A] text-white border-none shadow-[20px_20px_60px_rgba(222,10,10,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 blur-3xl" />

              <label className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block text-white/60">OFFICIAL EVENT CLOCK</label>
              <div className="text-5xl font-black mb-6 font-heading tabular-nums tracking-tighter">
                {new Date(Math.max(0, generalEndTime - now)).toISOString().substr(11, 8)}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onUpdateGeneralTimer(generalEndTime + 5 * 60 * 1000)}
                  className="bg-white text-black text-[10px] font-black py-4 rounded-xl uppercase transition-all border border-white hover:bg-transparent hover:text-white"
                >
                  +5 MIN
                </button>
                <button
                  onClick={() => onUpdateGeneralTimer(generalEndTime - 5 * 60 * 1000)}
                  className="bg-black/20 text-white text-[10px] font-black py-4 rounded-xl uppercase transition-all border border-white/20 hover:bg-white hover:text-black"
                >
                  -5 MIN
                </button>
              </div>
            </div>
          )}

          {/* GAME SPECIFIC TIMER */}
          <div className="premium-card p-8 rounded-3xl bg-black text-white border-none shadow-[20px_20px_60px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#DE0A0A] opacity-20 blur-3xl" />

            <label className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block text-[#DE0A0A]">GAME CLOCK</label>
            <div className="text-5xl font-black mb-6 font-heading tabular-nums tracking-tighter">
              {new Date(Math.max(0, gameEndTime - now)).toISOString().substr(11, 8)}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateGameTimer(Date.now() + 15 * 60 * 1000)}
                className="bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-black py-4 rounded-xl uppercase transition-all border border-white/10 hover:border-white"
              >
                +15 M
              </button>
              <button
                onClick={() => onUpdateGameTimer(Date.now() + 5 * 1000)} // PRUEBA: 5 segundos
                className="bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-black py-4 rounded-xl uppercase transition-all border border-yellow-400"
              >
                TEST 5S
              </button>
              <button
                onClick={() => onUpdateGameTimer(Date.now())}
                className="col-span-2 bg-[#DE0A0A]/20 hover:bg-[#DE0A0A] text-[#DE0A0A] hover:text-white text-[10px] font-black py-4 rounded-xl uppercase border-2 border-[#DE0A0A]/30 hover:border-[#DE0A0A] transition-all"
              >
                ABORT / RESET
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-widest mb-2 block">DISCIPLINA</label>
            <div className="space-y-3">
              {GAMES.map(game => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`w-full p-5 rounded-xl border-2 font-black text-left uppercase text-xs tracking-widest transition-all ${selectedGameId === game.id
                    ? 'bg-black text-white shadow-[6px_6px_0px_#DE0A0A]'
                    : 'bg-white border-black hover:bg-black/5'
                    }`}
                >
                  {game.name}
                  {game.id === '1' && <span className="ml-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-[8px]">SPECIAL</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-8 space-y-6">
          <div className="premium-card p-10 rounded-2xl border-4 border-black">
            {isSecretCodeMode ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-black uppercase tracking-tight">CÓDIGO SECRETO: MULTI-PUNTUACIÓN</h3>
                  <p className="text-[10px] font-bold text-black/40 uppercase mt-1">SELECCIONA 3 EQUIPOS Y ASIGNA SUS PUNTOS</p>

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => onUpdateGameTimer(Date.now() + 5 * 1000)} // PRUEBA: 5 segundos
                      className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-black text-xs uppercase shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      ⚡ INICIAR PRUEBA (5 SEGUNDOS)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border-2 border-black/5 rounded-xl">
                  {teams.map(t => {
                    const isSelected = secretCodeTeams[t.id] !== undefined;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSecretCodeTeamToggle(t.id)}
                        disabled={!isSelected && Object.keys(secretCodeTeams).length >= 3}
                        className={`p-3 rounded-lg border-2 font-black text-[10px] uppercase transition-all ${isSelected ? 'bg-black text-white border-black' : 'bg-white border-black/10 text-black/40 hover:border-black/30 disabled:opacity-20'
                          }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {Object.keys(secretCodeTeams).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-6 border-t-4 border-black"
                    >
                      {Object.keys(secretCodeTeams).map(teamId => (
                        <div key={teamId} className="flex items-center justify-between gap-4 bg-black/5 p-4 rounded-xl border-2 border-black/10">
                          <span className="font-black text-sm uppercase">{teams.find(t => t.id === teamId)?.name}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleSecretCodePointsChange(teamId, Math.max(0, secretCodeTeams[teamId] - 1))}
                              className="w-10 h-10 bg-white border-2 border-black font-black text-xl rounded-lg"
                            >-</button>
                            <input
                              type="number"
                              value={secretCodeTeams[teamId]}
                              onChange={(e) => handleSecretCodePointsChange(teamId, parseInt(e.target.value) || 0)}
                              className="w-16 text-center bg-white border-2 border-black font-black text-xl p-1 rounded-lg focus:outline-none"
                            />
                            <button
                              onClick={() => handleSecretCodePointsChange(teamId, secretCodeTeams[teamId] + 1)}
                              className="w-10 h-10 bg-white border-2 border-black font-black text-xl rounded-lg"
                            >+</button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50">EQUIPO ALPHA</label>
                    <select
                      value={teamAId}
                      onChange={(e) => setTeamAId(e.target.value)}
                      className="w-full p-5 rounded-xl border-4 border-black bg-white font-black text-lg focus:outline-none appearance-none"
                    >
                      <option value="">SELECCIONAR</option>
                      {teams.map(t => <option key={t.id} value={t.id} disabled={t.id === teamBId}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/50">EQUIPO BRAVO</label>
                    <select
                      value={teamBId}
                      onChange={(e) => setTeamBId(e.target.value)}
                      className="w-full p-5 rounded-xl border-4 border-black bg-white font-black text-lg focus:outline-none appearance-none"
                    >
                      <option value="">SELECCIONAR</option>
                      {teams.map(t => <option key={t.id} value={t.id} disabled={t.id === teamAId}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <AnimatePresence>
                  {teamAId && teamBId && teamAId !== teamBId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 pt-8 border-t-4 border-black/10"
                    >
                      <label className="text-[10px] font-black uppercase tracking-widest block text-center mb-6">DECLARAR RESULTADO</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => setWinner(teamAId)}
                          className={`p-6 rounded-xl border-4 font-black transition-all ${winner === teamAId ? 'bg-black text-white' : 'bg-white border-black hover:bg-black/5'
                            }`}
                        >
                          GANÓ ALPHA
                        </button>
                        <button
                          onClick={() => setWinner('draw')}
                          className={`p-6 rounded-xl border-4 font-black transition-all ${winner === 'draw' ? 'bg-[#DE0A0A] text-white border-[#DE0A0A]' : 'bg-white border-black hover:bg-black/5'
                            }`}
                        >
                          EMPATE
                        </button>
                        <button
                          onClick={() => setWinner(teamBId)}
                          className={`p-6 rounded-xl border-4 font-black transition-all ${winner === teamBId ? 'bg-black text-white' : 'bg-white border-black hover:bg-black/5'
                            }`}
                        >
                          GANÓ BRAVO
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSecretCodeMode ? Object.keys(secretCodeTeams).length !== 3 : (!teamAId || !teamBId || !winner)}
            className={`w-full p-8 rounded-2xl font-black text-3xl italic font-heading tracking-tighter uppercase transition-all shadow-[10px_10px_0px_#000] ${(isSecretCodeMode ? Object.keys(secretCodeTeams).length === 3 : (teamAId && teamBId && winner))
              ? 'bg-[#DE0A0A] text-white hover:bg-red-700'
              : 'bg-black/10 text-black/20 cursor-not-allowed grayscale'
              }`}
          >
            CONFIRMAR {isSecretCodeMode ? 'PUNTOS' : 'RESULTADO'}
          </button>

          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 border-4 border-black rounded-xl text-center font-black uppercase tracking-widest text-xs ${feedback.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {feedback}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StaffGameController;
