import { getCloud } from "@/lib/cloud";
import { verifyHostKey } from "@/lib/host-key";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { room, identity, trackSid, hostKey } = await req.json();

  if (!room || !identity || !trackSid) {
    return NextResponse.json(
      { error: "room, identity and trackSid are required" },
      { status: 400 },
    );
  }

  // Only the holder of the room's host key may mute others.
  if (!verifyHostKey(room, hostKey)) {
    return NextResponse.json(
      { error: "Only the host can mute participants" },
      { status: 403 },
    );
  }

  try {
    await getCloud().roomService().mutePublishedTrack(room, identity, trackSid, true);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to mute participant";
    console.error("[mute] ERROR:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
