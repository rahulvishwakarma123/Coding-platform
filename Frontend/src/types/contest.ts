// types/contest.ts
import { BaseEntity, ID } from './common';
import { Problem } from './problem';
import { User } from './user';

export interface Contest extends BaseEntity {
  title: string;
  description: string;
  problems: ContestProblem[];
  startTime: ISO8601;
  endTime: ISO8601;
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
  joinedAt: ISO8601;
  rank?: number;
}

export interface ContestSubmission {
  problemId: ID;
  submissionId: ID;
  status: string;
  points: number;
  time: ISO8601;
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
  CANCELLED = 'cancelled'
}

export interface ContestState {
  list: Contest[];
  currentContest: Contest | null;
  leaderboard: ContestParticipant[];
  isLoading: boolean;
  error: string | null;
  registeredContests: ID[];
}