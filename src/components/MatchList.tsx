import React, { useState } from 'react';
import { GroupId, Match, Team } from '../types';
import { Filter, Zap, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  teams: Team[];
  onScoreChange: (matchId: string, homeScore: number | null, awayScore: number | null) => void;
  onSimulateUnplayed: () => void;
  onResetAllScores: () => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  teams,
  onScoreChange,
  onSimulateUnplayed,
  onResetAllScores,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupId | 'ALL'>('ALL');
  const [selectedRound, setSelectedRound] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PLAYED' | 'UNPLAYED'>('ALL');

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    if (selectedGroup !== 'ALL' && m.groupId !== selectedGroup) return false;
    if (selectedRound !== 'ALL' && m.round !== selectedRound) return false;
    if (statusFilter === 'PLAYED' && !m.isPlayed) return false;
    if (statusFilter === 'UNPLAYED' && m.isPlayed) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Control Bar & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtrele:</span>
          </div>

          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value as GroupId | 'ALL')}
            className="bg-slate-950 text-white text-xs font-medium border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Tüm Gruplar (A, B, C)</option>
            <option value="A">Grup A Maçları</option>
            <option value="B">Grup B Maçları</option>
            <option value="C">Grup C Maçları</option>
          </select>

          {/* Round Filter */}
          <select
            value={selectedRound === 'ALL' ? 'ALL' : selectedRound.toString()}
            onChange={(e) =>
              setSelectedRound(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
            }
            className="bg-slate-950 text-white text-xs font-medium border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Tüm Haftalar (1 - 6)</option>
            <option value="1">1. Hafta (İlk Maç)</option>
            <option value="2">2. Hafta (İlk Maç)</option>
            <option value="3">3. Hafta (İlk Maç)</option>
            <option value="4">4. Hafta (Rövanş)</option>
            <option value="5">5. Hafta (Rövanş)</option>
            <option value="6">6. Hafta (Rövanş)</option>
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('PLAYED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                statusFilter === 'PLAYED' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Oynanmış
            </button>
            <button
              onClick={() => setStatusFilter('UNPLAYED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                statusFilter === 'UNPLAYED' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bekleyen
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateUnplayed}
            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Skorları Otomatik Doldur</span>
          </button>

          <button
            onClick={onResetAllScores}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Skorları Temizle</span>
          </button>
        </div>

      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 border border-slate-800 rounded-2xl">
            Seçilen filtrelere uygun maç bulunamadı.
          </div>
        ) : (
          filteredMatches.map((match) => {
            const homeTeam = getTeam(match.homeTeamId);
            const awayTeam = getTeam(match.awayTeamId);

            const isLeg2 = match.round >= 4;

            return (
              <div
                key={match.id}
                className={`bg-slate-900 border rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 transition-all hover:border-slate-700 ${
                  match.isPlayed
                    ? 'border-emerald-500/30 bg-slate-900/90'
                    : 'border-slate-800'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded font-mono">
                      Grup {match.groupId}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {match.round}. Hafta {isLeg2 ? '(Rövanş)' : '(İlk Maç)'}
                    </span>
                  </div>
                  
                  {match.isPlayed ? (
                    <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tamamlandı</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-400 text-[11px] font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      <span>Bekliyor</span>
                    </span>
                  )}
                </div>

                {/* Score Editor Section */}
                <div className="flex items-center justify-between py-2">
                  
                  {/* Home Team */}
                  <div className="flex-1 flex flex-col items-center text-center space-y-1.5 pr-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md"
                      style={{ backgroundColor: homeTeam?.color || '#3b82f6' }}
                    >
                      {homeTeam?.shortName || 'EV'}
                    </div>
                    <span className="font-semibold text-xs text-white line-clamp-1 max-w-[100px]">
                      {homeTeam?.name || 'Ev Sahibi'}
                    </span>
                  </div>

                  {/* Score Inputs */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={match.homeScore !== null ? match.homeScore : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        onScoreChange(
                          match.id,
                          isNaN(val as number) ? null : val,
                          match.awayScore
                        );
                      }}
                      placeholder="-"
                      className="w-11 h-11 bg-slate-950 text-emerald-400 font-mono font-black text-lg text-center rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 shadow-inner"
                    />

                    <span className="text-slate-600 font-bold text-lg">:</span>

                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={match.awayScore !== null ? match.awayScore : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                        onScoreChange(
                          match.id,
                          match.homeScore,
                          isNaN(val as number) ? null : val
                        );
                      }}
                      placeholder="-"
                      className="w-11 h-11 bg-slate-950 text-emerald-400 font-mono font-black text-lg text-center rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 shadow-inner"
                    />
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex flex-col items-center text-center space-y-1.5 pl-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md"
                      style={{ backgroundColor: awayTeam?.color || '#3b82f6' }}
                    >
                      {awayTeam?.shortName || 'DEP'}
                    </div>
                    <span className="font-semibold text-xs text-white line-clamp-1 max-w-[100px]">
                      {awayTeam?.name || 'Deplasman'}
                    </span>
                  </div>

                </div>

                {/* Footer Clear / Quick fill */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Maç #{match.matchNumber}</span>
                  {match.isPlayed && (
                    <button
                      onClick={() => onScoreChange(match.id, null, null)}
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Skoru Sıfırla
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
