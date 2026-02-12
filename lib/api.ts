import type { JoinResponse } from "./types";

export async function joinRoom(
  room: string,
  identity: string,
  role: string,
): Promise<JoinResponse> {
  const res = await fetch("/api/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room, identity, role }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to join room");
  }
  return res.json();
}

export async function createRoom(
  roomName: string,
  identity: string,
  topic?: string,
): Promise<{ name: string; sid: string }> {
  const res = await fetch("/api/create-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName, identity, topic }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to create room");
  }
  return res.json();
}

export async function kickParticipant(
  room: string,
  identity: string,
  callerRole: string,
): Promise<void> {
  const res = await fetch("/api/kick", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room, identity, callerRole }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to kick participant");
  }
}

export async function muteParticipant(
  room: string,
  identity: string,
  trackSid: string,
  callerRole: string,
): Promise<void> {
  const res = await fetch("/api/mute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room, identity, trackSid, callerRole }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to mute participant");
  }
}

export async function getRoomCount(room: string): Promise<number> {
  const res = await fetch(`/api/room-count?room=${encodeURIComponent(room)}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count ?? 0;
}
