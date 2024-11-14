export interface Team {
  id: string;
  name: string;
}

export interface VoteMetadata {
  id: string;
  title: string;
  createdAt: string;
  maxVotesPerUser: number;
  teams: Team[];
}

export interface Vote {
  metadata: VoteMetadata;
  votes: Record<string, number>;
  voters: Record<string, string[]>; // IP/用户 -> 已投票的队伍
} 