import { getRoomService } from "@/lib/room-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { room, identity, callerRole } = await req.json();

  if (!room || !identity || !callerRole) {
    return NextResponse.json(
      { error: "room, identity, and callerRole are required" },
      { status: 400 },
    );
  }

  // Verify the caller is a host.
  // Note: In a production app you should verify this from the caller's JWT
  // on the server side rather than trusting the client-provided role.
  // For this example, the role was set during token creation and is trusted.
  if (callerRole !== "host") {
    return NextResponse.json(
      { error: "Only hosts can kick participants" },
      { status: 403 },
    );
  }

  try {
    const client = await getRoomService();
    await client.removeParticipant(room, identity);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to kick participant";
    console.error("[kick] ERROR:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
