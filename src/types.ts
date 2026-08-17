export interface Team {
  id: string;
  name: string;
  shortName: string;
  color?: string; // Hex or tailwind color class
  groupId?: 'A' | 'B' | 'C';
}

export type GroupId = 'A' | 'B' | 'C';

export interface Group {
  id: GroupId;
  name: string;
  teamIds: string[];
}

export interface Match {
  id: string;
  groupId?: GroupId; // undefined for knockout matches
  stage: 'group' | 'semi-final' | 'final' | 'third-place';
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  homePenalty?: number | null; // For knockout draws
  awayPenalty?: number | null;
  round: number; // 1 to 6 for double round robin
  isPlayed: boolean;
  dateStr?: string;
  matchNumber?: number;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  shortName: string;
  color?: string;
  groupId: GroupId;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
  isQualified: boolean;
  qualificationReason?: string; // e.g., 'Grup Lideri' or 'En İyi 2.'
}

export interface KnockoutMatchData {
  id: string;
  title: string;
  stage: 'semi-final' | 'final' | 'third-place';
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homePenalty?: number | null;
  awayPenalty?: number | null;
  winnerId: string | null;
  isPlayed: boolean;
  slotHomeDescription?: string; // e.g. "A Grubu 1.si"
  slotAwayDescription?: string; // e.g. "En İyi 2. Takım"
}

export interface SaveSlot {
  id: string;
  name: string;
  savedAt: string;
  playedCount: number;
  totalCount: number;
  data: {
    teams: Team[];
    groups: Group[];
    matches: Match[];
    knockoutMatches: KnockoutMatchData[];
  };
}

export interface TournamentState {
  teams: Team[];
  groups: Group[];
  matches: Match[];
  knockoutMatches: KnockoutMatchData[];
  stage: 'setup' | 'group' | 'knockout' | 'finished';
  winnerTeamId?: string;
}
