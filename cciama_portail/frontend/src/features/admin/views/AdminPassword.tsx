import { useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { KeyRound, Save, AlertTriangle } from 'lucide-react';

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-ink-soft)',
  marginBottom: 6,
  marginTop: 14,
} as const;

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--color-rule)',
  borderRadius: 4,
  background: 'var(--color-cream)',
  color: 'var(--color-ink)',
} as const;

export function AdminPassword() {
  const user = useAuthStore(s => s.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (newPassword.length < 8) {
      setToast({ type: 'error', message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: 'error', message: 'La confirmation ne correspond pas au nouveau mot de passe.' });
      return;
    }
    if (newPassword === currentPassword) {
      setToast({ type: 'error', message: "Le nouveau mot de passe doit être différent de l'actuel." });
      return;
    }
    if (!user?.email) {
      setToast({ type: 'error', message: 'Session invalide. Reconnectez-vous.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Échec du changement de mot de passe.');
      }
      setToast({ type: 'success', message: 'Mot de passe mis à jour avec succès.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur réseau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Sécurité</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Mot de passe</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>
            Modifiez le mot de passe du compte {user?.email ? <strong>{user.email}</strong> : 'connecté'}.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{
          padding: '12px 18px', borderRadius: 6, marginBottom: 20,
          background: toast.type === 'success' ? '#EBFBEE' : '#FCE8E6',
          border: `1px solid ${toast.type === 'success' ? '#D3F9D8' : '#F8D7DA'}`,
          color: toast.type === 'success' ? '#2B8A3E' : '#C92A2A',
          fontSize: 14, fontWeight: 500,
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', maxWidth: 520 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <KeyRound size={16} /> Changer mon mot de passe
        </h3>

        <label style={labelStyle}>Mot de passe actuel</label>
        <input type="password" autoComplete="current-password" style={inputStyle} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />

        <label style={labelStyle}>Nouveau mot de passe</label>
        <input type="password" autoComplete="new-password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
        <div style={{ fontSize: 11, color: 'var(--color-ink-mute)', marginTop: 4 }}>Au moins 8 caractères.</div>

        <label style={labelStyle}>Confirmer le nouveau mot de passe</label>
        <input type="password" autoComplete="new-password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFF8E1', border: '1px solid #FCE9B8', padding: '12px 16px', borderRadius: 6, marginTop: 20, color: '#8A6D0E' }}>
          <AlertTriangle size={18} />
          <div style={{ fontSize: 12, fontWeight: 500 }}>Pour des raisons de sécurité, le mot de passe actuel est exigé pour confirmer ce changement.</div>
        </div>

        <div style={{ marginTop: 22 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} style={{ marginRight: 6 }} /> {loading ? 'Enregistrement…' : 'Mettre à jour le mot de passe'}
          </button>
        </div>
      </div>
    </form>
  );
}
