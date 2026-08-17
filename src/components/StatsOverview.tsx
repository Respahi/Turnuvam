import React from 'react';
import { Match, TeamStats } from '../types';
import { Activity, Flame, ShieldCheck, Trophy, Goal } from 'lucide-react';

interface StatsOverviewProps {
  matches: Match[];
  allStandings: TeamStats[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ matches, allStandings }) => {
  const playedGroupMatches = matches.filter((m) => m.isPlayed && m.homeScore !== null && m.awayScore !== null);
  const totalGoals = playedGroupMatches.reduce(
    (sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0),
    0
  );

  const avgGoalsPerMatch =
    playedGroupMatches.length > 0 ? (totalGoals / playedGroupMatches.length).toFixed(2) : '0.00';

  // Find Best Attack (Most Goals For) & Best Defense (Fewest Goals Against)
  const sortedByAttack = [...allStandings].sort((a, b) => b.goalsFor - a.goalsFor);
  const sortedByDefense = [...allStandings].sort((a, b) => a.goalsAgainst - b.goalsAgainst);

  const bestAttack = sortedByAttack[0];
  const bestDefense = sortedByDefense[0];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
      
      {/* Total Goals */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <Goal className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Toplam Gol</div>
          <div className="text-xl font-black text-white font-mono">{totalGoals} Gol</div>
        </div>
      </div>

      {/* Avg Goals Per Match */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Maç Başı Ort. Gol</div>
          <div className="text-xl font-black text-white font-mono">{avgGoalsPerMatch}</div>
        </div>
      </div>

      {/* Best Attack */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
          <Flame className="w-5 h-5" />
        </div>
        <div className="truncate">
          <div className="text-[11px] text-slate-400 font-medium">En Golcü Takım</div>
          <div className="text-sm font-bold text-white truncate">
            {bestAttack?.goalsFor > 0 ? `${bestAttack.teamName} (${bestAttack.goalsFor})` : '-'}
          </div>
        </div>
      </div>

      {/* Best Defense */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="truncate">
          <div className="text-[11px] text-slate-400 font-medium">En Az Gol Yen</div>
          <div className="text-sm font-bold text-white truncate">
            {bestDefense?.played > 0 ? `${bestDefense.teamName} (${bestDefense.goalsAgainst})` : '-'}
          </div>
        </div>
      </div>

    </div>
  );
};
