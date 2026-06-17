import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Pause, Play } from 'lucide-react';
import { useFlashInfos } from '@/hooks/useCms';

export function FlashInfoBand() {
  const { data: flashData } = useFlashInfos();
  const FLASH_INFOS = (flashData ?? []).filter(f => f.active);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Auto-advance: setTimeout resets cleanly on each idx/paused change
  useEffect(() => {
    if (paused) return;
    const isMobile = window.innerWidth <= 640;
    const t = setTimeout(() => setIdx(i => (i + 1) % FLASH_INFOS.length), isMobile ? 12000 : 5500);
    return () => clearTimeout(t);
  }, [idx, paused]);

  // Hide when the site footer scrolls into view
  useEffect(() => {
    const footer = document.querySelector('.gov-footer');
    if (!footer) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const flash = FLASH_INFOS[idx];
  if (!flash || dismissed || footerVisible) return null;

  const counter = `${String(idx + 1).padStart(2, '0')} / ${String(FLASH_INFOS.length).padStart(2, '0')}`;

  return (
    <div
      className={`flash-band severity-${flash.severity}`}
      role="region"
      aria-label="Flash informations"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container flash-container">
        <div className="flash-tag">
          <span className="flash-dot" />
          <span className="flash-label">Flash Info</span>
        </div>

        <div className="flash-stage">
          {FLASH_INFOS.map((f, i) => (
            <div key={i} className={`flash-item ${i === idx ? 'is-current' : ''}`}>
              <span className="flash-severity">{f.label}</span>
              <span className="flash-text">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="flash-controls">
          <button
            onClick={() => setIdx(i => (i - 1 + FLASH_INFOS.length) % FLASH_INFOS.length)}
            aria-label="Flash info précédente"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Reprendre le défilement' : 'Mettre en pause'}
            aria-pressed={paused}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
          <span className="flash-counter" aria-label={`Info ${idx + 1} sur ${FLASH_INFOS.length}`}>
            {counter}
          </span>
          <button
            onClick={() => setIdx(i => (i + 1) % FLASH_INFOS.length)}
            aria-label="Flash info suivante"
          >
            <ChevronRight size={14} />
          </button>
          <button onClick={() => setDismissed(true)} aria-label="Fermer les flash infos">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
