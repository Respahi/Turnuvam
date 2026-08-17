import React from 'react';
import { GroupId, TeamStats } from '../types';
import { Award, Trophy, Info, Sparkles } from 'lucide-react';

interface BestSecondTableProps {
  bestSeconds: TeamStats[];
}

export const BestSecondTable: React.FC<BestSecondTableProps> = ({ bestSeconds }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Award className="w-5 h-5 text-amber-400" />
              <span>En İyi İkinciler Karşılaştırma Cetveli</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Yarı Final'e Yükselen En İyi 2. Takım Belirleme
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              3 gruptaki 2. sırada yer alan takımlar arasında <strong>Puan</strong>, <strong>Avaraj (Gol Farkı)</strong> ve <strong>Atılan Gol</strong> sayılarına göre genel bir sıralama yapılır. Lider 1 takım Yarı Final biletini alır.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center shrink-0">
            <div className="text-[10px] text-amber-300 font-mono uppercase tracking-wider">Yarı Final Bilet Sayısı</div>
            <div className="text-2xl font-black text-amber-400 font-mono">1 TAKIM</div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-950/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center space-x-2">
            <span>2. Sıra Takımları Genel Puan Durumu</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>
          <span className="text-xs text-slate-400 font-mono">3 Takım Karşılaştırılıyor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Sıra</th>
                <th className="py-3 px-4">Takım</th>
                <th className="py-3 px-3 text-center">Grup</th>
                <th className="py-3 px-3 text-center">O</th>
                <th className="py-3 px-3 text-center">G</th>
                <th className="py-3 px-3 text-center">B</th>
                <th className="py-3 px-3 text-center">M</th>
                <th className="py-3 px-3 text-center">AG</th>
                <th className="py-3 px-3 text-center">YG</th>
                <th className="py-3 px-3 text-center font-bold text-slate-100">AV</th>
                <th className="py-3 px-4 text-center font-bold text-amber-400">Puan</th>
                <th className="py-3 px-4 text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {bestSeconds.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-500 text-xs">
                    Henüz grup maçları tamamlanmadı veya 2. sıra verileri oluşmadı.
                  </td>
                </tr>
              ) : (
                bestSeconds.map((st, idx) => {
                  const isTopSecond = idx === 0;

                  return (
                    <tr
                      key={st.teamId}
                      className={`transition-colors ${
                        isTopSecond
                          ? 'bg-amber-950/30 hover:bg-amber-950/50 border-l-4 border-amber-400'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            isTopSecond
                              ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-900/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: st.color || '#3b82f6' }}
                          />
                          <div>
                            <div className="font-bold text-white text-base flex items-center space-x-2">
                              <span>{st.teamName}</span>
                              {isTopSecond && (
                                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {st.groupId} Grubu 2.si
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Group Badge */}
                      <td className="py-4 px-3 text-center font-mono">
                        <span className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {st.groupId} Grubu
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="py-4 px-3 text-center font-mono">{st.played}</td>
                      <td className="py-4 px-3 text-center font-mono text-emerald-400">{st.won}</td>
                      <td className="py-4 px-3 text-center font-mono text-slate-400">{st.drawn}</td>
                      <td className="py-4 px-3 text-center font-mono text-rose-400">{st.lost}</td>
                      <td className="py-4 px-3 text-center font-mono font-bold">{st.goalsFor}</td>
                      <td className="py-4 px-3 text-center font-mono text-slate-400">{st.goalsAgainst}</td>
                      
                      {/* Averaj */}
                      <td
                        className={`py-4 px-3 text-center font-mono font-bold text-base ${
                          st.goalDifference > 0
                            ? 'text-emerald-400'
                            : st.goalDifference < 0
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {st.goalDifference > 0 ? `+${st.goalDifference}` : st.goalDifference}
                      </td>

                      {/* Points */}
                      <td className="py-4 px-4 text-center font-mono font-black text-lg text-amber-400">
                        {st.points}
                      </td>

                      {/* Qualification Status */}
                      <td className="py-4 px-4 text-center">
                        {isTopSecond ? (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1 shadow-sm">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Yarı Final'e Yükseldi!</span>
                          </span>
                        ) : (
                          <span className="bg-slate-800/80 text-slate-500 border border-slate-700/50 px-2.5 py-1 rounded-lg text-xs font-medium">
                            Elendi
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tiebreaker Rules Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-amber-400" />
          <span>Eşitlik Bozma Kriterleri (En İyi 2. Takım İçin):</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-2">
          <li>Toplam Puan (En yüksek puan alan öne geçer)</li>
          <li>Gol Farkı / Averaj (Atılan Gol - Yenen Gol)</li>
          <li>Atılan Gol Sayısı (En çok gol atan takım)</li>
          <li>Takım İsmi Alfabetik Sıralaması</li>
        </ol>
      </div>

    </div>
  );
};
