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

  // DEMO ONLY — NOT SECURE: callerRole comes from the request body, so any
  // client can claim "host". In production, verify the caller's access token
  // with TokenVerifier and take role + room from its claims. See
  // https://docs.dtelecom.org/guides/server-api#host-controls-pattern
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
