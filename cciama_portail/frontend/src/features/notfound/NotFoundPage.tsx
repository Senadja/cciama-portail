import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export function NotFoundPage() {
  return (
    <>
      <div className="page-banner" aria-label="Erreur 404">
        <div className="container">
          <h1>Page introuvable</h1>
        </div>
      </div>
      <div className="container" style={{ padding: '80px 28px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(64px, 12vw, 120px)',
          fontWeight: 700, color: 'var(--color-rule)', lineHeight: 1,
          marginBottom: 32, letterSpacing: '-0.04em',
        }} aria-hidden="true">404</div>
        <p style={{
          fontSize: 'var(--text-lg)', color: 'var(--color-ink-soft)',
          maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.6,
        }}>
          Vérifiez l'adresse saisie ou utilisez la navigation pour rejoindre une page existante.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <Link to="/services" className="btn btn-outline">
            Voir les services <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
