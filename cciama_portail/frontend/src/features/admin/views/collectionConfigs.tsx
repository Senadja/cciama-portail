import { collections } from '@/lib/api';
import {
  DOCUMENT_TYPES, FLASH_SEVERITIES, NEWS_CATEGORIES, PROJECT_STATUSES,
  formatDate, formatYears, labelOf, optionsOf, todayKey,
} from '@/lib/format';
import type { CollectionConfig } from './CollectionEditor';

const boolDot = (v: boolean) => (
  <span style={{ color: v ? '#1F5C1F' : 'var(--color-ink-mute)', fontWeight: 700 }}>{v ? '●' : '○'}</span>
);
const truncate = (s: string, n = 60) => (s && s.length > n ? s.slice(0, n) + '…' : s);
const today = () => `${todayKey()}T00:00:00.000Z`;

/** État d'un message flash au regard de ses dates, pour la liste d'administration. */
const flashWindow = (i: { startsAt: string | null; endsAt: string | null }) => {
  const now = todayKey();
  const started = !i.startsAt || i.startsAt.slice(0, 10) <= now;
  const ended = !!i.endsAt && i.endsAt.slice(0, 10) < now;
  const [label, color] = ended ? ['Terminé', 'var(--color-ink-mute)'] : started ? ['En ligne', '#1F5C1F'] : ['Programmé', 'var(--color-gold)'];
  const span = `${i.startsAt ? `du ${formatDate(i.startsAt)}` : 'dès maintenant'}${i.endsAt ? ` au ${formatDate(i.endsAt)}` : ', sans fin'}`;
  return <span><strong style={{ color }}>{label}</strong> · {span}</span>;
};

export const newsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Actualités & communiqués',
  subtitle: 'communiqués, événements, décrets, appels d\'offres.',
  itemLabel: 'actualité',
  queryKey: 'news',
  crud: collections.news,
  titleField: 'title',
  get defaults() {
    return { cat: 'communique', title: '', date: today(), author: '', readTime: '3 min de lecture', excerpt: '', body: '', images: [], published: true };
  },
  fields: [
    { key: 'cat', label: 'Catégorie', type: 'select', options: optionsOf(NEWS_CATEGORIES) },
    { key: 'date', label: 'Date de publication', type: 'date' },
    { key: 'title', label: 'Titre', full: true },
    { key: 'author', label: 'Auteur', placeholder: 'Direction de la Communication' },
    { key: 'readTime', label: 'Temps de lecture', placeholder: '4 min de lecture' },
    { key: 'images', label: 'Images — la première sert de vignette', type: 'images', full: true },
    { key: 'excerpt', label: 'Chapô (extrait)', type: 'textarea' },
    { key: 'body', label: 'Corps de l\'article (paragraphes séparés par une ligne vide)', type: 'textarea' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publiée' },
  ],
  columns: [
    { key: 'title', label: 'Titre', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'cat', label: 'Catégorie', render: i => <span className={`ni-cat ${i.cat}`}>{labelOf(NEWS_CATEGORIES, i.cat)}</span> },
    { key: 'date', label: 'Date', render: i => formatDate(i.date) },
    { key: 'author', label: 'Auteur' },
    { key: 'published', label: 'Publiée', render: i => boolDot(i.published) },
  ],
};

export const documentsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Documentation officielle',
  subtitle: 'décrets, lois, arrêtés, circulaires, rapports.',
  itemLabel: 'document',
  queryKey: 'documents',
  crud: collections.documents,
  titleField: 'title',
  get defaults() {
    return { type: 'decret', ref: '', title: '', date: today(), summary: '', pages: 1, size: '', fileUrl: '', published: true };
  },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: optionsOf(DOCUMENT_TYPES) },
    { key: 'ref', label: 'Référence', placeholder: 'N°2026-0184/PR/PM' },
    { key: 'title', label: 'Intitulé', full: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'pages', label: 'Pages', type: 'number' },
    { key: 'size', label: 'Taille', placeholder: '1.2 Mo' },
    { key: 'fileUrl', label: 'Fichier PDF', type: 'file', full: true },
    { key: 'summary', label: 'Résumé — une adresse vidéo (YouTube, Facebook…) collée dans le texte y devient un lien cliquable', type: 'textarea' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'type', label: 'Type', render: i => <span className={`doc-type-pill ${i.type}`}>{labelOf(DOCUMENT_TYPES, i.type)}</span> },
    { key: 'ref', label: 'Référence', render: i => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i.ref}</span> },
    { key: 'title', label: 'Intitulé', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'date', label: 'Date', render: i => formatDate(i.date) },
    { key: 'published', label: 'Publié', render: i => boolDot(i.published) },
  ],
};

