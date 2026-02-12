"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [identity, setIdentity] = useState("");

  function handleJoin(asHost: boolean) {
    if (!roomName.trim() || !identity.trim()) return;
    const params = new URLSearchParams({
      room: roomName.trim(),
      identity: identity.trim(),
      role: asHost ? "host" : "guest",
    });
    router.push(`/prejoin?${params}`);
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
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin(false)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Your name"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin(false)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => handleJoin(true)}
            disabled={!roomName.trim() || !identity.trim()}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create Room
          </button>
          <button
            onClick={() => handleJoin(false)}
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
