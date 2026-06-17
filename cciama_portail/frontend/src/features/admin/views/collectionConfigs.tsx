import { collections } from '@/lib/api';
import type { CollectionConfig } from './CollectionEditor';

const boolDot = (v: boolean) => (
  <span style={{ color: v ? '#1F5C1F' : 'var(--color-ink-mute)', fontWeight: 700 }}>{v ? '●' : '○'}</span>
);
const truncate = (s: string, n = 60) => (s && s.length > n ? s.slice(0, n) + '…' : s);

export const newsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Actualités & communiqués',
  subtitle: 'communiqués, événements, décrets, appels d\'offres.',
  itemLabel: 'actualité',
  queryKey: 'news',
  crud: collections.news,
  titleField: 'title',
  defaults: { cat: 'communique', catLabel: 'Communiqué', title: '', date: '', dateShort: '', author: '', readTime: '3 min de lecture', excerpt: '', body: '', image: '', published: true },
  fields: [
    { key: 'cat', label: 'Catégorie', type: 'select', options: [
      { value: 'communique', label: 'Communiqué' }, { value: 'evenement', label: 'Événement' },
      { value: 'decret', label: 'Décret' }, { value: 'appel', label: "Appel d'offres" } ] },
    { key: 'catLabel', label: 'Libellé catégorie', placeholder: 'Communiqué' },
    { key: 'title', label: 'Titre', full: true },
    { key: 'date', label: 'Date (affichée)', placeholder: '21 mai 2026' },
    { key: 'dateShort', label: 'Date courte', placeholder: '21 MAI' },
    { key: 'author', label: 'Auteur', placeholder: 'Direction de la Communication' },
    { key: 'readTime', label: 'Temps de lecture', placeholder: '4 min de lecture' },
    { key: 'image', label: 'Image principale', type: 'image', full: true },
    { key: 'excerpt', label: 'Chapô (extrait)', type: 'textarea' },
    { key: 'body', label: 'Corps de l\'article (paragraphes séparés par une ligne vide)', type: 'textarea' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publiée' },
  ],
  columns: [
    { key: 'title', label: 'Titre', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'catLabel', label: 'Catégorie', render: i => <span className={`ni-cat ${i.cat}`}>{i.catLabel}</span> },
    { key: 'date', label: 'Date' },
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
  defaults: { type: 'decret', typeLabel: 'Décret', ref: '', title: '', date: '', summary: '', pages: 1, size: '', fileUrl: '', published: true },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: [
      { value: 'decret', label: 'Décret' }, { value: 'loi', label: 'Loi' }, { value: 'arrete', label: 'Arrêté' },
      { value: 'circulaire', label: 'Circulaire' }, { value: 'rapport', label: 'Rapport' } ] },
    { key: 'typeLabel', label: 'Libellé type', placeholder: 'Décret' },
    { key: 'ref', label: 'Référence', placeholder: 'N°2026-0184/PR/PM' },
    { key: 'title', label: 'Intitulé', full: true },
    { key: 'date', label: 'Date', placeholder: '17 mai 2026' },
    { key: 'pages', label: 'Pages', type: 'number' },
    { key: 'size', label: 'Taille', placeholder: '1.2 Mo' },
    { key: 'fileUrl', label: 'Fichier PDF', type: 'file', full: true },
    { key: 'summary', label: 'Résumé', type: 'textarea' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'typeLabel', label: 'Type', render: i => <span className={`doc-type-pill ${i.type}`}>{i.typeLabel}</span> },
    { key: 'ref', label: 'Référence', render: i => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i.ref}</span> },
    { key: 'title', label: 'Intitulé', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'date', label: 'Date' },
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
  defaults: { status: 'ongoing', statusLabel: 'En cours', title: '', period: '', budget: '', partner: '', progress: 0, desc: '', published: true },
  fields: [
    { key: 'status', label: 'Statut', type: 'select', options: [
      { value: 'ongoing', label: 'En cours' }, { value: 'completed', label: 'Achevé' }, { value: 'planned', label: 'Programmé' } ] },
    { key: 'statusLabel', label: 'Libellé statut', placeholder: 'En cours' },
    { key: 'title', label: 'Titre', full: true },
    { key: 'period', label: 'Période', placeholder: '2024 — 2030' },
    { key: 'budget', label: 'Budget', placeholder: '30 Mds USD' },
    { key: 'partner', label: 'Partenaire', placeholder: 'Banque Mondiale' },
    { key: 'progress', label: 'Progression (%)', type: 'number' },
    { key: 'desc', label: 'Description', type: 'textarea' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'title', label: 'Projet', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.title}</span> },
    { key: 'period', label: 'Période' },
    { key: 'partner', label: 'Partenaire' },
    { key: 'progress', label: 'Progression', render: i => `${i.progress}%` },
    { key: 'statusLabel', label: 'Statut' },
  ],
};

export const organismsConfig: CollectionConfig = {
  eyebrow: 'Contenu du portail',
  title: 'Organismes & partenaires',
  subtitle: 'organismes sous tutelle et partenaires institutionnels.',
  itemLabel: 'entité',
  queryKey: 'organisms',
  crud: collections.organisms,
  titleField: 'name',
  defaults: { kind: 'organism', name: '', short: '', url: '#', color: '#0E2A5E', mark: 'circle', published: true },
  fields: [
    { key: 'kind', label: 'Catégorie', type: 'select', options: [
      { value: 'organism', label: 'Organisme sous tutelle' }, { value: 'partner', label: 'Partenaire' } ] },
    { key: 'name', label: 'Nom complet', full: true },
    { key: 'short', label: 'Sigle', placeholder: 'ANIE' },
    { key: 'url', label: 'Lien externe', placeholder: 'https://…' },
    { key: 'color', label: 'Couleur (hex)', placeholder: '#0E2A5E' },
    { key: 'mark', label: 'Symbole', placeholder: 'growth | book | grain | tower | globe | circle | stars | scale | hands' },
    { key: 'published', label: 'Publication', type: 'checkbox', placeholder: 'Publié' },
  ],
  columns: [
    { key: 'name', label: 'Nom', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.name}</span> },
    { key: 'short', label: 'Sigle' },
    { key: 'kind', label: 'Catégorie', render: i => (i.kind === 'partner' ? 'Partenaire' : 'Organisme') },
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
  titleField: 'label',
  defaults: { severity: 'info', label: '', text: '', active: true },
  fields: [
    { key: 'severity', label: 'Sévérité', type: 'select', options: [
      { value: 'info', label: 'Information' }, { value: 'warning', label: 'Avertissement' },
      { value: 'danger', label: 'Urgent' }, { value: 'success', label: 'Bonne nouvelle' } ] },
    { key: 'label', label: 'Étiquette', placeholder: 'Alerte' },
    { key: 'text', label: 'Message', type: 'textarea' },
    { key: 'active', label: 'Activation', type: 'checkbox', placeholder: 'Actif' },
  ],
  columns: [
    { key: 'label', label: 'Étiquette', render: i => <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{i.label}</span> },
    { key: 'text', label: 'Message', render: i => truncate(i.text) },
    { key: 'severity', label: 'Sévérité' },
    { key: 'active', label: 'Actif', render: i => boolDot(i.active) },
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
