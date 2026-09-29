import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(projects);
  } catch {
    return Response.json({ error: 'Erro ao buscar projetos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Auth via cookie
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return Response.json({ error: 'Não autorizado' }, { status: 401 });

  const { verifyToken } = await import('@/lib/auth');
  if (!verifyToken(token)) return Response.json({ error: 'Token inválido' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, imageUrl, videoUrl, link } = body;

    if (!title || !description) {
      return Response.json({ error: 'Título e descrição são obrigatórios' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: { title, description, imageUrl: imageUrl || null, videoUrl: videoUrl || null, link: link || null },
    });
    return Response.json(project, { status: 201 });
  } catch {
    return Response.json({ error: 'Erro ao criar projeto' }, { status: 500 });
  }
}
