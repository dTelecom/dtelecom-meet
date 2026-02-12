import { getRoomService } from "@/lib/room-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { room, identity, trackSid, callerRole } = await req.json();

  if (!room || !identity || !trackSid || !callerRole) {
    return NextResponse.json(
      { error: "room, identity, trackSid, and callerRole are required" },
      { status: 400 },
    );
  }

  // Verify the caller is a host.
  // Note: In a production app you should verify this from the caller's JWT
  // on the server side rather than trusting the client-provided role.
  // For this example, the role was set during token creation and is trusted.
  if (callerRole !== "host") {
    return NextResponse.json(
      { error: "Only hosts can mute participants" },
      { status: 403 },
    );
  }

  try {
    const client = await getRoomService();
    await client.mutePublishedTrack(room, identity, trackSid, true);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to mute participant";
    console.error("[mute] ERROR:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
