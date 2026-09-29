import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return Response.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 });
    }

    // In production: integrate with email service (Resend, SendGrid, etc.)
    console.log('[Contact Form]', { name, email, message: message.slice(0, 100) });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
