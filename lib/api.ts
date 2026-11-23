import type { JoinResponse } from "./types";

async function post<T>(url: string, body: unknown, fallbackError: string): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || fallbackError);
  }
  return res.json();
}

/** Creates a meeting: the server picks the room name and returns its host key. */
export function createRoom(title: string): Promise<{ room: string; hostKey: string }> {
  return post("/api/create-room", { title }, "Failed to create the meeting");
}

/** Joins as host when `hostKey` is valid for the room, otherwise as a guest. */
export function joinRoom(room: string, identity: string, hostKey?: string | null): Promise<JoinResponse> {
  return post("/api/join", { room, identity, hostKey: hostKey ?? undefined }, "Failed to join room");
}

export async function kickParticipant(room: string, identity: string, hostKey: string): Promise<void> {
  await post("/api/kick", { room, identity, hostKey }, "Failed to remove participant");
}

/** People in the room right now, or null when the count is unavailable. */
export async function getRoomCount(room: string): Promise<number | null> {
  const res = await fetch(`/api/room-count?room=${encodeURIComponent(room)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.count === "number" ? data.count : null;
}

export async function muteParticipant(room: string, identity: string, trackSid: string, hostKey: string): Promise<void> {
  await post("/api/mute", { room, identity, trackSid, hostKey }, "Failed to mute participant");
}
