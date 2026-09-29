import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/ogg',
];

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Arquivo muito grande (máx 50MB)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Produção (Vercel): usa Vercel Blob (filesystem da Vercel é somente leitura).
    // Local: salva em public/uploads.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(`uploads/${safeName}`, file, {
        access: 'public',
        contentType: file.type,
      });
      return Response.json({ url: blob.url });
    }

    const { writeFile, mkdir } = await import('fs/promises');
    const path = (await import('path')).default;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, safeName), Buffer.from(bytes));

    return Response.json({ url: `/uploads/${safeName}` });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Erro ao fazer upload' }, { status: 500 });
  }
}
