import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

export interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'image' | 'file';
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean; // span both columns
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
}

export interface CollectionCrud {
  list: () => Promise<any[]>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  remove: (id: string) => Promise<{ success: boolean }>;
}

export interface CollectionConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  itemLabel: string; // singular
  queryKey: string;
  crud: CollectionCrud;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaults: Record<string, any>;
  titleField: string;
}

const st = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 } as const,
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)', marginBottom: 4 },
  title: { fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' },
  subtitle: { fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 },
  card: { background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '22px 26px', marginBottom: 20 } as const,
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 } as const,
  input: { width: '100%', padding: '9px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, font: 'inherit', fontSize: 14, background: 'var(--color-cream)', color: 'var(--color-ink)', boxSizing: 'border-box' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  tableHead: { background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-ink-mute)' },
};
const iconBtn = { background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 4, padding: 6, cursor: 'pointer', display: 'inline-flex', color: 'var(--color-ink-soft)' } as const;

function FileUploadField({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const isImage = field.type === 'image';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    setUploading(true);
    try {
      const res = await api.uploadMedia(file, isImage ? 'image' : 'document');
      onChange(res.url);
    } catch (e: any) {
      setErr(e.message || 'Échec du téléversement.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && isImage && (
        <img src={value} alt="" style={{ maxHeight: 96, borderRadius: 4, border: '1px solid var(--color-rule)', marginBottom: 8, display: 'block', objectFit: 'cover' }} />
      )}
      {value && !isImage && (
        <a href={value} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: 8, fontSize: 13, color: 'var(--color-navy)', fontWeight: 600 }}>Voir le fichier actuel ↗</a>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="btn btn-outline" style={{ cursor: uploading ? 'wait' : 'pointer', fontSize: 13 }}>
          {uploading ? 'Téléversement…' : value ? 'Remplacer' : isImage ? 'Téléverser une image' : 'Téléverser un PDF'}
          <input type="file" accept={isImage ? 'image/png,image/jpeg,image/webp' : 'application/pdf'} style={{ display: 'none' }} onChange={handleFile} disabled={uploading} />
        </label>
        {value && <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => onChange('')}>Retirer</button>}
      </div>
      {err && <div style={{ color: 'var(--color-red)', fontSize: 12, marginTop: 6 }}>{err}</div>}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.type === 'image' || field.type === 'file') {
    return <FileUploadField field={field} value={value} onChange={onChange} />;
  }
  if (field.type === 'textarea') {
    return <textarea style={{ ...st.input, minHeight: 90, resize: 'vertical' }} value={value ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} />;
  }
  if (field.type === 'select') {
    return (
      <select style={st.input} value={value ?? ''} onChange={e => onChange(e.target.value)}>
        {(field.options ?? []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', paddingTop: 4 }}>
        <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> {field.placeholder ?? 'Activé'}
      </label>
    );
  }
  if (field.type === 'number') {
    return <input type="number" style={st.input} value={value ?? 0} placeholder={field.placeholder} onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
  }
  return <input style={st.input} value={value ?? ''} placeholder={field.placeholder} onChange={e => onChange(e.target.value)} />;
}

export function CollectionEditor({ config }: { config: CollectionConfig }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: [config.queryKey], queryFn: config.crud.list });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [config.queryKey] });

  const createMut = useMutation({ mutationFn: (d: any) => config.crud.create(d), onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: ({ id, d }: { id: string; d: any }) => config.crud.update(id, d), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id: string) => config.crud.remove(id), onSuccess: invalidate });

  const [editing, setEditing] = useState<any | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const items = data ?? [];

  const openNew = () => { setForm({ ...config.defaults }); setErrorMsg(''); setEditing('new'); };
  const openEdit = (item: any) => {
    const f: Record<string, any> = {};
    config.fields.forEach(fl => { f[fl.key] = item[fl.key]; });
    setForm(f); setErrorMsg(''); setEditing(item);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editing === 'new') await createMut.mutateAsync(form);
      else await updateMut.mutateAsync({ id: editing.id, d: form });
      setEditing(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); }
    catch (err: any) { alert(err.message || 'Erreur lors de la suppression.'); }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}><RefreshCw size={24} className="animate-spin" /></div>;
  }

  // ── Form view ──
  if (editing !== null) {
    const pending = createMut.isPending || updateMut.isPending;
    return (
      <form onSubmit={submit}>
        <div style={st.pageHead}>
          <div>
            <button type="button" onClick={() => setEditing(null)} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: 'var(--color-ink-mute)', fontWeight: 500, padding: 0 }}>← Retour à la liste</button>
            <h1 style={{ ...st.title, marginTop: 8 }}>{editing === 'new' ? `Nouveau · ${config.itemLabel}` : `Éditer · ${editing[config.titleField] ?? config.itemLabel}`}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </div>
        {errorMsg && <div style={{ background: '#FCE8E6', border: '1px solid #F8D7DA', color: '#C92A2A', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 16 }}>{errorMsg}</div>}
        <div style={st.card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {config.fields.map(field => (
              <div key={field.key} style={{ gridColumn: field.full || field.type === 'textarea' ? '1 / -1' : 'auto' }}>
                {field.type !== 'checkbox' && <label style={st.label}>{field.label}</label>}
                <FieldInput field={field} value={form[field.key]} onChange={v => setForm(p => ({ ...p, [field.key]: v }))} />
              </div>
            ))}
          </div>
        </div>
      </form>
    );
  }

  // ── List view ──
  return (
    <>
      <div style={st.pageHead}>
        <div>
          <div style={st.eyebrow}>{config.eyebrow}</div>
          <h1 style={st.title}>{config.title}</h1>
          <p style={st.subtitle}>{items.length} {config.itemLabel}{items.length > 1 ? 's' : ''} · {config.subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Ajouter</button>
        </div>
      </div>

      <div style={st.card}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 36, color: 'var(--color-ink-mute)' }}>Aucun élément. Cliquez sur « Ajouter ».</div>
        ) : (
          <table style={st.table}>
            <thead>
              <tr style={st.tableHead}>
                {config.columns.map(c => <th key={c.key} style={{ padding: '10px 12px', textAlign: 'left' }}>{c.label}</th>)}
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  {config.columns.map(c => (
                    <td key={c.key} style={{ padding: '11px 12px', color: 'var(--color-ink-soft)' }}>
                      {c.render ? c.render(item) : String(item[c.key] ?? '')}
                    </td>
                  ))}
                  <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button style={iconBtn} title="Éditer" onClick={() => openEdit(item)}><Edit2 size={13} /></button>
                      <button style={{ ...iconBtn, color: 'var(--color-red)', borderColor: 'rgba(184,30,44,0.25)' }} title="Supprimer" onClick={() => setDeleteTarget(item)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', width: '100%', maxWidth: 440, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}><AlertTriangle size={22} /></div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression</h3>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                  Supprimer <strong>{deleteTarget[config.titleField]}</strong> ? Cette action est irréversible et le retire du portail public.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button type="button" className="btn btn-danger" style={{ background: 'var(--color-red)', color: 'white' }} onClick={confirmDelete} disabled={deleteMut.isPending}>
                {deleteMut.isPending ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
