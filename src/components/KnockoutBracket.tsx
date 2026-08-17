import React from 'react';
import { KnockoutMatchData, Team, TeamStats } from '../types';
import { Trophy, Award, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface KnockoutBracketProps {
  knockoutMatches: KnockoutMatchData[];
  teams: Team[];
  qualifiedTeams: TeamStats[];
  onKnockoutScoreChange: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    homePenalty?: number | null,
    awayPenalty?: number | null
  ) => void;
  championTeam?: Team;
  onSimulateKnockout: () => void;
}

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({
  knockoutMatches,
  teams,
  qualifiedTeams,
  onKnockoutScoreChange,
  championTeam,
  onSimulateKnockout,
}) => {
  const getTeam = (teamId: string | null) => {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId) || null;
  };

  const sf1 = knockoutMatches.find((m) => m.id === 'sf-1');
  const sf2 = knockoutMatches.find((m) => m.id === 'sf-2');
  const thirdPlace = knockoutMatches.find((m) => m.id === 'third-place');
  const finalMatch = knockoutMatches.find((m) => m.id === 'final');

  const renderMatchCard = (match: KnockoutMatchData | undefined, isFinal: boolean = false) => {
    if (!match) return null;

    const homeTeam = getTeam(match.homeTeamId);
    const awayTeam = getTeam(match.awayTeamId);

    const isDraw =
      match.homeScore !== null &&
      match.awayScore !== null &&
      match.homeScore === match.awayScore;

    return (
      <div
        className={`bg-slate-900 border rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all ${
          isFinal
            ? 'border-amber-500/60 bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 shadow-amber-950/40 ring-1 ring-amber-500/30'
            : match.isPlayed
            ? 'border-emerald-500/40 bg-slate-900'
            : 'border-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            {isFinal ? (
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            ) : (
              <Award className="w-4 h-4 text-emerald-400" />
            )}
            <span
              className={`font-bold text-sm tracking-wide ${
                isFinal ? 'text-amber-400 uppercase font-black' : 'text-slate-100'
              }`}
            >
              {match.title}
            </span>
          </div>

          {match.isPlayed ? (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Sonuçlandı
            </span>
          ) : (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              Bekliyor
            </span>
          )}
        </div>

        {/* Teams and Scores */}
        <div className="space-y-3">
          
          {/* Home Team Row */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              match.winnerId && match.winnerId === match.homeTeamId
                ? 'bg-emerald-950/30 border-emerald-500/50 text-white font-bold'
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3 truncate">
              {homeTeam ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: homeTeam.color || '#3b82f6' }}
                  />
                  <span className="font-bold text-sm truncate">{homeTeam.name}</span>
                </>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  {match.slotHomeDescription || 'TBD'}
                </span>
              )}
            </div>

            <input
              type="number"
              min={0}
              max={20}
              disabled={!match.homeTeamId}
              value={match.homeScore !== null ? match.homeScore : ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                onKnockoutScoreChange(
                  match.id,
                  isNaN(val as number) ? null : val,
                  match.awayScore,
                  match.homePenalty,
                  match.awayPenalty
                );
              }}
              placeholder="-"
              className="w-10 h-10 bg-slate-900 text-amber-400 font-mono font-black text-center text-lg rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 disabled:opacity-30"
            />
          </div>

          {/* Away Team Row */}
          <div
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
              match.winnerId && match.winnerId === match.awayTeamId
                ? 'bg-emerald-950/30 border-emerald-500/50 text-white font-bold'
                : 'bg-slate-950/80 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3 truncate">
              {awayTeam ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: awayTeam.color || '#3b82f6' }}
                  />
                  <span className="font-bold text-sm truncate">{awayTeam.name}</span>
                </>
              ) : (
                <span className="text-xs text-slate-500 italic">
                  {match.slotAwayDescription || 'TBD'}
                </span>
              )}
            </div>

            <input
              type="number"
              min={0}
              max={20}
              disabled={!match.awayTeamId}
              value={match.awayScore !== null ? match.awayScore : ''}
              onChange={(e) => {
                const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                onKnockoutScoreChange(
                  match.id,
                  match.homeScore,
                  isNaN(val as number) ? null : val,
                  match.homePenalty,
                  match.awayPenalty
                );
              }}
              placeholder="-"
              className="w-10 h-10 bg-slate-900 text-amber-400 font-mono font-black text-center text-lg rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 disabled:opacity-30"
            />
          </div>

        </div>

        {/* Penalty Shootout section if draw */}
        {isDraw && (
          <div className="mt-4 pt-3 border-t border-amber-500/30 bg-amber-950/20 rounded-xl p-3 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Beraberlik! Penaltı Atışları:</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300 font-medium truncate">{homeTeam?.shortName || 'Ev'}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={match.homePenalty !== null ? match.homePenalty : ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    onKnockoutScoreChange(
                      match.id,
                      match.homeScore,
                      match.awayScore,
                      isNaN(val as number) ? null : val,
                      match.awayPenalty
                    );
                  }}
                  placeholder="P"
                  className="w-8 h-8 bg-slate-900 text-emerald-400 font-mono font-bold text-center rounded border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-300 font-medium truncate">{awayTeam?.shortName || 'Dep'}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={match.awayPenalty !== null ? match.awayPenalty : ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    onKnockoutScoreChange(
                      match.id,
                      match.homeScore,
                      match.awayScore,
                      match.homePenalty,
                      isNaN(val as number) ? null : val
                    );
                  }}
                  placeholder="P"
                  className="w-8 h-8 bg-slate-900 text-emerald-400 font-mono font-bold text-center rounded border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Winner Tag */}
        {match.winnerId && (
          <div className="mt-3 text-center bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl text-xs text-emerald-400 font-bold flex items-center justify-center space-x-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Tur Atlayan: {getTeam(match.winnerId)?.name}</span>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      
      {/* Banner / Qualified teams summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Yarı Finalist 4 Takım</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Eleme Turnuvası Ağacı & Şampiyonluk Aşaması
            </h2>
          </div>

          <button
            onClick={onSimulateKnockout}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Eleme Maçlarını Otomatik Tamamla</span>
          </button>
        </div>

        {/* Qualified Teams Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {qualifiedTeams.map((qt) => (
            <div
              key={qt.teamId}
              className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3"
            >
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: qt.color || '#3b82f6' }}
              />
              <div className="truncate">
                <div className="font-bold text-white text-xs truncate">{qt.teamName}</div>
                <div className="text-[10px] text-amber-400 font-medium">
                  {qt.qualificationReason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Champion Podium Box if Champion exists */}
      {championTeam && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 rounded-2xl p-6 shadow-2xl shadow-amber-500/20 text-center space-y-2 border-2 border-amber-300 animate-pulse">
          <div className="inline-flex p-3 bg-slate-950 rounded-2xl text-amber-400 mb-1 shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="text-xs uppercase font-mono font-black tracking-widest text-slate-900">
            TURNUVA ŞAMPİYONU
          </div>
          <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">
            🏆 {championTeam.name} 🏆
          </h1>
          <p className="text-xs font-semibold text-slate-900">
            Tebrikler! Bütün rakiplerini eleyerek kupanın sahibi oldu!
          </p>
        </div>
      )}

      {/* Tournament Bracket Flow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Semi-Finals (5 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Yarı Final Maçları</span>
          </div>

          <div className="space-y-6">
            {renderMatchCard(sf1)}
            {renderMatchCard(sf2)}
          </div>
        </div>

        {/* Right: Final & 3rd Place (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Final & Üçüncülük Maçı</span>
          </div>

          <div className="space-y-6">
            {renderMatchCard(finalMatch, true)}
            {renderMatchCard(thirdPlace)}
          </div>
        </div>

      </div>

    </div>
  );
};
