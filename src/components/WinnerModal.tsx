import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Team } from '../types';
import { Trophy, Sparkles, X, RotateCcw } from 'lucide-react';

interface WinnerModalProps {
  championTeam: Team | null;
  onClose: () => void;
  onReset: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ championTeam, onClose, onReset }) => {
  useEffect(() => {
    if (championTeam) {
      // Fire confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.5 } });
        confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.5 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [championTeam]);

  if (!championTeam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Visual */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-2xl shadow-amber-500/40 mx-auto flex items-center justify-center animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
              <Trophy className="w-12 h-12" />
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        {/* Title & Champion */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-mono font-black text-amber-400 tracking-widest flex items-center justify-center space-x-1">
            <span>🏆 TURNUVA ŞAMPİYONU 🏆</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {championTeam.name}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed px-4">
            Bütün rakiplerini mağlup ederek büyük turnuvanın birincisi ve altın kupanın sahibi oldu!
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            Kupayı Kutla! 🎉
          </button>

          <button
            onClick={onReset}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Turnuva</span>
          </button>
        </div>

      </div>
    </div>
  );
};
