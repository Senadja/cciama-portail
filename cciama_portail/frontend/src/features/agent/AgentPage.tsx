import { useState } from 'react';
import { Inbox, Clock, CheckCircle, Plus, BarChart3, Archive, Search } from 'lucide-react';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import type { AgentDossier } from '@/types';

const AGENT_DOSSIERS: AgentDossier[] = [
  { id: "TCD-2026-08421", type: "Acte de naissance",        citoyen: "Mahamat Adam Hassan",   deposit: "12 mai 2026", deadline: "26 mai 2026", priority: "normal", priorityLabel: "Normale", current: "Instruction", daysLeft: 4, age: 10,
    flow: [{ svc: "Guichet central", state: "done", agent: "M. Saleh G.", date: "12/05" },{ svc: "Vérification pièces", state: "done", agent: "Mme Aché D.", date: "13/05" },{ svc: "Direction État Civil", state: "current", agent: "— En attente —", date: "—" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }],
    docs: [{ name: "Formulaire CERFA-A4", size: "180 ko", ok: true },{ name: "Copie pièce d'identité", size: "740 ko", ok: true },{ name: "Justificatif domicile", size: "1.2 Mo", ok: true },{ name: "Photo d'identité", size: "320 ko", ok: true }] },
  { id: "TCD-2026-08433", type: "Certificat de nationalité", citoyen: "Fatimé Idriss Béchir",  deposit: "13 mai 2026", deadline: "27 mai 2026", priority: "high",   priorityLabel: "Urgente", current: "Instruction", daysLeft: 5, age: 9,
    flow: [{ svc: "Guichet central", state: "done" },{ svc: "Vérification pièces", state: "done" },{ svc: "Direction État Civil", state: "current" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }], docs: [] },
  { id: "TCD-2026-08440", type: "Acte de naissance",        citoyen: "Issa Béchir Ngarmadji", deposit: "14 mai 2026", deadline: "28 mai 2026", priority: "normal", priorityLabel: "Normale", current: "Instruction", daysLeft: 6, age: 8,
    flow: [{ svc: "Guichet central", state: "done" },{ svc: "Vérification pièces", state: "done" },{ svc: "Direction État Civil", state: "current" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }], docs: [] },
  { id: "TCD-2026-08458", type: "Acte de naissance",        citoyen: "Halimé Goukouni Adoum", deposit: "15 mai 2026", deadline: "29 mai 2026", priority: "low",    priorityLabel: "Basse",   current: "Instruction", daysLeft: 7, age: 7,
    flow: [{ svc: "Guichet central", state: "done" },{ svc: "Vérification pièces", state: "done" },{ svc: "Direction État Civil", state: "current" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }], docs: [] },
  { id: "TCD-2026-08482", type: "Acte de mariage",          citoyen: "Zara Mahamat Saleh",    deposit: "16 mai 2026", deadline: "30 mai 2026", priority: "high",   priorityLabel: "Urgente", current: "Instruction", daysLeft: 8, age: 6,
    flow: [{ svc: "Guichet central", state: "done" },{ svc: "Vérification pièces", state: "done" },{ svc: "Direction État Civil", state: "current" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }], docs: [] },
  { id: "TCD-2026-08503", type: "Acte de naissance",        citoyen: "Adoum Hissène Yacoub",  deposit: "17 mai 2026", deadline: "31 mai 2026", priority: "normal", priorityLabel: "Normale", current: "Instruction", daysLeft: 9, age: 5,
    flow: [{ svc: "Guichet central", state: "done" },{ svc: "Vérification pièces", state: "done" },{ svc: "Direction État Civil", state: "current" },{ svc: "Signature SG", state: "pending" },{ svc: "Mise à disposition", state: "pending" }], docs: [] },
];

