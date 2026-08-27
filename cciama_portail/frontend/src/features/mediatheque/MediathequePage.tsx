import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X, Image as ImageIcon } from 'lucide-react';
import { useAllMedia } from '@/hooks/useCms';
import type { MediaAsset } from '@/lib/api';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'image', label: 'Photos' },
  { id: 'video', label: 'Vidéos' },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function MediathequePage() {
  const { data: mediaData, isLoading } = useAllMedia();
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState<MediaAsset | null>(null);

  // La bibliothèque contient aussi les PDF et les logos : la médiathèque
  // publique n'expose que les photos et les vidéos.
  const MEDIA = (mediaData ?? []).filter(m => m.type === 'image' || m.type === 'video');
  const filtered = filter === 'all' ? MEDIA : MEDIA.filter(m => m.type === filter);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Médiathèque</h1>
          <p className="lead">
            Photothèque et vidéothèque institutionnelles de la CCIAMA : événements,
            rencontres et actions consulaires.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 28px 80px' }}>
        <div className="news-toolbar">
          <div className="filters" role="tablist" aria-label="Filtrer par type de média">
            {FILTERS.map(f => (
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
            {filtered.length} média{filtered.length > 1 ? 's' : ''}
          </div>
        </div>

        {isLoading && (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--color-ink-mute)' }}>
            Chargement de la médiathèque…
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={{
            background: 'var(--color-paper)', border: '1px solid var(--color-rule)',
            borderRadius: 'var(--radius-lg)', padding: '48px 28px',
            textAlign: 'center', color: 'var(--color-ink-mute)',
          }}>
            <ImageIcon size={28} style={{ margin: '0 auto 12px' }} />
            Aucun média n'est encore publié dans cette rubrique.
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <motion.div className="media-grid" initial="hidden" animate="visible" variants={stagger}>
            {filtered.map(m => (
              <motion.button
                key={m.id}
                type="button"
                className="media-tile"
                variants={fadeUp}
                onClick={() => setActive(m)}
                aria-label={`Agrandir : ${m.altText || m.filename}`}
              >
                <div className="media-thumb">
                  {m.type === 'image'
                    ? <img src={m.url} alt={m.altText || ''} loading="lazy" />
                    : <video src={m.url} preload="metadata" muted />}
                  <span className="media-kind">{m.type === 'image' ? 'Photo' : 'Vidéo'}</span>
                  {m.type === 'video' && (
                    <span className="media-play" aria-hidden="true"><Play size={34} /></span>
                  )}
                </div>
                <div className="media-caption">
                  <div className="t">{m.altText || m.filename}</div>
                  <div className="d">{formatDate(m.uploadedAt)}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {active && (
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.altText || active.filename}
          onClick={() => setActive(null)}
        >
          <div className="media-lightbox-inner" onClick={e => e.stopPropagation()}>
            {active.type === 'image'
              ? <img src={active.url} alt={active.altText || ''} />
              : <video src={active.url} controls autoPlay />}
            <div className="media-lightbox-bar">
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>{active.altText || active.filename}</div>
                <div>{formatDate(active.uploadedAt)}</div>
              </div>
              <button type="button" className="media-lightbox-close" onClick={() => setActive(null)}>
                <X size={16} /> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
