import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Home, Newspaper, FileText, FolderKanban, Building2, Settings, Users, Zap, Image, Activity, Search, Sliders, KeyRound, ShieldCheck, LayoutList, Plus } from 'lucide-react';
import { WorkspaceLayout } from '@/layouts/WorkspaceLayout';
import { useDocuments, useNews, useOrganisms, useProjects } from '@/hooks/useCms';
import { logsApi } from '@/lib/api';
import { ROLE_LABELS, formatDateTime } from '@/lib/format';
import { accountName, useAuthStore } from '@/stores/useAuthStore';

import { AdminHomeEditor } from './views/AdminHomeEditor';
import { AdminMinisterEditor } from './views/AdminMinisterEditor';
import { AdminMissionsEditor } from './views/AdminMissionsEditor';
import { AdminOrganigram } from './views/AdminOrganigram';
import { AdminServicesEditor } from './views/AdminServicesEditor';
import { AdminSettings } from './views/AdminSettings';
import { AdminMediaLibrary } from './views/AdminMediaLibrary';
import { AdminPassword } from './views/AdminPassword';
import { AdminUsers } from './views/AdminUsers';
import { AdminRoles } from './views/AdminRoles';
import { AdminLogs, describeLogEntry } from './views/AdminLogs';
import { CollectionEditor } from './views/CollectionEditor';
import { newsConfig, documentsConfig, projectsConfig, organismsConfig, flashConfig, quickActionsConfig } from './views/collectionConfigs';

/** Écrans réservés aux administrateurs (l'API refuse de toute façon les éditeurs). */
const ADMIN_ONLY = ['users', 'roles', 'logs', 'settings'];

export function AdminPage() {
  const [view, setView] = useState('overview');
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.role === 'ADMIN';

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
      { id: 'users',    icon: <Users size={16} />,       label: 'Utilisateurs' },
      { id: 'roles',    icon: <ShieldCheck size={16} />, label: 'Rôles & permissions' },
      { id: 'logs',     icon: <Activity size={16} />,    label: "Journal d'activité" },
      { id: 'settings', icon: <Settings size={16} />,    label: 'Paramètres généraux' },
      { id: 'password', icon: <KeyRound size={16} />,    label: 'Mot de passe' },
    ].filter(item => isAdmin || !ADMIN_ONLY.includes(item.id)) },
  ];

  const name = accountName(user);
  const initials = [user?.firstName, user?.lastName].filter(Boolean).map(s => s!.charAt(0)).join('').toUpperCase()
    || name.charAt(0).toUpperCase();
  const canSee = (v: string) => view === v && (isAdmin || !ADMIN_ONLY.includes(v));

  return (
    <WorkspaceLayout
      role="Console d'administration"
      accent="navy"
      sections={sections}
      current={view}
      onNav={(id) => setView(id)}
      user={{ initials, name, role: ROLE_LABELS[user?.role ?? ''] ?? '' }}
    >
      {view === 'overview'  && <AdminOverview setView={setView} isAdmin={isAdmin} firstName={user?.firstName || name} />}
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
      {view === 'media'     && <AdminMediaLibrary />}
      {view === 'password'  && <AdminPassword />}
      {canSee('settings')   && <AdminSettings />}
      {canSee('users')      && <AdminUsers />}
      {canSee('roles')      && <AdminRoles />}
      {canSee('logs')       && <AdminLogs />}
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
  kpi:      { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '20px 24px', textAlign: 'left' as const, cursor: 'pointer', font: 'inherit' },
  kpiK:     { fontSize: 12, color: 'var(--color-ink-mute)', fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 8 },
  kpiV:     { fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: 'var(--color-navy)', marginTop: 4 },
  kpiD:     { fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 4 },
  twocol:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 } as const,
};

