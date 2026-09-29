import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await context.params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) {
    return Response.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await prisma.project.delete({ where: { id: projectId } });
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Projeto não encontrado' }, { status: 404 });
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const projectId = parseInt(id);
  if (isNaN(projectId)) {
    return Response.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return Response.json({ error: 'Não encontrado' }, { status: 404 });
    return Response.json(project);
  } catch {
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}
