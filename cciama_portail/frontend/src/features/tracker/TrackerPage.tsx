import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle, Clock, FileText, Shield, Printer, Download } from 'lucide-react';
import { DOSSIERS } from '@/data';
import type { Dossier } from '@/types';

export function TrackerPage() {
  const [ref, setRef] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<Dossier | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!ref.trim()) {
      setError('Veuillez saisir un numéro de dossier.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = DOSSIERS[ref.trim().toUpperCase()];
      if (found) {
        setResult(found);
        setError('');
      } else {
        setResult(null);
        setError(`Aucun dossier correspondant au numéro « ${ref} ». Vérifiez la référence sur votre récépissé de dépôt.`);
      }
      setLoading(false);
    }, 380);
  };

  const tryExample = (k: string) => {
    setRef(k);
    setDob('');
    setError('');
    setLoading(true);
    setTimeout(() => {
      setResult(DOSSIERS[k] || null);
      setLoading(false);
    }, 200);
  };

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Suivez l'état d'avancement de votre dossier en temps réel.</h1>
        </div>
      </div>

      <div className="container tracker">
        <div className="tracker-card">
          <h2>Identifiant de dossier</h2>
          <p className="help">
            Votre numéro de dossier se compose de 14 caractères au format <strong>TCD-AAAA-NNNNN</strong>.
            Il vous a été communiqué par courriel et figure sur le récépissé papier remis au guichet.
          </p>
          <form className="tracker-form" onSubmit={handleSearch}>
            <div className="field">
              <label htmlFor="tracker-ref">Numéro de dossier</label>
              <input
                id="tracker-ref"
                type="text"
                placeholder="TCD-2026-XXXXX"
                value={ref}
                onChange={e => setRef(e.target.value.toUpperCase())}
                autoComplete="off"
                spellCheck={false}
                aria-describedby="tracker-ref-help"
              />
            </div>
            <div className="field">
              <label htmlFor="tracker-dob">Date de dépôt (facultatif)</label>
              <input
                id="tracker-dob"
                type="text"
                placeholder="JJ/MM/AAAA"
                value={dob}
                onChange={e => setDob(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Recherche…' : <><span>Consulter</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="tracker-examples">
            <strong>Essayer avec un dossier de démonstration :</strong>
            {Object.keys(DOSSIERS).map(k => (
              <button key={k} type="button" onClick={() => tryExample(k)}>{k}</button>
            ))}
          </div>

          {error && (
            <div role="alert" style={{
              marginTop: 20, padding: '14px 18px',
              background: 'rgba(184,30,44,0.08)',
              border: '1px solid rgba(184,30,44,0.3)',
              borderRadius: 4, color: 'var(--color-red-deep)',
              display: 'flex', gap: 12, alignItems: 'center',
              fontSize: 'var(--text-sm)',
            }}>
              <AlertTriangle size={20} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}
        </div>

        {result && (
          <motion.div
            className="tracker-result"
            role="region"
            aria-label="Résultat du suivi"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tr-head">
              <div>
                <h3>{result.type}</h3>
                <div className="ref">Référence : {result.ref}</div>
              </div>
              <span className={`status-pill ${result.status}`}>
                {result.status === 'done' && <CheckCircle size={14} />}
                {result.status === 'rejected' && <AlertTriangle size={14} />}
                {result.statusLabel}
              </span>
            </div>

            <div className="tr-meta">
              {[
                { k: 'Date de dépôt', v: result.deposit },
                { k: 'Service instructeur', v: result.service },
                { k: 'Échéance prévisionnelle', v: result.deadline },
                { k: 'Progression', v: `${result.steps.filter(s => s.state === 'done').length} / ${result.steps.length} étapes` },
              ].map((m, i) => (
                <div key={i} className="it">
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="timeline" role="list">
              {result.steps.map((step, i) => (
                <motion.div
                  key={i}
                  className={`step ${step.state}`}
                  role="listitem"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="dot">
                    {step.state === 'done' && <CheckCircle size={16} />}
                    {step.state === 'current' && <span style={{ width: 8, height: 8, background: 'white', borderRadius: '50%', display: 'block' }} />}
                    {step.state === 'rejected' && '×'}
                    {step.state === 'pending' && <span style={{ fontSize: 13, fontWeight: 700 }}>{i + 1}</span>}
                  </div>
                  <div className="body">
                    <h4>{step.title}</h4>
                    <p className="justify">{step.desc}</p>
                  </div>
                  <div className="date">{step.date}</div>
                </motion.div>
              ))}
            </div>

            {result.rejectionReason && (
              <div className="rejection-banner" role="alert">
                <div className="ic">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h4>Motif du rejet</h4>
                  <p>{result.rejectionReason}</p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}>Introduire un recours</button>
                    <Link to="/contact" className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>Demander un éclairage</Link>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              marginTop: 32, paddingTop: 24,
              borderTop: '1px solid var(--color-rule)',
              display: 'flex', gap: 12, flexWrap: 'wrap',
              justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
                Besoin d'aide ? Contactez le service au{' '}
                <strong style={{ color: 'var(--color-navy)' }}>+235 22 52 52 64</strong> ou via{' '}
                <Link to="/contact" style={{ color: 'var(--color-red)', fontWeight: 600 }}>le formulaire de contact</Link>.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => window.print()}>
                  <Printer size={14} /> Imprimer
                </button>
                <button className="btn btn-outline">
                  <Download size={14} /> Télécharger le récépissé
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feature cards shown before first search */}
        {!result && !error && (
          <div style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {[
              { ic: <Clock size={22} />, t: 'Suivi 24h/24', d: 'Consultez l\'avancement à tout moment, depuis n\'importe quel appareil connecté.' },
              { ic: <FileText size={22} />, t: 'Notifications par SMS', d: 'Recevez une alerte gratuite à chaque changement d\'étape de votre dossier.' },
              { ic: <Shield size={22} />, t: 'Données protégées', d: 'Vos informations personnelles sont sécurisées et conformes au règlement national.' },
            ].map((b, i) => (
              <div key={i} style={{
                background: 'var(--color-paper)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 26px',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-cream-warm)', color: 'var(--color-navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>{b.ic}</div>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>{b.t}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)', margin: 0, lineHeight: 1.55, textAlign: 'justify', hyphens: 'auto' }}>{b.d}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
