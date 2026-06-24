import { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, FileText, ChevronDown, Menu, X } from 'lucide-react';
import { useLangStore } from '@/stores/useLangStore';
import { useClickOutside } from '@/hooks/useClickOutside';
import { NAV_ITEMS, LANGS } from '@/data';
import { usePlatformSettings, useServiceCatalogue } from '@/hooks/useCms';

export function GovHeader({ onGoTo }: { onGoTo: (route: string) => void }) {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: settings } = usePlatformSettings();

  useEffect(() => {
    if (settings) {
      if (settings.favicon) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settings.favicon;
      }
      if (settings.meta_desc) {
        let meta = document.querySelector("meta[name='description']") as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = settings.meta_desc;
      }
    }
  }, [settings]);

  // Close everything on route change (done during render to avoid cascading renders)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  const getActive = (id: string, path?: string) => {
    if (path) return location.pathname === path;
    if (id === 'institution') return location.pathname.startsWith('/institution');
    return false;
  };

  return (
    <header className="gov-header" id="top" role="banner">
      {/* Brand + Search */}
      <div className="gov-header-top">
        <div className="container header-top-container">
          <Link to="/" className="brand" aria-label="CCIAMA du Tchad — Retour à l'accueil">
            <img src={settings?.logo || "/cciama-logo.png"} alt="Logo de la CCIAMA" />
            <div className="brand-text">
              <div className="l1 desktop-only">Chambre de Commerce</div>
              <div className="l2 desktop-only">CCIAMA du Tchad</div>
              <div className="l2 mobile-only">CCIAMA</div>
            </div>
          </Link>

          <label className="header-search" aria-label="Recherche dans le portail">
            <Search size={16} style={{ color: 'var(--color-ink-mute)', flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Rechercher un service, un document, une démarche…"
              aria-label="Recherche"
            />
          </label>

          <Link to="/tracker" className="cta-suivre" aria-label="Suivre mon dossier">
            <FileText size={18} />
            <span className="lbl-full">Suivre mon dossier</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="main-nav"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav
        className={`gov-nav${mobileOpen ? ' open' : ''}`}
        id="main-nav"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="container">
          {NAV_ITEMS.map(item => {
            if (item.id === 'services') {
              return (
                <ServicesNavDropdown
                  key={item.id}
                  label={item.label}
                  isActive={location.pathname.startsWith('/services')}
                  isOpen={openDropdown === item.id}
                  onToggle={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                  onClose={() => setOpenDropdown(null)}
                />
              );
            }
            if (item.children) {
              return (
                <NavDropdown
                  key={item.id}
                  item={item}
                  isActive={getActive(item.id)}
                  isOpen={openDropdown === item.id}
                  onToggle={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                  onClose={() => setOpenDropdown(null)}
                />
              );
            }
            return (
              <Link
                key={item.id}
                to={item.path!}
                className={getActive(item.id, item.path) ? 'active' : ''}
                aria-current={getActive(item.id, item.path) ? 'page' : undefined}
                onClick={() => setOpenDropdown(null)}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mobile-only" style={{ padding: '16px 0', borderBottom: '1px solid var(--color-rule-soft)' }}>
            <Link to="/tracker" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
              <FileText size={18} />
              Suivre mon dossier
            </Link>
          </div>

          <div className="desktop-only" style={{ flex: 1 }} />

          <NavUtility onGoTo={onGoTo} />
        </div>
      </nav>
    </header>
  );
}

function NavDropdown({ item, isActive, isOpen, onToggle, onClose }: {
  item: typeof NAV_ITEMS[1];
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useClickOutside<HTMLDivElement>(onClose);

  return (
    <div className={`nav-item ${isOpen ? 'open' : ''}`} ref={ref}>
      <a
        className={isActive ? 'active' : ''}
        onClick={(e) => { e.preventDefault(); onToggle(); }}
        href="#"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronDown size={12} className="nav-caret" style={{ marginLeft: 4 }} />
      </a>
      {isOpen && (
        <div className="gov-dropdown" role="menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {item.children?.map(child => (
            <Link
              key={child.id}
              to={child.path!}
              onClick={onClose}
              role="menuitem"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
            >
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ServicesNavDropdown({ label, isActive, isOpen, onToggle, onClose }: {
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useClickOutside<HTMLDivElement>(onClose);
  const { data: catalogue } = useServiceCatalogue();
  const families = catalogue ?? [];

  return (
    <div className={`nav-item ${isOpen ? 'open' : ''}`} ref={ref}>
      <a
        className={isActive ? 'active' : ''}
        onClick={(e) => { e.preventDefault(); onToggle(); }}
        href="#"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown size={12} className="nav-caret" style={{ marginLeft: 4 }} />
      </a>
      {isOpen && (
        <div className="gov-dropdown gov-dropdown-services" role="menu">
          {families.map(fam => (
            <div className="svc-dd-group" key={fam.id}>
              <div className="svc-dd-fam">{fam.name}</div>
              {(fam.services ?? []).map(svc => (
                <Link
                  key={svc.id}
                  to={`/services/${svc.code}`}
                  onClick={onClose}
                  role="menuitem"
                  className="svc-dd-item"
                >
                  {svc.title}
                </Link>
              ))}
            </div>
          ))}
          <Link to="/services" onClick={onClose} className="svc-dd-all">Tous les services →</Link>
        </div>
      )}
    </div>
  );
}

function NavUtility({ onGoTo }: { onGoTo: (route: string) => void }) {
  return (
    <div className="nav-utility">
      <InternalSpacesDropdown onGoTo={onGoTo} />
      <div className="nav-utility-sep" aria-hidden="true" />
      <LangDropdown />
    </div>
  );
}

function LangDropdown() {
  const { lang, setLang } = useLangStore();
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(useCallback(() => setOpen(false), []));

  return (
    <div className="nav-utility-item" ref={ref}>
      <button
        className="nav-utility-btn"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Choisir la langue"
      >
        {lang}
        <ChevronDown size={10} className="caret" />
      </button>
      {open && (
        <div className="nav-utility-menu" style={{ minWidth: 200 }} role="menu">
          <div className="acc-section-label">Langue du portail</div>
          {LANGS.map(l => (
            <button
              key={l.code}
              className={`lang-row ${lang === l.code ? 'active' : ''}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
              role="menuitem"
              aria-current={lang === l.code ? true : undefined}
            >
              <span className="lang-flag" aria-hidden="true">{l.flag}</span>
              <span className="lang-label">{l.label}</span>
              <span className="lang-code">{l.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function InternalSpacesDropdown({ onGoTo }: { onGoTo: (route: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(useCallback(() => setOpen(false), []));

  const spaces = [
    { label: 'Administration', desc: 'Se connecter à la console', icon: 'A', color: '#0E2A5E', path: '/connexion' },
    { label: 'Espace Agent', desc: 'Instruire les dossiers', icon: 'AG', color: '#1F5C1F', path: '/agent' },
    { label: 'Tableau de bord décideurs', desc: 'Indicateurs & pilotage', icon: 'BI', color: '#7A5A0E', path: '/bi' },
  ];

  return (
    <div className="nav-utility-item" ref={ref}>
      <button
        className="nav-utility-btn subtle"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Accès agents et administrateurs"
      >
        Espace interne
        <ChevronDown size={10} className="caret" />
      </button>
      {open && (
        <div className="nav-utility-menu" style={{ minWidth: 320, right: 0, left: 'auto' }} role="menu">
          {spaces.map(s => (
            <div
              key={s.path}
              className="space-row"
              onClick={() => { onGoTo(s.path); setOpen(false); }}
              role="menuitem"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { onGoTo(s.path); setOpen(false); } }}
            >
              <span className="us-icon" style={{ background: s.color }}>{s.icon}</span>
              <div>
                <div className="us-name">{s.label}</div>
                <div className="us-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Footer =====
export function GovFooter() {
  const { data: settings } = usePlatformSettings();

  return (
    <footer className="gov-footer" role="contentinfo">
      <div className="container">
        {/* Info grid */}
        <div className="footer-info-grid" style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="footer-info">
            <div className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div className="k">Adresse</div>
              <div className="v">
                {settings?.footer_address ? (
                  settings.footer_address.split('\n').map((line, idx) => (
                    <span key={idx}>{line}<br/></span>
                  ))
                ) : (
                  <>Avenue Karim Nassour<br/>B.P. 458 · N'Djamena, Tchad</>
                )}
              </div>
            </div>
          </div>
          <div className="footer-info">
            <div className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.7.7 2.5a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6.3 6.3l1.4-1.4a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.7a2 2 0 0 1 1.7 2z"/></svg>
            </div>
            <div>
              <div className="k">Téléphone</div>
              <div className="v">
                {settings?.footer_phones ? (
                  settings.footer_phones.split('\n').map((line, idx) => (
                    <span key={idx}>{line}<br/></span>
                  ))
                ) : (
                  <>+235 66 28 07 63</>
                )}
              </div>
            </div>
          </div>
          <div className="footer-info">
            <div className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <div className="k">Courriel</div>
              <div className="v">
                <a href={`mailto:${settings?.footer_email || 'info.cciama@gmail.com'}`}>
                  {settings?.footer_email || 'info.cciama@gmail.com'}
                </a>
              </div>
            </div>
          </div>
          <div className="footer-info">
            <div className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="k">Accueil du public</div>
              <div className="v">Lundi — Vendredi<br/>07h30 — 15h30</div>
              <div className="footer-socials-row" aria-label="Réseaux sociaux">
                {(settings?.footer_socials || [
                  { platform: 'Facebook', url: '#' },
                  { platform: 'Twitter', url: '#' },
                  { platform: 'YouTube', url: '#' },
                  { platform: 'LinkedIn', url: '#' }
                ]).map((soc: any, idx: number) => {
                  const label = soc.platform;
                  const url = soc.url || '#';
                  if (label === 'Facebook') {
                    return (
                      <a key={idx} href={url} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V9z"/></svg>
                      </a>
                    );
                  }
                  if (label === 'Twitter' || label === 'X') {
                    return (
                      <a key={idx} href={url} aria-label="X (anciennement Twitter)" target="_blank" rel="noopener noreferrer">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3l8 10L3 21h2l7-7 5 7h5l-9-12 8-9h-2l-6 7-5-7H3z"/></svg>
                      </a>
                    );
                  }
                  if (label === 'YouTube') {
                    return (
                      <a key={idx} href={url} aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.1 5 12 5 12 5s-4.1 0-7.1.1c-.4 0-1.3.1-2.1.9C2.2 6.6 2 8 2 8s-.2 1.7-.2 3.4v1.2C1.8 14.3 2 16 2 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 7.3.2 7.3.2s4.1 0 7.1-.1c.4 0 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.7.2-3.4v-1.2c0-1.7-.2-3.5-.2-3.5zM10 15V9l5 3-5 3z"/></svg>
                      </a>
                    );
                  }
                  if (label === 'LinkedIn') {
                    return (
                      <a key={idx} href={url} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v2c.6-1.2 2-2.3 4-2.3 3.5 0 4 2.3 4 5.3V20h-4v-4c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4z"/></svg>
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="footer-cols">
          <div className="footer-brand">
            <img src={settings?.logo || "/cciama-logo.png"} alt="Logo CCIAMA" />
            <div>
              <div className="l1">Chambre de Commerce</div>
              <div className="l2">CCIAMA du Tchad</div>
              <div className="motto">« La voix du secteur privé tchadien »</div>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Formalités des entreprises</Link></li>
              <li><Link to="/tracker">Suivre mon dossier</Link></li>
              <li><Link to="/documentation">Documentation officielle</Link></li>
              <li><Link to="/actualites">Actualités et Événements</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>La CCIAMA</h4>
            <ul>
              <li><Link to="/institution/missions">Missions</Link></li>
              <li><Link to="/institution/structure">Gouvernance</Link></li>
              <li><Link to="/institution/organismes">Délégations</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 24, marginTop: 36, borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)',
        }}>
          <span>© {new Date().getFullYear()} CCIAMA du Tchad · Tous droits réservés</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.45)' }}>Mentions légales</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.45)' }}>Accessibilité (RGAA)</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.45)' }}>Données personnelles</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
