"use client";

import { PreJoin } from "@dtelecom/components-react";
import type { LocalUserChoices } from "@dtelecom/components-react";
import "@dtelecom/components-styles";
import { useRouter, useSearchParams } from "next/navigation";
import { joinRoom, getRoomCount } from "@/lib/api";
import { useState, useEffect, Suspense } from "react";

function PreJoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || "";
  const identity = searchParams.get("identity") || "";
  const role = searchParams.get("role") || "guest";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  useEffect(() => {
    if (!room) return;
    getRoomCount(room).then(setParticipantCount);
    const interval = setInterval(() => {
      getRoomCount(room).then(setParticipantCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [room]);

  async function handleSubmit(choices: LocalUserChoices) {
    setError("");
    setLoading(true);
    try {
      const name = choices.username || identity;
      if (!name) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }
      const { token, wsUrl } = await joinRoom(room, name, role);
      sessionStorage.setItem(
        `room:${room}`,
        JSON.stringify({
          token,
          wsUrl,
          audioEnabled: choices.audioEnabled,
          videoEnabled: choices.videoEnabled,
        }),
      );
      router.push(`/room/${encodeURIComponent(room)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to join room");
      setLoading(false);
    }
  }

  if (!room) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold text-white">Joining: {room}</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Preview your camera and microphone before joining
        </p>
        {participantCount !== null && (
          <p className="mt-1 text-sm text-neutral-400">
            {participantCount
              ? `${participantCount} participant${participantCount === 1 ? "" : "s"} in room`
              : "No one in this room yet"}
          </p>
        )}
      </div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      <div data-lk-theme="default">
        <PreJoin
          onSubmit={handleSubmit}
          onError={(err) => setError(err.message)}
          defaults={{
            username: identity,
            videoEnabled: true,
            audioEnabled: true,
          }}
          joinLabel={loading ? "Joining..." : "Join Room"}
        />
      </div>
    </div>
  );
}

export default function PreJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
          Loading...
        </div>
      }
    >
      <PreJoinContent />
    </Suspense>
  );
}
