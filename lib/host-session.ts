"use client";

import { useSyncExternalStore } from "react";

/**
 * The host key stays in this browser tab (sessionStorage). It arrives either from /api/create-room
 * or from a host link `/prejoin?room=<room>#host=<key>`. The #fragment is never sent to a server;
 * it is moved into sessionStorage and removed from the address bar.
 */

const storageKey = (room: string) => `hostKey:${room}`;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveHostKey(room: string, key: string): void {
  sessionStorage.setItem(storageKey(room), key);
  notify();
}

export function getHostKey(room: string): string | null {
  return sessionStorage.getItem(storageKey(room));
}

export function forgetHostKey(room: string): void {
  sessionStorage.removeItem(storageKey(room));
  notify();
}

function keyFromUrl(): string | null {
  const match = window.location.hash.match(/^#host=([^&]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Takes `#host=<key>` from the address bar, if present, and keeps it for this room. */
export function takeHostKeyFromUrl(room: string): void {
  const key = keyFromUrl();
  if (!key) return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
  saveHostKey(room, key);
}

/**
 * The room's host key in this tab: from a host link's #host= or from sessionStorage, null when
 * there is none, undefined while rendering on the server.
 */
export function useHostKey(room: string): string | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => keyFromUrl() ?? getHostKey(room),
    () => undefined,
  );
}

export function hostLink(room: string, key: string): string {
  return `${window.location.origin}/prejoin?room=${encodeURIComponent(room)}#host=${encodeURIComponent(key)}`;
}

export function inviteLink(room: string): string {
  return `${window.location.origin}/prejoin?room=${encodeURIComponent(room)}`;
}
