import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ArrowLeft, Clock, User, Share2, Printer, Download, Mail, Phone } from 'lucide-react';
import { useNews } from '@/hooks/useCms';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export function NewsListPage() {
  const { data: newsData } = useNews();
  const NEWS = newsData ?? [];
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = [
    { id: 'all', label: 'Toutes' },
    { id: 'communique', label: 'Communiqués' },
    { id: 'evenement', label: 'Événements' },
    { id: 'decret', label: 'Décrets & lois' },
    { id: 'appel', label: "Appels d'offres" },
  ];

  const filtered = NEWS.filter(n => {
    if (filter !== 'all' && n.cat !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        (n.author || '').toLowerCase().includes(q) ||
        n.catLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Actualités & Événements</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 28px 80px' }}>
        <div className="news-search-bar">
          <label className="news-search" aria-label="Rechercher dans les actualités">
            <Search size={18} style={{ color: 'var(--color-ink-mute)' }} />
            <input
              type="search"
              placeholder="Rechercher par titre, mot-clé, auteur…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher dans les actualités"
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
          <div className="filters" role="tablist" aria-label="Filtrer par catégorie">
            {filters.map(f => (
              <button
                key={f.id}
                className={`chip ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="total" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
            {filtered.length} publication{filtered.length > 1 ? 's' : ''}
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
                Aucune publication ne correspond à votre recherche.
              </div>
            )}
            {filtered.map(n => (
              <motion.article key={n.id} variants={fadeUp}>
                <Link
                  to={`/actualites/${n.id}`}
                  className="news-card"
                  aria-label={`Lire l'actualité : ${n.title}`}
                >
                  <div className="img">
                    {n.image
                      ? <img src={n.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span className="tag">[ photo · {n.catLabel.toLowerCase()} ]</span>}
                  </div>
                  <div className="body">
                    <div className="ni-meta">
                      <span className={`ni-cat ${n.cat}`}>{n.catLabel}</span>
                      <span>{n.date}</span>
                      <span style={{ opacity: 0.5 }}>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {n.readTime}
                      </span>
                    </div>
                    <h3>{n.title}</h3>
                    <p className="justify">{n.excerpt}</p>
                    <span className="read-more">
                      Lire l'article complet <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          <aside className="side">
            <div className="side-card dark">
              <h3>À la une cette semaine</h3>
              <ul>
                {NEWS.slice(0, 4).map((n, i) => (
                  <li key={n.id}>
                    <div className="num">0{i + 1}</div>
                    <Link to={`/actualites/${n.id}`} className="t">{n.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="side-card">
              <h3>Abonnez-vous</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)', margin: '0 0 14px', lineHeight: 1.55 }}>
                Recevez chaque vendredi la sélection officielle des communications de la semaine.
              </p>
              <input
                type="email"
                placeholder="votre@email.td"
                style={{
                  width: '100%', padding: '12px 14px',
                  border: '1px solid var(--color-rule)', borderRadius: 4,
                  marginBottom: 10, font: 'inherit', fontSize: 'var(--text-sm)',
                  background: 'var(--color-cream)', color: 'var(--color-ink)',
                }}
                aria-label="Adresse e-mail pour l'abonnement"
              />
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Je m'abonne
              </button>
            </div>

            <div className="side-card">
              <h3>Archives</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Mai 2026 (6)', 'Avril 2026 (8)', 'Mars 2026 (12)', 'Février 2026 (9)'].map(a => (
                  <li key={a} style={{
                    padding: '10px 0', borderBottom: '1px solid var(--color-rule-soft)',
                    fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-ink-soft)',
                  }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export function ArticlePage() {
  const { id } = useParams();
  const { data: newsData } = useNews();
  const NEWS = newsData ?? [];
  const article = NEWS.find(n => n.id === id) || NEWS[0];
  const related = NEWS.filter(n => n.id !== id).slice(0, 3);

  if (!article) {
    return (
      <>
        <div className="page-banner"><div className="container"><h1>Article</h1></div></div>
        <div className="container" style={{ padding: '64px 28px', textAlign: 'center', color: 'var(--color-ink-mute)' }}>
          Chargement de l'article…
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <Link
            to="/actualites"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--color-gold-soft)', fontSize: 'var(--text-sm)',
              fontWeight: 600, marginBottom: 16,
            }}
          >
            <ArrowLeft size={14} /> Retour aux actualités
          </Link>
          <h1>{article.title}</h1>
        </div>
      </div>

      <div className="container">
        <div className="article-wrap">
          <article className="article">
            <div className="article-hero" style={{ marginTop: 16 }}>
              {article.image
                ? <img src={article.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="tag">[ photo · {article.catLabel.toLowerCase()} ]</span>}
            </div>

            <div className="article-meta">
              <span className={`ni-cat ${article.cat}`}>{article.catLabel}</span>
              <span>Publié le {article.date}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <User size={12} /> {article.author}
              </span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {article.readTime}
              </span>
            </div>

            <p className="lead">{article.excerpt}</p>

            {article.body.split('\n\n').map((para, i) => (
              <p key={i} className="justify">{para}</p>
            ))}

            <div className="share">
              <span>Partager</span>
              <button aria-label="Partager sur les réseaux sociaux"><Share2 size={16} /></button>
              <button aria-label="Imprimer l'article" onClick={() => window.print()}><Printer size={16} /></button>
              <button aria-label="Télécharger en PDF"><Download size={16} /></button>
            </div>
          </article>

          <aside className="article-side">
            <div className="side-card">
              <h3>Articles liés</h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {related.map(r => (
                  <li key={r.id} style={{ paddingBottom: 14, borderBottom: '1px solid var(--color-rule-soft)' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-red)', fontWeight: 700, marginBottom: 6 }}>
                      {r.catLabel}
                    </div>
                    <Link
                      to={`/actualites/${r.id}`}
                      style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', color: 'var(--color-ink)', lineHeight: 1.3 }}
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="side-card dark">
              <h3>Contact presse</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'var(--text-sm)', lineHeight: 1.6, margin: '0 0 16px' }}>
                Pour toute demande d'information complémentaire, merci de contacter la Direction de la Communication.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 'var(--text-sm)' }}>
                <div style={{ color: 'var(--color-gold-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Mail size={14} /> communication@cciama-tchad.com
                </div>
                <div style={{ color: 'var(--color-gold-soft)', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={14} /> +235 22 52 52 64
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
