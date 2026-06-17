import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LogoMark } from '@/components/icons/LogoMark';
import type { Organism } from '@/types';

interface MarqueeProps {
  items: Organism[];
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
                <LogoMark type={item.mark} color={item.color} />
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
