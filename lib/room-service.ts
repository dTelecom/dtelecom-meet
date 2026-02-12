import { AccessToken, RoomServiceClient } from "@dtelecom/server-sdk-js";

let client: RoomServiceClient | null = null;
let clientPromise: Promise<RoomServiceClient> | null = null;

export async function getRoomService(): Promise<RoomServiceClient> {
  if (client) return client;
  if (clientPromise) return clientPromise;

  clientPromise = (async () => {
    const at = new AccessToken(
      process.env.API_KEY!,
      process.env.API_SECRET!,
      { identity: "server" },
    );
    const apiUrl = await at.getApiUrl();
    client = new RoomServiceClient(
      apiUrl,
      process.env.API_KEY!,
      process.env.API_SECRET!,
    );
    return client;
  })();

  return clientPromise;
}
