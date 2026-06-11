import React, { useState, useEffect } from 'react';
import { GameScore, UserProfile } from '../types';
import { Trophy, Gamepad2, Award, Zap, Coins, Users, RefreshCw, Star, CheckCircle } from 'lucide-react';

interface GameSectionProps {
  leaderboard: GameScore[];
  setLeaderboard: React.Dispatch<React.SetStateAction<GameScore[]>>;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export default function GameSection({ leaderboard, setLeaderboard, currentUser, setCurrentUser }: GameSectionProps) {
  const [activeGame, setActiveGame] = useState<'tictactoe' | 'tapduel' | null>(null);
  
  // Tic Tac Toe State
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [tttWinner, setTttWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  
  // Tap Duel State
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'tap' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [triggerTime, setTriggerTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [opponentTime, setOpponentTime] = useState<number>(0);
  const [tapWinner, setTapWinner] = useState<'player' | 'opponent' | null>(null);
  const [statusMessage, setStatusMessage] = useState('Click start duel to play with Alice!');

  // Gamification Claims
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Tic-Tac-Toe AI Move
  useEffect(() => {
    if (activeGame === 'tictactoe' && !isXNext && !tttWinner && !isDraw) {
      const timer = setTimeout(() => {
        makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, activeGame, tttWinner, isDraw]);

  // Tap Duel countdown sequence
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    let delayTimer: NodeJS.Timeout;

    if (activeGame === 'tapduel' && gameState === 'countdown') {
      if (countdown > 0) {
        countdownTimer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        // Start random wait period before triggering button
        setStatusMessage('Wait for Green...');
        const randomWait = 1000 + Math.random() * 2500;
        delayTimer = setTimeout(() => {
          setGameState('tap');
          setTriggerTime(Date.now());
          setStatusMessage('TAP QUICK!');
        }, randomWait);
      }
    }

    return () => {
      clearTimeout(countdownTimer);
      clearTimeout(delayTimer);
    };
  }, [activeGame, gameState, countdown]);

  // Tic Tac Toe Rules
  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleTttClick = (index: number) => {
    if (board[index] || tttWinner || isDraw || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X'; // Player
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setTttWinner('Player');
      awardCoins(10);
      updateLeaderboard('Tic-Tac-Toe Arena', 10);
    } else if (newBoard.every(sq => sq !== null)) {
      setIsDraw(true);
    } else {
      setIsXNext(false);
    }
  };

  const makeAiMove = () => {
    // Collect empty indicies
    const emptySquares = board.reduce<(number)[]>((acc, val, idx) => {
      if (!val) acc.push(idx);
      return acc;
    }, []);

    if (emptySquares.length === 0) return;

    // Simple AI: Prefer center, then empty random
    let chosenSquare = emptySquares[0];
    if (emptySquares.includes(4)) {
      chosenSquare = 4;
    } else {
      chosenSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    const newBoard = [...board];
    newBoard[chosenSquare] = 'O'; // Smart Bot
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setTttWinner('Alice Vance (AI)');
    } else if (newBoard.every(sq => sq !== null)) {
      setIsDraw(true);
    } else {
      setIsXNext(true);
    }
  };

  const resetTtt = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setTttWinner(null);
    setIsDraw(false);
  };

  // Tap Duel Rules
  const startTapDuel = () => {
    setGameState('countdown');
    setCountdown(3);
    setReactionTime(null);
    setTapWinner(null);
    setStatusMessage('Ready... Set...');
  };

  const handlePlayerTap = () => {
    if (gameState !== 'tap') {
      setStatusMessage('Too early! Disqualified. Try again.');
      setGameState('idle');
      return;
    }

    const timeDiff = Date.now() - triggerTime;
    setReactionTime(timeDiff);

    // Opponent reaction speed simulation (190ms - 340ms)
    const opponentReaction = Math.floor(190 + Math.random() * 150);
    setOpponentTime(opponentReaction);

    if (timeDiff < opponentReaction) {
      setTapWinner('player');
      awardCoins(25);
      updateLeaderboard('Tap Duel', 300 - timeDiff); // Higher reaction score
      setStatusMessage(`Victory! You tapped in ${timeDiff}ms vs Alices ${opponentReaction}ms!`);
    } else {
      setTapWinner('opponent');
      setStatusMessage(`Defeat! Alice tapped in ${opponentReaction}ms. You took ${timeDiff}ms.`);
    }

    setGameState('finished');
  };

  const awardCoins = (amount: number) => {
    setCurrentUser(prevUser => {
      const added = {
        ...prevUser,
        score: prevUser.score + amount
      };
      // Persist score
      localStorage.setItem('friend_req_score', JSON.stringify(added.score));
      return added;
    });
  };

  const updateLeaderboard = (game: string, scoreVal: number) => {
    const newRecord: GameScore = {
      id: `l_custom_${Date.now()}`,
      gameName: game,
      playerName: currentUser.username,
      avatar: currentUser.avatar,
      score: scoreVal,
      rank: 2,
      date: 'Today'
    };

    setLeaderboard([newRecord, ...leaderboard]);
  };

  const claimDaily = () => {
    if (!dailyClaimed) {
      awardCoins(50);
      setDailyClaimed(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-y-auto pb-24 scrollbar-none" id="game-section">
      {/* Gamification Bar */}
      <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">Play & Connect</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest mt-0.5">Play locally with smart AI friends</p>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-450 px-3.5 py-1.5 rounded-full font-bold text-[10px] uppercase font-display tracking-wider">
          <Coins size={12} className="text-yellow-500 animate-pulse" />
          <span>{currentUser.score} Coins</span>
        </div>
      </div>

      {!activeGame ? (
        // Games Home Grid
        <div className="p-4 space-y-4">
          {/* Daily reward claim block */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-600 rounded-[24px] p-4.5 text-white shadow-md relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
            <div className="flex justify-between items-center relative z-10">
              <div>
                <span className="text-[8px] bg-white/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest font-display">Daily Reward</span>
                <h4 className="text-xs font-black mt-2 font-display uppercase tracking-wider">Claim 50 Coins Check-In</h4>
                <p className="text-[9px] opacity-80 mt-1 max-w-[190px] leading-relaxed font-sans">Use points to rank on the active leaderboards.</p>
              </div>

              <button
                onClick={claimDaily}
                disabled={dailyClaimed}
                className={`text-[9.5px] font-bold uppercase tracking-widest font-display px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active-press ${
                  dailyClaimed ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-slate-50'
                }`}
                id="btn-claim-daily"
              >
                {dailyClaimed ? <CheckCircle size={11} /> : <Award size={11} />}
                {dailyClaimed ? 'Claimed' : 'Check In'}
              </button>
            </div>
          </div>

          {/* Gamification Catalogue Grid */}
          <div>
            <h4 className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display mb-3 px-1">Multiplayer Arcade</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Tic Tac Toe card */}
              <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[28px] shadow-xs text-center flex flex-col justify-between">
                <div className="flex justify-center p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 w-11 h-11 rounded-2xl mx-auto mb-2.5 items-center">
                  <Gamepad2 size={20} />
                </div>
                <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-205">Tic-Tac-Toe Arena</h5>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 mb-3.5 shrink-0 line-clamp-2">Defeat Alice Vance in a classic logic match.</p>
                <button
                  onClick={() => { setActiveGame('tictactoe'); resetTtt(); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold uppercase tracking-widest font-display py-2 rounded-xl transition-all w-full cursor-pointer active-press"
                  id="btn-play-ttt"
                >
                  Start Match (+10 🪙)
                </button>
              </div>

              {/* Tap Duel card */}
              <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 p-4 rounded-[28px] shadow-xs text-center flex flex-col justify-between">
                <div className="flex justify-center p-2.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 w-11 h-11 rounded-2xl mx-auto mb-2.5 items-center">
                  <Zap size={20} />
                </div>
                <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-255">Tap React Duel</h5>
                <p className="text-[9px] text-slate-400 dark:text-slate-550 mt-1 mb-3.5 shrink-0 line-clamp-2">Click instantly when colors flash green!</p>
                <button
                  onClick={() => { setActiveGame('tapduel'); startTapDuel(); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-bold uppercase tracking-widest font-display py-2 rounded-xl transition-all w-full cursor-pointer active-press"
                  id="btn-play-tapduel"
                >
                  Duel Alice (+25 🪙)
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard Table block */}
          <div className="bg-white dark:bg-[#11131A] border border-slate-200/60 dark:border-white/5 rounded-[28px] p-4.5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-widest font-display flex items-center gap-1.5">
                <Trophy size={12} className="text-yellow-500 animate-pulse" /> Friends Leaderboard
              </span>
              <span className="text-[8px] font-bold uppercase tracking-widest font-display bg-[#F4F5F8] dark:bg-[#161922] text-slate-400 px-2.5 py-1 rounded-md border border-slate-200/10">All-Time</span>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-none pb-1">
              {leaderboard.map((row, idx) => (
                <div key={row.id} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-white/5 pb-2.5 last:border-none last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold w-4 text-[10px] ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-blue-400' : 'text-slate-450'}`}>
                      #{idx + 1}
                    </span>
                    <img src={row.avatar} className="w-7 h-7 rounded-full object-cover border border-slate-100 dark:border-white/10" alt="" />
                    <div>
                      <h6 className="font-bold text-[10px] text-slate-800 dark:text-slate-200">@{row.playerName}</h6>
                      <span className="text-[8px] font-display uppercase tracking-wider text-slate-400 mt-0.5 block">{row.gameName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-mono font-bold text-[10px] text-slate-600 dark:text-slate-350 bg-[#F4F5F8] dark:bg-[#1C1F28] px-2 py-0.5 rounded-md border border-slate-200/20">
                    <span>{row.score}</span>
                    <Coins size={10} className="text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Immersive Mini Game Overlay UI
        <div className="flex flex-col flex-1 p-4 bg-[#F4F5F8] dark:bg-[#0A0B10] animate-fade-in relative min-h-[350px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1 px-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-404 font-display uppercase tracking-widest text-[9px] font-black rounded-full border border-blue-500/10">
                {activeGame === 'tictactoe' ? 'Tic-Tac-Toe Arena' : 'Tap React Duel'}
              </span>
              <span className="text-[8px] text-slate-400 font-display uppercase tracking-wider">Vs Alice Vance</span>
            </div>
            <button
              onClick={() => setActiveGame(null)}
              className="text-[9px] text-red-500 font-bold uppercase tracking-wider font-display cursor-pointer hover:text-red-650 transition active-press"
              id="btn-leave-game"
            >
              Exit Arcade
            </button>
          </div>

          {/* ACTIVE GAME 1: TIC TAC TOE ARENA */}
          {activeGame === 'tictactoe' && (
            <div className="flex flex-col items-center justify-center flex-1 py-4">
              <div className="flex justify-around w-full max-w-[240px] mb-4 text-[9px] font-display uppercase tracking-widest">
                <div className="flex flex-col items-center">
                  <span className={`font-bold pb-1 ${isXNext ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>My Turn (X)</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className={`font-bold pb-1 ${!isXNext ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400'}`}>Alice (O)</span>
                </div>
              </div>

              {/* Grid 3x3 */}
              <div className="grid grid-cols-3 gap-2.5 bg-slate-200 dark:bg-[#1C1F28] p-3 rounded-[32px] w-full max-w-[220px] aspect-square shadow-xl border border-slate-350 dark:border-white/5">
                {board.map((cell, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTttClick(idx)}
                    className="bg-white dark:bg-[#11131A] rounded-xl flex items-center justify-center font-mono text-lg font-black transition-all hover:bg-slate-50 dark:hover:bg-[#252A37] cursor-pointer active-press"
                  >
                    <span className={cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-purple-500' : 'text-transparent'}>
                      {cell || '-'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Status Banner */}
              {(tttWinner || isDraw) && (
                <div className="mt-5 p-4.5 bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] text-center w-full max-w-[220px] shadow-xl animate-fade-in">
                  <h6 className="text-[8px] font-bold uppercase tracking-widest font-display text-slate-400">Match Completed</h6>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1.5 uppercase font-display tracking-wider">
                    {tttWinner ? `${tttWinner === 'Player' ? '🎉 You Won!' : '💀 You Defeated'}` : "🤝 Draw Match!"}
                  </p>
                  <button
                    onClick={resetTtt}
                    className="mt-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold uppercase tracking-widest font-display px-5 py-2 rounded-full cursor-pointer active-press"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE GAME 2: TAP REACT DUEL */}
          {activeGame === 'tapduel' && (
            <div className="flex flex-col items-center justify-center flex-1 py-4">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mb-6 font-display uppercase tracking-widest text-center block">
                {statusMessage}
              </span>

              {/* Waiting count indicator */}
              {gameState === 'countdown' && (
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl animate-pulse shrink-0 mb-8 select-none">
                  {countdown}
                </div>
              )}

              {/* Play Area */}
              {(gameState === 'idle' || gameState === 'finished') && (
                <button
                  onClick={startTapDuel}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 font-bold uppercase tracking-widest font-display text-[9.5px] rounded-full shadow-lg transition-transform cursor-pointer active-press"
                >
                  Start reaction duel
                </button>
              )}

              {gameState === 'tap' && (
                <button
                  onClick={handlePlayerTap}
                  className="w-32 h-32 rounded-full bg-green-500 border-4 border-green-400 hover:bg-green-600 hover:border-green-500 cursor-pointer flex flex-col items-center justify-center text-white font-black text-xs shadow-2xl relative z-10 active-press"
                >
                  <Zap size={22} className="mb-1" /> TAP NOW!
                </button>
              )}

              {/* Victory screen stats */}
              {gameState === 'finished' && (
                <div className="mt-5 p-4 bg-white dark:bg-[#11131A] border border-slate-150 dark:border-white/5 rounded-[24px] text-center w-full max-w-[220px] shadow-xl">
                  <h6 className="text-[8px] font-bold uppercase tracking-widest font-display text-slate-400">Match Duel Times</h6>
                  <div className="flex justify-around text-xs my-3 bg-[#F4F5F8] dark:bg-[#1C1F28] p-2 rounded-xl border border-slate-200/20">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider font-display font-bold">You</p>
                      <p className="font-bold text-slate-800 dark:text-slate-100 font-mono text-[10px] mt-0.5">{reactionTime}ms</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider font-display font-bold">Alice</p>
                      <p className="font-bold text-slate-800 dark:text-slate-100 font-mono text-[10px] mt-0.5">{opponentTime}ms</p>
                    </div>
                  </div>
                  <button
                    onClick={startTapDuel}
                    className="bg-blue-600 hover:bg-blue-705 text-white text-[9px] font-bold uppercase tracking-widest font-display py-2 rounded-xl w-full cursor-pointer active-press"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
