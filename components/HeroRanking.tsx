
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../types';
import { SJLogo } from './SJLogo';

interface HeroRankingProps {
  teams: Team[];
  endTime: number;
}

const HeroRanking: React.FC<HeroRankingProps> = ({ teams, endTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);
      const distance = endTime - currentTime;

      if (distance < 0) {
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const sortedTeams = useMemo(() => [...teams].sort((a, b) => b.points - a.points), [teams]);
  const leader = sortedTeams[0];
  const podium = sortedTeams.slice(0, 3);
  const remaining = sortedTeams.slice(3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-32 relative">
      {/* 
          ACADEMIC ARENA BACKGROUND
          Themed with floating school elements (books, pencils, math)
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fafafa]">
        {/* Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
        />

        {/* Dynamic Blobs (Scholastic Colors) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: ['-2%', '2%', '-2%'] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#DE0A0A]/5 via-transparent to-black/5 blur-[120px]"
        />

        {/* Animated Academic Icons (SVG) */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`academic-icon-${i}`}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              rotate: Math.random() * 360,
              opacity: 0
            }}
            animate={{
              y: [null, -150],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              opacity: [0, 0.15, 0]
            }}
            transition={{
              duration: 25 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-black/20"
          >
            {/* SVG Academic Icons */}
            {i % 4 === 0 ? (
              <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg> // Graduation Cap
            ) : i % 4 === 1 ? (
              <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14a2 2 0 002 2h14v-2H4V6zm16-4H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z" /></svg> // Books
            ) : i % 4 === 2 ? (
              <svg width="35" height="35" fill="currentColor" viewBox="0 0 24 24"><path d="M13.12 2.06L7.58 7.6l10.82 10.82 5.54-5.54L13.12 2.06zM2.84 21.16l1.41-1.41 10.82-10.82-1.41-1.41L2.84 18.33l-1.41 1.41 1.41 1.42z" /></svg> // Pencil/Ruler
            ) : (
              <svg width="25" height="25" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg> // Logic/Math
            )}
          </motion.div>
        ))}
      </div>

      <header className="relative z-10 flex flex-col items-center justify-center mb-10 sm:mb-20 px-4">
        <SJLogo className="scale-100 drop-shadow-xl" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 px-5 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-full border-2 border-black inline-flex items-center gap-3 sm:gap-4 shadow-[6px_6px_0px_rgba(222,10,10,0.2)] sm:shadow-[8px_8px_0px_rgba(222,10,10,0.2)] whitespace-nowrap"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 sm:w-3 h-3 bg-red-600 rounded-full animate-ping absolute inset-0" />
            <span className="w-2.5 h-2.5 sm:w-3 h-3 bg-red-600 rounded-full relative block" />
          </div>
          <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] sm:tracking-[0.5em]">ARENA DE DOCENTES • VIVO</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
        {/* Countdown - Premium Dashboard Design (Always first in order) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-6 sm:p-12 rounded-[2.5rem] bg-black text-white border-none shadow-[20px_20px_60px_rgba(0,0,0,0.15)] relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DE0A0A] opacity-30 blur-[60px] -mr-16 -mt-16 group-hover:opacity-50 transition-opacity" />

            <div className="relative z-10 w-full text-center lg:text-left">
              <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.5em] text-[#DE0A0A] mb-4 block">LIVE STATUS: COUNTDOWN</span>
              <div className="flex flex-col items-center lg:items-start font-heading tabular-nums tracking-tighter mb-6 gap-2">
                {timeLeft.split(':')[0] !== '00' && (
                  <motion.span
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-2xl sm:text-3xl md:text-4xl text-white/40 font-black"
                  >
                    {timeLeft.split(':')[0]}<span className="text-[0.5em] ml-1">HORAS</span>
                  </motion.span>
                )}
                <span className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[6rem] font-black leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {timeLeft.split(':').slice(1).join(':')}
                </span>
              </div>

              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 p-1 mb-10">
                <motion.div
                  animate={{
                    width: ['0%', '100%'],
                    backgroundColor: ['#DE0A0A', '#ff4d4d', '#DE0A0A']
                  }}
                  transition={{ duration: 60, repeat: Infinity }}
                  className="h-full rounded-full shadow-[0_0_15px_#DE0A0A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/10">
                <div className="hover:translate-x-1 transition-transform cursor-default">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-wider">EVENTO</p>
                  <p className="text-xs font-bold uppercase mt-1">GAMES ELITE</p>
                </div>
                <div className="hover:translate-x-1 transition-transform cursor-default">
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-wider">LOCATION</p>
                  <p className="text-xs font-bold uppercase mt-1">MAIN ARENA</p>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-12 h-12 rounded-2xl bg-[#DE0A0A] flex items-center justify-center text-white ring-8 ring-[#DE0A0A]/10 group-hover/item:ring-[#DE0A0A]/20 transition-all rotate-3 group-hover/item:rotate-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase leading-tight tracking-[0.2em] text-white">
                      LIVE SCORING ENGINE<br />
                      <span className="text-white/40">INSTANT DATA SYNC</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-10 rounded-[2.5rem] bg-white border-2 border-black/5 shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col items-center gap-6 group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.02] pointer-events-none" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-2xl relative z-10"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>

            <div className="text-center relative z-10">
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-black mb-2">VALIDACIÓN OFICIAL</h4>
              <p className="text-[11px] font-bold uppercase leading-relaxed tracking-widest text-black/40">
                CIERRE OFICIAL DE COMPETENCIA. <br />
                LOS RESULTADOS SON VALIDADOS POR EL <span className="text-[#DE0A0A] font-black">COMITÉ SJ</span>.
              </p>
            </div>

            {/* Technical Border Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/5" />
          </motion.div>
        </div>

        {/* Podium and Ranking List */}
        <div className="lg:col-span-7 space-y-8">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {podium.map((team, index) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1
                  }}
                  className={`relative p-6 sm:p-10 rounded-[2.5rem] border-4 border-black overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 group transition-all duration-500 hover:-translate-y-2 ${index === 0
                    ? 'bg-black text-white shadow-[20px_20px_40px_rgba(222,10,10,0.15)] ring-4 ring-[#DE0A0A] ring-offset-8 ring-offset-white'
                    : 'bg-white text-black shadow-[12px_12px_0px_#000]'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 relative z-10 text-center sm:text-left">
                    <div className="relative">
                      <span className={`text-5xl sm:text-8xl font-heading font-black italic tracking-tighter leading-none ${index === 0 ? 'text-[#DE0A0A] drop-shadow-[0_0_15px_rgba(222,10,10,0.5)]' : 'text-black/10 group-hover:text-black/20 transition-colors'
                        }`}>
                        0{index + 1}
                      </span>
                      {index === 0 && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border-2 sm:border-4 border-black"
                        >
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-1 sm:mb-2 ${index === 0 ? 'text-white/40' : 'text-black/30'}`}>TEAM IDENTITY</p>
                      <h3 className="text-2xl sm:text-5xl font-black italic font-heading tracking-tighter uppercase leading-tight group-hover:tracking-normal transition-all duration-500 origin-center sm:origin-left">{team.name}</h3>
                      {index === 0 && (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-block mt-2 sm:mt-3 bg-[#DE0A0A] text-white px-3 sm:px-4 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full shadow-[0_0_15px_rgba(222,10,10,0.5)]"
                        >
                          DOMINATING RANKING
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <div className="text-center sm:text-right relative z-10">
                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-1 sm:mb-2 ${index === 0 ? 'text-white/40' : 'text-black/30'}`}>SCORE</p>
                    <span className={`text-5xl sm:text-8xl font-heading font-black italic tabular-nums transition-colors ${index === 0 ? 'text-white group-hover:text-[#DE0A0A]' : 'text-black group-hover:text-[#DE0A0A]'
                      }`}>
                      {team.points}
                    </span>
                  </div>

                  {index === 0 && (
                    <>
                      <div className="absolute top-0 right-0 w-80 h-80 bg-[#DE0A0A]/20 blur-[100px] -mr-40 -mt-40 animate-pulse" />
                      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 blur-[100px] -ml-40 -mb-40" />
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Scrolling List for Remaining Teams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {remaining.map((team, index) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 3) * 0.05 }}
                  className="bg-white border-2 border-black p-5 sm:p-6 rounded-[1.8rem] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#DE0A0A] hover:-translate-y-2 transition-all group cursor-pointer text-center sm:text-left"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5">
                    <span className="text-xl sm:text-2xl font-black italic font-heading text-black/10 group-hover:text-black transition-colors w-auto sm:w-10">
                      {(index + 4).toString().padStart(2, '0')}
                    </span>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-tight group-hover:tracking-widest transition-all">{team.name}</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black italic font-heading group-hover:text-[#DE0A0A] transition-colors tabular-nums">
                    {team.points} <span className="text-[10px] font-bold text-black/20 group-hover:text-[#DE0A0A]/40 transition-colors">PTS</span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroRanking;
