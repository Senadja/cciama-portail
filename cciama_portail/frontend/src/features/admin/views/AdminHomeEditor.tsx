import { useState, useEffect } from 'react';
import { useHomeContent, useUpdateHomeContentMutation } from '@/hooks/useCms';
import { api } from '@/lib/api';
import { Upload, Trash2, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

export function AdminHomeEditor() {
  const { data: home, isLoading } = useHomeContent();
  const updateMutation = useUpdateHomeContentMutation();

  const [formData, setFormData] = useState({
    heroEyebrow: '',
    heroTitle: '',
    heroDesc: '',
    heroCtaText: '',
    heroCtaLink: '',
    heroImage: '',
    missionEye: '',
    missionTitle: '',
    missionDesc: '',
    stats: [] as Array<{ num: string; sup: string; label: string }>
  });

  const [isDirty, setIsDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync with database content when loaded
  useEffect(() => {
    if (home) {
      const parsedStats = Array.isArray(home.stats) ? home.stats : [];
      setFormData({
        heroEyebrow: home.heroEyebrow || '',
        heroTitle: home.heroTitle || '',
        heroDesc: home.heroDesc || '',
        heroCtaText: home.heroCtaText || '',
        heroCtaLink: home.heroCtaLink || '',
        heroImage: home.heroImage || '',
        missionEye: home.missionEye || '',
        missionTitle: home.missionTitle || '',
        missionDesc: home.missionDesc || '',
        stats: parsedStats
      });
      setIsDirty(false);
    }
  }, [home]);

  // Track dirty state
  useEffect(() => {
    if (!home) return;
    const parsedStats = Array.isArray(home.stats) ? home.stats : [];
    const isSame = 
      formData.heroEyebrow === home.heroEyebrow &&
      formData.heroTitle === home.heroTitle &&
      formData.heroDesc === home.heroDesc &&
      formData.heroCtaText === home.heroCtaText &&
      formData.heroCtaLink === home.heroCtaLink &&
      formData.heroImage === home.heroImage &&
      formData.missionEye === home.missionEye &&
      formData.missionTitle === home.missionTitle &&
      formData.missionDesc === home.missionDesc &&
      JSON.stringify(formData.stats) === JSON.stringify(parsedStats);

    setIsDirty(!isSame);
  }, [formData, home]);

  // Prompt before window reload if dirty
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

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index: number, key: 'num' | 'sup' | 'label', value: string) => {
    const nextStats = [...formData.stats];
    nextStats[index] = { ...nextStats[index], [key]: value };
    handleFieldChange('stats', nextStats);
  };

  const addStat = () => {
    handleFieldChange('stats', [...formData.stats, { num: '0', sup: '', label: 'Nouveau chiffre' }]);
  };

  const removeStat = (index: number) => {
    const nextStats = formData.stats.filter((_, idx) => idx !== index);
    handleFieldChange('stats', nextStats);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setToast(null);

    try {
      const res = await api.uploadMedia(file, 'image', 'Image Hero Page d\'Accueil');
      handleFieldChange('heroImage', res.url);
      setToast({ type: 'success', message: 'Image téléversée et compressée avec succès.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur lors du téléversement.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    try {
      await updateMutation.mutateAsync(formData);
      setIsDirty(false);
      setToast({ type: 'success', message: 'Page d\'accueil mise à jour et publiée (SSE diffusé).' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur d\'enregistrement.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Pages</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Édition de la page d'accueil</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Modifiez la section Hero, les statistiques institutionnelles et les missions.</p>
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
              if (home) {
                setFormData({
                  heroEyebrow: home.heroEyebrow || '',
                  heroTitle: home.heroTitle || '',
                  heroDesc: home.heroDesc || '',
                  heroCtaText: home.heroCtaText || '',
                  heroCtaLink: home.heroCtaLink || '',
                  heroImage: home.heroImage || '',
                  missionEye: home.missionEye || '',
                  missionTitle: home.missionTitle || '',
                  missionDesc: home.missionDesc || '',
                  stats: Array.isArray(home.stats) ? home.stats : []
                });
              }
            }}
          >
            Réinitialiser
          </button>
          <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending || !isDirty}>
            {updateMutation.isPending ? 'Publication...' : 'Publier les modifications'}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Section Hero</h3>
          
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Surtitre du Hero (Eyebrow)</label>
          <input
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
            value={formData.heroEyebrow}
            onChange={e => handleFieldChange('heroEyebrow', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Titre principal (Heading 1)</label>
          <input
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
            value={formData.heroTitle}
            onChange={e => handleFieldChange('heroTitle', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Description (Paragraphe)</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 90, resize: 'vertical' }}
            value={formData.heroDesc}
            onChange={e => handleFieldChange('heroDesc', e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Bouton CTA — Texte</label>
              <input
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                value={formData.heroCtaText}
                onChange={e => handleFieldChange('heroCtaText', e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Bouton CTA — Lien</label>
              <input
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                value={formData.heroCtaLink}
                onChange={e => handleFieldChange('heroCtaLink', e.target.value)}
                required
              />
            </div>
          </div>

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Image d'illustration Hero</label>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
            {formData.heroImage && (
              <div style={{ width: 80, height: 80, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-rule)', flexShrink: 0 }}>
                <img src={formData.heroImage} alt="Hero illustration preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  id="hero-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <label
                  htmlFor="hero-image-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--color-cream)',
                    border: '2px dashed var(--color-rule)',
                    borderRadius: 6,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Upload size={16} /> {uploading ? 'Téléchargement...' : 'Parcourir et téléverser'}
                </label>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-ink-mute)', marginTop: 6 }}>Format PNG/JPG/WebP. Sharp compressera et formatera automatiquement en WebP.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Notre Mission</h3>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Surtitre de Mission (Eyebrow)</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
              value={formData.missionEye}
              onChange={e => handleFieldChange('missionEye', e.target.value)}
              required
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Titre de la Mission</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
              value={formData.missionTitle}
              onChange={e => handleFieldChange('missionTitle', e.target.value)}
              required
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Texte de Description</label>
            <textarea
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 90, resize: 'vertical' }}
              value={formData.missionDesc}
              onChange={e => handleFieldChange('missionDesc', e.target.value)}
              required
            />
          </div>

          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)' }}>Chiffres-clés (KPIs)</h3>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: 12, padding: '4px 8px' }}
                onClick={addStat}
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            {formData.stats.map((s, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 40px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', textAlign: 'center', fontWeight: 'bold' }}
                  value={s.num}
                  placeholder="Nombre"
                  onChange={e => handleStatChange(idx, 'num', e.target.value)}
                  required
                />
                <input
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', textAlign: 'center' }}
                  value={s.sup}
                  placeholder="Sup"
                  onChange={e => handleStatChange(idx, 'sup', e.target.value)}
                />
                <input
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                  value={s.label}
                  placeholder="Libellé"
                  onChange={e => handleStatChange(idx, 'label', e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(184,30,44,0.3)',
                    borderRadius: 4,
                    padding: '8px',
                    cursor: 'pointer',
                    color: 'var(--color-red)'
                  }}
                  onClick={() => removeStat(idx)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
