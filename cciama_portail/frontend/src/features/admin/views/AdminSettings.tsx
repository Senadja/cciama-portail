import { useState, useEffect } from 'react';
import { useAdminSettings, useUpdateSettingMutation } from '@/hooks/useCms';
import { api } from '@/lib/api';
import { Upload, Save, RefreshCw, Sliders, Mail, MapPin, Phone, ShieldCheck, AlertTriangle } from 'lucide-react';

export function AdminSettings() {
  const { data: rawSettings, isLoading } = useAdminSettings();
  const updateMutation = useUpdateSettingMutation();

  const [activeTab, setActiveTab] = useState<'branding' | 'contact'>('branding');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (rawSettings) {
      const data: Record<string, string> = {};
      rawSettings.forEach(s => {
        data[s.key] = s.value;
      });
      setFormData(data);
      setIsDirty(false);
    }
  }, [rawSettings]);

  useEffect(() => {
    if (!rawSettings) return;
    let dirty = false;
    for (const s of rawSettings) {
      if (formData[s.key] !== s.value) {
        dirty = true;
        break;
      }
    }
    setIsDirty(dirty);
  }, [formData, rawSettings]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?";
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
        <RefreshCw size={24} className="animate-spin" />
      </div>
    );
  }

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(key);
    setToast(null);

    try {
      const label = key === 'logo' ? 'Logo Officiel' : 'Favicon du navigateur';
      const res = await api.uploadMedia(file, 'image', label);
      handleFieldChange(key, res.url);
      setToast({ type: 'success', message: `${label} téléversé avec succès.` });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur lors du téléversement.' });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    try {
      // Save all modified keys one by one
      if (rawSettings) {
        for (const s of rawSettings) {
          if (formData[s.key] !== s.value) {
            await updateMutation.mutateAsync({ key: s.key, value: formData[s.key] });
          }
        }
      }
      setIsDirty(false);
      setToast({ type: 'success', message: 'Paramètres généraux mis à jour et propagés (SSE émis).' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur d\'enregistrement des paramètres.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Configuration</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Paramètres généraux</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Configurez l'identité visuelle de l'institution, le SEO, les marquees et les durées globales.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isDirty && (
            <span style={{ fontSize: 12, color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <AlertTriangle size={14} /> Modifications non sauvegardées
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline"
            disabled={!isDirty}
            onClick={() => {
              if (rawSettings) {
                const data: Record<string, string> = {};
                rawSettings.forEach(s => {
                  data[s.key] = s.value;
                });
                setFormData(data);
              }
            }}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending || !isDirty}>
            <Save size={16} style={{ marginRight: 6 }} /> Enregistrer
          </button>
        </div>
      </div>

      {toast && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 6,
          marginBottom: 20,
          background: toast.type === 'success' ? '#EBFBEE' : '#FCE8E6',
          border: `1px solid ${toast.type === 'success' ? '#D3F9D8' : '#F8D7DA'}`,
          color: toast.type === 'success' ? '#2B8A3E' : '#C92A2A',
          fontSize: 14,
          fontWeight: 500
        }}>
          {toast.message}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--color-rule)', marginBottom: 20, paddingBottom: 1 }}>
        <button
          type="button"
          className={`chip ${activeTab === 'branding' ? 'active' : ''}`}
          onClick={() => setActiveTab('branding')}
          style={{ fontSize: 13, padding: '8px 16px', borderRadius: '4px 4px 0 0' }}
        >
          <Sliders size={14} style={{ marginRight: 6, verticalAlign: 'middle', display: 'inline' }} /> Charte graphique &amp; Référencement (SEO)
        </button>
        <button
          type="button"
          className={`chip ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
          style={{ fontSize: 13, padding: '8px 16px', borderRadius: '4px 4px 0 0' }}
        >
          <Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle', display: 'inline' }} /> Pied de page &amp; Contacts
        </button>
      </div>

      {activeTab === 'branding' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Main Visual Branding Details */}
          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Identité Visuelle &amp; SEO</h3>
            
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Nom officiel de l'Institution</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
              value={formData.site_name || ''}
              onChange={e => handleFieldChange('site_name', e.target.value)}
              required
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Description SEO globale (Meta Description)</label>
            <textarea
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 90, resize: 'vertical', lineHeight: 1.5 }}
              value={formData.meta_desc || ''}
              onChange={e => handleFieldChange('meta_desc', e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Durée du modal visiteur (s)</label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                  value={formData.modal_duration || ''}
                  onChange={e => handleFieldChange('modal_duration', e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Vitesse des logos défilants</label>
                <input
                  type="number"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                  value={formData.marquee_speed || ''}
                  onChange={e => handleFieldChange('marquee_speed', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Logo & Favicon uploads */}
          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', alignSelf: 'start' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Logos &amp; Fichiers graphiques</h3>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Logo institutionnel officiel</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
              {formData.logo && (
                <div style={{ width: 80, height: 80, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-rule)', flexShrink: 0, padding: 8, background: '#f8f9fa' }}>
                  <img src={formData.logo} alt="Official logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={e => handleImageUpload('logo', e)}
                  style={{ display: 'none' }}
                  disabled={uploadingField !== null}
                />
                <label
                  htmlFor="logo-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--color-cream)',
                    border: '2px dashed var(--color-rule)',
                    borderRadius: 6,
                    cursor: uploadingField !== null ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Upload size={16} /> {uploadingField === 'logo' ? 'Téléchargement...' : 'Téléverser logo'}
                </label>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 20 }}>Favicon du navigateur</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
              {formData.favicon && (
                <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-rule)', flexShrink: 0, padding: 4, background: '#f8f9fa' }}>
                  <img src={formData.favicon} alt="Favicon preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="favicon-upload"
                  accept="image/*"
                  onChange={e => handleImageUpload('favicon', e)}
                  style={{ display: 'none' }}
                  disabled={uploadingField !== null}
                />
                <label
                  htmlFor="favicon-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: 'var(--color-cream)',
                    border: '2px dashed var(--color-rule)',
                    borderRadius: 6,
                    cursor: uploadingField !== null ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <Upload size={14} /> {uploadingField === 'favicon' ? 'Téléchargement...' : 'Téléverser favicon'}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px', maxWidth: 640 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Pied de page &amp; Contacts officiels</h3>
          
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>
            <MapPin size={13} style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline', color: 'var(--color-gold)' }} /> Adresse Physique
          </label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 60, resize: 'vertical' }}
            value={formData.footer_address || ''}
            onChange={e => handleFieldChange('footer_address', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>
            <Phone size={13} style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline', color: 'var(--color-gold)' }} /> Numéros de téléphones standards (Séparez par retour à la ligne)
          </label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 60, resize: 'vertical', fontFamily: 'monospace' }}
            value={formData.footer_phones || ''}
            onChange={e => handleFieldChange('footer_phones', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>
            <Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline', color: 'var(--color-gold)' }} /> Courriel de contact institutionnel
          </label>
          <input
            type="email"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
            value={formData.footer_email || ''}
            onChange={e => handleFieldChange('footer_email', e.target.value)}
            required
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#EBF8FB', border: '1px solid #D0EBFE', padding: '12px 16px', borderRadius: 6, marginTop: 24, color: '#0E5C9A' }}>
            <ShieldCheck size={20} />
            <div style={{ fontSize: 12, fontWeight: 500 }}>Toutes les modifications apportées au pied de page se propageront en cascade à l'ensemble du portail.</div>
          </div>
        </div>
      )}
    </form>
  );
}
