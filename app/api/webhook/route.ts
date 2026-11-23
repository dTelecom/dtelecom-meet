import { WebhookReceiver } from "@dtelecom/server-sdk-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * Example webhook receiver. Each participant's token carries this URL (see /api/join), and the
 * node posts participant and track events here, signed with its key. The receiver checks the
 * signature against the node registry before the event is trusted.
 *
 * This example only logs the events. The participant count on the join page comes from /api/room-count, which asks
 * the nodes directly, so it is right on every serverless instance.
 */
const receiver = new WebhookReceiver();

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const authToken = req.headers.get("Authorization") ?? "";
    const event = await receiver.receive(body, authToken);
    console.log(
      `[webhook] ${event.event} room=${event.room?.name ?? "-"} participant=${event.participant?.identity ?? "-"}`,
    );
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[webhook] ERROR:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid webhook" },
      { status: 400 },
    );
  }
}
