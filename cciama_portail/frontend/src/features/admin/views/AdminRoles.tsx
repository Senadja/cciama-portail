import { Check, Minus } from 'lucide-react';

const st = {
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4, marginBottom: 24 },
  card: { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '22px 26px', marginBottom: 20 } as const,
  head: { background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)' },
};

/** Droits appliqués par l'API : cette table les documente, elle ne les configure pas. */
const PERMISSIONS: { label: string; detail: string; admin: boolean; editor: boolean }[] = [
  { label: 'Contenus du portail', detail: 'Accueil, actualités, documentation, projets, partenaires, bande flash, accès rapides, médiathèque', admin: true, editor: true },
  { label: 'Institution', detail: "Mot de l'Administrateur, missions, organigramme", admin: true, editor: true },
  { label: 'Catalogue des services', detail: 'Modifier et supprimer les fiches, éditer les familles', admin: true, editor: true },
  { label: 'Son propre mot de passe', detail: 'Changer le mot de passe de son compte', admin: true, editor: true },
  { label: 'Paramètres généraux', detail: 'Logo, nom du site, coordonnées du pied de page', admin: true, editor: false },
  { label: 'Utilisateurs', detail: 'Créer des comptes, attribuer les rôles, réinitialiser les mots de passe', admin: true, editor: false },
  { label: "Journal d'activité", detail: 'Consulter qui a modifié quoi, et quand', admin: true, editor: false },
];

const Mark = ({ on }: { on: boolean }) => on
  ? <Check size={18} style={{ color: '#1F5C1F' }} aria-label="Autorisé" />
  : <Minus size={18} style={{ color: 'var(--color-ink-mute)' }} aria-label="Non autorisé" />;

export function AdminRoles() {
  return (
    <>
      <div style={st.eyebrow}>Administration</div>
      <h1 style={st.title}>Rôles & permissions</h1>
      <p style={st.subtitle}>Deux rôles. Ils s'attribuent à chaque compte depuis la page Utilisateurs.</p>

      <div style={st.card}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={st.head}>
              <th style={{ padding: '10px 12px', textAlign: 'left' }}>Permission</th>
              <th style={{ padding: '10px 12px', width: 140 }}>Administrateur</th>
              <th style={{ padding: '10px 12px', width: 140 }}>Éditeur</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map(p => (
              <tr key={p.label} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 2 }}>{p.detail}</div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}><Mark on={p.admin} /></td>
                <td style={{ padding: '12px', textAlign: 'center' }}><Mark on={p.editor} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
