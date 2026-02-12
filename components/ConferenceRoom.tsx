"use client";

import {
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
} from "@dtelecom/components-react";
import { Track } from "@dtelecom/livekit-client";
import { useState } from "react";
import CustomControlBar from "./CustomControlBar";
import ParticipantListPanel from "./ParticipantListPanel";
import ChatPanel from "./ChatPanel";
import ConnectionStateOverlay from "./ConnectionStateOverlay";

type SidebarTab = "none" | "participants" | "chat";

export default function ConferenceRoom({ roomName }: { roomName: string }) {
  const [sidebar, setSidebar] = useState<SidebarTab>("none");
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <div className="relative flex flex-1 flex-col">
        <ConnectionStateOverlay />
        <div className="flex-1 overflow-hidden p-2" data-lk-theme="default">
          <GridLayout tracks={tracks}>
            <ParticipantTile />
          </GridLayout>
        </div>
        <RoomAudioRenderer />
        <CustomControlBar
          roomName={roomName}
          onToggleParticipants={() =>
            setSidebar((s) => (s === "participants" ? "none" : "participants"))
          }
          onToggleChat={() =>
            setSidebar((s) => (s === "chat" ? "none" : "chat"))
          }
          participantsOpen={sidebar === "participants"}
          chatOpen={sidebar === "chat"}
        />
      </div>

      {sidebar === "participants" && (
        <ParticipantListPanel
          roomName={roomName}
          onClose={() => setSidebar("none")}
        />
      )}
      {sidebar === "chat" && (
        <ChatPanel onClose={() => setSidebar("none")} />
      )}
    </div>
  );
}
