import { getRoomService } from "@/lib/room-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { roomName, identity, topic } = await req.json();

  if (!roomName || !identity) {
    return NextResponse.json(
      { error: "roomName and identity are required" },
      { status: 400 },
    );
  }

  const client = await getRoomService();

  const room = await client.createRoom({
    name: roomName,
    emptyTimeout: 600,
    maxParticipants: 50,
    metadata: JSON.stringify({ createdBy: identity, topic: topic || "" }),
  });

  return NextResponse.json({ name: room.name, sid: room.sid });
}
