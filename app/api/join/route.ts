import { NextRequest, NextResponse } from "next/server";
import { getCloud, clientIp } from "@/lib/cloud";
import { verifyHostKey } from "@/lib/host-key";

function getWebhookUrl(): string | undefined {
  if (process.env.WEBHOOK_URL) return process.env.WEBHOOK_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/webhook`;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { room, identity, hostKey } = await req.json();

    if (!room || !identity) {
      return NextResponse.json(
        { error: "room and identity are required" },
        { status: 400 },
      );
    }

    // The server decides the role: only a valid host key for this room makes a host.
    const isHost = verifyHostKey(room, hostKey);
    const role = isHost ? "host" : "guest";
    const webhookUrl = getWebhookUrl();

    // Everyone can publish camera, microphone, screen and chat. The host also gets roomAdmin.
    const { token, wsUrl } = await getCloud().createToken({
      room,
      identity,
      name: identity,
      metadata: JSON.stringify({ role }),
      // A token's lifetime is a hard limit: the participant is removed when it runs out.
      ttl: "6h",
      clientIp: clientIp(req.headers),
      webhookUrls: webhookUrl ? [webhookUrl] : undefined,
      grants: { roomAdmin: isHost },
    });

    return NextResponse.json({ token, wsUrl, role });
  } catch (e: unknown) {
    console.error("[join] ERROR:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 },
    );
  }
}
