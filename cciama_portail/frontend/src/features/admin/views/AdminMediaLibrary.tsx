import { useState } from 'react';
import { useAllMedia, useUploadMediaMutation, useDeleteMediaMutation } from '@/hooks/useCms';
import { Upload, Trash2, Image, FileText, Video, RefreshCw, X, Plus, ExternalLink, Calendar, HardDrive } from 'lucide-react';

export function AdminMediaLibrary() {
  const [filterType, setFilterType] = useState<string>('all');
  const { data: rawMedia, isLoading } = useAllMedia(filterType === 'all' ? undefined : filterType);
  const uploadMutation = useUploadMediaMutation();
  const deleteMutation = useDeleteMediaMutation();

  const [activeModal, setActiveModal] = useState<'upload' | 'delete' | null>(null);
  const [targetMedia, setTargetMedia] = useState<any>(null);
  
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'document' | 'video'>('image');
  const [altText, setAltText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
        <RefreshCw size={24} className="animate-spin" />
      </div>
    );
  }

  const mediaList = rawMedia || [];

  const handleOpenUpload = () => {
    setUploadFile(null);
    setUploadType('image');
    setAltText('');
    setErrorMsg('');
    setActiveModal('upload');
  };

  const handleOpenDelete = (m: any) => {
    setTargetMedia(m);
    setActiveModal('delete');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Auto-detect type
      if (file.type.startsWith('image/')) {
        setUploadType('image');
      } else if (file.type.startsWith('video/')) {
        setUploadType('video');
      } else {
        setUploadType('document');
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setErrorMsg('Veuillez sélectionner un fichier.');
      return;
    }

    setErrorMsg('');
    try {
      await uploadMutation.mutateAsync({
        file: uploadFile,
        type: uploadType,
        altText: altText || undefined
      });
      setActiveModal(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors du téléversement.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(targetMedia.id);
      setActiveModal(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-ink-mute)', marginBottom: 4 }}>Médias</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 600, color: 'var(--color-ink)' }}>Médiathèque centralisée</h1>
          <p style={{ fontSize: 14, color: 'var(--color-ink-mute)', marginTop: 4 }}>Consultez, ajoutez ou supprimez les ressources du serveur MinIO S3 de la CCIAMA.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleOpenUpload}>
            <Plus size={16} /> Verser un fichier
          </button>
        </div>
      </div>

      {/* Toolbar filters */}
      <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'image', 'document', 'video'] as const).map((t, idx) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`chip ${filterType === t ? 'active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {['Tous les fichiers', 'Images & Logos', 'Documents PDF', 'Vidéos'][idx]}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-ink-mute)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <HardDrive size={13} /> {mediaList.length} élément{mediaList.length > 1 ? 's' : ''} trouvé{mediaList.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Media grid list */}
      {mediaList.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 8, padding: '48px 0', textAlign: 'center', color: 'var(--color-ink-mute)' }}>
          <Image size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p>Aucun fichier média correspondant dans la bibliothèque.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {mediaList.map((m: any) => (
            <div
              key={m.id}
              style={{
                background: 'white',
                border: '1px solid var(--color-rule)',
                borderRadius: 8,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative'
              }}
            >
              {/* Media preview panel */}
              <div style={{ height: 140, background: '#f1f3f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid var(--color-rule-soft)' }}>
                {m.type === 'image' || m.type === 'logo' ? (
                  <img src={m.url} alt={m.altText || m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : m.type === 'video' ? (
                  <Video size={36} style={{ color: 'var(--color-navy)' }} />
                ) : (
                  <FileText size={36} style={{ color: '#E03131' }} />
                )}
              </div>

              {/* Media details text */}
              <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                    {m.filename}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-ink-mute)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={10} /> {new Date(m.uploadedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--color-rule-soft)' }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-ink-mute)' }}>{formatSize(m.size)}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ouvrir dans un nouvel onglet"
                      style={{ padding: 6, border: '1px solid var(--color-rule)', borderRadius: 4, color: 'var(--color-navy)', background: 'transparent', display: 'inline-flex' }}
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      type="button"
                      title="Supprimer définitivement"
                      style={{ padding: 6, border: '1px solid rgba(184,30,44,0.2)', borderRadius: 4, color: 'var(--color-red)', background: 'transparent', cursor: 'pointer' }}
                      onClick={() => handleOpenDelete(m)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Upload Media File */}
      {activeModal === 'upload' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 480, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-rule-soft)', paddingBottom: 12, marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-navy)' }}>
                Verser un fichier média
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

            <form onSubmit={handleUploadSubmit}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Sélectionner le fichier</label>
              <div style={{ border: '2px dashed var(--color-rule)', borderRadius: 6, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', background: 'var(--color-cream)', position: 'relative', marginBottom: 16 }}>
                <Upload size={24} style={{ color: 'var(--color-ink-mute)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>{uploadFile ? uploadFile.name : 'Choisir un fichier...'}</span>
                <span style={{ fontSize: 11, color: 'var(--color-ink-mute)' }}>PDF, JPG, PNG, WEBP, MP4</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Type de média</label>
                  <select
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                    value={uploadType}
                    onChange={e => setUploadType(e.target.value as any)}
                  >
                    <option value="image">Image ou Logo (WebP compressé)</option>
                    <option value="document">Document officiel (PDF)</option>
                    <option value="video">Fichier Vidéo (MP4)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: 6 }}>Texte alternatif (Alt Text / Description pour accessibilité)</label>
                  <input
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-rule)', borderRadius: 4, background: 'var(--color-cream)', color: 'var(--color-ink)' }}
                    value={altText}
                    onChange={e => setAltText(e.target.value)}
                    placeholder="e.g. Logo de la CCIAMA"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid var(--color-rule-soft)', paddingTop: 16 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? 'Téléversement...' : 'Téléverser'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete Media */}
      {activeModal === 'delete' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 8, border: '1px solid var(--color-rule)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 420, padding: 28 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ background: '#FCE8E6', color: 'var(--color-red)', borderRadius: '50%', padding: 10, flexShrink: 0 }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>Confirmer la suppression</h3>
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>
                  Voulez-vous vraiment supprimer le fichier média <strong>"{targetMedia?.filename}"</strong> de la bibliothèque ?
                  <br /><br />
                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>⚠️ Danger :</span> Cette action effacera définitivement l'objet du serveur de stockage MinIO S3. Tous les liens publics pointant vers ce fichier seront rompus !
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
