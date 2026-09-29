'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import FadeInObserver from '@/components/FadeInObserver';
import { ProjectCarousel, ProjectGrid, ProjectModal } from '@/components/Projects';
import s from './styles.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  link: string | null;
  createdAt: string;
}

const TICKER_ITEMS = [
  'Roblox Studio', '◈', 'Lua Scripting', '◈', 'Game Systems', '◈',
  'UI/UX Design', '◈', 'Backend Dev', '◈', 'Scripting', '◈',
  'Roblox Studio', '◈', 'Lua Scripting', '◈', 'Game Systems', '◈',
  'UI/UX Design', '◈', 'Backend Dev', '◈', 'Scripting', '◈',
];

const SKILLS = [
  'Lua', 'Roblox Studio', 'Game Design', 'UI Design',
  'TypeScript', 'Next.js', 'Sistema de Combate', 'DataStore',
  'Remote Events', 'ModuleScript', 'Animação', 'Pathfinding',
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  const featured = projects.slice(0, 5);

  return (
    <>
      <FadeInObserver />
      <Navbar />

      {/* HERO */}
      <section className={s.hero} id="home">
        <div className={s.heroGrid} />
        <div className={s.heroContent}>
          <div className={s.heroTag}>[ Portfolio — 2026 ]</div>
          <h1 className={s.heroTitle} data-text="kz">kz</h1>
          <div className={s.heroSub}>Roblox Developer · Systems Builder</div>
          <p className={s.heroDesc}>
            Criações no Roblox Studio — sistemas, jogos e experiências únicas.
            Código limpo, mecânicas sólidas, design que impressiona.
          </p>
          <div className={s.heroCta}>
            <a href="#projects" className={s.btnPrimary}>Ver Projetos →</a>
            <a href="#contact" className={s.btnSecondary}>Falar Comigo</a>
          </div>
        </div>

        <div className={s.heroScroll}>
          <div className={s.scrollLine} />
          scroll
        </div>
      </section>

      {/* TICKER */}
      <div className={s.ticker}>
        <div className={s.tickerInner}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className={s.tickerItem}>
              {item === '◈' ? <span>{item}</span> : item}
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section className={s.projectsSection} id="projects">
        <div className="container">
          <div className={`${s.sectionHeader} fade-in`}>
            <div className={s.sectionLabel}>Trabalhos</div>
            <h2 className={s.sectionTitle}>Meus Projetos</h2>
            <p className={s.sectionSub}>
              Sistemas, jogos e criações desenvolvidas no Roblox Studio.
              Clique em qualquer projeto para ver detalhes.
            </p>
          </div>

          {featured.length > 0 && (
            <div className="fade-in">
              <ProjectCarousel projects={featured} onSelect={setSelected} />
            </div>
          )}

          <div className="fade-in">
            <ProjectGrid projects={projects} onSelect={setSelected} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={s.aboutSection} id="about">
        <div className="container">
          <div className={s.aboutGrid}>
            <div className="fade-in">
              <div className={s.sectionLabel}>Sobre</div>
              <h2 className={s.sectionTitle}>Quem é kz</h2>
              <div className={s.aboutText} style={{ marginTop: '1.5rem' }}>
                <p>
                  Desenvolvedor apaixonado pelo universo Roblox, especializado em criar
                  sistemas robustos e experiências de jogo imersivas usando Lua e Roblox Studio.
                </p>
                <p>
                  Do design de mecânicas de gameplay à implementação de backends escaláveis,
                  cada projeto é construído com atenção aos detalhes e foco na qualidade.
                </p>
                <p>
                  Seja um sistema de combate complexo, UI polida ou uma experiência completa —
                  eu faço acontecer.
                </p>
              </div>
              <div className={s.skillsList}>
                {SKILLS.map(skill => (
                  <span key={skill} className={s.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
            <div className="fade-in">
              <div className={s.statsGrid}>
                <div className={s.statCard}>
                  <div className={s.statNumber}>{projects.length}+</div>
                  <div className={s.statLabel}>Projetos</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statNumber}>100%</div>
                  <div className={s.statLabel}>Dedicação</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statNumber}>∞</div>
                  <div className={s.statLabel}>Criatividade</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statNumber}>01</div>
                  <div className={s.statLabel}>Username: kz</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={s.contactSection} id="contact">
        <div className="container">
          <div className={`${s.sectionHeader} fade-in`}>
            <div className={s.sectionLabel}>Contato</div>
            <h2 className={s.sectionTitle}>Fale Comigo</h2>
          </div>
          <div className={s.contactGrid}>
            <div className="fade-in">
              <div className={s.contactInfo}>
                <h3>Vamos conversar</h3>
                <p>
                  Tem um projeto em mente? Quer colaborar, tirar uma dúvida
                  ou simplesmente dizer oi? Me manda uma mensagem.
                </p>
                <div className={s.contactLinks}>
                  <a href="https://www.roblox.com/users/search?keyword=kz" target="_blank" rel="noopener noreferrer" className={s.contactLink}>
                    <span className={s.contactLinkIcon}>⬡</span>
                    Roblox — kz
                  </a>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={`${s.footerInner} container`}>
          <div className={s.footerLogo}>kz</div>
          <div className={s.footerCopy}>© 2026 kz — Todos os direitos reservados</div>
        </div>
      </footer>

      {/* MODAL */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
