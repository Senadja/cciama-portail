import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react';

interface SectionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface Section {
  heading?: string;
  items: SectionItem[];
}

interface WorkspaceShellProps {
  children: React.ReactNode;
  role: string;
  accent: 'navy' | 'green' | 'gold';
  sections: Section[];
  current: string;
  onNav: (id: string) => void;
  user: { initials: string; name: string; role: string };
}

const accentColors = {
  navy: { bg: '#0E2A5E', hover: 'rgba(14,42,94,0.08)', active: 'rgba(14,42,94,0.12)' },
  green: { bg: '#1F5C1F', hover: 'rgba(31,92,31,0.08)', active: 'rgba(31,92,31,0.12)' },
  gold: { bg: '#7A5A0E', hover: 'rgba(122,90,14,0.08)', active: 'rgba(122,90,14,0.12)' },
};

export function WorkspaceLayout({ children, role, accent, sections, current, onNav, user }: WorkspaceShellProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const ac = accentColors[accent];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F4F2EB' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 260,
        background: 'white',
        borderRight: '1px solid var(--color-rule)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {/* Sidebar header */}
        <div style={{
          padding: collapsed ? '18px 12px' : '18px 20px',
          borderBottom: '1px solid var(--color-rule-soft)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 32, height: 32,
            background: ac.bg,
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 14,
            flexShrink: 0,
          }}>
            {role.charAt(0)}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ac.bg, whiteSpace: 'nowrap' }}>{role}</div>
              <div style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>Portail institutionnel</div>
            </div>
          )}
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }} aria-label="Navigation de l'espace de travail">
          {sections.map((section, si) => (
            <div key={si}>
              {section.heading && !collapsed && (
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--color-ink-mute)', padding: '16px 20px 6px',
                }}>{section.heading}</div>
              )}
              {section.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%',
                    padding: collapsed ? '10px 20px' : '10px 20px',
                    background: current === item.id ? ac.active : 'transparent',
                    border: 'none',
                    borderLeft: current === item.id ? `3px solid ${ac.bg}` : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: current === item.id ? 600 : 400,
                    color: current === item.id ? ac.bg : 'var(--color-ink-soft)',
                    transition: 'all 0.12s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (current !== item.id) (e.currentTarget as HTMLElement).style.background = ac.hover;
                  }}
                  onMouseLeave={e => {
                    if (current !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                      background: current === item.id ? ac.bg : 'var(--color-cream-warm)',
                      color: current === item.id ? 'white' : 'var(--color-ink-mute)',
                      padding: '2px 8px', borderRadius: 100,
                    }}>{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar footer: user + back link */}
        <div style={{ borderTop: '1px solid var(--color-rule-soft)' }}>
          {!collapsed && (
            <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32,
                background: ac.bg,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 12, fontWeight: 700,
                flexShrink: 0,
              }}>{user.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>{user.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: collapsed ? '12px 20px' : '10px 20px',
              background: 'transparent', border: 0, cursor: 'pointer',
              fontSize: 12, color: 'var(--color-ink-mute)',
              borderTop: collapsed ? 0 : '1px solid var(--color-rule-soft)',
              transition: 'color 0.12s',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = ac.bg)}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ink-mute)')}
            title="Retour au portail public"
            aria-label="Retour au portail public"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {!collapsed && <span>Retour au portail public</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          height: 56,
          background: 'white',
          borderBottom: '1px solid var(--color-rule)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 12,
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--color-ink-mute)', display: 'flex', alignItems: 'center',
              padding: 4, borderRadius: 4,
            }}
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div style={{ flex: 1 }} />

          <label style={{
            display: 'flex', alignItems: 'center',
            background: 'var(--color-cream)', border: '1px solid var(--color-rule)',
            borderRadius: 4, padding: '0 12px', height: 36, maxWidth: 320, width: '100%',
          }} aria-label="Recherche dans l'espace">
            <Search size={14} style={{ color: 'var(--color-ink-mute)', flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Rechercher…"
              style={{
                border: 0, background: 'transparent', font: 'inherit',
                fontSize: 13, padding: '0 8px', flex: 1, color: 'var(--color-ink)',
                outline: 'none',
              }}
            />
            <kbd style={{
              fontSize: 10, color: 'var(--color-ink-mute)',
              background: 'var(--color-cream-warm)', border: '1px solid var(--color-rule)',
              borderRadius: 3, padding: '1px 5px', flexShrink: 0,
            }}>⌘K</kbd>
          </label>

          <button
            aria-label="Notifications"
            style={{
              position: 'relative',
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: 'var(--color-ink-mute)', padding: 6,
            }}
          >
            <Bell size={18} />
            <span aria-hidden="true" style={{
              position: 'absolute', top: 4, right: 4,
              width: 7, height: 7, background: 'var(--color-red)',
              borderRadius: '50%', border: '1.5px solid white',
            }} />
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid var(--color-rule)',
              borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
              fontSize: 12, color: 'var(--color-ink-soft)',
            }}
          >
            <LogOut size={14} />
            Portail public
          </button>
        </div>

        {/* Content area */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 36px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
