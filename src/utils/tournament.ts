import { Group, GroupId, KnockoutMatchData, Match, Team, TeamStats } from '../types';

export const DEFAULT_TEAM_NAMES = [
  'Kırmızı Fırtına',
  'Mavi Şimşekler',
  'Yeşil Kaplanlar',
  'Sarı Kanaryalar',
  'Kara Kartallar',
  'Turuncu Aslanlar',
  'Mor Yıldızlar',
  'Bordo Kasırga',
  'Lacivert Güneş',
];

export const TEAM_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#eab308', // Yellow
  '#1e293b', // Dark Slate
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#881337', // Crimson/Bordo
  '#1e40af', // Navy Blue
];

/**
 * Creates 9 initial team objects
 */
export function createInitialTeams(names: string[] = DEFAULT_TEAM_NAMES): Team[] {
  return names.slice(0, 9).map((name, index) => ({
    id: `team-${index + 1}`,
    name: name.trim() || `Takım ${index + 1}`,
    shortName: (name.trim() || `T${index + 1}`).substring(0, 3).toUpperCase(),
    color: TEAM_COLORS[index % TEAM_COLORS.length],
  }));
}

/**
 * Randomly shuffles 9 teams into 3 groups of 3 teams each
 */
export function shuffleTeamsIntoGroups(teams: Team[]): { teams: Team[]; groups: Group[] } {
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  
  const updatedTeams: Team[] = [];
  const groups: Group[] = [
    { id: 'A', name: 'A Grubu', teamIds: [] },
    { id: 'B', name: 'B Grubu', teamIds: [] },
    { id: 'C', name: 'C Grubu', teamIds: [] },
  ];

  shuffled.forEach((team, index) => {
    const groupIndex = Math.floor(index / 3);
    const groupId = (groupIndex === 0 ? 'A' : groupIndex === 1 ? 'B' : 'C') as GroupId;
    
    const updatedTeam = { ...team, groupId };
    updatedTeams.push(updatedTeam);
    groups[groupIndex].teamIds.push(updatedTeam.id);
  });

  return { teams: updatedTeams, groups };
}

/**
 * Generates double round-robin matches for 3 groups of 3 teams (6 matches per group, 18 total)
 */
export function generateGroupMatches(groups: Group[]): Match[] {
  const matches: Match[] = [];
  let matchCounter = 1;

  groups.forEach((group) => {
    const ids = group.teamIds;
    if (ids.length < 3) return;

    const [t1, t2, t3] = ids;

    // Double Round Robin Fixtures (6 matches per group)
    // First Half (Round 1-3)
    const fixtures = [
      { home: t1, away: t2, round: 1 },
      { home: t2, away: t3, round: 2 },
      { home: t3, away: t1, round: 3 },
      // Second Half (Round 4-6 - Rövanş)
      { home: t2, away: t1, round: 4 },
      { home: t3, away: t2, round: 5 },
      { home: t1, away: t3, round: 6 },
    ];

    fixtures.forEach((fix) => {
      matches.push({
        id: `match-g${group.id}-${fix.round}`,
        groupId: group.id,
        stage: 'group',
        homeTeamId: fix.home,
        awayTeamId: fix.away,
        homeScore: null,
        awayScore: null,
        round: fix.round,
        isPlayed: false,
        matchNumber: matchCounter++,
      });
    });
  });

  return matches;
}

/**
 * Calculates group standings for a single group
 */
export function calculateGroupStandings(
  groupId: GroupId,
  teams: Team[],
  matches: Match[]
): TeamStats[] {
  const groupTeams = teams.filter((t) => t.groupId === groupId);
  const groupMatches = matches.filter(
    (m) => m.groupId === groupId && m.stage === 'group' && m.isPlayed && m.homeScore !== null && m.awayScore !== null
  );

  const statsMap: Record<string, TeamStats> = {};

  groupTeams.forEach((t) => {
    statsMap[t.id] = {
      teamId: t.id,
      teamName: t.name,
      shortName: t.shortName,
      color: t.color,
      groupId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      rank: 0,
      isQualified: false,
    };
  });

  groupMatches.forEach((m) => {
    const home = statsMap[m.homeTeamId];
    const away = statsMap[m.awayTeamId];
    if (!home || !away) return;

    const hScore = m.homeScore!;
    const aScore = m.awayScore!;

    home.played += 1;
    away.played += 1;

    home.goalsFor += hScore;
    home.goalsAgainst += aScore;
    away.goalsFor += aScore;
    away.goalsAgainst += hScore;

    if (hScore > aScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (hScore < aScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      home.points += 1;
      away.drawn += 1;
      away.points += 1;
    }
  });

  // Calculate Goal Difference
  Object.values(statsMap).forEach((st) => {
    st.goalDifference = st.goalsFor - st.goalsAgainst;
  });

  // Sort standings: Points -> Goal Difference -> Goals For -> Alphabetical Name
  const sorted = Object.values(statsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, 'tr');
  });

  // Assign Ranks
  sorted.forEach((st, idx) => {
    st.rank = idx + 1;
  });

  return sorted;
}

