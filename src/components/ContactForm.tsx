'use client';
import { useState } from 'react';
import s from '../app/styles.module.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className={s.contactForm} onSubmit={handleSubmit}>
      <div className={s.formGroup}>
        <label className={s.formLabel} htmlFor="contact-name">Nome</label>
        <input
          id="contact-name"
          className={s.formInput}
          type="text"
          placeholder="Seu nome"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel} htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          className={s.formInput}
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel} htmlFor="contact-message">Mensagem</label>
        <textarea
          id="contact-message"
          className={s.formTextarea}
          placeholder="Sua mensagem..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          required
        />
      </div>

      <div className={`${s.formStatus} ${status === 'success' ? s.success : status === 'error' ? s.error : ''}`}>
        {status === 'success' && '✓ Mensagem enviada!'}
        {status === 'error' && '✗ Erro ao enviar. Tente novamente.'}
      </div>

      <button
        type="submit"
        className={s.btnPrimary}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? <><span className={s.spinner} /> Enviando...</> : 'Enviar Mensagem →'}
      </button>
    </form>
  );
}
