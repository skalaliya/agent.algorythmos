import { env } from './env'

export const API_BASE = env.NEXT_PUBLIC_API_URL;

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : (res.text() as any);
}

export const api = {
  get: (path: string, init?: RequestInit) =>
    fetch(`${API_BASE}${path}`, { cache: 'no-store', ...init }).then(handle),
  post: (path: string, body: any, init?: RequestInit) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
      body: JSON.stringify(body),
      ...init,
    }).then(handle),
};