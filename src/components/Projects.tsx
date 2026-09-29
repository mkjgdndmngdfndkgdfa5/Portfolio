'use client';
import { useState, useEffect, useCallback } from 'react';
import s from '../app/styles.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  link: string | null;
  createdAt: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const date = new Date(project.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        {project.videoUrl ? (
          <video
            className={s.modalMedia}
            src={project.videoUrl}
            controls
            autoPlay
            muted
            loop
          />
        ) : project.imageUrl ? (
          <img className={s.modalMedia} src={project.imageUrl} alt={project.title} />
        ) : null}

        <div className={s.modalBody}>
          <button className={s.modalClose} onClick={onClose} aria-label="Fechar">×</button>
          <div className={s.modalDate}>{date}</div>
          <h2 className={s.modalTitle}>{project.title}</h2>
          <p className={s.modalDescription}>{project.description}</p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={s.modalLink}>
              Ver projeto ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProjectCarouselProps {
  projects: Project[];
  onSelect: (p: Project) => void;
}

export function ProjectCarousel({ projects, onSelect }: ProjectCarouselProps) {
  const [idx, setIdx] = useState(0);
  const len = projects.length;

  const prev = useCallback(() => setIdx(i => (i - 1 + len) % len), [len]);
  const next = useCallback(() => setIdx(i => (i + 1) % len), [len]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  if (!len) return null;

  return (
    <div className={s.carousel}>
      <div
        className={s.carouselTrack}
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {projects.map((p) => (
          <div key={p.id} className={s.carouselSlide} onClick={() => onSelect(p)}>
            {p.videoUrl ? (
              <video
                className={s.carouselMedia}
                src={p.videoUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : p.imageUrl ? (
              <img className={s.carouselMedia} src={p.imageUrl} alt={p.title} />
            ) : (
              <div className={s.carouselMedia} style={{ background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '3rem' }}>◈</div>
            )}
            <div className={s.carouselOverlay}>
              <div className={s.carouselTag}>Projeto em destaque</div>
              <div className={s.carouselTitle}>{p.title}</div>
              <div className={s.carouselDesc}>{p.description}</div>
              <div className={s.carouselViewBtn}>Ver projeto →</div>
            </div>
          </div>
        ))}
      </div>

      <div className={s.carouselDots}>
        {projects.map((_, i) => (
          <button
            key={i}
            className={`${s.carouselDot} ${i === idx ? s.active : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>

      {len > 1 && (
        <div className={s.carouselControls}>
          <button className={s.carouselBtn} onClick={prev} aria-label="Anterior">←</button>
          <button className={s.carouselBtn} onClick={next} aria-label="Próximo">→</button>
        </div>
      )}
    </div>
  );
}

interface ProjectGridProps {
  projects: Project[];
  onSelect: (p: Project) => void;
}

export function ProjectGrid({ projects, onSelect }: ProjectGridProps) {
  return (
    <div className={s.projectsGrid}>
      {projects.length === 0 ? (
        <div className={s.emptyState}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◈</div>
          <p>Nenhum projeto adicionado ainda.</p>
        </div>
      ) : (
        projects.map((p) => {
          const date = new Date(p.createdAt).toLocaleDateString('pt-BR', {
            year: 'numeric', month: 'short'
          });
          return (
            <div key={p.id} className={s.projectCard} onClick={() => onSelect(p)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onSelect(p)}>
              <div className={s.projectThumb}>
                {p.videoUrl ? (
                  <video src={p.videoUrl} muted playsInline />
                ) : p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} loading="lazy" />
                ) : (
                  <div className={s.projectThumbPlaceholder}>◈</div>
                )}
                <div className={s.projectBadge}>Roblox</div>
              </div>
              <div className={s.projectInfo}>
                <div className={s.projectTitle}>{p.title}</div>
                <div className={s.projectExcerpt}>{p.description}</div>
                <div className={s.projectFooter}>
                  <span className={s.projectDate}>{date}</span>
                  <span className={s.projectArrow}>→</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
