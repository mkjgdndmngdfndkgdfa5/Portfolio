'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import s from '../styles.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  link: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: '', description: '', link: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects', { credentials: 'same-origin' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetch('/api/projects', { credentials: 'same-origin' })
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => setProjects([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    setIsVideo(f.type.startsWith('video/'));
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setStatus('error');
      setStatusMsg('Título e descrição são obrigatórios.');
      return;
    }

    setStatus('loading');
    setStatusMsg('');

    try {
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;

      // Upload file if provided
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'same-origin',
          body: fd,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Erro no upload');
        }
        const { url } = await uploadRes.json();
        if (isVideo) videoUrl = url;
        else imageUrl = url;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ ...form, imageUrl, videoUrl }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar projeto');
      }

      setStatus('success');
      setStatusMsg('Projeto criado com sucesso!');
      setForm({ title: '', description: '', link: '' });
      setFile(null);
      setPreview(null);
      loadProjects();

      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 3000);
    } catch (err: unknown) {
      setStatus('error');
      setStatusMsg(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) loadProjects();
    } catch {}
  };

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE', credentials: 'same-origin' });
    router.push('/login');
  };

  return (
    <div className={s.adminPage}>
      <div className="container">
        <div className={s.adminHeader}>
          <div>
            <h1 className={s.adminTitle}>Admin — kz Portfolio</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Gerencie seus projetos abaixo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/" className={s.btnSecondary} style={{ textDecoration: 'none' }}>← Ver Site</Link>
            <button className={s.btnDanger} onClick={handleLogout}>Sair</button>
          </div>
        </div>

        <div className={s.adminGrid}>
          {/* Form */}
          <div className={s.adminCard}>
            <h2 className={s.adminCardTitle}>Adicionar Projeto</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="proj-title">Título *</label>
                <input
                  id="proj-title"
                  className={s.formInput}
                  type="text"
                  placeholder="Nome do projeto"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="proj-desc">Descrição *</label>
                <textarea
                  id="proj-desc"
                  className={s.formTextarea}
                  placeholder="Descreva o projeto, mecânicas, tecnologias usadas..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>

              <div className={s.formGroup}>
                <label className={s.formLabel} htmlFor="proj-link">Link (opcional)</label>
                <input
                  id="proj-link"
                  className={s.formInput}
                  type="url"
                  placeholder="https://roblox.com/games/..."
                  value={form.link}
                  onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                />
              </div>

              {/* Upload zone */}
              <div className={s.formGroup}>
                <label className={s.formLabel}>Mídia (imagem ou vídeo)</label>
                <div
                  className={`${s.uploadZone} ${dragOver ? s.dragOver : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  <div className={s.uploadIcon}>{file ? '✓' : '↑'}</div>
                  <div className={s.uploadText}>
                    {file ? file.name : 'Clique ou arraste um arquivo aqui'}
                  </div>
                  <div className={s.uploadHint}>JPG, PNG, WebP, GIF, MP4, WebM — máx 50MB</div>
                </div>

                {preview && (
                  <div className={s.uploadPreview}>
                    {isVideo
                      ? <video src={preview} controls muted />
                      : <img src={preview} alt="Preview" />
                    }
                  </div>
                )}
              </div>

              {statusMsg && (
                <div className={`${s.formStatus} ${status === 'success' ? s.success : status === 'error' ? s.error : ''}`}>
                  {status === 'success' ? `✓ ${statusMsg}` : status === 'error' ? `✗ ${statusMsg}` : ''}
                </div>
              )}

              <button type="submit" className={s.btnPrimary} disabled={status === 'loading'}>
                {status === 'loading'
                  ? <><span className={s.spinner} /> Salvando...</>
                  : 'Publicar Projeto →'
                }
              </button>
            </form>
          </div>

          {/* Projects list */}
          <div className={s.adminCard}>
            <h2 className={s.adminCardTitle}>Projetos Publicados ({projects.length})</h2>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0', fontSize: '0.85rem' }}>
                Nenhum projeto ainda. Adicione o primeiro!
              </div>
            ) : (
              <div className={s.adminProjectList}>
                {projects.map(p => {
                  const date = new Date(p.createdAt).toLocaleDateString('pt-BR');
                  return (
                    <div key={p.id} className={s.adminProjectItem}>
                      {p.imageUrl || p.videoUrl ? (
                        p.imageUrl
                          ? <img className={s.adminProjectThumb} src={p.imageUrl} alt={p.title} />
                          : <video className={s.adminProjectThumb} src={p.videoUrl!} muted />
                      ) : (
                        <div className={s.adminProjectThumb} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>◈</div>
                      )}
                      <div className={s.adminProjectInfo}>
                        <div className={s.adminProjectName}>{p.title}</div>
                        <div className={s.adminProjectDate}>{date}</div>
                      </div>
                      <div className={s.adminProjectActions}>
                        <button
                          className={s.btnDanger}
                          onClick={() => handleDelete(p.id)}
                          aria-label={`Deletar ${p.title}`}
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
