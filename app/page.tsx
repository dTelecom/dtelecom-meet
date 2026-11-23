"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createRoom } from "@/lib/api";
import { saveHostKey } from "@/lib/host-session";

/** A room name, or an invite or host link pasted whole. */
function parseRoomInput(input: string): { room: string; hash: string } {
  try {
    const url = new URL(input);
    const room = url.searchParams.get("room");
    if (room) return { room, hash: url.hash };
  } catch {}
  return { room: input, hash: "" };
}

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [identity, setIdentity] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Create: the server picks the room name and returns the host key, which this tab keeps.
  async function handleCreate() {
    if (!roomName.trim() || !identity.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      const { room, hostKey } = await createRoom(roomName.trim());
      saveHostKey(room, hostKey);
      router.push(`/prejoin?${new URLSearchParams({ room, identity: identity.trim() })}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create the meeting");
      setLoading(false);
    }
  }

  // Join: an existing room by name or link. The join page reads a host link's #host=.
  function handleJoin() {
    if (!roomName.trim() || !identity.trim()) return;
    const { room, hash } = parseRoomInput(roomName.trim());
    router.push(`/prejoin?${new URLSearchParams({ room, identity: identity.trim() })}${hash}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold text-white">dTelecom Meet</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Start or join a video conference
        </p>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Meeting name, or a room link to join"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Your name"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCreate}
            disabled={!roomName.trim() || !identity.trim() || loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
          <button
            onClick={handleJoin}
            disabled={!roomName.trim() || !identity.trim()}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
