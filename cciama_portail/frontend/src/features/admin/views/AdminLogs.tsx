import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { logsApi, type AuditEntry } from '@/lib/api';
import { formatDateTime } from '@/lib/format';

const ENTITY_LABELS: Record<string, string> = {
  news_article: 'Actualité',
  official_document: 'Document',
  project: 'Projet',
  organism: 'Partenaire',
  flash_info: 'Flash info',
  quick_action: 'Accès rapide',
  service: 'Fiche service',
  service_family: 'Famille de services',
  home_page_content: "Page d'accueil",
  minister_word_content: "Mot de l'Administrateur",
  institution_mission: 'Mission',
  organigram_node: 'Organigramme',
  platform_setting: 'Paramètre',
  user: 'Utilisateur',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  reset_password: 'Mot de passe provisoire',
  complete_account: 'Compte finalisé',
};

const clip = (s: string | null, n = 70) => (s && s.length > n ? s.slice(0, n) + '…' : s ?? '');

/**
 * Une ligne du journal en français. Pour l'accueil et les paramètres, `field` porte le nom
 * du champ modifié plutôt qu'une action : on l'affiche avec l'ancienne et la nouvelle valeur.
 */
export function describeLogEntry(e: AuditEntry) {
  const entity = ENTITY_LABELS[e.entityType] ?? e.entityType;
  const action = ACTION_LABELS[e.field];
  if (action) {
    const target = e.field === 'delete' ? e.oldValue : e.newValue ?? e.oldValue;
    const renamed = e.field === 'update' && e.oldValue && e.newValue && e.oldValue !== e.newValue;
    return { action, entity, detail: renamed ? `${clip(e.oldValue, 40)} → ${clip(e.newValue, 40)}` : clip(target) };
  }
  return { action: 'Modification', entity: `${entity} · ${e.field}`, detail: `${clip(e.oldValue, 40)} → ${clip(e.newValue, 40)}` };
}

const st = {
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4, marginBottom: 24 },
  card: { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '22px 26px', marginBottom: 20 } as const,
  head: { background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)' },
};
const PAGE_SIZE = 30;

export function AdminLogs() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['logs', page],
    queryFn: () => logsApi.list(page, PAGE_SIZE),
    placeholderData: prev => prev,
  });
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <>
      <div style={st.eyebrow}>Administration</div>
      <h1 style={st.title}>Journal d'activité</h1>
      <p style={st.subtitle}>{data ? `${data.total} action${data.total > 1 ? 's' : ''} enregistrée${data.total > 1 ? 's' : ''}` : 'Historique des actions'} · de la plus récente à la plus ancienne.</p>

      <div style={st.card}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 36, color: 'var(--color-ink-mute)' }}><RefreshCw size={22} className="animate-spin" /></div>
        ) : !data?.items.length ? (
          <div style={{ textAlign: 'center', padding: 36, color: 'var(--color-ink-mute)' }}>Aucune action enregistrée pour le moment.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, opacity: isFetching ? 0.6 : 1 }}>
            <thead>
              <tr style={st.head}>
                {['Date', 'Utilisateur', 'Action', 'Élément', 'Détail'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.items.map(e => {
                const d = describeLogEntry(e);
                return (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap', color: 'var(--color-ink-mute)' }}>{formatDateTime(e.updatedAt)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--color-navy)' }}>{e.updatedBy}</td>
                    <td style={{ padding: '10px 12px' }}>{d.action}</td>
                    <td style={{ padding: '10px 12px' }}>{d.entity}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-ink-soft)' }}>{d.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 16, fontSize: 13 }}>
            <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /> Précédent</button>
            <span style={{ color: 'var(--color-ink-mute)' }}>Page {page} / {pages}</span>
            <button className="btn btn-outline" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Suivant <ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    </>
  );
}
