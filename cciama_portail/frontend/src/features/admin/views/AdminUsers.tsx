import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Copy, Edit2, KeyRound, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { usersApi, type NewUser } from '@/lib/api';
import { ROLE_LABELS, optionsOf } from '@/lib/format';
import { accountName, useAuthStore, type User } from '@/stores/useAuthStore';

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
  error: { background: '#FCE8E6', border: '1px solid #F8D7DA', color: '#C92A2A', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 16 },
};
const iconBtn = { background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 4, padding: 6, cursor: 'pointer', display: 'inline-flex', color: 'var(--color-ink-soft)' } as const;

/** Mot de passe provisoire lisible à l'oral (sans 0/O ni 1/l/I). */
function generatePassword(length = 10) {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

type Form = NewUser & { isActive: boolean };
const EMPTY: Form = { lastName: '', firstName: '', matricule: '', role: 'EDITOR', temporaryPassword: '', isActive: true };

/** Identifiants à transmettre à l'utilisateur après une création ou une réinitialisation. */
function CredentialsNotice({ who, matricule, password, onClose }: { who: string; matricule: string; password: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const text = `Identifiant : ${matricule}\nMot de passe provisoire : ${password}`;
  return (
    <div style={{ ...st.card, borderColor: 'var(--color-gold)', background: '#FFFBEF' }}>
      <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Identifiants à transmettre à {who}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.8 }}>
        Identifiant : <strong>{matricule}</strong><br />
        Mot de passe provisoire : <strong>{password}</strong>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', margin: '10px 0 14px' }}>
        À sa première connexion, l'utilisateur devra saisir son adresse e-mail et choisir son propre mot de passe.
        Ce mot de passe provisoire n'est affiché qu'une fois.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-outline" onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); }}>
          <Copy size={14} /> {copied ? 'Copié' : 'Copier'}
        </button>
        <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const queryClient = useQueryClient();
  const me = useAuthStore(s => s.user);
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: usersApi.list });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const [editing, setEditing] = useState<User | 'new' | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ who: string; matricule: string; password: string } | null>(null);
  const [resetTarget, setResetTarget] = useState<{ user: User; password: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const createMut = useMutation({ mutationFn: usersApi.create, onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: string; data: Parameters<typeof usersApi.update>[1] }) => usersApi.update(id, data), onSuccess: invalidate });
  const resetMut = useMutation({ mutationFn: ({ id, password }: { id: string; password: string }) => usersApi.resetPassword(id, password), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: usersApi.remove, onSuccess: invalidate });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm({ ...EMPTY, temporaryPassword: generatePassword() }); setError(''); setEditing('new'); };
  const openEdit = (u: User) => {
    setForm({ lastName: u.lastName ?? '', firstName: u.firstName ?? '', matricule: u.matricule ?? '', role: u.role, temporaryPassword: '', isActive: u.isActive ?? true });
    setError(''); setEditing(u);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing === 'new') {
        const { isActive: _active, ...data } = form;
        await createMut.mutateAsync(data);
        setNotice({ who: `${form.firstName} ${form.lastName}`, matricule: form.matricule.trim(), password: form.temporaryPassword });
      } else if (editing) {
        const { temporaryPassword: _pwd, ...data } = form;
        await updateMut.mutateAsync({ id: editing.id, data });
      }
      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Enregistrement impossible.');
    }
  };

  const confirmReset = async () => {
    if (!resetTarget) return;
    try {
      await resetMut.mutateAsync({ id: resetTarget.user.id, password: resetTarget.password });
      setNotice({ who: accountName(resetTarget.user), matricule: resetTarget.user.matricule ?? resetTarget.user.email ?? '', password: resetTarget.password });
      setResetTarget(null);
    } catch (err: any) {
      alert(err.message || 'Réinitialisation impossible.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); }
    catch (err: any) { alert(err.message || 'Suppression impossible.'); }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}><RefreshCw size={24} className="animate-spin" /></div>;
  }

  // ── Formulaire ──
  if (editing !== null) {
    const isNew = editing === 'new';
    const isSelf = !isNew && editing.id === me?.id;
    const pending = createMut.isPending || updateMut.isPending;
    return (
      <form onSubmit={submit}>
        <div style={st.pageHead}>
          <div>
            <button type="button" onClick={() => setEditing(null)} style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 13, color: 'var(--color-ink-mute)', padding: 0 }}>← Retour à la liste</button>
            <h1 style={{ ...st.title, marginTop: 8 }}>{isNew ? 'Nouvel utilisateur' : `Éditer · ${accountName(editing)}`}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </div>
        {error && <div style={st.error}>{error}</div>}
        <div style={st.card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={st.label}>Nom</label><input style={st.input} required value={form.lastName} onChange={e => set('lastName', e.target.value)} /></div>
            <div><label style={st.label}>Prénom</label><input style={st.input} required value={form.firstName} onChange={e => set('firstName', e.target.value)} /></div>
            <div><label style={st.label}>Numéro matricule</label><input style={st.input} required value={form.matricule} onChange={e => set('matricule', e.target.value)} placeholder="CCI-0042" /></div>
            <div>
              <label style={st.label}>Rôle</label>
              <select style={st.input} value={form.role} disabled={isSelf} onChange={e => set('role', e.target.value as User['role'])}>
                {optionsOf(ROLE_LABELS).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {isNew ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={st.label}>Mot de passe provisoire</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...st.input, fontFamily: 'var(--font-mono)' }} required minLength={8} value={form.temporaryPassword} onChange={e => set('temporaryPassword', e.target.value)} />
                  <button type="button" className="btn btn-outline" onClick={() => set('temporaryPassword', generatePassword())}>Générer</button>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 6 }}>
                  L'utilisateur se connectera avec son matricule et ce mot de passe, puis sera invité à saisir son e-mail et à choisir son propre mot de passe.
                </p>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: isSelf ? 'not-allowed' : 'pointer' }}>
                <input type="checkbox" checked={form.isActive} disabled={isSelf} onChange={e => set('isActive', e.target.checked)} /> Compte actif
              </label>
            )}
          </div>
          {isSelf && <p style={{ fontSize: 12, color: 'var(--color-ink-mute)', marginTop: 12 }}>Vous ne pouvez pas modifier votre propre rôle ni désactiver votre compte.</p>}
        </div>
      </form>
    );
  }

  // ── Liste ──
  const items = users ?? [];
  return (
    <>
      <div style={st.pageHead}>
        <div>
          <div style={st.eyebrow}>Administration</div>
          <h1 style={st.title}>Utilisateurs</h1>
          <p style={st.subtitle}>{items.length} compte{items.length > 1 ? 's' : ''} · agents et administrateurs de la console.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Nouvel utilisateur</button>
      </div>

      {notice && <CredentialsNotice {...notice} onClose={() => setNotice(null)} />}

      <div style={st.card}>
        <table style={st.table}>
          <thead>
            <tr style={st.tableHead}>
              {['Nom', 'Matricule', 'E-mail', 'Rôle', 'Statut'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>)}
              <th style={{ padding: '10px 12px', textAlign: 'right', width: 130 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(u => {
              const isSelf = u.id === me?.id;
              const [status, color] = !u.isActive ? ['Désactivé', 'var(--color-ink-mute)']
                : u.mustChangePassword ? ['À finaliser', 'var(--color-gold)'] : ['Actif', '#1F5C1F'];
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  <td style={{ padding: '11px 12px', fontWeight: 600, color: 'var(--color-navy)' }}>{accountName(u)}{isSelf && <span style={{ fontWeight: 400, color: 'var(--color-ink-mute)' }}> (vous)</span>}</td>
                  <td style={{ padding: '11px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{u.matricule ?? '—'}</td>
                  <td style={{ padding: '11px 12px', color: 'var(--color-ink-soft)' }}>{u.email ?? <em style={{ color: 'var(--color-ink-mute)' }}>à la première connexion</em>}</td>
                  <td style={{ padding: '11px 12px' }}>{ROLE_LABELS[u.role] ?? u.role}</td>
                  <td style={{ padding: '11px 12px', color, fontWeight: 600 }}>{status}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button style={iconBtn} title="Éditer" onClick={() => openEdit(u)}><Edit2 size={13} /></button>
                      <button style={iconBtn} title="Nouveau mot de passe provisoire" onClick={() => setResetTarget({ user: u, password: generatePassword() })}><KeyRound size={13} /></button>
                      <button style={{ ...iconBtn, color: 'var(--color-red)', borderColor: 'rgba(184,30,44,0.25)', opacity: isSelf ? 0.35 : 1, cursor: isSelf ? 'not-allowed' : 'pointer' }}
                        title={isSelf ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer'} disabled={isSelf} onClick={() => setDeleteTarget(u)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(resetTarget || deleteTarget) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', width: '100%', maxWidth: 460, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}>
                {resetTarget ? <KeyRound size={22} /> : <AlertTriangle size={22} />}
              </div>
              <div>
                {resetTarget ? (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Nouveau mot de passe provisoire</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                      Le mot de passe actuel de <strong>{accountName(resetTarget.user)}</strong> sera remplacé par <strong style={{ fontFamily: 'var(--font-mono)' }}>{resetTarget.password}</strong>, à changer à la prochaine connexion.
                    </p>
                  </>
                ) : deleteTarget && (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                      Supprimer le compte de <strong>{accountName(deleteTarget)}</strong> ? Cette action est irréversible. Pour suspendre un accès sans perdre le compte, préférez « Compte actif ».
                    </p>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => { setResetTarget(null); setDeleteTarget(null); }}>Annuler</button>
              {resetTarget ? (
                <button type="button" className="btn btn-primary" onClick={confirmReset} disabled={resetMut.isPending}>{resetMut.isPending ? 'Réinitialisation…' : 'Réinitialiser'}</button>
              ) : (
                <button type="button" className="btn" style={{ background: 'var(--color-red)', color: 'white' }} onClick={confirmDelete} disabled={deleteMut.isPending}>
                  {deleteMut.isPending ? 'Suppression…' : 'Supprimer définitivement'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
