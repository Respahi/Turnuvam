import React, { useState, useEffect, useMemo } from 'react';
import {
  createInitialTeams,
  createInitialKnockoutMatches,
  generateGroupMatches,
  shuffleTeamsIntoGroups,
  calculateGroupStandings,
  calculateBestSeconds,
  updateKnockoutSlots,
  generateSampleTournamentData,
} from './utils/tournament';
import { Group, GroupId, KnockoutMatchData, Match, SaveSlot, Team, TeamStats } from './types';
import { Header } from './components/Header';
import { TeamSetup } from './components/TeamSetup';
import { GroupStandings } from './components/GroupStandings';
import { BestSecondTable } from './components/BestSecondTable';
import { MatchList } from './components/MatchList';
import { KnockoutBracket } from './components/KnockoutBracket';
import { StatsOverview } from './components/StatsOverview';
import { WinnerModal } from './components/WinnerModal';
import { SaveManagerModal } from './components/SaveManagerModal';

const LOCAL_STORAGE_KEY = 'turnuva_puan_tablosu_v1';
const SAVE_SLOTS_KEY = 'turnuva_save_slots_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'setup' | 'group' | 'bestSeconds' | 'knockout'>('group');
  const [isSaveManagerOpen, setIsSaveManagerOpen] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());

  // Save Slots State
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(() => {
    const saved = localStorage.getItem(SAVE_SLOTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Initialize Tournament State
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teams) return parsed.teams;
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    }
    const initial = createInitialTeams();
    const { teams: grouped } = shuffleTeamsIntoGroups(initial);
    return grouped;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.groups) return parsed.groups;
      } catch (e) {}
    }
    return [
      { id: 'A', name: 'A Grubu', teamIds: teams.filter((t) => t.groupId === 'A').map((t) => t.id) },
      { id: 'B', name: 'B Grubu', teamIds: teams.filter((t) => t.groupId === 'B').map((t) => t.id) },
      { id: 'C', name: 'C Grubu', teamIds: teams.filter((t) => t.groupId === 'C').map((t) => t.id) },
    ];
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.matches) return parsed.matches;
      } catch (e) {}
    }
    return generateGroupMatches([
      { id: 'A', name: 'A Grubu', teamIds: teams.filter((t) => t.groupId === 'A').map((t) => t.id) },
      { id: 'B', name: 'B Grubu', teamIds: teams.filter((t) => t.groupId === 'B').map((t) => t.id) },
      { id: 'C', name: 'C Grubu', teamIds: teams.filter((t) => t.groupId === 'C').map((t) => t.id) },
    ]);
  });

  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatchData[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.knockoutMatches) return parsed.knockoutMatches;
      } catch (e) {}
    }
    return createInitialKnockoutMatches();
  });

  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);

  // Save state to LocalStorage
  useEffect(() => {
    const payload = { teams, groups, matches, knockoutMatches };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    setLastSavedAt(new Date());
  }, [teams, groups, matches, knockoutMatches]);

  // Persist Save Slots
  useEffect(() => {
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(saveSlots));
  }, [saveSlots]);

  // Handle Save Slot Creation
  const handleSaveSlot = (name: string) => {
    const playedCount = matches.filter((m) => m.isPlayed).length;
    const newSlot: SaveSlot = {
      id: Date.now().toString(),
      name,
      savedAt: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      playedCount,
      totalCount: matches.length,
      data: { teams, groups, matches, knockoutMatches },
    };
    setSaveSlots((prev) => [newSlot, ...prev]);
  };

  // Handle Loading Data
  const handleLoadData = (data: {
    teams: Team[];
    groups: Group[];
    matches: Match[];
    knockoutMatches: KnockoutMatchData[];
  }) => {
    setTeams(data.teams);
    setGroups(data.groups);
    setMatches(data.matches);
    setKnockoutMatches(data.knockoutMatches || createInitialKnockoutMatches());
  };

  const handleLoadSlot = (slot: SaveSlot) => {
    handleLoadData(slot.data);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSaveSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  // Compute live group standings for Groups A, B, C
  const standingsByGroup = useMemo(() => {
    const result: Record<GroupId, TeamStats[]> = {
      A: calculateGroupStandings('A', teams, matches),
      B: calculateGroupStandings('B', teams, matches),
      C: calculateGroupStandings('C', teams, matches),
    };
    return result;
  }, [teams, matches]);

  // Flattened standings list
  const allStandingsList = useMemo(() => {
    return [...standingsByGroup.A, ...standingsByGroup.B, ...standingsByGroup.C];
  }, [standingsByGroup]);

  // Best 2nd Place Teams comparison
  const bestSeconds = useMemo(() => {
    return calculateBestSeconds(standingsByGroup);
  }, [standingsByGroup]);

  const bestSecondTeamId = bestSeconds.length > 0 ? bestSeconds[0].teamId : undefined;

  // Update knockout bracket slots based on standings
  const knockoutDetails = useMemo(() => {
    return updateKnockoutSlots(standingsByGroup, knockoutMatches);
  }, [standingsByGroup, knockoutMatches]);

  // Final Winner Determination
  const finalMatch = knockoutDetails.knockoutMatches.find((m) => m.id === 'final');
  const championTeam = finalMatch?.winnerId ? teams.find((t) => t.id === finalMatch.winnerId) : undefined;

  // Trigger modal when champion is determined
  useEffect(() => {
    if (championTeam && finalMatch?.isPlayed) {
      setShowWinnerModal(true);
    }
  }, [championTeam, finalMatch?.isPlayed]);

  // Handlers
  const handleShuffleGroups = () => {
    const { teams: newTeams, groups: newGroups } = shuffleTeamsIntoGroups(teams);
    const newMatches = generateGroupMatches(newGroups);
    setTeams(newTeams);
    setGroups(newGroups);
    setMatches(newMatches);
    setKnockoutMatches(createInitialKnockoutMatches());
  };

  const handleUpdateTeams = (updatedTeams: Team[]) => {
    setTeams(updatedTeams);
  };

  const handleScoreChange = (matchId: string, homeScore: number | null, awayScore: number | null) => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === matchId) {
          const isPlayed = homeScore !== null && awayScore !== null;
          return { ...m, homeScore, awayScore, isPlayed };
        }
        return m;
      })
    );
  };

  const handleSimulateUnplayedGroupMatches = () => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (!m.isPlayed) {
          const hScore = Math.floor(Math.random() * 4);
          const aScore = Math.floor(Math.random() * 3);
          return { ...m, homeScore: hScore, awayScore: aScore, isPlayed: true };
        }
        return m;
      })
    );
  };

  const handleResetAllGroupScores = () => {
    setMatches((prevMatches) =>
      prevMatches.map((m) => ({ ...m, homeScore: null, awayScore: null, isPlayed: false }))
    );
    setKnockoutMatches(createInitialKnockoutMatches());
  };

  const handleKnockoutScoreChange = (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null,
    homePenalty?: number | null,
    awayPenalty?: number | null
  ) => {
    setKnockoutMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const isPlayed = homeScore !== null && awayScore !== null;
          let winnerId: string | null = null;

          if (isPlayed && m.homeTeamId && m.awayTeamId) {
            if (homeScore > awayScore) {
              winnerId = m.homeTeamId;
            } else if (awayScore > homeScore) {
              winnerId = m.awayTeamId;
            } else if (homePenalty !== undefined && awayPenalty !== undefined && homePenalty !== null && awayPenalty !== null) {
              if (homePenalty > awayPenalty) winnerId = m.homeTeamId;
              else if (awayPenalty > homePenalty) winnerId = m.awayTeamId;
            }
          }

          return {
            ...m,
            homeScore,
            awayScore,
            homePenalty,
            awayPenalty,
            isPlayed,
            winnerId,
          };
        }
        return m;
      })
    );
  };

  const handleSimulateKnockout = () => {
    // Simulate current knockout matches
    const updated = knockoutDetails.knockoutMatches.map((m) => {
      if (m.homeTeamId && m.awayTeamId) {
        let hScore = Math.floor(Math.random() * 4);
        let aScore = Math.floor(Math.random() * 4);
        let hPen = null;
        let aPen = null;

        if (hScore === aScore) {
          hPen = 5;
          aPen = 4;
        }

        const winnerId = hScore > aScore || (hPen && hPen > (aPen || 0)) ? m.homeTeamId : m.awayTeamId;

        return {
          ...m,
          homeScore: hScore,
          awayScore: aScore,
          homePenalty: hPen,
          awayPenalty: aPen,
          isPlayed: true,
          winnerId,
        };
      }
      return m;
    });

    // Handle Final if SFs played
    const sf1 = updated.find((m) => m.id === 'sf-1');
    const sf2 = updated.find((m) => m.id === 'sf-2');
    const finalM = updated.find((m) => m.id === 'final');
    const thirdM = updated.find((m) => m.id === 'third-place');

    if (sf1?.winnerId && sf2?.winnerId && finalM) {
      finalM.homeTeamId = sf1.winnerId;
      finalM.awayTeamId = sf2.winnerId;
      let fhScore = Math.floor(Math.random() * 3) + 1;
      let faScore = Math.floor(Math.random() * 3);
      finalM.homeScore = fhScore;
      finalM.awayScore = faScore;
      finalM.isPlayed = true;
      finalM.winnerId = fhScore > faScore ? sf1.winnerId : sf2.winnerId;
    }

    if (sf1?.winnerId && sf2?.winnerId && thirdM) {
      const sf1L = sf1.winnerId === sf1.homeTeamId ? sf1.awayTeamId : sf1.homeTeamId;
      const sf2L = sf2.winnerId === sf2.homeTeamId ? sf2.awayTeamId : sf2.homeTeamId;
      thirdM.homeTeamId = sf1L;
      thirdM.awayTeamId = sf2L;
      thirdM.homeScore = 2;
      thirdM.awayScore = 1;
      thirdM.isPlayed = true;
      thirdM.winnerId = sf1L;
    }

    setKnockoutMatches(updated);
  };

  const handleLoadSample = () => {
    const { teams: sTeams, groups: sGroups, matches: sMatches } = generateSampleTournamentData();
    setTeams(sTeams);
    setGroups(sGroups);
    setMatches(sMatches);
    setKnockoutMatches(createInitialKnockoutMatches());
    setActiveTab('group');
  };

  const handleResetTournament = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const initial = createInitialTeams();
    const { teams: grouped, groups: newG } = shuffleTeamsIntoGroups(initial);
    setTeams(grouped);
    setGroups(newG);
    setMatches(generateGroupMatches(newG));
    setKnockoutMatches(createInitialKnockoutMatches());
    setShowWinnerModal(false);
    setActiveTab('setup');
  };

  const playedMatchesCount = matches.filter((m) => m.isPlayed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadSample={handleLoadSample}
        onReset={handleResetTournament}
        onSimulateAll={handleSimulateUnplayedGroupMatches}
        onOpenSaveManager={() => setIsSaveManagerOpen(true)}
        playedMatchesCount={playedMatchesCount}
        totalMatchesCount={matches.length}
        championName={championTeam?.name}
      />

      {/* Main App Container */}
      <main className="py-8 space-y-8">
        
        {/* Top Tournament Stats Bar */}
        <StatsOverview matches={matches} allStandings={allStandingsList} />

        {/* Tab 1: Teams & Groups Setup */}
        {activeTab === 'setup' && (
          <TeamSetup
            teams={teams}
            groups={groups}
            onUpdateTeams={handleUpdateTeams}
            onShuffleGroups={handleShuffleGroups}
            onStartTournament={() => setActiveTab('group')}
          />
        )}

        {/* Tab 2: Group Standings & Matches */}
        {activeTab === 'group' && (
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            {/* Standings Tables */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Grup Puan Durumu (Canlı Tablo)</span>
              </h2>
              <GroupStandings
                standingsByGroup={standingsByGroup}
                bestSecondTeamId={bestSecondTeamId}
              />
            </div>

            {/* Matches List */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Grup Maç Sonuçları Girişi (18 Maç - Rövanşlı)</span>
              </h2>
              <MatchList
                matches={matches}
                teams={teams}
                onScoreChange={handleScoreChange}
                onSimulateUnplayed={handleSimulateUnplayedGroupMatches}
                onResetAllScores={handleResetAllGroupScores}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Best 2nd Place Table */}
        {activeTab === 'bestSeconds' && (
          <div className="max-w-7xl mx-auto px-4">
            <BestSecondTable bestSeconds={bestSeconds} />
          </div>
        )}

        {/* Tab 4: Knockout Stage */}
        {activeTab === 'knockout' && (
          <div className="max-w-7xl mx-auto px-4">
            <KnockoutBracket
              knockoutMatches={knockoutDetails.knockoutMatches}
              teams={teams}
              qualifiedTeams={knockoutDetails.qualifiedTeams}
              onKnockoutScoreChange={handleKnockoutScoreChange}
              championTeam={championTeam}
              onSimulateKnockout={handleSimulateKnockout}
            />
          </div>
        )}

      </main>

      {/* Champion Modal */}
      {showWinnerModal && (
        <WinnerModal
          championTeam={championTeam || null}
          onClose={() => setShowWinnerModal(false)}
          onReset={handleResetTournament}
        />
      )}

      {/* Save & Continue Manager Modal */}
      <SaveManagerModal
        isOpen={isSaveManagerOpen}
        onClose={() => setIsSaveManagerOpen(false)}
        teams={teams}
        groups={groups}
        matches={matches}
        knockoutMatches={knockoutMatches}
        onLoadData={handleLoadData}
        lastSavedAt={lastSavedAt}
        saveSlots={saveSlots}
        onSaveSlot={handleSaveSlot}
        onLoadSlot={handleLoadSlot}
        onDeleteSlot={handleDeleteSlot}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Grup & Eleme Turnuva Puan Tablosu Sistemi • Otomatik Rövanş ve Averaj Hesaplayıcı</p>
      </footer>

    </div>
  );
}
