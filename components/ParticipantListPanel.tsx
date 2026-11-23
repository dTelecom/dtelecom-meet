"use client";

import {
  useParticipants,
  useLocalParticipant,
} from "@dtelecom/components-react";
import { Track } from "@dtelecom/livekit-client";
import type { ParticipantMeta } from "@/lib/types";
import { kickParticipant, muteParticipant } from "@/lib/api";
import { getHostKey, hostLink } from "@/lib/host-session";
import { useState } from "react";

interface Props {
  roomName: string;
  onClose: () => void;
}

export default function ParticipantListPanel({ roomName, onClose }: Props) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();

  let localMeta: ParticipantMeta = { role: "guest" };
  try {
    localMeta = JSON.parse(localParticipant.metadata || "{}");
  } catch {}
  // The server put the role into this participant's token metadata.
  const isHost = localMeta.role === "host";
  const [hostKey] = useState(() => getHostKey(roomName));
  const [copied, setCopied] = useState(false);

  function requireHostKey(): string {
    if (!hostKey) throw new Error("Only the host can do this");
    return hostKey;
  }

  async function handleKick(identity: string) {
    if (!confirm(`Remove ${identity} from the room?`)) return;
    try {
      await kickParticipant(roomName, identity, requireHostKey());
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to kick participant");
    }
  }

  async function handleMute(identity: string, trackSid: string) {
    try {
      await muteParticipant(roomName, identity, trackSid, requireHostKey());
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to mute participant");
    }
  }

  return (
    <div className="flex w-72 flex-col border-l border-white/10 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">
          Participants ({participants.length})
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>
      {isHost && hostKey && (
        <div className="border-b border-white/10 px-4 py-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(hostLink(roomName, hostKey));
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="w-full rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
          >
            {copied ? "Copied" : "Copy host link"}
          </button>
          <p className="mt-1.5 text-[11px] text-neutral-500">
            Opens this room as host on another device, for 24 hours. Anyone with it is a host.
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {participants.map((p) => {
          let meta: ParticipantMeta = { role: "guest" };
          try {
            meta = JSON.parse(p.metadata || "{}");
          } catch {}

          const audioTrack = p.getTrack(Track.Source.Microphone);
          const isLocal = p.identity === localParticipant.identity;

          return (
            <div
              key={p.identity}
              className="flex items-center justify-between border-b border-white/5 px-4 py-2.5"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate text-sm text-white">
                  {p.name || p.identity}
                </span>
                {isLocal && (
                  <span className="text-xs text-neutral-500">(You)</span>
                )}
                {meta.role === "host" && (
                  <span className="rounded bg-blue-600/20 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                    Host
                  </span>
                )}
              </div>
              {isHost && !isLocal && (
                <div className="flex gap-1">
                  {audioTrack && !audioTrack.isMuted && (
                    <button
                      onClick={() => handleMute(p.identity, audioTrack.trackSid)}
                      className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-white/10 hover:text-white"
                      title="Mute"
                    >
                      Mute
                    </button>
                  )}
                  <button
                    onClick={() => handleKick(p.identity)}
                    className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
