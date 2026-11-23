import { CloudClient } from "@dtelecom/server-sdk-js";

// globalThis trick to survive Next.js hot-reload in dev
const g = globalThis as typeof globalThis & { __cloud?: CloudClient };

/**
 * dTelecom Cloud client. Reads DTELECOM_API_KEY, DTELECOM_API_SECRET and
 * DTELECOM_CLOUD_URL from the environment.
 */
export function getCloud(): CloudClient {
  return (g.__cloud ??= new CloudClient());
}

/** First X-Forwarded-For entry, or undefined so the cloud uses the request IP. */
export function clientIp(headers: Headers): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded) return undefined;
  const ip = forwarded.split(",")[0].trim();
  return ip || undefined;
}
