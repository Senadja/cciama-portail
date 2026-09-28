/**
 * Libellés et dates dérivés des codes stockés en base. Les anciens champs « libellé »
 * saisis à la main (catégorie, type, statut, étiquette) sont remplacés par ces tables :
 * une seule source pour la console et le portail public.
 */

export const NEWS_CATEGORIES: Record<string, string> = {
  communique: 'Communiqué',
  evenement: 'Événement',
  decret: 'Décret',
  appel: "Appel d'offres",
};

export const DOCUMENT_TYPES: Record<string, string> = {
  decret: 'Décret',
  loi: 'Loi',
  arrete: 'Arrêté',
  circulaire: 'Circulaire',
  rapport: 'Rapport',
};

export const PROJECT_STATUSES: Record<string, string> = {
  ongoing: 'En cours',
  completed: 'Achevé',
  planned: 'Programmé',
};

export const FLASH_SEVERITIES: Record<string, string> = {
  info: 'Information',
  warning: 'Avertissement',
  danger: 'Urgent',
  success: 'Bonne nouvelle',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  EDITOR: 'Éditeur',
};

export const labelOf = (map: Record<string, string>, key: string) => map[key] ?? key;

export const optionsOf = (map: Record<string, string>) =>
  Object.entries(map).map(([value, label]) => ({ value, label }));

// Les dates sont stockées à minuit UTC : on les affiche en UTC pour ne jamais décaler le jour.
const toDate = (iso?: string | null) => (iso ? new Date(iso) : null);

/** « 21 mai 2026 » */
export function formatDate(iso?: string | null): string {
  const d = toDate(iso);
  return d ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
}

/** « 21 MAI » */
export function formatDateShort(iso?: string | null): string {
  const d = toDate(iso);
  return d ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).replace('.', '').toUpperCase() : '';
}

/** « 21/05/2026 14:32 », pour le journal d'activité (heure locale). */
export function formatDateTime(iso?: string | null): string {
  const d = toDate(iso);
  return d ? d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '';
}

/** Période d'un projet : « 2024 — 2030 », ou « Depuis 2025 » sans année de fin. */
export function formatYears(start?: number | null, end?: number | null): string {
  if (!start) return '';
  if (!end) return `Depuis ${start}`;
  return start === end ? String(start) : `${start} — ${end}`;
}

/** Date du jour « AAAA-MM-JJ » dans le fuseau du visiteur, pour comparer aux bornes d'affichage. */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
