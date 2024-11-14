export interface VoteMetadata {
  id: string;
  title: string;
  createdAt: Date;
  maxVotesPerUser: number;
  teams: string[];
}

export interface Vote {
  metadata: VoteMetadata;
  votes: Record<string, number>;
  voters: Record<string, string[]>; // IP/用户 -> 已投票的队伍
} 