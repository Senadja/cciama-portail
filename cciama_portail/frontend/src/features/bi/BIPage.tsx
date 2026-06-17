import { useState } from 'react';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import { LayoutGrid, Activity, Wallet, MapPin, Users, FileText, Download } from 'lucide-react';

/* ── Shared chart types ── */
interface ChartPoint { l: string; v: number; }

/* ── Sparkline on KPI card ── */
function BIKpiSpark({ color }: { color: string }) {
  const pts = [10, 14, 9, 18, 16, 22, 20, 26, 24, 30];
  const max = Math.max(...pts);
  const W = 120, H = 32;
  const path = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 32, display: 'block', marginTop: 10, opacity: 0.85 }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Line chart (SLA trend) ── */
function LineChart({ data, height = 180, color = 'var(--color-navy)' }: { data: ChartPoint[]; height?: number; color?: string }) {
  const W = 520, H = height - 40;
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const range = max - min || 1;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((d.v - min) / range) * H,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

  return (
    <svg viewBox={`0 -10 ${W + 30} ${H + 40}`} width="100%" height={height}>
      <defs>
        <linearGradient id="biLineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1="0" y1={(H / 3) * i} x2={W} y2={(H / 3) * i} stroke="var(--color-rule-soft)" strokeDasharray="3 3" />
      ))}
      <path d={areaPath} fill="url(#biLineGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2.2" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={(i / (data.length - 1)) * W} y={H + 20} textAnchor="middle" fontSize="11" fill="var(--color-ink-mute)">{d.l}</text>
      ))}
    </svg>
  );
}

/* ── Main page ── */
export function BIPage() {
  const [view, setView] = useState('overview');
  const [period, setPeriod] = useState('30j');

  const sections = [
    { items: [
      { id: 'overview',   icon: <LayoutGrid size={16} />, label: "Vue d'ensemble" },
      { id: 'ops',        icon: <Activity size={16} />,   label: "Performances opérationnelles" },
      { id: 'finance',    icon: <Wallet size={16} />,     label: "Exécution budgétaire" },
      { id: 'territoire', icon: <MapPin size={16} />,     label: "Vue territoriale" },
      { id: 'rh',         icon: <Users size={16} />,      label: "Ressources humaines" },
    ]},
    { heading: 'Rapports', items: [
      { id: 'reports', icon: <FileText size={16} />, label: "Rapports périodiques" },
      { id: 'export',  icon: <Download size={16} />, label: "Exporter" },
    ]},
  ];

  const allItems = sections.flatMap(s => s.items);

  return (
    <WorkspaceLayout
      role="Tableau de bord décideurs"
      accent="gold"
      sections={sections}
      current={view}
      onNav={setView}
      user={{ initials: 'IS', name: 'S.E.M. Issa Saleh', role: 'Ministre' }}
    >
      {view === 'overview' && <BIOverview period={period} setPeriod={setPeriod} />}
      {view !== 'overview' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600 }}>
              {allItems.find(i => i.id === view)?.label}
            </h1>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: 48, textAlign: 'center', color: 'var(--color-ink-mute)' }}>
            Tableau détaillé · indicateurs spécifiques à cette dimension.
          </div>
        </>
      )}
    </WorkspaceLayout>
  );
}

