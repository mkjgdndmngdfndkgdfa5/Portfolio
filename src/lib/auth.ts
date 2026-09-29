import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET || 'kz-portfolio-super-secret-2026';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, SECRET) as object;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  const cookie = req.cookies.get('admin_token');
  return cookie?.value ?? null;
}

export function requireAuth(req: NextRequest): { ok: true } | Response {
  const token = getTokenFromRequest(req);
  if (!token) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return Response.json({ error: 'Token inválido' }, { status: 401 });
  }
  return { ok: true };
}
