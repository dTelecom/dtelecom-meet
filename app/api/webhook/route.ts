import { WebhookReceiver } from "@dtelecom/server-sdk-js";
import { NextRequest, NextResponse } from "next/server";
import {
  incrementRoom,
  decrementRoom,
  clearRoom,
} from "@/lib/participant-count";

const receiver = new WebhookReceiver(
  process.env.API_KEY!,
  process.env.API_SECRET!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const authToken = req.headers.get("Authorization") ?? "";
    const event = await receiver.receive(body, authToken);

    const roomName = event.room?.name;
    if (!roomName) {
      return NextResponse.json({ ok: true });
    }

    switch (event.event) {
      case "participant_joined":
        incrementRoom(roomName);
        console.log("[webhook] participant_joined in", roomName);
        break;
      case "participant_left":
        decrementRoom(roomName);
        console.log("[webhook] participant_left in", roomName);
        break;
      case "room_finished":
        clearRoom(roomName);
        console.log("[webhook] room_finished:", roomName);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[webhook] ERROR:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid webhook" },
      { status: 400 },
    );
  }
}
