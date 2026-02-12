"use client";

import { Chat } from "@dtelecom/components-react";

interface Props {
  onClose: () => void;
}

export default function ChatPanel({ onClose }: Props) {
  return (
    <div className="flex w-80 flex-col border-l border-white/10 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Chat</h2>
        <button
          onClick={onClose}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </div>
  );
}
