import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

export function getSessionSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET wajib diisi dengan minimal 32 karakter acak.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  role: string;
  sessionId: string;
  mustChangePassword?: boolean;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.userId !== "string" || !payload.userId ||
        typeof payload.sessionId !== "string" || !payload.sessionId ||
        typeof payload.role !== "string" ||
        typeof payload.exp !== "number" ||
        (payload.mustChangePassword !== undefined && typeof payload.mustChangePassword !== "boolean")) {
      return null;
    }
    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
      role: payload.role,
      mustChangePassword: payload.mustChangePassword,
    };
  } catch {
    return null;
  }
}