const ws = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 } as const,
  eyebrow:  { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#1F5C1F', marginBottom: 4 },
  title:    { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600 },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 },
  actions:  { display: 'flex', gap: 10 } as const,
  card:     { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 } as const,
  kpiGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 } as const,
  kpi:      { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '20px 24px' } as const,
  table:    { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  tableHead:{ background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)' },
  input:    { width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, font: 'inherit', fontSize: 14, background: 'var(--color-cream)', color: 'var(--color-ink)', boxSizing: 'border-box' as const },
  label:    { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 },
};

export function AgentPage() {
  const [view, setView] = useState('queue');
  const [selected, setSelected] = useState<AgentDossier | null>(null);
  const [filter, setFilter] = useState('todo');
  const [actionModal, setActionModal] = useState<string | null>(null);

  const sections = [
    { items: [
      { id: 'queue',   icon: <Inbox size={16} />,       label: 'À traiter',              badge: AGENT_DOSSIERS.length },
      { id: 'pending', icon: <Clock size={16} />,       label: 'En attente complément',  badge: 3 },
      { id: 'history', icon: <CheckCircle size={16} />, label: 'Traités',                badge: 142 },
    ]},
    { heading: 'Outils', items: [
      { id: 'register', icon: <Plus size={16} />,       label: 'Enregistrer un dossier' },
      { id: 'stats',    icon: <BarChart3 size={16} />,  label: 'Mes statistiques' },
      { id: 'archive',  icon: <Archive size={16} />,    label: 'Archives' },
    ]},
  ];

  return (
    <WorkspaceLayout
      role="Direction de l'État Civil"
      accent="green"
      sections={sections}
      current={view}
      onNav={(id) => { setView(id); setSelected(null); }}
      user={{ initials: 'MO', name: 'Mahamat Ousmane', role: 'Agent instructeur · Niveau 2' }}
    >
      {view === 'queue' && !selected && (
        <AgentQueue dossiers={AGENT_DOSSIERS} filter={filter} setFilter={setFilter} onOpen={setSelected} />
      )}
      {view === 'queue' && selected && (
        <AgentDetail dossier={selected} onBack={() => setSelected(null)} onAction={setActionModal} />
      )}
      {view === 'register' && <AgentRegister />}
      {view === 'pending'  && <AgentPending />}
      {view === 'history'  && <AgentHistory />}
      {view === 'stats'    && <AgentStats />}
      {view === 'archive'  && (
        <>
          <div style={ws.pageHead}><div><h1 style={ws.title}>Archives</h1></div></div>
          <div style={{ ...ws.card, padding: 48, textAlign: 'center', color: 'var(--color-ink-mute)' }}>Section dédiée — vue spécifique du service.</div>
        </>
      )}

      {actionModal && selected && (
        <AgentActionModal kind={actionModal} dossier={selected} onClose={() => setActionModal(null)} />
      )}
    </WorkspaceLayout>
  );
}