export const projectsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Projets & programmes',
  subtitle: 'initiatives et programmes de la CCIAMA.',
  itemLabel: 'projet',
  queryKey: 'projects',
  crud: collections.projects,
  titleField: 'title',
  get defaults() {
    return { status: 'ongoing', type: '', title: '', startYear: new Date().getFullYear(), endYear: null, partner: '', progress: 0, desc: '' };
  },
  fields: [
    { key: 'status', label: 'Statut', type: 'select', options: optionsOf(PROJECT_STATUSES) },
    { key: 'type', label: 'Type de projet', placeholder: 'Appui aux entreprises, infrastructure…' },
    { key: 'title', label: 'Titre', full: true },
    { key: 'startYear', label: 'Année de début', type: 'year' },
    { key: 'endYear', label: 'Année de fin', type: 'year', optional: true },
    { key: 'partner', label: 'Partenaire', placeholder: 'Banque Mondiale' },
    { key: 'progress', label: 'Progression (%)', type: 'number' },
    { key: 'desc', label: 'Description', type: 'textarea' },
  ],
  columns: [
    { key: 'title', label: 'Projet', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'type', label: 'Type', render: i => i.type || '—' },
    { key: 'years', label: 'Période', render: i => formatYears(i.startYear, i.endYear) },
    { key: 'partner', label: 'Partenaire' },
    { key: 'progress', label: 'Progression', render: i => `${i.progress}%` },
    { key: 'status', label: 'Statut', render: i => labelOf(PROJECT_STATUSES, i.status) },
  ],
};

export const organismsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Organismes & partenaires',
  subtitle: 'partenaires institutionnels affichés sur la page d\'accueil.',
  itemLabel: 'organisme',
  newLabel: 'Nouvel organisme',
  queryKey: 'organisms',
  crud: collections.organisms,
  titleField: 'name',
  defaults: { name: '', short: '', url: '#', logo: '', published: true },
  fields: [
    { key: 'name', label: 'Nom complet', full: true },
    { key: 'short', label: 'Sigle', placeholder: 'CICD' },
    { key: 'url', label: 'Lien externe', placeholder: 'https://…' },
    { key: 'logo', label: 'Logo', type: 'image', mediaType: 'logo', full: true },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'logo', label: 'Logo', render: i => (i.logo
      ? <img src={i.logo} alt="" style={{ height: 30, maxWidth: 80, objectFit: 'contain', display: 'block' }} />
      : <span style={{ color: 'var(--color-ink-mute)' }}>—</span>) },
    { key: 'name', label: 'Nom', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.name}</span> },
    { key: 'short', label: 'Sigle' },
    { key: 'url', label: 'Lien' },
    { key: 'published', label: 'Publié', render: i => boolDot(i.published) },
  ],
};

export const flashConfig: CollectionConfig = {
  eyebrow: 'Communication',
  title: 'Bande Flash Infos',
  subtitle: 'messages défilants en haut du portail.',
  itemLabel: 'message',
  queryKey: 'flash',
  crud: collections.flash,
  titleField: 'text',
  get defaults() {
    return { severity: 'info', text: '', startsAt: today(), endsAt: null };
  },
  fields: [
    { key: 'severity', label: 'Sévérité', type: 'select', options: optionsOf(FLASH_SEVERITIES) },
    { key: 'text', label: 'Message', type: 'textarea' },
    { key: 'startsAt', label: 'Afficher à partir du', type: 'date', optional: true },
    { key: 'endsAt', label: 'Jusqu\'au (inclus)', type: 'date', optional: true },
  ],
  columns: [
    { key: 'text', label: 'Message', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{truncate(i.text)}</span> },
    { key: 'severity', label: 'Sévérité', render: i => labelOf(FLASH_SEVERITIES, i.severity) },
    { key: 'window', label: 'Affichage', render: flashWindow },
  ],
};

export const quickActionsConfig: CollectionConfig = {
  eyebrow: 'Page d\'accueil',
  title: 'Accès rapides',
  subtitle: 'démarches en accès rapide sur la page d\'accueil.',
  itemLabel: 'accès rapide',
  queryKey: 'quickActions',
  crud: collections.quickActions,
  titleField: 'title',
  defaults: { ic: 'doc', title: '', desc: '', link: '/services', published: true },
  fields: [
    { key: 'ic', label: 'Icône', type: 'select', options: [
      { value: 'doc', label: 'Document' }, { value: 'form', label: 'Formulaire' }, { value: 'track', label: 'Suivi' },
      { value: 'pay', label: 'Paiement' }, { value: 'appoint', label: 'Rendez-vous / opportunités' } ] },
    { key: 'title', label: 'Titre', full: true },
    { key: 'desc', label: 'Description' },
    { key: 'link', label: 'Lien', placeholder: '/services' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'title', label: 'Titre', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'desc', label: 'Description' },
    { key: 'ic', label: 'Icône' },
    { key: 'link', label: 'Lien' },
    { key: 'published', label: 'Publié', render: i => boolDot(i.published) },
  ],
};
