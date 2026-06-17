import { useState } from 'react';
import { useOrganigram, useCreateOrganigramNodeMutation, useUpdateOrganigramNodeMutation, useDeleteOrganigramNodeMutation } from '@/hooks/useCms';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, GitMerge, RefreshCw, AlertTriangle, X } from 'lucide-react';

export function AdminOrganigram() {
  const { data: rawNodes, isLoading } = useOrganigram();
  const createMutation = useCreateOrganigramNodeMutation();
  const updateMutation = useUpdateOrganigramNodeMutation();
  const deleteMutation = useDeleteOrganigramNodeMutation();

  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [targetNode, setTargetNode] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', role: '', parentId: '' as string | null, orderIndex: 0 });
  const [childrenCount, setChildrenCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
        <RefreshCw size={24} className="animate-spin" />
      </div>
    );
  }

  const nodes = rawNodes || [];

  // Group nodes by their parent relationships for clean hierarchical visual display
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  const getParentName = (parentId: string | null) => {
    if (!parentId) return '— (Racine)';
    const parent = nodeMap.get(parentId);
    return parent ? `${parent.role} : ${parent.name}` : '— (Inconnu)';
  };

  const handleOpenCreate = () => {
    setFormData({ name: '', role: 'Direction', parentId: nodes[0]?.id || null, orderIndex: nodes.length });
    setErrorMsg('');
    setActiveModal('create');
  };

  const handleOpenEdit = (n: any) => {
    setTargetNode(n);
    setFormData({ name: n.name, role: n.role, parentId: n.parentId, orderIndex: n.orderIndex });
    setErrorMsg('');
    setActiveModal('edit');
  };

  const handleOpenDelete = async (n: any) => {
    setTargetNode(n);
    setErrorMsg('');
    try {
      const res = await api.getChildrenCount(n.id);
      setChildrenCount(res.count);
      setActiveModal('delete');
    } catch (err: any) {
      alert(err.message || 'Erreur lors du calcul des enfants.');
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        role: formData.role,
        parentId: formData.parentId || null,
        orderIndex: Number(formData.orderIndex)
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
        id: targetNode.id,
        data: {
          name: formData.name,
          role: formData.role,
          parentId: formData.parentId || null,
          orderIndex: Number(formData.orderIndex)
        }
      });
      setActiveModal(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la modification.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(targetNode.id);
      setActiveModal(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  // Build recursive children nodes for interactive visualization
  const getNestedChildren = (parentId: string | null, depth = 0): React.ReactNode => {
    const list = nodes.filter(n => n.parentId === parentId).sort((a,b) => a.orderIndex - b.orderIndex);
    if (list.length === 0) return null;

    return (
      <div style={{ marginLeft: depth > 0 ? 28 : 0, borderLeft: depth > 0 ? '1px dashed var(--color-rule)' : 'none', paddingLeft: depth > 0 ? 12 : 0 }}>
        {list.map(n => (
          <div key={n.id} style={{ marginBottom: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: depth === 0 ? 'var(--color-cream-warm)' : 'white',
              border: '1px solid var(--color-rule)',
              borderRadius: 6,
              padding: '12px 18px',
              boxShadow: depth === 0 ? '0 2px 4px rgba(0,0,0,0.03)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GitMerge size={14} style={{ color: 'var(--color-gold)' }} />
                <div>
                  <span style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontWeight: 700,
                    color: depth === 0 ? 'var(--color-navy)' : 'var(--color-ink-mute)',
                    display: 'block'
                  }}>
                    {n.role}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-ink)' }}>{n.name}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  style={{ background: 'transparent', border: '1px solid var(--color-rule)', borderRadius: 3, padding: '4px 8px', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                  onClick={() => handleOpenEdit(n)}
                >
                  <Edit2 size={11} /> Modifier
                </button>
                <button
                  type="button"
                  style={{ background: 'transparent', border: '1px solid rgba(184,30,44,0.2)', borderRadius: 3, padding: '4px 8px', cursor: 'pointer', color: 'var(--color-red)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                  onClick={() => handleOpenDelete(n)}
                >
                  <Trash2 size={11} /> ×
                </button>
              </div>
            </div>
            {getNestedChildren(n.id, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Pages</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Organigramme de direction</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Organisez l'Assemblée, le Bureau Exécutif et les Directions opérationnelles en cascade.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Ajouter un nœud
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        {/* Hierarchical tree visualization */}
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 18, color: 'var(--color-navy)' }}>Structure Hiérarchique Active</h3>
          
          {nodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-ink-mute)' }}>
              Aucun nœud d'organigramme configuré.
            </div>
          ) : (
            getNestedChildren(null)
          )}
        </div>

        {/* Flat list of all nodes for rapid inspection */}
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', alignSelf: 'start' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Liste de contrôle à plat</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-rule)', color: 'var(--color-ink-mute)', fontWeight: 'bold' }}>
                <th style={{ padding: '8px 4px', textAlign: 'left' }}>Poste / Rôle</th>
                <th style={{ padding: '8px 4px', textAlign: 'left' }}>Unité / Nom</th>
                <th style={{ padding: '8px 4px', textAlign: 'left' }}>Supérieur (Parent)</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(n => (
                <tr key={n.id} style={{ borderBottom: '1px solid var(--color-rule-soft)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 'bold', color: 'var(--color-gold)' }}>{n.role}</td>
                  <td style={{ padding: '8px 4px', color: 'var(--color-navy)' }}>{n.name}</td>
                  <td style={{ padding: '8px 4px', color: 'var(--color-ink-mute)' }}>{getParentName(n.parentId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Nœud */}
      {(activeModal === 'create' || activeModal === 'edit') && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 500, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 12, marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-navy)' }}>
                {activeModal === 'create' ? 'Ajouter un nœud d\'organigramme' : 'Modifier le nœud'}
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
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Rôle / Type de poste</label>
              <input
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 'bold' }}
                value={formData.role}
                onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Direction, Secrétariat Général"
                required
              />

              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 16 }}>Nom de l'unité / Titre officiel</label>
              <input
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Direction de l'Appui PME/PMI"
                required
              />

              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 16 }}>Nœud parent (Supérieur hiérarchique)</label>
              <select
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                value={formData.parentId || ''}
                onChange={e => setFormData(p => ({ ...p, parentId: e.target.value || null }))}
              >
                <option value="">— Aucun (Nœud Racine Principal)</option>
                {nodes
                  .filter(n => activeModal === 'create' || n.id !== targetNode.id) // Avoid self-referencing loop
                  .map(n => (
                    <option key={n.id} value={n.id}>{n.role} : {n.name}</option>
                  ))}
              </select>

              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 16 }}>Index d'affichage (Tri horizontal)</label>
              <input
                type="number"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                value={formData.orderIndex}
                onChange={e => setFormData(p => ({ ...p, orderIndex: Number(e.target.value) }))}
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

      {/* Modal: Cascading Delete Dialog with Child Count warnings */}
      {activeModal === 'delete' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 460, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression hiérarchique</h3>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5, marginBottom: 12 }}>
                  Voulez-vous vraiment supprimer le nœud d'organigramme <strong>"{targetNode?.role} : {targetNode?.name}"</strong> ?
                </p>

                {childrenCount > 0 ? (
                  <div style={{
                    background: '#FFF0F0',
                    border: '1px solid #FFE3E3',
                    borderRadius: 6,
                    padding: '12px 16px',
                    color: '#C92A2A',
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.4
                  }}>
                    ⚠️ ATTENTION DANGER ! Ce nœud contient {childrenCount} sous-niveaux / nœuds dépendants (enfants). 
                    Si vous validez, TOUTE cette branche hiérarchique ({childrenCount} nœuds) sera supprimée en cascade de manière définitive !
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: 'var(--color-ink-mute)' }}>
                    Ce nœud ne contient aucun sous-niveau. La suppression se fera en toute sécurité.
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                Annuler
              </button>
              <button type="button" className="btn btn-danger" style={{ background: 'var(--color-red)', color: 'white' }} onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Suppression...' : `Supprimer définitivement (${childrenCount + 1} nœud${childrenCount > 0 ? 's' : ''})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
