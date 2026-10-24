import bcrypt from 'bcryptjs';

/**
 * Passwords: accounts copied from Supabase keep their bcrypt hashes ($2a/$2b).
 * New and changed passwords use PBKDF2-SHA256 via Web Crypto, which is much
 * cheaper in Workers CPU time. A bcrypt hash is upgraded on the next good login.
 * Format: pbkdf2$<iterations>$<salt b64>$<hash b64>
 */
const ITERATIONS = 100_000; // Workers' Web Crypto maximum

const b64 = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0));

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(await pbkdf2(password, salt, ITERATIONS))}`;
}

const sameBytes = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
};

/** { ok, needsUpgrade } — needsUpgrade when the stored hash is bcrypt. */
export async function verifyPassword(stored: string | null | undefined, password: string): Promise<{ ok: boolean; needsUpgrade: boolean }> {
  if (!stored) return { ok: false, needsUpgrade: false };
  if (stored.startsWith('pbkdf2$')) {
    const [, iter, salt, hash] = stored.split('$');
    const got = new Uint8Array(await pbkdf2(password, unb64(salt), Number(iter)));
    return { ok: sameBytes(got, unb64(hash)), needsUpgrade: false };
  }
  if (/^\$2[aby]\$/.test(stored)) {
    return { ok: await bcrypt.compare(password, stored), needsUpgrade: true };
  }
  return { ok: false, needsUpgrade: false };
}

/** SHA-256 hex, for OTP codes (stored hashed, never plain). */
export async function sha256(text: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time compare for hex/ASCII strings (signatures, hashes). */
export function safeEqual(a: string, b: string): boolean {
  return sameBytes(new TextEncoder().encode(a), new TextEncoder().encode(b));
}
