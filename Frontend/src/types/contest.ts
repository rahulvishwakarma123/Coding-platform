// types/contest.ts
import type { BaseEntity, ID } from './common';
import type { Problem } from './problem';
import type { User } from './user';

export interface Contest extends BaseEntity {
  title: string;
  description: string;
  problems: ContestProblem[];
  startTime: Date;
  endTime: Date;
  duration: number;
  status: ContestStatus;
  participants: ContestParticipant[];
  rules: ContestRules;
  prizes?: ContestPrize[];
  createdBy: ID;
  maxParticipants?: number;
  isPrivate: boolean;
  password?: string;
}

export interface ContestProblem {
  problemId: ID;
  problem: Problem;
  points: number;
  order: number;
}

export interface ContestParticipant {
  userId: ID;
  user: User;
  score: number;
  penalties: number;
  submissions: ContestSubmission[];
  joinedAt: Date;
  rank?: number;
}

export interface ContestSubmission {
  problemId: ID;
  submissionId: ID;
  status: string;
  points: number;
  time: Date;
  attempts: number;
}

export interface ContestRules {
  penaltyTime: number;
  maxAttempts: number;
  scoringType: 'standard' | 'dynamic';
  allowPartialScoring: boolean;
  allowDebugging: boolean;
}

export interface ContestPrize {
  rank: number;
  description: string;
  value?: number;
}

export enum ContestStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ContestState {
  list: Contest[];
  currentContest: Contest | null;
  leaderboard: ContestParticipant[];
  isLoading: boolean;
  error: string | null;
  registeredContests: ID[];
}
