import { NextRequest, NextResponse } from "next/server";
import { getRoomCount } from "@/lib/participant-count";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  if (!room) {
    return NextResponse.json(
      { error: "room query parameter is required" },
      { status: 400 },
    );
  }
  return NextResponse.json({ room, count: getRoomCount(room) });
}
