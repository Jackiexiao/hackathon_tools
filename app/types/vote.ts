export interface Team {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'vote' | 'comment';
  teamNames?: string[];
}

export interface VoteMetadata {
  id: string;
  title: string;
  createdAt: string;
  maxVotesPerUser: number;
  voteDuration: number;
  teams: Team[];
  ended?: boolean;
}

export interface UserVoteRecord {
  votedTeams: string[];
  voteCount: number;
}

export interface Vote {
  metadata: VoteMetadata;
  votes: Record<string, number>;
  voters: Record<string, UserVoteRecord>;
  messages: Message[];
} 