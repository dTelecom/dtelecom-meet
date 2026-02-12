"use client";

import { ControlBar } from "@dtelecom/components-react";
import ShareInviteButton from "./ShareInviteButton";

interface Props {
  roomName: string;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  participantsOpen: boolean;
  chatOpen: boolean;
}

export default function CustomControlBar({
  roomName,
  onToggleParticipants,
  onToggleChat,
  participantsOpen,
  chatOpen,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-[#141414] px-4 py-2">
      <ControlBar variation="minimal" />
      <div className="mx-2 h-6 w-px bg-white/10" />
      <button
        onClick={onToggleParticipants}
        className={`lk-button ${participantsOpen ? "lk-button-active" : ""}`}
        title="Participants"
      >
        Participants
      </button>
      <button
        onClick={onToggleChat}
        className={`lk-button ${chatOpen ? "lk-button-active" : ""}`}
        title="Chat"
      >
        Chat
      </button>
      <ShareInviteButton roomName={roomName} />
    </div>
  );
}