/**
 * Calculates Best 2nd Place Team across Groups A, B, C
 */
export function calculateBestSeconds(allStandings: Record<GroupId, TeamStats[]>): TeamStats[] {
  const seconds: TeamStats[] = [];

  (['A', 'B', 'C'] as GroupId[]).forEach((gid) => {
    const gStandings = allStandings[gid];
    if (gStandings && gStandings.length >= 2) {
      seconds.push({ ...gStandings[1] }); // 2nd placed team
    }
  });

  // Sort 2nd place teams: Points -> Goal Difference -> Goals For -> Alphabetical
  seconds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, 'tr');
  });

  return seconds;
}

/**
 * Initial empty Knockout matches setup (2 Semi-Finals, 1 Final, 1 3rd-Place)
 */
export function createInitialKnockoutMatches(): KnockoutMatchData[] {
  return [
    {
      id: 'sf-1',
      title: 'Yarı Final 1',
      stage: 'semi-final',
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      winnerId: null,
      isPlayed: false,
      slotHomeDescription: '1. Yarı Finalist (Grup Lideri)',
      slotAwayDescription: 'En İyi 2. Takım',
    },
    {
      id: 'sf-2',
      title: 'Yarı Final 2',
      stage: 'semi-final',
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      winnerId: null,
      isPlayed: false,
      slotHomeDescription: '2. Yarı Finalist (Grup Lideri)',
      slotAwayDescription: '3. Yarı Finalist (Grup Lideri)',
    },
    {
      id: 'third-place',
      title: 'Üçüncülük Maçı',
      stage: 'third-place',
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      winnerId: null,
      isPlayed: false,
      slotHomeDescription: 'Yarı Final 1 Mağlubu',
      slotAwayDescription: 'Yarı Final 2 Mağlubu',
    },
    {
      id: 'final',
      title: 'ŞAMPİYONLUK FİNALİ',
      stage: 'final',
      homeTeamId: null,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      winnerId: null,
      isPlayed: false,
      slotHomeDescription: 'Yarı Final 1 Galibi',
      slotAwayDescription: 'Yarı Final 2 Galibi',
    },
  ];
}

/**
 * Automatically updates Knockout slots based on group winners & best second team
 */
