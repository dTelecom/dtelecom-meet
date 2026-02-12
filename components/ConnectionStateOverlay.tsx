"use client";

import { useConnectionState } from "@dtelecom/components-react";
import { ConnectionState } from "@dtelecom/livekit-client";

export default function ConnectionStateOverlay() {
  const state = useConnectionState();

  if (state === ConnectionState.Reconnecting) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-lg font-medium">Reconnecting...</p>
        </div>
      </div>
    );
  }

  if (state === ConnectionState.Connecting) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-lg font-medium">Connecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
