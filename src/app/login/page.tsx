'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import s from '../styles.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'same-origin',
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Credenciais inválidas');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.loginPage}>
      <div className={s.loginCard}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          [ ADMIN ACCESS ]
        </div>
        <h1 className={s.loginTitle}>kz — Admin</h1>
        <p className={s.loginSub}>Entre para gerenciar seus projetos.</p>

        <form className={s.contactForm} onSubmit={handleSubmit}>
          <div className={s.formGroup}>
            <label className={s.formLabel} htmlFor="login-user">Usuário</label>
            <input
              id="login-user"
              className={s.formInput}
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className={s.formGroup}>
            <label className={s.formLabel} htmlFor="login-pass">Senha</label>
            <input
              id="login-pass"
              className={s.formInput}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className={`${s.formStatus} ${s.error}`}>✗ {error}</div>
          )}

          <button type="submit" className={s.btnPrimary} disabled={loading}>
            {loading ? <><span className={s.spinner} /> Entrando...</> : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  );
}
