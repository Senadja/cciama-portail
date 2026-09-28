import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlatformSettings } from '@/hooks/useCms';
import { authApi } from '@/lib/api';
import { Lock, Mail, UserRound, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

/** Cadre commun à la connexion et à la finalisation du compte. */
function LoginShell({ title, subtitle, error, children }: { title: string; subtitle: string; error: string; children: React.ReactNode }) {
  const { data: settings } = usePlatformSettings();
  const logoUrl = settings?.logo || '/cciama-logo.png';

  return (
    <div className="login-page">
      <div className="login-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Retour au site
        </Link>
        <motion.div
          className="login-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="login-header">
            <img src={logoUrl} alt="CCIAMA Logo" />
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {children}
        </motion.div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          padding: 24px;
        }
        .login-container {
          width: 100%;
          max-width: 440px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--color-ink-soft);
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: var(--color-navy);
        }
        .login-box {
          background: var(--color-paper);
          border: 1px solid var(--color-rule);
          border-radius: var(--radius-lg);
          padding: 48px 40px;
          box-shadow: var(--shadow-lg);
        }
        .login-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .login-header img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          margin: 0 auto 20px;
        }
        .login-header h1 {
          font-size: var(--text-xl);
          color: var(--color-navy);
          margin-bottom: 8px;
        }
        .login-header p {
          font-size: var(--text-sm);
          color: var(--color-ink-soft);
          margin: 0;
        }
        .login-error {
          background: rgba(184, 30, 44, 0.1);
          color: var(--color-red);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          font-weight: 500;
          margin-bottom: 24px;
          text-align: center;
        }
        .login-form .field {
          margin-bottom: 20px;
        }
        .login-form label {
          display: block;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-ink-soft);
          margin-bottom: 8px;
        }
        .input-with-icon {
          position: relative;
          width: 100%;
        }
        .input-with-icon svg:first-child {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-ink-mute);
          pointer-events: none;
        }
        .input-with-icon input {
          width: 100%;
          padding: 12px 42px; /* 42px padding on both sides to accommodate icons */
          border: 1px solid var(--color-rule);
          border-radius: var(--radius-sm);
          font: inherit;
          font-size: var(--text-sm);
          background: var(--color-cream);
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .input-with-icon input::-ms-reveal,
        .input-with-icon input::-ms-clear {
          display: none;
        }
        .input-with-icon input:focus {
          outline: none;
          border-color: var(--color-navy);
        }
        .toggle-pwd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-ink-mute);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-pwd:hover {
          color: var(--color-navy);
        }
        .login-btn {
          width: 100%;
          justify-content: center;
          padding: 14px;
          font-size: var(--text-base);
        }
      `}</style>
    </div>
  );
}

/** Champ mot de passe avec bouton afficher / masquer. */
function PasswordInput({ value, onChange, placeholder = '••••••••' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-with-icon">
      <Lock size={18} />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        className="toggle-pwd"
        onClick={() => setShow(!show)}
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { access_token, user } = await authApi.login(identifier, password);
      login(user, access_token);
      // Mot de passe provisoire : le compte doit d'abord être finalisé.
      navigate(user.mustChangePassword ? '/connexion/finaliser' : '/admin');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginShell title="Administration" subtitle="Connectez-vous pour accéder à la console de gestion." error={error}>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="field">
          <label>E-mail ou matricule</label>
          <div className="input-with-icon">
            <UserRound size={18} />
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="vous@cciama-td.org ou CCI-0042"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Mot de passe</label>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>
    </LoginShell>
  );
}

/** Première connexion : l'utilisateur renseigne son e-mail et remplace son mot de passe provisoire. */
export function CompleteAccountPage() {
  const navigate = useNavigate();
  const { user, token, login, logout } = useAuthStore();
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!token || !user) return <Navigate to="/connexion" replace />;
  if (!user.mustChangePassword) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (password !== confirm) return setError('La confirmation ne correspond pas au mot de passe.');

    setIsLoading(true);
    try {
      const { access_token, user: updated } = await authApi.completeAccount(email, password);
      login(updated, access_token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Impossible de finaliser le compte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginShell
      title="Finalisez votre compte"
      subtitle={`Bienvenue${user.firstName ? ` ${user.firstName}` : ''}. Renseignez votre adresse e-mail et choisissez votre mot de passe personnel.`}
      error={error}
    >
      <form onSubmit={handleSubmit} className="login-form">
        <div className="field">
          <label>Adresse e-mail</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@cciama-td.org"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Nouveau mot de passe</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="8 caractères minimum" />
        </div>

        <div className="field">
          <label>Confirmer le mot de passe</label>
          <PasswordInput value={confirm} onChange={setConfirm} />
        </div>

        <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Activer mon compte'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
          onClick={() => { logout(); navigate('/connexion'); }}
        >
          Se déconnecter
        </button>
      </form>
    </LoginShell>
  );
}
