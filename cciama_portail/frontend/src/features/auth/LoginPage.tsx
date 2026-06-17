import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlatformSettings } from '@/hooks/useCms';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const { data: settings } = usePlatformSettings();

  const logoUrl = settings?.logo || '/cciama-logo.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1>Administration</h1>
            <p>Connectez-vous pour accéder à la console de gestion.</p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label>Email ou Téléphone</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input 
                  type="text" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cciama-tchad.com"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Mot de passe</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="toggle-pwd" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
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
