import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/admin'];
const AUTH_PAGES = ['/login'];

function hasValidSessionShape(token: string | undefined): boolean {
  if (!token) return false;
  // Checagem leve (sem jsonwebtoken, que não roda bem no Edge):
  // só verifica estrutura do JWT e expiração. A verificação real
  // da assinatura acontece nas API routes (Node runtime).
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );
    if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p));

  const token = req.cookies.get('admin_token')?.value;
  const isAuth = hasValidSessionShape(token);

  if (isProtected && !isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthPage && isAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
