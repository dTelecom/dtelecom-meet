import { NextRequest, NextResponse } from "next/server";

// Note: In dTelecom's decentralized network, ListParticipants is a local-only
// read that returns participants from a single node's in-memory store. It does
// not aggregate across nodes. This endpoint is not used by the conference app.
export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  if (!room) {
    return NextResponse.json({ error: "room is required" }, { status: 400 });
  }

  return NextResponse.json([]);
}
