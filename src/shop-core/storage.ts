// localStorage can throw (private mode, blocked storage, sandboxed iframes); never let it break the shop.

export function readJSON(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the cart simply lives for this page view only.
  }
}
