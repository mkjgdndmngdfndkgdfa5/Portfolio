'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import s from '../app/styles.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${s.navbar} ${scrolled ? s.scrolled : ''}`}>
      <div className={`${s.navInner} container`}>
        <Link href="/" className={s.logo}>
          kz <span />
        </Link>
        <div className={s.navLinks}>
          <a href="#projects" className={s.navLink}>Projetos</a>
          <a href="#about" className={s.navLink}>Sobre</a>
          <a href="#contact" className={s.navLink}>Contato</a>
          <Link href="/admin" className={s.navAdmin}>Admin</Link>
        </div>
      </div>
    </nav>
  );
}
