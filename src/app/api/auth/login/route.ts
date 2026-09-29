import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin credentials from environment
const ADMIN_USER = process.env.ADMIN_USERNAME || 'kz';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const ADMIN_PLAIN = process.env.ADMIN_PASSWORD || 'kz24142109';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 400 });
    }

    if (username !== ADMIN_USER) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Support both hashed env and plain env fallback
    let valid = false;
    if (ADMIN_HASH) {
      valid = await bcrypt.compare(password, ADMIN_HASH);
    } else {
      valid = password === ADMIN_PLAIN;
    }

    if (!valid) {
      return Response.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = signToken({ username, role: 'admin' });

    const response = Response.json({ success: true });
    // Set httpOnly cookie
    const headers = new Headers(response.headers);
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    headers.set(
      'Set-Cookie',
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax${secure}`
    );
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch {
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE() {
  const headers = new Headers();
  headers.set(
    'Set-Cookie',
    'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  );
  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}
