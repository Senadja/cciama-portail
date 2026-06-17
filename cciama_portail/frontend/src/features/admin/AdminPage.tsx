import { useState } from 'react';
import { LayoutGrid, Home, Newspaper, FileText, FolderKanban, Building2, Settings, Users, Zap, Image, Activity, Search, Sliders } from 'lucide-react';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';

import { AdminHomeEditor } from './views/AdminHomeEditor';
import { AdminMinisterEditor } from './views/AdminMinisterEditor';
import { AdminMissionsEditor } from './views/AdminMissionsEditor';
import { AdminOrganigram } from './views/AdminOrganigram';
import { AdminServicesEditor } from './views/AdminServicesEditor';
import { AdminSettings } from './views/AdminSettings';
import { AdminMediaLibrary } from './views/AdminMediaLibrary';
import { CollectionEditor } from './views/CollectionEditor';
import { newsConfig, documentsConfig, projectsConfig, organismsConfig, flashConfig, quickActionsConfig } from './views/collectionConfigs';

export function AdminPage() {
  const [view, setView] = useState('overview');

  const sections = [
    { items: [
      { id: 'overview', icon: <LayoutGrid size={16} />, label: 'Tableau de bord' },
    ]},
    { heading: 'Contenu du portail', items: [
      { id: 'home',       icon: <Home size={16} />,        label: "Page d'accueil" },
      { id: 'minister',   icon: <FileText size={16} />,    label: "Mot de l'Administrateur" },
      { id: 'missions',   icon: <Sliders size={16} />,     label: "Missions consulaires" },
      { id: 'organigram', icon: <Building2 size={16} />,   label: "Organigramme" },
      { id: 'services',   icon: <Settings size={16} />,    label: 'Catalogue services' },
      { id: 'news',       icon: <Newspaper size={16} />,   label: 'Actualités' },
      { id: 'docs',       icon: <FileText size={16} />,    label: 'Documentation' },
      { id: 'projects',   icon: <FolderKanban size={16} />,label: 'Projets' },
      { id: 'orgs',       icon: <Building2 size={16} />,   label: 'Organismes & partenaires' },
      { id: 'flash',      icon: <Zap size={16} />,         label: 'Bande Flash' },
      { id: 'quick',      icon: <Search size={16} />,      label: 'Accès rapides' },
      { id: 'media',      icon: <Image size={16} />,       label: 'Médiathèque' },
    ]},
    { heading: 'Administration', items: [
      { id: 'users',    icon: <Users size={16} />,    label: 'Utilisateurs' },
      { id: 'roles',    icon: <Users size={16} />,    label: 'Rôles & permissions' },
      { id: 'logs',     icon: <Activity size={16} />, label: "Journal d'activité" },
      { id: 'settings', icon: <Settings size={16} />, label: 'Paramètres généraux' },
    ]},
  ];

  return (
    <WorkspaceLayout
      role="Console d'administration"
      accent="navy"
      sections={sections}
      current={view}
      onNav={(id) => setView(id)}
      user={{ initials: 'AD', name: 'Aïcha Djimet', role: 'Administratrice' }}
    >
      {view === 'overview'  && <AdminOverview setView={setView} />}
      {view === 'home'      && <AdminHomeEditor />}
      {view === 'minister'  && <AdminMinisterEditor />}
      {view === 'missions'  && <AdminMissionsEditor />}
      {view === 'organigram'&& <AdminOrganigram />}
      {view === 'services'  && <AdminServicesEditor />}
      {view === 'news'      && <CollectionEditor config={newsConfig} />}
      {view === 'docs'      && <CollectionEditor config={documentsConfig} />}
      {view === 'projects'  && <CollectionEditor config={projectsConfig} />}
      {view === 'orgs'      && <CollectionEditor config={organismsConfig} />}
      {view === 'flash'     && <CollectionEditor config={flashConfig} />}
      {view === 'quick'     && <CollectionEditor config={quickActionsConfig} />}
      {view === 'settings'  && <AdminSettings />}
      {view === 'media'     && <AdminMediaLibrary />}
      {['users','roles','logs'].includes(view) && (
        <AdminGenericPlaceholder view={view} />
      )}
    </WorkspaceLayout>
  );
}

/* ── Shared inline styles ── */
const ws = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 } as const,
  eyebrow:  { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)', marginBottom: 4 },
  title:    { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 },
  actions:  { display: 'flex', gap: 10, alignItems: 'center' } as const,
  card:     { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', marginBottom: 20 } as const,
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 } as const,
  kpiGrid:  { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 } as const,
  kpi:      { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '20px 24px' } as const,
  kpiK:     { fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600, letterSpacing: '0.02em' },
  kpiV:     { fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--color-navy)', marginTop: 4 },
  kpiD:     { fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 4 },
  twocol:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 } as const,
};

