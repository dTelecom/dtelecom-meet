export type Role = "host" | "guest";

export interface ParticipantMeta {
  role: Role;
}

export interface JoinResponse {
  token: string;
  wsUrl: string;
  fallbackUrls?: string[];
  /** Decided by the server from the host key. */
  role: Role;
}
