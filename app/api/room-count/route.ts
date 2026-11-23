import { NextRequest, NextResponse } from "next/server";
import { getCloud } from "@/lib/cloud";

// Everyone on the join page polls this, so answers are kept for a few seconds.
const CACHE_MS = 5_000;
const g = globalThis as typeof globalThis & {
  __roomCounts?: Map<string, { count: number; at: number }>;
};
const cache = (g.__roomCounts ??= new Map());

/** People in the room: its participants across the nodes. */
export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  if (!room) {
    return NextResponse.json(
      { error: "room query parameter is required" },
      { status: 400 },
    );
  }

  const cached = cache.get(room);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return NextResponse.json({ room, count: cached.count });
  }
  try {
    // An empty list when nobody has joined yet.
    const participants = await getCloud().roomService().listParticipants(room);
    const count = participants.length;
    cache.set(room, { count, at: Date.now() });
    return NextResponse.json({ room, count });
  } catch (e: unknown) {
    console.error("[room-count] ERROR:", e);
    return NextResponse.json({ room, count: null });
  }
}
