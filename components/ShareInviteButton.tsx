"use client";

import { useState, useCallback } from "react";

export default function ShareInviteButton({
  roomName,
}: {
  roomName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}/prejoin?room=${encodeURIComponent(roomName)}&role=guest`;
    navigator.clipboard.writeText(url);
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