/* ── Overview ── */
function AdminOverview({ setView, isAdmin, firstName }: { setView: (v: string) => void; isAdmin: boolean; firstName: string }) {
  const { data: news } = useNews();
  const { data: docs } = useDocuments();
  const { data: projects } = useProjects();
  const { data: orgs } = useOrganisms();
  const { data: logs } = useQuery({ queryKey: ['logs', 'recent'], queryFn: () => logsApi.list(1, 6), enabled: isAdmin });

  const count = (n?: number) => (n === undefined ? '…' : String(n));
  const stats = [
    { k: 'Actualités',          icon: <Newspaper size={14} />,    v: count(news?.length),     d: `${news?.filter(n => n.published).length ?? 0} publiées`,        view: 'news' },
    { k: 'Documents officiels', icon: <FileText size={14} />,     v: count(docs?.length),     d: `${docs?.filter(d => d.published).length ?? 0} publiés`,         view: 'docs' },
    { k: 'Projets',             icon: <FolderKanban size={14} />, v: count(projects?.length), d: `${projects?.filter(p => p.status === 'ongoing').length ?? 0} en cours`, view: 'projects' },
    { k: 'Partenaires',         icon: <Building2 size={14} />,    v: count(orgs?.length),     d: `${orgs?.filter(o => o.published).length ?? 0} affichés`,        view: 'orgs' },
  ];
  const quickActions = [
    { label: 'Publier une actualité',    icon: <Newspaper size={16} />,    view: 'news' },
    { label: 'Téléverser un document',   icon: <FileText size={16} />,     view: 'docs' },
    { label: 'Modifier la bande Flash',  icon: <Zap size={16} />,          view: 'flash' },
    { label: 'Ajouter un projet',        icon: <FolderKanban size={16} />, view: 'projects' },
    { label: "Éditer l'accueil",         icon: <Home size={16} />,         view: 'home' },
    { label: 'Catalogue services',       icon: <LayoutList size={16} />,   view: 'services' },
  ];

  const quickCard = (
    <div style={ws.card}>
      <div style={ws.cardHead}><h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Actions rapides</h3></div>
      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 10 }}>
        {quickActions.map(a => (
          <button key={a.view} onClick={() => setView(a.view)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: 'var(--color-cream)', border: '1px solid var(--color-rule)',
            borderRadius: 6, cursor: 'pointer', fontSize: 13, textAlign: 'left', transition: 'all 0.12s', color: 'var(--color-ink)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-navy)'; e.currentTarget.style.background = 'var(--color-cream-warm)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-rule)'; e.currentTarget.style.background = 'var(--color-cream)'; }}
          >
            <span style={{ color: 'var(--color-navy)', display: 'flex' }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div style={ws.pageHead}>
        <div>
          <div style={ws.eyebrow}>Vue d'ensemble</div>
          <h1 style={ws.title}>Bonjour {firstName}</h1>
          <p style={ws.subtitle}>Voici un aperçu des contenus du portail.</p>
        </div>
        <div style={ws.actions}>
          {isAdmin && <button className="btn btn-outline" onClick={() => setView('logs')}>Voir le journal complet</button>}
          <button className="btn btn-primary" onClick={() => setView('news')}><Plus size={16} /> Nouvelle publication</button>
        </div>
      </div>

      <div style={ws.kpiGrid}>
        {stats.map(s => (
          <button key={s.k} style={ws.kpi} onClick={() => setView(s.view)}>
            <div style={ws.kpiK}><span style={{ color: 'var(--color-navy)', display: 'flex' }}>{s.icon}</span>{s.k}</div>
            <div style={ws.kpiV}>{s.v}</div>
            <div style={ws.kpiD}>{s.d}</div>
          </button>
        ))}
      </div>

      {isAdmin ? (
        <div style={ws.twocol}>
          <div style={ws.card}>
            <div style={ws.cardHead}>
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)' }}>Activité récente</h3>
              <button onClick={() => setView('logs')} style={{ fontSize: 12, color: 'var(--color-navy)', cursor: 'pointer', background: 'none', border: 0, padding: 0 }}>Voir tout</button>
            </div>
            {!logs?.items.length ? (
              <div style={{ fontSize: 13, color: 'var(--color-ink-mute)', padding: '10px 0' }}>Aucune action enregistrée pour le moment.</div>
            ) : logs.items.map(e => {
              const d = describeLogEntry(e);
              return (
                <div key={e.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-rule-soft)', fontSize: 13 }}>
                  <div><strong>{e.updatedBy}</strong> · {d.action.toLowerCase()} · {d.entity}{d.detail && <> · <em>{d.detail}</em></>}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-ink-mute)', marginTop: 2 }}>{formatDateTime(e.updatedAt)}</div>
                </div>
              );
            })}
          </div>
          {quickCard}
        </div>
      ) : quickCard}
    </>
  );
}
