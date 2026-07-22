// types/submission.ts
import { BaseEntity, ID } from './common';

export interface Submission extends BaseEntity {
  userId: ID;
  problemId: ID;
  code: string;
  language: Language;
  status: SubmissionStatus;
  executionTime: number;
  memoryUsed: number;
  testResults: TestResult[];
  contestId?: ID;
  error?: string;
}

export enum Language {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  TYPESCRIPT = 'typescript',
  GO = 'go',
  RUST = 'rust'
}

export enum SubmissionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
  RUNTIME_ERROR = 'runtime_error',
  COMPILATION_ERROR = 'compilation_error',
  QUEUED = 'queued'
}

export interface TestResult {
  testCase: string;
  passed: boolean;
  actual: string;
  expected: string;
  executionTime: number;
  memoryUsed: number;
}

export interface SubmissionResult {
  submission: Submission;
  passed: boolean;
  totalTests: number;
  passedTests: number;
  score: number;
}

export interface CodeExecutionRequest {
  code: string;
  language: Language;
  input?: string;
  problemId?: ID;
}

export interface CodeExecutionResponse {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  status: 'success' | 'error';
}

export interface SubmissionState {
  submissions: Submission[];
  currentSubmission: Submission | null;
  isLoading: boolean;
  error: string | null;
  executionResult: CodeExecutionResponse | null;
}