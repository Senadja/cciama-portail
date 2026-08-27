import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock } from 'lucide-react';
import { useNews } from '@/hooks/useCms';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export function AppelsOffresPage() {
  const { data: newsData } = useNews();
  const TENDERS = (newsData ?? []).filter(n => n.cat === 'appel');
  const [search, setSearch] = useState('');

  const filtered = TENDERS.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.excerpt.toLowerCase().includes(q) ||
      (t.author || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Appels d'offres</h1>
          <p className="lead">
            Avis d'appel d'offres, appels à manifestation d'intérêt et consultations
            publiés par la CCIAMA.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 28px 80px' }}>
        <div className="news-search-bar">
          <label className="news-search" aria-label="Rechercher un appel d'offres">
            <Search size={18} style={{ color: 'var(--color-ink-mute)' }} />
            <input
              type="search"
              placeholder="Rechercher par intitulé, objet ou direction…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher un appel d'offres"
            />
            {search && (
              <button
                type="button"
                className="news-search-clear"
                onClick={() => setSearch('')}
                aria-label="Effacer la recherche"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
                </svg>
              </button>
            )}
          </label>
        </div>

        <div className="news-toolbar">
          <div className="total" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
            {filtered.length} avis publié{filtered.length > 1 ? 's' : ''}
            {search && <span> · résultats pour « {search} »</span>}
          </div>
        </div>

        <div className="news-list">
          <motion.div className="main" initial="hidden" animate="visible" variants={stagger}>
            {filtered.length === 0 && (
              <div style={{
                background: 'var(--color-paper)', border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-lg)', padding: '40px 28px',
                textAlign: 'center', color: 'var(--color-ink-mute)',
              }}>
                {TENDERS.length === 0
                  ? "Aucun appel d'offres n'est ouvert actuellement."
                  : "Aucun appel d'offres ne correspond à votre recherche."}
              </div>
            )}
            {filtered.map(t => (
              <motion.article key={t.id} variants={fadeUp}>
                <Link
                  to={`/actualites/${t.id}`}
                  className="news-card"
                  aria-label={`Consulter l'appel d'offres : ${t.title}`}
                >
                  <div className="img">
                    {t.image
                      ? <img src={t.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span className="tag">[ avis · appel d'offres ]</span>}
                  </div>
                  <div className="body">
                    <div className="ni-meta">
                      <span className={`ni-cat ${t.cat}`}>{t.catLabel}</span>
                      <span>{t.date}</span>
                      <span style={{ opacity: 0.5 }}>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {t.readTime}
                      </span>
                    </div>
                    <h3>{t.title}</h3>
                    <p className="justify">{t.excerpt}</p>
                    <span className="read-more">
                      Consulter l'avis complet <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
