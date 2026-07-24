// types/common.ts
export type ID = string;
export type Timestamp = string;
export type ISO8601 = string;

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, undefined>; //yaha par maine any hata ke undifined kiya hai 
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}