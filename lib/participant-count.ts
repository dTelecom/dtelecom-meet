// globalThis trick to survive Next.js hot-reload in dev
const g = globalThis as typeof globalThis & {
  __participantCounts?: Map<string, number>;
};
const counts = (g.__participantCounts ??= new Map<string, number>());

export function incrementRoom(name: string): void {
  counts.set(name, (counts.get(name) ?? 0) + 1);
}

export function decrementRoom(name: string): void {
  const current = (counts.get(name) ?? 0) - 1;
  if (current <= 0) {
    counts.delete(name);
  } else {
    counts.set(name, current);
  }
}

export function clearRoom(name: string): void {
  counts.delete(name);
}

export function getRoomCount(name: string): number {
  return counts.get(name) ?? 0;
}
