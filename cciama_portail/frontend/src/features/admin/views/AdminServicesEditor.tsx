import { useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, X, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  useServiceCatalogue,
  useServiceFamilies,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceFamilyMutation,
} from '@/hooks/useCms';
import type { CatalogueService, ServiceFamily } from '@/lib/api';

/* ── Shared styles ── */
const st = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 } as const,
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 },
  card: { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '22px 26px', marginBottom: 20 } as const,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 } as const,
  input: { width: '100%', padding: '9px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, font: 'inherit', fontSize: 14, background: 'var(--color-cream)', color: 'var(--color-ink)', boxSizing: 'border-box' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  tableHead: { background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)' },
  sectionTitle: { fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '4px 0 4px' },
};

const iconBtn = { background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 4, padding: 6, cursor: 'pointer', display: 'inline-flex', color: 'var(--color-ink-soft)' } as const;

/* ── Generic editors for the nested lists ── */
function StringList({ label, items, onChange, placeholder, textarea }: {
  label: string; items: string[]; onChange: (next: string[]) => void; placeholder?: string; textarea?: boolean;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={st.sectionTitle}>{label}</span>
        <button type="button" style={iconBtn} title="Ajouter" onClick={() => onChange([...items, ''])}><Plus size={14} /></button>
      </div>
      {items.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', margin: '6px 0' }}>Aucun élément.</p>}
      {items.map((val, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-ink-mute)', minWidth: 22, paddingTop: 9, fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>
          {textarea ? (
            <textarea
              style={{ ...st.input, minHeight: 56, resize: 'vertical' }}
              value={val}
              placeholder={placeholder}
              onChange={e => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
            />
          ) : (
            <input
              style={st.input}
              value={val}
              placeholder={placeholder}
              onChange={e => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
            />
          )}
          <button type="button" style={{ ...iconBtn, color: 'var(--color-red)' }} title="Supprimer" onClick={() => onChange(items.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  );
}

type RecordItem = Record<string, string>;
function RecordList<T extends RecordItem>({ label, items, onChange, fields, empty }: {
  label: string; items: T[]; onChange: (next: T[]) => void; fields: { key: keyof T & string; placeholder: string; textarea?: boolean }[]; empty: T;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={st.sectionTitle}>{label}</span>
        <button type="button" style={iconBtn} title="Ajouter" onClick={() => onChange([...items, { ...empty }])}><Plus size={14} /></button>
      </div>
      {items.length === 0 && <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', margin: '6px 0' }}>Aucun élément.</p>}
      {items.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 8, paddingTop: 8, borderTop: i > 0 ? '1px dashed var(--color-rule-soft)' : 'none' }}>
          <span style={{ fontSize: 12, color: 'var(--color-ink-mute)', minWidth: 22, paddingTop: 9, fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>
          <div style={{ flex: 1, display: 'grid', gap: 6 }}>
            {fields.map(f => (
              f.textarea ? (
                <textarea
                  key={f.key}
                  style={{ ...st.input, minHeight: 50, resize: 'vertical' }}
                  value={row[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onChange={e => onChange(items.map((r, idx) => (idx === i ? { ...r, [f.key]: e.target.value } : r)))}
                />
              ) : (
                <input
                  key={f.key}
                  style={st.input}
                  value={row[f.key] ?? ''}
                  placeholder={f.placeholder}
                  onChange={e => onChange(items.map((r, idx) => (idx === i ? { ...r, [f.key]: e.target.value } : r)))}
                />
              )
            ))}
          </div>
          <button type="button" style={{ ...iconBtn, color: 'var(--color-red)' }} title="Supprimer" onClick={() => onChange(items.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  );
}

/* ── Form state ── */
interface FormState {
  code: string;
  title: string;
  tagline: string;
  familyId: string;
  beneficiaries: string;
  channels: string;
  targetDelay: string;
  phase: string;
  description: string;
  processSteps: string[];
  screens: { name: string; description: string }[];
  dataFields: { name: string; type: string; source: string }[];
  integrations: { name: string; description: string }[];
  kpis: string[];
  businessRules: string[];
  published: boolean;
}

function toForm(svc: CatalogueService | null, familyId: string): FormState {
  return {
    code: svc?.code ?? '',
    title: svc?.title ?? '',
    tagline: svc?.tagline ?? '',
    familyId: svc?.familyId ?? familyId,
    beneficiaries: svc?.beneficiaries ?? '',
    channels: svc?.channels ?? '',
    targetDelay: svc?.targetDelay ?? '',
    phase: svc?.phase ?? '',
    description: svc?.description ?? '',
    processSteps: svc?.processSteps ?? [],
    screens: svc?.screens ?? [],
    dataFields: svc?.dataFields ?? [],
    integrations: svc?.integrations ?? [],
    kpis: svc?.kpis ?? [],
    businessRules: svc?.businessRules ?? [],
    published: svc?.published ?? true,
  };
}

/* ── Service form (create / edit) ── */
function ServiceForm({ svc, families, onBack }: { svc: CatalogueService | null; families: ServiceFamily[]; onBack: () => void }) {
  const isNew = !svc;
  const [form, setForm] = useState<FormState>(() => toForm(svc, families[0]?.id ?? ''));
  const [errorMsg, setErrorMsg] = useState('');
  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(p => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.code.trim() || !form.title.trim() || !form.familyId) {
      setErrorMsg('Le code, le titre et la famille sont obligatoires.');
      return;
    }
    try {
      if (isNew) {
        await createMutation.mutateAsync({ ...form, code: form.code.trim().toUpperCase() });
      } else {
        const { code, ...rest } = form;
        await updateMutation.mutateAsync({ id: svc!.id, data: rest });
      }
      onBack();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit}>
      <div style={st.pageHead}>
        <div>
          <button type="button" onClick={onBack} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: 'var(--color-ink-mute)', fontWeight: 500, padding: 0 }}>
            ← Retour à la liste
          </button>
          <h1 style={{ ...st.title, marginTop: 8 }}>{isNew ? 'Nouveau service' : `Éditer ${svc!.code} — ${svc!.title}`}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-outline" onClick={onBack}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#FCE8E6', border: '1px solid #F8D7DA', color: '#C92A2A', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 16 }}>{errorMsg}</div>
      )}

      {/* Identité */}
      <div style={st.card}>
        <span style={st.sectionTitle}>Identité &amp; tableau récapitulatif</span>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 14 }}>
          <div>
            <label style={st.label}>Code</label>
            <input style={{ ...st.input, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', opacity: isNew ? 1 : 0.6 }} value={form.code} disabled={!isNew} onChange={e => set('code', e.target.value)} placeholder="S19" />
          </div>
          <div>
            <label style={st.label}>Famille</label>
            <select style={st.input} value={form.familyId} onChange={e => set('familyId', e.target.value)}>
              {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label style={st.label}>Phase de déploiement</label>
            <input style={st.input} value={form.phase} onChange={e => set('phase', e.target.value)} placeholder="Phase 1 — M6" />
          </div>
        </div>
        <label style={st.label}>Titre</label>
        <input style={{ ...st.input, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 600 }} value={form.title} onChange={e => set('title', e.target.value)} />
        <label style={st.label}>Accroche (tagline)</label>
        <input style={{ ...st.input, fontStyle: 'italic' }} value={form.tagline} onChange={e => set('tagline', e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={st.label}>Bénéficiaires</label>
            <textarea style={{ ...st.input, minHeight: 64, resize: 'vertical' }} value={form.beneficiaries} onChange={e => set('beneficiaries', e.target.value)} />
          </div>
          <div>
            <label style={st.label}>Canaux d'accès</label>
            <textarea style={{ ...st.input, minHeight: 64, resize: 'vertical' }} value={form.channels} onChange={e => set('channels', e.target.value)} />
          </div>
        </div>
        <label style={st.label}>Délai cible</label>
        <input style={st.input} value={form.targetDelay} onChange={e => set('targetDelay', e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginTop: 16 }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Publié (visible sur le portail public)
        </label>
      </div>

      {/* Description */}
      <div style={st.card}>
        <span style={st.sectionTitle}>Description du service</span>
        <textarea style={{ ...st.input, minHeight: 110, resize: 'vertical', marginTop: 10 }} value={form.description} onChange={e => set('description', e.target.value)} />
      </div>

      {/* Processus */}
      <div style={st.card}>
        <StringList label="Processus utilisateur (étapes)" items={form.processSteps} onChange={v => set('processSteps', v)} placeholder="Décrivez l'étape…" textarea />
      </div>

      {/* Écrans */}
      <div style={st.card}>
        <RecordList
          label="Écrans et interfaces"
          items={form.screens}
          onChange={v => set('screens', v)}
          empty={{ name: '', description: '' }}
          fields={[{ key: 'name', placeholder: 'Écran 1 — Nom de l\'écran' }, { key: 'description', placeholder: 'Description de l\'écran', textarea: true }]}
        />
      </div>

      {/* Données métier */}
      <div style={st.card}>
        <RecordList
          label="Données métier manipulées"
          items={form.dataFields}
          onChange={v => set('dataFields', v)}
          empty={{ name: '', type: '', source: '' }}
          fields={[{ key: 'name', placeholder: 'Donnée' }, { key: 'type', placeholder: 'Type' }, { key: 'source', placeholder: 'Source / contrôle' }]}
        />
      </div>

      {/* Intégrations */}
      <div style={st.card}>
        <RecordList
          label="Intégrations et systèmes connexes"
          items={form.integrations}
          onChange={v => set('integrations', v)}
          empty={{ name: '', description: '' }}
          fields={[{ key: 'name', placeholder: 'Partenaire / système (ex : ANIE)' }, { key: 'description', placeholder: 'Description de l\'intégration', textarea: true }]}
        />
      </div>

      {/* KPIs */}
      <div style={st.card}>
        <StringList label="Indicateurs de performance (KPIs)" items={form.kpis} onChange={v => set('kpis', v)} placeholder="Indicateur + cible…" />
      </div>

      {/* Règles métier */}
      <div style={st.card}>
        <StringList label="Règles métier et contrôles" items={form.businessRules} onChange={v => set('businessRules', v)} placeholder="Règle / contrôle…" />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 40 }}>
        <button type="button" className="btn btn-outline" onClick={onBack}>Annuler</button>
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  );
}

/* ── Family text editor (compact) ── */
function FamilyEditor({ family, onClose }: { family: ServiceFamily; onClose: () => void }) {
  const [name, setName] = useState(family.name);
  const [description, setDescription] = useState(family.description);
  const [errorMsg, setErrorMsg] = useState('');
  const mutation = useUpdateServiceFamilyMutation();

  const save = async () => {
    setErrorMsg('');
    try {
      await mutation.mutateAsync({ id: family.id, data: { name, description } });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', width: '100%', maxWidth: 560, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 12, marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-navy)' }}>Éditer la famille {family.code}</h3>
          <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-ink-mute)' }} onClick={onClose}><X size={18} /></button>
        </div>
        {errorMsg && <div style={{ background: '#FCE8E6', color: '#C92A2A', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 12 }}>{errorMsg}</div>}
        <label style={st.label}>Nom de la famille</label>
        <input style={st.input} value={name} onChange={e => setName(e.target.value)} />
        <label style={st.label}>Description</label>
        <textarea style={{ ...st.input, minHeight: 100, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={mutation.isPending}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export function AdminServicesEditor() {
  const { data: catalogue, isLoading } = useServiceCatalogue();
  const { data: families } = useServiceFamilies();
  const deleteMutation = useDeleteServiceMutation();

  const [editing, setEditing] = useState<CatalogueService | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueService | null>(null);
  const [familyTarget, setFamilyTarget] = useState<ServiceFamily | null>(null);

  const familyList = families || [];
  const allServices = useMemo(() => {
    const out: (CatalogueService & { familyName: string })[] = [];
    (catalogue || []).forEach(f => (f.services || []).forEach(s => out.push({ ...s, familyName: f.name })));
    return out;
  }, [catalogue]);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}><RefreshCw size={24} className="animate-spin" /></div>;
  }

  if (editing !== null) {
    if (familyList.length === 0) {
      return <div style={st.card}>Impossible de charger les familles de services. Vérifiez que le catalogue a été initialisé (seed).</div>;
    }
    return <ServiceForm svc={editing === 'new' ? null : editing} families={familyList} onBack={() => setEditing(null)} />;
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <>
      <div style={st.pageHead}>
        <div>
          <div style={st.eyebrow}>Contenu du portail</div>
          <h1 style={st.title}>Catalogue des services</h1>
          <p style={st.subtitle}>{allServices.length} services répartis en {familyList.length} familles. Toutes les rubriques des fiches sont éditables.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setEditing('new')}><Plus size={16} /> Nouveau service</button>
        </div>
      </div>

      {/* Familles */}
      <div style={st.card}>
        <span style={st.sectionTitle}>Familles de services</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginTop: 12 }}>
          {familyList.map(f => (
            <div key={f.id} style={{ border: '1px solid var(--color-rule)', borderRadius: 6, padding: '12px 14px', background: 'var(--color-cream)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13, color: 'var(--color-navy)' }}>{f.code} · {f.name}</strong>
                <button style={iconBtn} title="Éditer la famille" onClick={() => setFamilyTarget(f)}><Edit2 size={13} /></button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 6, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services table */}
      <div style={st.card}>
        {allServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 36, color: 'var(--color-ink-mute)' }}>Aucun service. Cliquez sur « Nouveau service » ou lancez le seed du catalogue.</div>
        ) : (
          <table style={st.table}>
            <thead>
              <tr style={st.tableHead}>
                <th style={{ padding: '10px 12px', textAlign: 'left', width: 60 }}>Code</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Famille</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Délai cible</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 80 }}>Publié</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 110 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allServices.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  <td style={{ padding: '11px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-gold)' }}>{s.code}</td>
                  <td style={{ padding: '11px 12px', fontWeight: 600, color: 'var(--color-navy)' }}>{s.title}</td>
                  <td style={{ padding: '11px 12px', color: 'var(--color-ink-soft)' }}>{s.familyName}</td>
                  <td style={{ padding: '11px 12px', color: 'var(--color-ink-soft)', maxWidth: 220 }}>{s.targetDelay}</td>
                  <td style={{ padding: '11px 12px', textAlign: 'center' }}>{s.published ? <span style={{ color: '#1F5C1F', fontWeight: 700 }}>●</span> : <span style={{ color: 'var(--color-ink-mute)' }}>○</span>}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button style={iconBtn} title="Éditer" onClick={() => setEditing(s)}><Edit2 size={13} /></button>
                      <button style={{ ...iconBtn, color: 'var(--color-red)', borderColor: 'rgba(184,30,44,0.25)' }} title="Supprimer" onClick={() => setDeleteTarget(s)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {familyTarget && <FamilyEditor family={familyTarget} onClose={() => setFamilyTarget(null)} />}

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', width: '100%', maxWidth: 440, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}><AlertTriangle size={22} /></div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression</h3>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                  Supprimer le service <strong>{deleteTarget.code} — {deleteTarget.title}</strong> ? Cette action est irréversible et le retire du portail public.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button type="button" className="btn btn-danger" style={{ background: 'var(--color-red)', color: 'white' }} onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