export function updateKnockoutSlots(
  allStandings: Record<GroupId, TeamStats[]>,
  existingKnockouts: KnockoutMatchData[]
): {
  knockoutMatches: KnockoutMatchData[];
  qualifiedTeams: TeamStats[];
  bestSecondTeam: TeamStats | null;
  groupWinners: TeamStats[];
} {
  const groupWinners: TeamStats[] = [];
  (['A', 'B', 'C'] as GroupId[]).forEach((gid) => {
    const groupStandings = allStandings[gid];
    if (groupStandings && groupStandings.length > 0) {
      groupWinners.push({ ...groupStandings[0] });
    }
  });

  // Sort group winners by performance (Points -> GD -> GF) to seed semi-finals
  groupWinners.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName, 'tr');
  });

  const bestSeconds = calculateBestSeconds(allStandings);
  const bestSecondTeam = bestSeconds.length > 0 ? bestSeconds[0] : null;

  // Qualified teams list (3 winners + 1 best second)
  const qualifiedTeams: TeamStats[] = [];
  groupWinners.forEach((w) => {
    w.isQualified = true;
    w.qualificationReason = `${w.groupId} Grubu Lideri`;
    qualifiedTeams.push(w);
  });

  if (bestSecondTeam) {
    bestSecondTeam.isQualified = true;
    bestSecondTeam.qualificationReason = `En İyi 2. Takım (${bestSecondTeam.groupId} Grubu)`;
    qualifiedTeams.push(bestSecondTeam);
  }

  // Update Semi Final slots
  const updatedKnockouts = existingKnockouts.map((km) => {
    const copy = { ...km };

    if (km.id === 'sf-1') {
      // Best Group Winner vs Best 2nd Place Team
      copy.homeTeamId = groupWinners[0]?.teamId || null;
      copy.awayTeamId = bestSecondTeam?.teamId || null;
      copy.slotHomeDescription = groupWinners[0]
        ? `${groupWinners[0].teamName} (${groupWinners[0].groupId} Grubu 1.si)`
        : 'En İyi Grup Lideri';
      copy.slotAwayDescription = bestSecondTeam
        ? `${bestSecondTeam.teamName} (En İyi 2.)`
        : 'En İyi 2. Takım';
    } else if (km.id === 'sf-2') {
      // 2nd Best Winner vs 3rd Best Winner
      copy.homeTeamId = groupWinners[1]?.teamId || null;
      copy.awayTeamId = groupWinners[2]?.teamId || null;
      copy.slotHomeDescription = groupWinners[1]
        ? `${groupWinners[1].teamName} (${groupWinners[1].groupId} Grubu 1.si)`
        : '2. En İyi Lider';
      copy.slotAwayDescription = groupWinners[2]
        ? `${groupWinners[2].teamName} (${groupWinners[2].groupId} Grubu 1.si)`
        : '3. En İyi Lider';
    }

    return copy;
  });

  // Process Semi Final winners/losers into Final and 3rd Place Match
  const sf1 = updatedKnockouts.find((m) => m.id === 'sf-1');
  const sf2 = updatedKnockouts.find((m) => m.id === 'sf-2');

  const finalMatch = updatedKnockouts.find((m) => m.id === 'final');
  const thirdMatch = updatedKnockouts.find((m) => m.id === 'third-place');

  if (sf1 && sf2) {
    if (sf1.isPlayed && sf1.winnerId) {
      const sf1LoserId = sf1.winnerId === sf1.homeTeamId ? sf1.awayTeamId : sf1.homeTeamId;
      if (finalMatch) finalMatch.homeTeamId = sf1.winnerId;
      if (thirdMatch) thirdMatch.homeTeamId = sf1LoserId;
    }

    if (sf2.isPlayed && sf2.winnerId) {
      const sf2LoserId = sf2.winnerId === sf2.homeTeamId ? sf2.awayTeamId : sf2.homeTeamId;
      if (finalMatch) finalMatch.awayTeamId = sf2.winnerId;
      if (thirdMatch) thirdMatch.awayTeamId = sf2LoserId;
    }
  }

  return {
    knockoutMatches: updatedKnockouts,
    qualifiedTeams,
    bestSecondTeam,
    groupWinners,
  };
}

/**
 * Generates sample data with populated team names & played group matches for instant demoing
 */
export function generateSampleTournamentData(): {
  teams: Team[];
  groups: Group[];
  matches: Match[];
} {
  const sampleNames = [
    'Anadolu Kartalları',
    'Boğaziçi Aslanları',
    'Ege Fırtınası',
    'Karadeniz Kaplanları',
    'Toros Kaplanları',
    'Akdeniz Rüzgarı',
    'Marmara Yıldızları',
    'Kafkas Güneşi',
    'Güneydoğu Şimşekleri',
  ];

  const teams = createInitialTeams(sampleNames);
  const { teams: groupedTeams, groups } = shuffleTeamsIntoGroups(teams);
  const matches = generateGroupMatches(groups);

  // Fill in realistic group match scores
  const sampleScores = [
    [2, 1], [0, 0], [3, 1], [1, 2], [2, 2], [1, 0],
    [3, 0], [1, 1], [2, 3], [0, 1], [4, 2], [2, 0],
    [1, 0], [2, 1], [3, 3], [1, 2], [0, 2], [2, 1]
  ];

  matches.forEach((m, idx) => {
    const pair = sampleScores[idx % sampleScores.length];
    m.homeScore = pair[0];
    m.awayScore = pair[1];
    m.isPlayed = true;
  });

  return { teams: groupedTeams, groups, matches };
}
