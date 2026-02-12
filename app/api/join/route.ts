import { AccessToken } from "@dtelecom/server-sdk-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { room, identity, role = "guest" } = await req.json();

    if (!room || !identity) {
      return NextResponse.json(
        { error: "room and identity are required" },
        { status: 400 },
      );
    }

    const metadata = JSON.stringify({ role });

    const at = new AccessToken(process.env.API_KEY!, process.env.API_SECRET!, {
      identity,
      name: identity,
      metadata,
      webHookURL: process.env.WEBHOOK_URL,
    });
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = at.toJwt();

    const clientIp = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    const wsUrl = await at.getWsUrl(clientIp);

    return NextResponse.json({ token, wsUrl });
  } catch (e: unknown) {
    console.error("[join] ERROR:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 },
    );
  }
}
