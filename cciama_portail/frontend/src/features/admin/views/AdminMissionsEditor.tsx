import { useState } from 'react';
import { useMissions, useCreateMissionMutation, useUpdateMissionMutation, useDeleteMissionMutation, useReorderMissionsMutation } from '@/hooks/useCms';
import { ArrowUp, ArrowDown, Trash2, Plus, Edit2, RefreshCw, AlertTriangle, X } from 'lucide-react';

export function AdminMissionsEditor() {
  const { data: dbMissions, isLoading } = useMissions();
  const createMutation = useCreateMissionMutation();
  const updateMutation = useUpdateMissionMutation();
  const deleteMutation = useDeleteMissionMutation();
  const reorderMutation = useReorderMissionsMutation();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [targetMission, setTargetMission] = useState<any>(null);
  const [formData, setFormData] = useState({ num: '', title: '', desc: '' });
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
        <RefreshCw size={24} className="animate-spin" />
      </div>
    );
  }

  const missions = dbMissions || [];

  const handleOpenCreate = () => {
    // Proactively fill standard sequence number e.g. "07"
    const nextNum = String(missions.length + 1).padStart(2, '0');
    setFormData({ num: nextNum, title: '', desc: '' });
    setErrorMsg('');
    setActiveModal('create');
  };

  const handleOpenEdit = (m: any) => {
    setTargetMission(m);
    setFormData({ num: m.num, title: m.title, desc: m.desc });
    setErrorMsg('');
    setActiveModal('edit');
  };

  const handleOpenDelete = (m: any) => {
    setTargetMission(m);
    setActiveModal('delete');
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createMutation.mutateAsync({
        ...formData,
        orderIndex: missions.length
      });
      setActiveModal(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await updateMutation.mutateAsync({
        id: targetMission.id,
        data: formData
      });
      setActiveModal(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la modification.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(targetMission.id);
      setActiveModal(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === missions.length - 1) return;

    const nextMissions = [...missions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    const temp = nextMissions[index];
    nextMissions[index] = nextMissions[targetIdx];
    nextMissions[targetIdx] = temp;

    const ids = nextMissions.map(m => m.id);
    try {
      await reorderMutation.mutateAsync(ids);
    } catch (err: any) {
      alert(err.message || 'Erreur de réorganisation.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Pages</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Missions consulaires</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Ajoutez, modifiez ou réordonnez les missions stratégiques de la CCIAMA.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Ajouter une mission
          </button>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
        {missions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-ink-mute)' }}>
            Aucune mission enregistrée. Cliquez sur "Ajouter une mission".
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-cream-warm)', fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-ink-mute)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'center', width: 60 }}>N°</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', width: 220 }}>Titre de la mission</th>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Description détaillée</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', width: 100 }}>Ordre</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m, idx) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-gold)' }}>{m.num}</td>
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>{m.title}</td>
                  <td style={{ padding: '14px', color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>{m.desc}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <button
                        type="button"
                        disabled={idx === 0 || reorderMutation.isPending}
                        style={{ background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 3, padding: 4, cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#ccc' : 'inherit' }}
                        onClick={() => handleMove(idx, 'up')}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === missions.length - 1 || reorderMutation.isPending}
                        style={{ background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 3, padding: 4, cursor: idx === missions.length - 1 ? 'not-allowed' : 'pointer', color: idx === missions.length - 1 ? '#ccc' : 'inherit' }}
                        onClick={() => handleMove(idx, 'down')}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 3, padding: '5px 8px', cursor: 'pointer', display: 'flex', gap: 4, alignItems: 'center', fontSize: 12 }}
                        onClick={() => handleOpenEdit(m)}
                      >
                        <Edit2 size={12} /> Écrire
                      </button>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: '1px solid rgba(184,30,44,0.2)', borderRadius: 3, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-red)', display: 'flex', gap: 4, alignItems: 'center', fontSize: 12 }}
                        onClick={() => handleOpenDelete(m)}
                      >
                        <Trash2 size={12} /> ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Create & Edit Form */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 540, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 12, marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-navy)' }}>
                {activeModal === 'create' ? 'Ajouter une mission' : 'Modifier la mission'}
              </h3>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-ink-mute)' }} onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: '#FCE8E6', border: '1px solid #F8D7DA', color: '#C92A2A', padding: '10px 14px', borderRadius: 4, fontSize: 13, marginBottom: 14 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={activeModal === 'create' ? handleSaveCreate : handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Numéro</label>
                  <input
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 'bold', textAlign: 'center' }}
                    value={formData.num}
                    onChange={e => setFormData(p => ({ ...p, num: e.target.value }))}
                    placeholder="e.g. 01"
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Titre de la mission</label>
                  <input
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="Titre explicite"
                    required
                  />
                </div>
              </div>

              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 16 }}>Description détaillée</label>
              <textarea
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 120, resize: 'vertical', lineHeight: 1.5 }}
                value={formData.desc}
                onChange={e => setFormData(p => ({ ...p, desc: e.target.value }))}
                placeholder="Rédigez l'explication complète de cette mission consulaire..."
                required
              />

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid var(--color-rule-soft)', paddingTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Dialog */}
      {activeModal === 'delete' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 440, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression</h3>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                  Voulez-vous vraiment supprimer la mission consulaire <strong>"{targetMission?.num} - {targetMission?.title}"</strong> ? Cette action est irréversible et retirera instantanément le contenu du portail public.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                Annuler
              </button>
              <button type="button" className="btn btn-danger" style={{ background: 'var(--color-red)', color: 'white' }} onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
