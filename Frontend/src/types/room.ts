// types/room.ts
import type { BaseEntity, ID } from './common';
import type { User } from './user';
import type { Problem } from './problem';

export interface Room extends BaseEntity {
  name: string;
  code: string;
  host: ID;
  participants: RoomParticipant[];
  problemId?: ID;
  problem?: Problem;
  status: RoomStatus;
  settings: RoomSettings;
  startedAt?: Date;
  endedAt?: Date;
  recordingUrl?: string;
}

export interface RoomParticipant {
  userId: ID;
  user: User;
  role: ParticipantRole;
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
  connectionStatus: ConnectionStatus;
}

export enum ParticipantRole {
  HOST = 'host',
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate',
  OBSERVER = 'observer'
}

export enum RoomStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended'
}

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting'
}

export interface RoomSettings {
  allowChat: boolean;
  allowVideo: boolean;
  allowAudio: boolean;
  allowScreenShare: boolean;
  autoRecord: boolean;
  maxParticipants: number;
  language: string;
  theme: string;
}

export interface ChatMessage {
  id: ID;
  roomId: ID;
  userId: ID;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system' | 'notification';
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: ID;
  type: 'image' | 'file' | 'code';
  url: string;
  name: string;
  size: number;
}

export interface RoomState {
  currentRoom: Room | null;
  participants: RoomParticipant[];
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isRecording: boolean;
}