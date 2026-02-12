import { AccessToken } from "@dtelecom/server-sdk-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("[join] parsing request body...");
    const { room, identity, role = "guest" } = await req.json();

    if (!room || !identity) {
      return NextResponse.json(
        { error: "room and identity are required" },
        { status: 400 },
      );
    }

    console.log("[join] creating AccessToken for", identity, "in room", room);
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

    console.log("[join] signing JWT...");
    const token = at.toJwt();
    console.log("[join] JWT signed OK");

    const clientIp = (req.headers.get("x-forwarded-for") ?? "127.0.0.1")
      .split(",")[0]
      .trim();
    console.log("[join] resolving wsUrl for IP:", clientIp);
    const wsUrl = await at.getWsUrl(clientIp);
    console.log("[join] wsUrl resolved:", wsUrl);

    return NextResponse.json({ token, wsUrl });
  } catch (e: unknown) {
    console.error("[join] ERROR:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 },
    );
  }
}