/* ── Overview ── */
function AdminOverview({ setView }: { setView: (v: string) => void }) {
  const stats = [
    { k: 'Publications',       v: '34',     d: '+ 8 ce mois-ci',  up: true },
    { k: 'Documents officiels',v: '128',    d: '+ 12 ce mois-ci', up: true },
    { k: 'Utilisateurs actifs',v: '1 824 K',d: '+ 4,2 %',         up: true },
    { k: 'Dossiers ouverts',   v: '6 482',  d: '— 3,1 %',         up: false },
  ];
  const activity = [
    { who: 'Mahamat Ousmane', what: 'a publié un communiqué',       target: 'Adoption du plan numérique 2026–2030',   when: 'il y a 12 min' },
    { who: 'Fatimé Annour',   what: 'a modifié le projet',          target: "Modernisation de l'état civil",           when: 'il y a 38 min' },
    { who: 'Système',         what: 'a généré le rapport mensuel',  target: 'RAP-2026-MAI.pdf',                        when: 'il y a 1 h' },
    { who: 'Issa Béchir',     what: 'a archivé',                   target: 'Arrêté n°189/MEF/SG/2024',               when: 'il y a 3 h' },
    { who: 'Aïcha Djimet',    what: 'a créé un compte',            target: 'utilisateur — Saleh Goukouni',            when: 'hier 16:42' },
  ];

  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <div style={ws.eyebrow}>Vue d'ensemble</div>
          <h1 style={ws.title}>Bonjour Aïcha 👋</h1>
          <p style={ws.subtitle}>Voici un aperçu de l'activité éditoriale du portail.</p>
        </div>
        <div style={ws.actions}>
          <button className="btn btn-outline">Voir le journal complet</button>
          <button className="btn btn-primary" onClick={() => setView('news')}>+ Nouvelle publication</button>
        </div>
      </div>

      <div style={ws.kpiGrid}>
        {stats.map(s => (
          <div key={s.k} style={ws.kpi}>
            <div style={ws.kpiK}>{s.k}</div>
            <div style={ws.kpiV}>{s.v}</div>
            <div style={{ ...ws.kpiD, color: s.up ? '#1F5C1F' : 'var(--color-red)' }}>
              {s.up ? '↗' : '↘'} {s.d}
            </div>
          </div>
        ))}
      </div>

      <div style={ws.twocol}>
        <div style={ws.card}>
          <div style={ws.cardHead}>
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Activité récente</h3>
            <span style={{ fontSize: 12, color: 'var(--color-navy)', cursor: 'pointer' }}>Voir tout</span>
          </div>
          {activity.map((a, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-rule-soft)', fontSize: 13 }}>
              <div><strong>{a.who}</strong> {a.what} · <em>{a.target}</em></div>
              <div style={{ fontSize: 11, color: 'var(--color-ink-mute)', marginTop: 2 }}>{a.when}</div>
            </div>
          ))}
        </div>
        <div style={ws.card}>
          <div style={ws.cardHead}><h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Actions rapides</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: '📰 Publier une actualité', view: 'news' },
              { label: '📑 Téléverser un document', view: 'docs' },
              { label: '⚡ Modifier la bande Flash', view: 'flash' },
              { label: '🏗️ Ajouter un projet', view: 'projects' },
              { label: "🏠 Éditer l'accueil", view: 'home' },
              { label: '🗂️ Catalogue services', view: 'services' },
            ].map(a => (
              <button key={a.view} onClick={() => setView(a.view)} style={{
                padding: '12px 16px', background: 'var(--color-cream)', border: '1px solid var(--color-rule)',
                borderRadius: 6, cursor: 'pointer', fontSize: 13, textAlign: 'left', transition: 'all 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-navy)'; e.currentTarget.style.background = 'var(--color-cream-warm)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-rule)'; e.currentTarget.style.background = 'var(--color-cream)'; }}
              >{a.label}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Generic placeholder (sections d'administration à venir) ── */
function AdminGenericPlaceholder({ view }: { view: string }) {
  const titles: Record<string, [string, string]> = {
    users:    ["Utilisateurs",               "Comptes des agents et administrateurs"],
    roles:    ["Rôles & permissions",        "Définition des droits d'accès"],
    logs:     ["Journal d'activité",         "Historique des actions effectuées"],
  };
  const [t, sub] = titles[view] || ["Section", ""];

  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <div style={ws.eyebrow}>Administration</div>
          <h1 style={ws.title}>{t}</h1>
          <p style={ws.subtitle}>{sub}</p>
        </div>
        <div style={ws.actions}>
          <button className="btn btn-primary">+ Ajouter</button>
        </div>
      </div>
      <div style={{ ...ws.card, padding: 48, textAlign: 'center', color: 'var(--color-ink-mute)' }}>
        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>⚙️</div>
        <p>Cette section dispose d'un éditeur dédié, structuré comme les autres pages d'administration.</p>
      </div>
    </>
  );
}
