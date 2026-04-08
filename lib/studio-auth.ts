export const STUDIO_SESSION_COOKIE = "resume_studio_session";

const STUDIO_SESSION_SALT = "resume-studio-owner-session";

function getHexDigest(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function hashValue(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return getHexDigest(digest);
}

export function getStudioOwnerPassword(): string {
  return process.env.RESUME_OWNER_PASSWORD?.trim() ?? "";
}

export async function createStudioSessionToken(
  password: string,
): Promise<string> {
  return hashValue(`${password}:${STUDIO_SESSION_SALT}`);
}

export async function getExpectedStudioSessionToken(): Promise<string | null> {
  const ownerPassword = getStudioOwnerPassword();

  if (!ownerPassword) {
    return null;
  }

  return createStudioSessionToken(ownerPassword);
}

export async function isStudioSessionTokenValid(
  token?: string | null,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expectedToken = await getExpectedStudioSessionToken();

  return expectedToken !== null && token === expectedToken;
}
