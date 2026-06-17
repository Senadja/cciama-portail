import { useState } from 'react';
import { Search, Download, Eye, Printer } from 'lucide-react';
import { useDocuments } from '@/hooks/useCms';

export function DocumentationPage() {
  const { data: docsData } = useDocuments();
  const DOCUMENTS = docsData ?? [];
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'decret', label: 'Décrets' },
    { id: 'loi', label: 'Lois' },
    { id: 'arrete', label: 'Arrêtés' },
    { id: 'circulaire', label: 'Circulaires' },
    { id: 'rapport', label: 'Rapports' },
  ];

  const filtered = DOCUMENTS.filter(d => {
    if (filter !== 'all' && d.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.ref.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      <div className="page-banner">
        <div className="container">
          <h1>Documentation</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 28px 80px' }}>
        <div className="doc-toolbar">
          <label className="doc-search" aria-label="Rechercher un document">
            <Search size={18} style={{ color: 'var(--color-ink-mute)' }} />
            <input
              type="search"
              placeholder="Rechercher par titre, référence ou mot-clé…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Rechercher un document"
            />
          </label>
          <div className="filters" role="tablist" aria-label="Filtrer par type" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.id}
                className={`chip ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
            {filtered.length} document{filtered.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="doc-table" role="table" aria-label="Liste des documents officiels">
          <div className="doc-row head" role="row">
            <div role="columnheader">Type</div>
            <div role="columnheader" className="ref-col">Référence</div>
            <div role="columnheader">Intitulé</div>
            <div role="columnheader">Date</div>
            <div role="columnheader" className="size-col">Taille</div>
            <div role="columnheader" style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {filtered.map(d => (
            <div key={d.id} className="doc-row" role="row">
              <div role="cell">
                <span className={`doc-type-pill ${d.type}`}>{d.typeLabel}</span>
              </div>
              <div role="cell" className="doc-ref ref-col">{d.ref}</div>
              <div role="cell" className="doc-title">
                <h4>{d.title}</h4>
                <p>{d.summary}</p>
              </div>
              <div role="cell" className="doc-date">{d.date}</div>
              <div role="cell" className="doc-size size-col">{d.pages}p · {d.size}</div>
              <div role="cell" className="doc-actions">
                <button title={d.fileUrl ? 'Aperçu' : 'Aucun fichier'} aria-label={`Aperçu de ${d.title}`} disabled={!d.fileUrl} style={{ opacity: d.fileUrl ? 1 : 0.4, cursor: d.fileUrl ? 'pointer' : 'not-allowed' }} onClick={() => d.fileUrl && window.open(d.fileUrl, '_blank')}><Eye size={15} /></button>
                <button title={d.fileUrl ? 'Télécharger PDF' : 'Aucun fichier'} aria-label={`Télécharger ${d.title}`} disabled={!d.fileUrl} style={{ opacity: d.fileUrl ? 1 : 0.4, cursor: d.fileUrl ? 'pointer' : 'not-allowed' }} onClick={() => d.fileUrl && window.open(d.fileUrl, '_blank')}><Download size={15} /></button>
                <button title="Imprimer" aria-label={`Imprimer ${d.title}`} onClick={() => window.print()}><Printer size={15} /></button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-ink-mute)', fontSize: 'var(--text-sm)' }}>
              Aucun document ne correspond à votre recherche.
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 'var(--text-xs)', color: 'var(--color-ink-mute)', textAlign: 'center' }}>
          Les documents officiels publiés sur ce portail font foi.
          Pour toute version certifiée conforme, contactez le Secrétariat Général.
        </div>
      </div>
    </>
  );
}
