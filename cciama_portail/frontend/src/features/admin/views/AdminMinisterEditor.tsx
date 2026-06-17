import { useState, useEffect } from 'react';
import { useMinisterContent, useUpdateMinisterContentMutation } from '@/hooks/useCms';
import { api } from '@/lib/api';
import { Upload, FileDown, RefreshCw, AlertTriangle } from 'lucide-react';

export function AdminMinisterEditor() {
  const { data: content, isLoading } = useMinisterContent();
  const updateMutation = useUpdateMinisterContentMutation();

  const [formData, setFormData] = useState({
    eyebrow: '',
    title: '',
    lead: '',
    name: '',
    role: '',
    portrait: '',
    welcomeTitle: '',
    para1: '',
    para2: '',
    quote: '',
    para3: '',
    bioFile: ''
  });

  const [isDirty, setIsDirty] = useState(false);
  const [portraitUploading, setPortraitUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        eyebrow: content.eyebrow || '',
        title: content.title || '',
        lead: content.lead || '',
        name: content.name || '',
        role: content.role || '',
        portrait: content.portrait || '',
        welcomeTitle: content.welcomeTitle || '',
        para1: content.para1 || '',
        para2: content.para2 || '',
        quote: content.quote || '',
        para3: content.para3 || '',
        bioFile: content.bioFile || ''
      });
      setIsDirty(false);
    }
  }, [content]);

  useEffect(() => {
    if (!content) return;
    const isSame = 
      formData.eyebrow === content.eyebrow &&
      formData.title === content.title &&
      formData.lead === content.lead &&
      formData.name === content.name &&
      formData.role === content.role &&
      formData.portrait === content.portrait &&
      formData.welcomeTitle === content.welcomeTitle &&
      formData.para1 === content.para1 &&
      formData.para2 === content.para2 &&
      formData.quote === content.quote &&
      formData.para3 === content.para3 &&
      formData.bioFile === content.bioFile;

    setIsDirty(!isSame);
  }, [formData, content]);

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

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPortraitUploading(true);
    setToast(null);

    try {
      const res = await api.uploadMedia(file, 'image', 'Portrait Officiel de l\'Administrateur');
      handleFieldChange('portrait', res.url);
      setToast({ type: 'success', message: 'Portrait officiel téléversé et compressé en WebP.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur lors du téléversement.' });
    } finally {
      setPortraitUploading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploading(true);
    setToast(null);

    try {
      const res = await api.uploadMedia(file, 'document', 'Biographie officielle de l\'Administrateur');
      handleFieldChange('bioFile', res.url);
      setToast({ type: 'success', message: 'Biographie PDF téléversée avec succès.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur lors du téléversement.' });
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    try {
      await updateMutation.mutateAsync(formData);
      setIsDirty(false);
      setToast({ type: 'success', message: 'Mot de l\'Administrateur mis à jour avec succès (SSE diffusé).' });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Erreur d\'enregistrement.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Pages</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Mot de l'Administrateur Provisoire</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Gérez le portrait, la biographie téléchargeable et les paragraphes éditoriaux de bienvenue.</p>
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
              if (content) {
                setFormData({
                  eyebrow: content.eyebrow || '',
                  title: content.title || '',
                  lead: content.lead || '',
                  name: content.name || '',
                  role: content.role || '',
                  portrait: content.portrait || '',
                  welcomeTitle: content.welcomeTitle || '',
                  para1: content.para1 || '',
                  para2: content.para2 || '',
                  quote: content.quote || '',
                  para3: content.para3 || '',
                  bioFile: content.bioFile || ''
                });
              }
            }}
          >
            Réinitialiser
          </button>
          <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending || !isDirty}>
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
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
          <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Contenu de bienvenue</h3>
          
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Surtitre de Page (Eyebrow)</label>
          <input
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
            value={formData.eyebrow}
            onChange={e => handleFieldChange('eyebrow', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Titre principal de la Page (Heading 1)</label>
          <input
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
            value={formData.title}
            onChange={e => handleFieldChange('title', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Accroche (Lead Paragraph / Phrase d'introduction)</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 60, resize: 'vertical' }}
            value={formData.lead}
            onChange={e => handleFieldChange('lead', e.target.value)}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Titre de Bienvenue (Heading 2)</label>
          <input
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
            value={formData.welcomeTitle}
            onChange={e => handleFieldChange('welcomeTitle', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Paragraphe 1</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 95, resize: 'vertical' }}
            value={formData.para1}
            onChange={e => handleFieldChange('para1', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Paragraphe 2</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 95, resize: 'vertical' }}
            value={formData.para2}
            onChange={e => handleFieldChange('para2', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Citation en exergue (Blockquote)</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 65, resize: 'vertical', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            value={formData.quote}
            onChange={e => handleFieldChange('quote', e.target.value)}
            required
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Paragraphe 3 (Conclusion)</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', minHeight: 95, resize: 'vertical' }}
            value={formData.para3}
            onChange={e => handleFieldChange('para3', e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '24px 28px' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 10, marginBottom: 14, color: 'var(--color-navy)' }}>Identité &amp; Médias</h3>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Nom complet de l'Autorité</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)', fontWeight: 600 }}
              value={formData.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              required
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Titre / Rôle institutionnel</label>
            <input
              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
              value={formData.role}
              onChange={e => handleFieldChange('role', e.target.value)}
              required
            />

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 14 }}>Portrait officiel</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
              {formData.portrait && (
                <div style={{ width: 85, height: 110, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-rule)', flexShrink: 0 }}>
                  <img src={formData.portrait} alt="Portrait preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="portrait-upload"
                  accept="image/*"
                  onChange={handlePortraitUpload}
                  style={{ display: 'none' }}
                  disabled={portraitUploading}
                />
                <label
                  htmlFor="portrait-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--color-cream)',
                    border: '2px dashed var(--color-rule)',
                    borderRadius: 6,
                    cursor: portraitUploading ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Upload size={16} /> {portraitUploading ? 'Téléchargement...' : 'Téléverser image'}
                </label>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6, marginTop: 18 }}>Biographie officielle (Document PDF)</label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
              {formData.bioFile && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 6, background: '#FFF0F0', border: '1px solid #FFE3E3', color: '#E03131', flexShrink: 0 }}>
                  <FileDown size={20} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  style={{ display: 'none' }}
                  disabled={pdfUploading}
                />
                <label
                  htmlFor="pdf-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'var(--color-cream)',
                    border: '2px dashed var(--color-rule)',
                    borderRadius: 6,
                    cursor: pdfUploading ? 'not-allowed' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Upload size={16} /> {pdfUploading ? 'Téléchargement...' : 'Téléverser biographie PDF'}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
