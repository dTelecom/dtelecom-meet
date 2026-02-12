import { NextResponse } from "next/server";

// Note: In dTelecom's decentralized network, ListRooms is a local-only read
// that returns rooms hosted on a single node. It does not aggregate across
// all nodes. This endpoint is not used by the conference app.
export async function GET() {
  return NextResponse.json([]);
}
