import bcrypt from 'bcryptjs'
import { jwtVerify, SignJWT } from 'jose'
import { ADMIN_SESSION_COOKIE } from './constants'

const SESSION_DURATION_SECONDS = 8 * 60 * 60

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

interface SessionPayload {
  [key: string]: unknown
  sub: string
  username: string
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.sub !== 'string' || typeof payload.username !== 'string') {
      return null
    }
    return { sub: payload.sub, username: payload.username }
  } catch {
    return null
  }
}

export { ADMIN_SESSION_COOKIE, SESSION_DURATION_SECONDS }
