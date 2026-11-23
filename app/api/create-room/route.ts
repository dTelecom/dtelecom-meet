import { NextRequest, NextResponse } from "next/server";
import { newRoomName, signHostKey } from "@/lib/host-key";

/**
 * Creates a meeting: the server picks an unguessable room name and returns the host key for it.
 * Rooms on dTelecom Cloud exist from the first join, so nothing is created on the network here.
 */
export async function POST(req: NextRequest) {
  const { title } = await req.json().catch(() => ({}));
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const room = newRoomName(title.trim());
  return NextResponse.json({ room, hostKey: signHostKey(room) });
}