/* ── Queue ── */
function AgentQueue({ dossiers, filter, setFilter, onOpen }: {
  dossiers: AgentDossier[];
  filter: string;
  setFilter: (f: string) => void;
  onOpen: (d: AgentDossier) => void;
}) {
  const [search, setSearch] = useState('');
  const urgentCount = dossiers.filter(d => d.priority === 'high').length;

  const visible = dossiers.filter(d => {
    if (filter === 'urgent') return d.priority === 'high';
    if (search) {
      const q = search.toLowerCase();
      return d.id.toLowerCase().includes(q) || d.citoyen.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <div style={ws.eyebrow}>Direction de l'État Civil</div>
          <h1 style={ws.title}>Dossiers à instruire</h1>
          <p style={ws.subtitle}>Seuls les dossiers se trouvant à l'étape de votre service sont visibles ici.</p>
        </div>
        <div style={ws.actions}><button className="btn btn-outline">Exporter (CSV)</button></div>
      </div>

      <div style={ws.kpiGrid}>
        <div style={ws.kpi}><div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>À instruire</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--color-navy)' }}>{dossiers.length}</div><div style={{ fontSize: 12, color: '#1F5C1F' }}>↗ + 2 depuis hier</div></div>
        <div style={ws.kpi}><div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>Urgents</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--color-red)' }}>{urgentCount}</div><div style={{ fontSize: 12, color: 'var(--color-ink-mute)' }}>Priorité haute</div></div>
        <div style={ws.kpi}><div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>SLA respecté</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700 }}>98 %</div><div style={{ fontSize: 12, color: '#1F5C1F' }}>↗ ce mois-ci</div></div>
        <div style={ws.kpi}><div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>Délai moyen</div><div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700 }}>2,1 <span style={{ fontSize: 16, color: 'var(--color-ink-mute)' }}>jours</span></div><div style={{ fontSize: 12, color: 'var(--color-ink-mute)' }}>Par dossier</div></div>
      </div>

      <div style={ws.card}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--color-rule-soft)', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, border: '1px solid var(--color-rule)', borderRadius: 4, padding: '7px 12px', background: 'var(--color-cream)' }}>
            <Search size={14} style={{ color: 'var(--color-ink-mute)', flexShrink: 0 }} />
            <input
              placeholder="Rechercher par référence, citoyen…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', font: 'inherit', fontSize: 13, flex: 1, outline: 'none', color: 'var(--color-ink)' }}
            />
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['todo','Tous'],['urgent','Urgents'],['today',"Aujourd'hui"]].map(([f, l]) => (
              <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'active' : ''}`}>{l}</button>
            ))}
          </div>
        </div>
        <table style={ws.table}>
          <thead><tr style={ws.tableHead}>
            <th style={{ padding: '10px 14px', width: 36 }}><input type="checkbox" /></th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Référence</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Citoyen</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Type de demande</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Dépôt</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Échéance</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Priorité</th>
            <th style={{ padding: '10px 14px', textAlign: 'left' }}>Âge</th>
            <th style={{ padding: '10px 14px' }}></th>
          </tr></thead>
          <tbody>
            {visible.map(d => (
              <tr key={d.id} onClick={() => onOpen(d)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--color-rule-soft)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-cream-warm)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '10px 14px' }}><input type="checkbox" onClick={e => e.stopPropagation()} /></td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-navy)', fontWeight: 600 }}>{d.id}</td>
                <td style={{ padding: '12px 14px' }}>{d.citoyen}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>{d.type}</td>
                <td style={{ padding: '12px 14px' }}>{d.deposit}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ color: d.daysLeft <= 3 ? 'var(--color-red)' : 'var(--color-ink)' }}>
                    {d.deadline} <span style={{ color: 'var(--color-ink-mute)' }}>({d.daysLeft} j)</span>
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: d.priority === 'high' ? 'rgba(184,30,44,0.1)' : d.priority === 'low' ? 'rgba(14,42,94,0.06)' : 'rgba(31,92,31,0.1)', color: d.priority === 'high' ? 'var(--color-red)' : d.priority === 'low' ? 'var(--color-ink-mute)' : '#1F5C1F' }}>
                    {d.priorityLabel}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{d.age} j</td>
                <td style={{ padding: '10px 14px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button title="Valider" onClick={() => onOpen(d)} style={{ width: 24, height: 24, border: '1px solid rgba(31,92,31,0.3)', borderRadius: 3, cursor: 'pointer', background: 'transparent', color: '#1F5C1F', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</button>
                    <button title="Demander complément" onClick={() => onOpen(d)} style={{ width: 24, height: 24, border: '1px solid rgba(200,150,30,0.3)', borderRadius: 3, cursor: 'pointer', background: 'transparent', color: '#7A5A0E', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</button>
                    <button title="Rejeter" onClick={() => onOpen(d)} style={{ width: 24, height: 24, border: '1px solid rgba(184,30,44,0.3)', borderRadius: 3, cursor: 'pointer', background: 'transparent', color: 'var(--color-red)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--color-ink-mute)', borderTop: '1px solid var(--color-rule-soft)' }}>
          {visible.length} dossier{visible.length > 1 ? 's' : ''} — visibles uniquement par votre service.
        </div>
      </div>
    </>
  );
}

/* ── Detail ── */
function AgentDetail({ dossier, onBack, onAction }: { dossier: AgentDossier; onBack: () => void; onAction: (k: string) => void }) {
  const defaultDocs = [
    { name: "Formulaire CERFA-A4", size: "180 ko", ok: true },
    { name: "Copie pièce d'identité", size: "740 ko", ok: true },
    { name: "Justificatif domicile", size: "1.2 Mo", ok: true },
    { name: "Photo d'identité", size: "320 ko", ok: true },
  ];
  const docs = dossier.docs.length ? dossier.docs : defaultDocs;

  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: 'var(--color-ink-mute)', fontWeight: 500, padding: 0 }}>
            ← Retour à la file
          </button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 8 }}>
            <h1 style={ws.title}>{dossier.type}</h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--color-ink-mute)' }}>{dossier.id}</span>
          </div>
          <p style={ws.subtitle}>Déposé par <strong>{dossier.citoyen}</strong> le {dossier.deposit}</p>
        </div>
        <div style={ws.actions}>
          <button className="btn btn-ghost" onClick={() => onAction('complement')}>? Demander un complément</button>
          <button className="btn btn-outline" style={{ borderColor: 'var(--color-red)', color: 'var(--color-red)' }} onClick={() => onAction('reject')}>× Rejeter</button>
          <button className="btn btn-primary" style={{ background: '#1F5C1F', borderColor: '#1F5C1F' }} onClick={() => onAction('validate')}>✓ Valider et transmettre</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div style={ws.card}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Informations du dossier</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: 13 }}>
            {[
              ['Référence', dossier.id],
              ['Type', dossier.type],
              ['Demandeur', dossier.citoyen],
              ["Pièce d'identité", 'CNI · 2024-0184-731'],
              ['Téléphone', '+235 66 22 11 84'],
              ['Email', dossier.citoyen.split(' ').join('.').toLowerCase() + '@email.td'],
              ['Date de dépôt', dossier.deposit],
              ['Échéance légale', dossier.deadline],
            ].map(([k, v]) => (
              <div key={k}><div style={{ fontSize: 11, color: 'var(--color-ink-mute)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div><div style={{ fontWeight: 600 }}>{v}</div></div>
            ))}
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 14px' }}>Pièces jointes</h4>
          {docs.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-rule-soft)', fontSize: 13 }}>
              <span style={{ padding: '4px 8px', background: 'var(--color-red)', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 2, flexShrink: 0 }}>PDF</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>{f.size}</div>
              </div>
              {f.ok && <span style={{ fontSize: 12, color: '#1F5C1F', fontWeight: 600 }}>✓ Conforme</span>}
              <button style={{ border: '1px solid var(--color-rule)', borderRadius: 3, padding: '3px 8px', cursor: 'pointer', background: 'transparent', fontSize: 12 }}>⤓</button>
            </div>
          ))}

          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 10px' }}>Notes internes</h4>
          <textarea style={ws.input} rows={3} placeholder="Ajouter une note visible uniquement par les agents…" />
        </div>

        <div style={ws.card}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Circuit de traitement</h4>
          <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', marginBottom: 14 }}>
            Vous êtes à l'étape <strong style={{ color: 'var(--color-navy)' }}>{dossier.current}</strong>.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {dossier.flow.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0 12px 16px', borderLeft: `2px solid ${s.state === 'done' ? 'var(--color-navy)' : s.state === 'current' ? 'var(--color-gold)' : 'var(--color-rule)'}`, position: 'relative' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: s.state === 'done' ? 'var(--color-navy)' : s.state === 'current' ? 'var(--color-gold)' : 'var(--color-cream-warm)', color: s.state === 'pending' ? 'var(--color-ink-mute)' : 'white', position: 'absolute', left: -11, flexShrink: 0 }}>
                  {s.state === 'done' ? '✓' : s.state === 'current' ? '●' : (i + 1)}
                </div>
                <div style={{ marginLeft: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: s.state === 'pending' ? 'var(--color-ink-mute)' : 'var(--color-ink)' }}>{s.svc}</div>
                  {s.agent && <div style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>{s.agent} · {s.date}</div>}
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 10px' }}>Activité du dossier</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['14:32', 'Vérification des pièces validée par', 'Aché D.'],
              ['09:14', 'Dossier déposé via le portail', ''],
            ].map(([time, txt, who], i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--color-ink-soft)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-ink-mute)' }}>{time}</span>{' '}
                {txt} {who && <strong>{who}</strong>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Action modal ── */
type ModalKind = 'validate' | 'complement' | 'reject';

function AgentActionModal({ kind, dossier, onClose }: { kind: string; dossier: AgentDossier; onClose: () => void }) {
  const cfg: Record<ModalKind, { title: string; desc: string; color: string; ctaLabel: string; reasonRequired: boolean }> = {
    validate: {
      title: "Valider le dossier",
      desc: "Le dossier sera transmis automatiquement au service suivant : Signature SG. Le citoyen recevra une notification.",
      color: "#1F5C1F",
      ctaLabel: "Valider et transmettre",
      reasonRequired: false,
    },
    complement: {
      title: "Demander un complément",
      desc: "Le dossier sera renvoyé au citoyen. Il devra fournir les pièces demandées sous 15 jours.",
      color: "#7A5410",
      ctaLabel: "Envoyer la demande",
      reasonRequired: true,
    },
    reject: {
      title: "Rejeter le dossier",
      desc: "Le rejet est définitif. Le motif sera communiqué au citoyen qui dispose d'un délai de recours gracieux de 30 jours.",
      color: "var(--color-red)",
      ctaLabel: "Confirmer le rejet",
      reasonRequired: true,
    },
  };
  const c = cfg[kind as ModalKind];
  if (!c) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: 10, width: '100%', maxWidth: 520, borderTop: `4px solid ${c.color}`, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-rule-soft)' }}>
          <h3 style={{ fontSize: 18, fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{c.title}</h3>
          <button onClick={onClose} aria-label="Fermer" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--color-ink-mute)', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ background: 'var(--color-cream-warm)', borderRadius: 4, padding: '10px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
            {dossier.id} · {dossier.type} · {dossier.citoyen}
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>{c.desc}</p>
          {c.reasonRequired && (
            <>
              <label style={{ ...ws.label, marginTop: 0 }}>
                Motif {kind === 'reject' && <span style={{ color: 'var(--color-red)' }}>*</span>}
              </label>
              {kind === 'complement' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {["Photo d'identité non conforme","Justificatif de domicile manquant","Signature absente sur le formulaire","Document expiré","Information illisible"].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                      <input type="checkbox" /> {t}
                    </label>
                  ))}
                </div>
              )}
              <textarea
                style={ws.input}
                rows={4}
                placeholder={kind === 'reject' ? "Motif détaillé du rejet (visible par le citoyen)…" : "Précisions complémentaires (optionnel)…"}
              />
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--color-rule-soft)' }}>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" style={{ background: c.color, borderColor: c.color }}>{c.ctaLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Register ── */
function AgentRegister() {
  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <div style={ws.eyebrow}>Outil de saisie</div>
          <h1 style={ws.title}>Enregistrer un nouveau dossier</h1>
          <p style={ws.subtitle}>Formulaire utilisé par les agents de guichet pour saisir les demandes physiques.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={ws.card}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Demandeur</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
            {[['Nom','Nom de famille'],['Prénoms','Prénoms'],["Pièce d'identité",'N° CNI / Passeport'],['Date de naissance',''],['Téléphone','+235 …'],['Email','optionnel']].map(([label, ph]) => (
              <div key={label}>
                <label style={ws.label}>{label}</label>
                <input style={ws.input} placeholder={ph} type={label === 'Date de naissance' ? 'date' : 'text'} />
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 14px' }}>Demande</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
            <div><label style={ws.label}>Type de demande</label><select style={ws.input}><option>— Sélectionner —</option><option>Acte de naissance</option><option>Certificat de nationalité</option><option>Attestation de résidence</option><option>Acte de mariage</option></select></div>
            <div><label style={ws.label}>Priorité</label><select style={ws.input}><option>Normale</option><option>Urgente</option><option>Basse</option></select></div>
            <div><label style={ws.label}>Canal de dépôt</label><select style={ws.input}><option>Guichet physique</option><option>Portail en ligne</option><option>Courrier postal</option></select></div>
            <div><label style={ws.label}>Mode de retrait</label><select style={ws.input}><option>Au guichet</option><option>Courrier postal</option><option>Numérique signé</option></select></div>
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 10px' }}>Pièces fournies</h4>
          <div style={{ border: '2px dashed var(--color-rule)', borderRadius: 6, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: 'var(--color-cream)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="4" x2="12" y2="16"/><polyline points="7 9 12 4 17 9"/><line x1="4" y1="20" x2="20" y2="20"/></svg>
            <div><strong style={{ fontSize: 14 }}>Déposer ou scanner</strong> les documents · PDF, JPG (max 5 Mo)</div>
          </div>
        </div>
        <div style={ws.card}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Récapitulatif</h4>
          {[['Type','— à compléter —'],['Priorité','Normale'],['Pièces','0 / 4'],['Délai légal','14 jours'],['Référence','TCD-2026-08504']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-rule-soft)', fontSize: 13 }}>
              <span style={{ color: 'var(--color-ink-mute)' }}>{k}</span>
              <strong style={{ fontFamily: k === 'Référence' ? 'var(--font-mono)' : 'inherit' }}>{v}</strong>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16, background: '#1F5C1F', borderColor: '#1F5C1F' }}>Enregistrer le dossier</button>
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Annuler</button>
        </div>
      </div>
    </>
  );
}

/* ── Pending ── */
function AgentPending() {
  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <h1 style={ws.title}>En attente de complément</h1>
          <p style={ws.subtitle}>Dossiers renvoyés au citoyen pour pièces complémentaires.</p>
        </div>
      </div>
      <div style={{ ...ws.card, padding: 48, textAlign: 'center', color: 'var(--color-ink-mute)' }}>
        3 dossiers — délai de réponse en cours.
      </div>
    </>
  );
}

/* ── History ── */
function AgentHistory() {
  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <h1 style={ws.title}>Dossiers traités</h1>
          <p style={ws.subtitle}>142 dossiers — Historique consultable.</p>
        </div>
      </div>
      <div style={{ ...ws.card, padding: 48, textAlign: 'center', color: 'var(--color-ink-mute)' }}>
        Liste complète paginée des dossiers déjà traités par votre service.
      </div>
    </>
  );
}

/* ── Stats ── */
function AgentStats() {
  return (
    <>
      <div style={ws.pageHead}><div><h1 style={ws.title}>Mes statistiques</h1><p style={ws.subtitle}>Performance individuelle du mois.</p></div></div>
      <div style={ws.kpiGrid}>
        {[{ k:'Traités', v:'142', d:'ce mois-ci', c:'var(--color-ink)' },{ k:'Délai moyen', v:'2,1 j', d:'↗ amélioration', c:'#1F5C1F' },{ k:'SLA respecté', v:'98%', d:'3 hors délai', c:'#1F5C1F' },{ k:'Rang équipe', v:'2/14', d:'↗ +1 place', c:'#1F5C1F' }].map(s => (
          <div key={s.k} style={ws.kpi}>
            <div style={{ fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600 }}>{s.k}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: s.c }}>{s.d}</div>
          </div>
        ))}
      </div>
    </>
  );
}
