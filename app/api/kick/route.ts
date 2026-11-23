import { getCloud } from "@/lib/cloud";
import { verifyHostKey } from "@/lib/host-key";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { room, identity, hostKey } = await req.json();

  if (!room || !identity) {
    return NextResponse.json(
      { error: "room and identity are required" },
      { status: 400 },
    );
  }

  // Only the holder of the room's host key may remove participants.
  if (!verifyHostKey(room, hostKey)) {
    return NextResponse.json(
      { error: "Only the host can remove participants" },
      { status: 403 },
    );
  }

  try {
    // Disconnects the participant. They can join again with a new token from /api/join.
    await getCloud().roomService().removeParticipant(room, identity);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to remove participant";
    console.error("[kick] ERROR:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
