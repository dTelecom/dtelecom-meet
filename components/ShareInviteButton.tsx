"use client";

import { useState, useCallback } from "react";
import { inviteLink } from "@/lib/host-session";

export default function ShareInviteButton({
  roomName,
}: {
  roomName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteLink(roomName));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roomName]);

  return (
    <button
      onClick={handleCopy}
      className="lk-button"
      title="Copy invite link"
    >
      {copied ? "Copied!" : "Invite"}
    </button>
  );
}
