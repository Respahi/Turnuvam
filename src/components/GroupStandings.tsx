import React from 'react';
import { GroupId, TeamStats } from '../types';
import { CheckCircle2, Award, XCircle, Info } from 'lucide-react';

interface GroupStandingsProps {
  standingsByGroup: Record<GroupId, TeamStats[]>;
  bestSecondTeamId?: string;
  onSelectGroup?: (groupId: GroupId) => void;
  selectedGroupFilter?: GroupId | 'ALL';
}

export const GroupStandings: React.FC<GroupStandingsProps> = ({
  standingsByGroup,
  bestSecondTeamId,
  selectedGroupFilter = 'ALL',
}) => {
  const groupsToShow: GroupId[] =
    selectedGroupFilter === 'ALL'
      ? ['A', 'B', 'C']
      : [selectedGroupFilter as GroupId];

  return (
    <div className="space-y-6">
      
      {/* Group Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {groupsToShow.map((gid) => {
          const groupStandings = standingsByGroup[gid] || [];
          const groupTitle = gid === 'A' ? 'A Grubu' : gid === 'B' ? 'B Grubu' : 'C Grubu';
          
          const headerGradient =
            gid === 'A'
              ? 'from-blue-600/30 to-slate-900 border-blue-500/30'
              : gid === 'B'
              ? 'from-purple-600/30 to-slate-900 border-purple-500/30'
              : 'from-amber-600/30 to-slate-900 border-amber-500/30';

          return (
            <div
              key={gid}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Group Table Header */}
                <div className={`bg-gradient-to-r ${headerGradient} p-4 border-b border-slate-800 flex items-center justify-between`}>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-white text-base tracking-wide">{groupTitle}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">3 Takım • 6 Maç</span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] uppercase font-mono text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 w-8 text-center">#</th>
                        <th className="py-2.5 px-3">Takım</th>
                        <th className="py-2.5 px-2 text-center" title="Oynanan">O</th>
                        <th className="py-2.5 px-2 text-center" title="Galibiyet">G</th>
                        <th className="py-2.5 px-2 text-center" title="Beraberlik">B</th>
                        <th className="py-2.5 px-2 text-center" title="Mağlubiyet">M</th>
                        <th className="py-2.5 px-2 text-center hidden sm:table-cell" title="Atılan Gol">AG</th>
                        <th className="py-2.5 px-2 text-center hidden sm:table-cell" title="Yenen Gol">YG</th>
                        <th className="py-2.5 px-2 text-center font-bold text-slate-200" title="Avaraj">AV</th>
                        <th className="py-2.5 px-3 text-center font-bold text-amber-400" title="Puan">P</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {groupStandings.map((st) => {
                        const isFirst = st.rank === 1;
                        const isSecond = st.rank === 2;
                        const isBestSecond = isSecond && st.teamId === bestSecondTeamId;

                        let rowBg = 'hover:bg-slate-800/50';
                        if (isFirst) {
                          rowBg = 'bg-emerald-950/20 hover:bg-emerald-950/40 border-l-2 border-emerald-500';
                        } else if (isBestSecond) {
                          rowBg = 'bg-amber-950/20 hover:bg-amber-950/40 border-l-2 border-amber-500';
                        } else if (isSecond) {
                          rowBg = 'bg-slate-800/30 hover:bg-slate-800/60 border-l-2 border-slate-600';
                        }

                        return (
                          <tr key={st.teamId} className={`transition-colors ${rowBg}`}>
                            {/* Rank */}
                            <td className="py-3 px-3 text-center font-mono font-bold">
                              <span
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] ${
                                  isFirst
                                    ? 'bg-emerald-500 text-slate-950'
                                    : isBestSecond
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {st.rank}
                              </span>
                            </td>

                            {/* Team Name */}
                            <td className="py-3 px-3">
                              <div className="flex items-center space-x-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: st.color || '#3b82f6' }}
                                />
                                <span className="font-semibold text-white truncate max-w-[110px] sm:max-w-[140px]">
                                  {st.teamName}
                                </span>
                              </div>
                            </td>

                            {/* Stats */}
                            <td className="py-3 px-2 text-center font-mono">{st.played}</td>
                            <td className="py-3 px-2 text-center font-mono text-emerald-400">{st.won}</td>
                            <td className="py-3 px-2 text-center font-mono text-slate-400">{st.drawn}</td>
                            <td className="py-3 px-2 text-center font-mono text-rose-400">{st.lost}</td>
                            <td className="py-3 px-2 text-center font-mono hidden sm:table-cell">{st.goalsFor}</td>
                            <td className="py-3 px-2 text-center font-mono hidden sm:table-cell">{st.goalsAgainst}</td>
                            <td
                              className={`py-3 px-2 text-center font-mono font-bold ${
                                st.goalDifference > 0
                                  ? 'text-emerald-400'
                                  : st.goalDifference < 0
                                  ? 'text-rose-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st.goalDifference > 0 ? `+${st.goalDifference}` : st.goalDifference}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-sm text-amber-400">
                              {st.points}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Footer */}
              <div className="bg-slate-950/60 p-3 border-t border-slate-800 text-[11px] space-y-1">
                {groupStandings.map((st) => {
                  if (st.rank === 1) {
                    return (
                      <div key={st.teamId} className="flex items-center space-x-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          <strong>{st.teamName}</strong> — Yarı Finalist (Lider)
                        </span>
                      </div>
                    );
                  }
                  if (st.rank === 2) {
                    const isBest = st.teamId === bestSecondTeamId;
                    return (
                      <div
                        key={st.teamId}
                        className={`flex items-center space-x-1.5 ${
                          isBest ? 'text-amber-400 font-medium' : 'text-slate-400'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          <strong>{st.teamName}</strong> — {isBest ? 'En İyi 2. (Yarı Finalist)' : '2. Sıra (En İyi 2. Adayı)'}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={st.teamId} className="flex items-center space-x-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        <strong>{st.teamName}</strong> — Elendi
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Legend Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center space-x-1 text-slate-300 font-medium">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Puan Cetveli Açıklaması:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>1. Sıra (Yarı Final'e Çıkar)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>En İyi 2. Takım (Yarı Final'e Çıkar)</span>
          </span>
          <span className="font-mono text-slate-500">
            Kısaltmalar: O: Oynanan, G: Galibiyet, B: Beraberlik, M: Mağlubiyet, AG: Atılan Gol, YG: Yenen Gol, AV: Averaj, P: Puan
          </span>
        </div>
      </div>

    </div>
  );
};
