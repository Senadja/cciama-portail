import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { OrganismItem } from '@/lib/api';

interface MarqueeProps {
  items: OrganismItem[];
  speed?: number;
  label: string;
  eyebrow: string;
  viewAllPath?: string;
}

export function Marquee({ items, speed = 40, label, eyebrow, viewAllPath }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <section className="marquee-section">
      <div className="container">
        <div className="marquee-head">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h3>{label}</h3>
          </div>
          {viewAllPath && (
            <Link to={viewAllPath} className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }}>
              Voir tous <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <div className="marquee" role="region" aria-label={label}>
          <div className="marquee-fade marquee-fade-l" aria-hidden="true" />
          <div className="marquee-fade marquee-fade-r" aria-hidden="true" />
          <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
            {doubled.map((item, i) => (
              <a key={i} className="marquee-item" href={item.url}>
                {item.logo
                  ? <img className="logo-mark" src={item.logo} alt="" />
                  : <span className="logo-mark logo-mark-fallback" aria-hidden="true">{item.short.slice(0, 4)}</span>}
                <div>
                  <div className="logo-short">{item.short}</div>
                  <div className="logo-name">{item.name}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