/* ── Overview ── */
function BIOverview({ period, setPeriod }: { period: string; setPeriod: (p: string) => void }) {
  const monthly: ChartPoint[] = [
    { l: 'Jan', v: 1820 },{ l: 'Fév', v: 2140 },{ l: 'Mar', v: 2380 },
    { l: 'Avr', v: 2210 },{ l: 'Mai', v: 2680 },{ l: 'Jun', v: 2890 },
    { l: 'Jul', v: 3120 },{ l: 'Aoû', v: 3340 },{ l: 'Sep', v: 3580 },
    { l: 'Oct', v: 3720 },{ l: 'Nov', v: 3950 },{ l: 'Déc', v: 4180 },
  ];
  const sla: ChartPoint[] = [
    { l: 'Lun', v: 94 },{ l: 'Mar', v: 96 },{ l: 'Mer', v: 92 },
    { l: 'Jeu', v: 97 },{ l: 'Ven', v: 95 },{ l: 'Sam', v: 89 },{ l: 'Dim', v: 91 },
  ];
  const byDir = [
    { l: 'État Civil',        v: 2840, color: '#0E2A5E' },
    { l: 'Urbanisme',         v: 1240, color: '#C8961E' },
    { l: 'Sécurité Publique', v: 980,  color: '#B81E2C' },
    { l: 'Affaires Sociales', v: 720,  color: '#1F5C1F' },
    { l: 'Fiscalité',         v: 540,  color: '#5C2D8C' },
    { l: 'Autres',            v: 380,  color: '#3A3A3A' },
  ];
  const ranking = [
    { name: "Direction de l'État Civil",           value: '2 840', delta: '+12%', up: true },
    { name: "Direction de l'Urbanisme",            value: '1 240', delta: '+4%',  up: true },
    { name: 'Direction de la Sécurité Publique',   value: '980',   delta: '-2%',  up: false },
    { name: 'Direction des Affaires Sociales',     value: '720',   delta: '+18%', up: true },
    { name: 'Direction Fiscalité',                 value: '540',   delta: '-7%',  up: false },
  ];
  const provinces = [
    { name: "N'Djamena",          value: '4 820', share: 72 },
    { name: 'Logone Occidental',  value: '1 240', share: 38 },
    { name: 'Mayo-Kebbi Est',     value: '980',   share: 31 },
    { name: 'Hadjer-Lamis',       value: '720',   share: 24 },
    { name: 'Ouaddaï',            value: '610',   share: 20 },
    { name: 'Borkou',             value: '380',   share: 12 },
  ];
  const alerts = [
    { sev: 'danger',  t: 'Délai dépassé sur 12 dossiers',                 s: "Direction de l'Urbanisme · à arbitrer" },
    { sev: 'warning', t: '4 décrets en attente de signature',              s: 'Cabinet · échéance < 48h' },
    { sev: 'info',    t: 'Hausse de 18% des demandes (Affaires Sociales)', s: 'Vs même période 2025' },
  ];

  const card = { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' } as const;
  const kpi  = { ...card, position: 'relative' as const, overflow: 'hidden' as const };
  const max  = Math.max(...monthly.map(d => d.v));
  const total = byDir.reduce((s, d) => s + d.v, 0);
  const donutR = 70, donutC = 2 * Math.PI * donutR;

  const alertColors: Record<string, string> = {
    danger:  'var(--color-red)',
    warning: '#C8961E',
    info:    'var(--color-navy)',
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7A5A0E', marginBottom: 4 }}>Tableau de bord exécutif</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600 }}>Vue d'ensemble — Mai 2026</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Indicateurs consolidés pour la prise de décision · données rafraîchies il y a 4 minutes.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--color-rule)', borderRadius: 4, overflow: 'hidden' }}>
            {['7j','30j','90j','12m'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 12px', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: period === p ? '#7A5A0E' : 'white', color: period === p ? 'white' : 'var(--color-ink-soft)' }}>{p}</button>
            ))}
          </div>
          <button className="btn btn-outline" style={{ fontSize: 13 }}>⤓ Exporter PDF</button>
          <button className="btn btn-primary" style={{ background: '#7A5A0E', borderColor: '#7A5A0E', fontSize: 13 }}>Briefing du jour</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { k: 'Dossiers traités', v: '6 482',    d: '↗ + 12,4 % vs avril', c: '#0E2A5E' },
          { k: 'Délai moyen',      v: '3,8 jours', d: '↘ — 0,6 j vs avril',  c: '#1F5C1F' },
          { k: 'SLA respecté',     v: '94,2 %',   d: '↗ + 2,1 pts',          c: '#C8961E' },
          { k: 'Budget exécuté',   v: '68 %',     d: '42,8 Mds / 63 Mds FCFA',c: '#B81E2C' },
        ].map(s => (
          <div key={s.k} style={kpi}>
            <div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>{s.k}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--color-navy)', marginTop: 4 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: '#1F5C1F', marginTop: 4 }}>{s.d}</div>
            <BIKpiSpark color={s.c} />
          </div>
        ))}
      </div>

      {/* Charts row 1: bar + donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Volume mensuel des dossiers traités</h3>
            <span style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>2026 · 12 mois</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
            {monthly.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-ink-mute)' }}>{d.v}</span>
                <div style={{ width: '100%', height: `${(d.v / max) * 100}%`, background: 'var(--color-navy)', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                <span style={{ fontSize: 10, color: 'var(--color-ink-mute)' }}>{d.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Répartition par direction</h3>
            <span style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>Cumul mensuel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <svg width={160} height={160} viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={donutR} fill="none" stroke="var(--color-cream-warm)" strokeWidth="22" />
              {(() => {
                let offset = 0;
                return byDir.map((d, i) => {
                  const len = (d.v / total) * donutC;
                  const el = <circle key={i} cx="100" cy="100" r={donutR} fill="none" stroke={d.color} strokeWidth="22" strokeDasharray={`${len} ${donutC}`} strokeDashoffset={-offset} transform="rotate(-90 100 100)" />;
                  offset += len;
                  return el;
                });
              })()}
              <text x="100" y="96"  textAnchor="middle" fontSize="28" fontWeight="600" fontFamily="var(--font-serif)" fill="var(--color-navy)">{total.toLocaleString('fr-FR')}</text>
              <text x="100" y="116" textAnchor="middle" fontSize="10" fill="var(--color-ink-mute)" letterSpacing="2">DOSSIERS</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {byDir.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--color-ink-soft)' }}>{d.l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.v.toLocaleString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2: SLA line + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>SLA quotidien — semaine en cours</h3>
            <span style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>Cible : 90 % · % traités dans les délais</span>
          </div>
          <LineChart data={sla} color="#1F5C1F" height={160} />
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Alertes décisionnelles</h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-ink-mute)' }}>3 en cours</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 6, background: 'var(--color-cream)', border: `1px solid ${alertColors[a.sev]}22` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: alertColors[a.sev], flexShrink: 0, marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>{a.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>{a.s}</div>
                </div>
                <button style={{ border: '1px solid var(--color-rule)', borderRadius: 3, padding: '3px 8px', cursor: 'pointer', background: 'transparent', fontSize: 12, flexShrink: 0 }}>→</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: ranking + provinces */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card}>
          <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', marginBottom: 16 }}>Classement des directions</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '2px solid var(--color-rule)', fontSize: 11, color: 'var(--color-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <th style={{ padding: '8px 0', textAlign: 'left' }}>Direction</th>
              <th style={{ padding: '8px 0', textAlign: 'right' }}>Dossiers</th>
              <th style={{ padding: '8px 0', textAlign: 'right' }}>Évol.</th>
            </tr></thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  <td style={{ padding: '10px 0' }}>{r.name}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{r.value}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', color: r.up ? '#1F5C1F' : 'var(--color-red)', fontWeight: 600 }}>
                    {r.up ? '↗' : '↘'} {r.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', marginBottom: 16 }}>Répartition territoriale</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {provinces.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                <span>{p.name}</span>
                <div style={{ height: 8, background: 'var(--color-cream-warm)', borderRadius: 100 }}>
                  <div style={{ height: '100%', width: `${p.share}%`, background: 'var(--color-navy)', borderRadius: 100 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', textAlign: 'right', fontSize: 12 }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
