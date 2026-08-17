import React, { useState } from 'react';
import { Group, Team } from '../types';
import { Shuffle, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';

interface TeamSetupProps {
  teams: Team[];
  groups: Group[];
  onUpdateTeams: (teams: Team[]) => void;
  onShuffleGroups: () => void;
  onStartTournament: () => void;
}

export const TeamSetup: React.FC<TeamSetupProps> = ({
  teams,
  groups,
  onUpdateTeams,
  onShuffleGroups,
  onStartTournament,
}) => {
  const [teamNames, setTeamNames] = useState<string[]>(teams.map((t) => t.name));

  const handleNameChange = (index: number, newName: string) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = newName;
    setTeamNames(updatedNames);

    const updatedTeams = teams.map((t, idx) => {
      if (idx === index) {
        return {
          ...t,
          name: newName,
          shortName: (newName.trim() || `T${idx + 1}`).substring(0, 3).toUpperCase(),
        };
      }
      return t;
    });

    onUpdateTeams(updatedTeams);
  };

  const getGroupTeams = (groupId: 'A' | 'B' | 'C') => {
    return teams.filter((t) => t.groupId === groupId);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Rules Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Turnuva Formatı ve İlerleme Kuralları</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              9 Takımlı 3 Grup ve Rövanşlı Lig Sistemi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Her grupta 3 takım rövanşlı çift devreli 6 maç yapar.</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Grup Lideri (3 takım) direkt Yarı Final'e yükselir.</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gruplardaki en iyi 2. takım (1 takım) 4. finalist olur.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onShuffleGroups}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Grupları Rasgele Kura Çek</span>
            </button>

            <button
              onClick={onStartTournament}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
            >
              <span>Maçlara ve Puan Tablosuna Geç</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Team Input Form & Group Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 9 Team Name Inputs */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Takım Listesi</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  9 Takım
                </span>
              </h3>
              <p className="text-xs text-slate-400">Yarışacak takımların isimlerini giriniz</p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {teams.map((team, idx) => (
              <div
                key={team.id}
                className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 focus-within:border-emerald-500/60 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
                  style={{ backgroundColor: team.color || '#3b82f6' }}
                >
                  {idx + 1}
                </div>
                <input
                  type="text"
                  value={teamNames[idx] || ''}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  placeholder={`Takım ${idx + 1} İsmi`}
                  className="bg-transparent text-white text-sm w-full focus:outline-none placeholder-slate-600 font-medium"
                />
                <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0">
                  {team.groupId ? `${team.groupId} Grubu` : 'Atanmadı'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Groups Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Grup Dağılımı</span>
              <span className="text-xs text-slate-400 font-normal">(Her grupta 3 takım)</span>
            </h3>
            <button
              onClick={onShuffleGroups}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-medium cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Yeniden Kura Çek</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['A', 'B', 'C'] as const).map((gid) => {
              const gTeams = getGroupTeams(gid);
              const groupName = gid === 'A' ? 'A Grubu' : gid === 'B' ? 'B Grubu' : 'C Grubu';
              const badgeBg =
                gid === 'A'
                  ? 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400'
                  : gid === 'B'
                  ? 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400'
                  : 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400';

              return (
                <div
                  key={gid}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div
                      className={`px-3 py-1 rounded-lg border bg-gradient-to-r ${badgeBg} font-bold text-sm`}
                    >
                      {groupName}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {gTeams.length} / 3 Takım
                    </span>
                  </div>

                  <div className="space-y-2">
                    {gTeams.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 italic">
                        Henüz takım atanmadı. "Grupları Rasgele Kura Çek" butonuna tıklayınız.
                      </div>
                    ) : (
                      gTeams.map((t, idx) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800/80"
                        >
                          <div className="flex items-center space-x-2.5">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: t.color || '#3b82f6' }}
                            />
                            <span className="text-sm font-semibold text-slate-100 truncate max-w-[120px]">
                              {t.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-center space-x-1">
                    <HelpCircle className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>6 Çift Devreli Maç Oynanacak</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick info card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center justify-between">
            <span>
              💡 Takım isimlerini dilediğiniz gibi güncelleyip ardından Kura Çekebilirsiniz.
            </span>
            <button
              onClick={onStartTournament}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-2 cursor-pointer shrink-0"
            >
              Maç Takvimine Git →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
