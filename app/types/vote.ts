export interface Team {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'vote' | 'comment'; // vote 表示投票消息，comment 表示评论
  teamNames?: string[]; // 投票的队伍名称，仅在 type 为 vote 时有效
}

export interface VoteMetadata {
  id: string;
  title: string;
  createdAt: string;
  maxVotesPerUser: number;
  teams: Team[];
  ended?: boolean; // 添加结束状态
}

export interface Vote {
  metadata: VoteMetadata;
  votes: Record<string, number>;
  voters: Record<string, string[]>;
  messages: Message[]; // 添加消息数组
} 