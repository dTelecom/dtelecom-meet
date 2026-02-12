export type Role = "host" | "guest";

export interface ParticipantMeta {
  role: Role;
}

export interface JoinResponse {
  token: string;
  wsUrl: string;
}

export interface RoomInfo {
  name: string;
  sid: string;
  numParticipants: number;
  metadata: string;
}

export interface ParticipantInfo {
  identity: string;
  name: string;
  metadata: string;
  joinedAt: number;
}
