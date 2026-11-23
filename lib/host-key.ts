import crypto from "node:crypto";

/**
 * Stateless host key: proves that whoever holds it created the room, with no database.
 *
 *   key = <expiry, unix seconds>.<b64url(HMAC-SHA256(hostSecret, "host:" + room + ":" + expiry))>
 *
 * - Room names are generated here (`newRoomName`), never chosen by the browser. Rooms exist from
 *   the first join, so if users could pick a name they could mint a host key for a room someone
 *   else is already using.
 * - The key expires after 24 hours (the expiry is inside the signed text, so it cannot be edited).
 * - `hostSecret` is derived from DTELECOM_API_SECRET, so there is nothing extra to configure.
 *   Rotating the API secret invalidates every host link.
 * - The key travels in the link's #fragment, which browsers never send to servers, and the page
 *   keeps it in sessionStorage.
 *
 * Anyone holding the host link is a host: share the invite link with guests instead.
 */

const TTL_SECONDS = 24 * 60 * 60;

function hostSecret(): Buffer {
  const apiSecret = process.env.DTELECOM_API_SECRET;
  if (!apiSecret) throw new Error("DTELECOM_API_SECRET is not set");
  return crypto.createHmac("sha256", apiSecret).update("dtelecom-meet host key v1").digest();
}

function mac(room: string, expiry: number): string {
  return crypto
    .createHmac("sha256", hostSecret())
    .update(`host:${room}:${expiry}`)
    .digest("base64url");
}

/** A room name nobody can predict: a readable prefix from the title plus 12 random hex characters. */
export function newRoomName(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  const random = crypto.randomBytes(6).toString("hex");
  return slug ? `${slug}-${random}` : random;
}

export function signHostKey(room: string, now = Date.now()): string {
  const expiry = Math.floor(now / 1000) + TTL_SECONDS;
  return `${expiry}.${mac(room, expiry)}`;
}

/** True when `key` was issued for `room` by this deployment and has not expired. */
export function verifyHostKey(room: string, key: unknown, now = Date.now()): boolean {
  if (typeof key !== "string" || !room) return false;
  const [expiryText, signature, extra] = key.split(".");
  if (extra !== undefined || !expiryText || !signature || !/^\d{1,12}$/.test(expiryText)) return false;
  const expiry = Number(expiryText);
  if (expiry * 1000 <= now) return false;
  const expected = Buffer.from(mac(room, expiry));
  const given = Buffer.from(signature);
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}
