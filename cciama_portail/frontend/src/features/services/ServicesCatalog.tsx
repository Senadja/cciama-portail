import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Building2, FileText, RefreshCw } from 'lucide-react';
import { useServiceCatalogue, useServiceByCode } from '@/hooks/useCms';
import type { CatalogueService } from '@/lib/api';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

function PageBanner({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </div>
  );
}

function phaseLabel(phase: string): string {
  const m = phase.match(/phase\s*(\d)/i);
  return m ? `Phase ${m[1]}` : phase;
}

/* ────────────────────────────────────────────────────────────────────────
   Catalogue — 18 services groupés par famille
   ──────────────────────────────────────────────────────────────────────── */
export function ServicesPage() {
  const { data: families, isLoading, isError } = useServiceCatalogue();
  const [activeFamily, setActiveFamily] = useState<string>('all');

  const allFamilies = families || [];
  const totalServices = allFamilies.reduce((acc, f) => acc + (f.services?.length || 0), 0);
  const visibleFamilies = activeFamily === 'all' ? allFamilies : allFamilies.filter(f => f.id === activeFamily);

  return (
    <>
      <PageBanner
        title="Catalogue des services"
        lead="Le programme de digitalisation de la CCIAMA du Tchad réunit l'ensemble des services en ligne au bénéfice des entreprises et des opérateurs économiques."
      />

      <div className="container" style={{ padding: '40px 28px 0' }}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64, color: 'var(--color-ink-mute)' }}>
            <RefreshCw size={24} className="animate-spin" />
          </div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
            Le catalogue n'est pas disponible pour le moment. Veuillez réessayer ultérieurement.
          </div>
        )}

        {!isLoading && !isError && allFamilies.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-ink-mute)' }}>
            Aucun service publié pour le moment.
          </div>
        )}

        {!isLoading && allFamilies.length > 0 && (
          <>
            {/* Family filter */}
            <div className="news-toolbar" style={{ marginBottom: 28 }}>
              <div className="filters" role="tablist" aria-label="Filtrer par famille">
                <button
                  className={`chip ${activeFamily === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFamily('all')}
                  role="tab"
                  aria-selected={activeFamily === 'all'}
                >
                  Toutes les familles
                </button>
                {allFamilies.map(f => (
                  <button
                    key={f.id}
                    className={`chip ${activeFamily === f.id ? 'active' : ''}`}
                    onClick={() => setActiveFamily(f.id)}
                    role="tab"
                    aria-selected={activeFamily === f.id}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
              <div className="total" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
                {totalServices} service{totalServices > 1 ? 's' : ''}
              </div>
            </div>

            {visibleFamilies.map(family => (
              <section key={family.id} style={{ marginBottom: 48 }}>
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--color-rule)' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', marginBottom: 8 }}>
                    {family.name}
                  </h2>
                  <p className="justify" style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.6, maxWidth: 880 }}>
                    {family.description}
                  </p>
                </div>

                <motion.div
                  className="svc-grid"
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                >
                  {(family.services || []).map(svc => (
                    <motion.div key={svc.id} className="svc-card" variants={fadeUp}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <span className="num">{svc.code}</span>
                        <span className="status-pill review" style={{ fontSize: 10 }}>{phaseLabel(svc.phase)}</span>
                      </div>
                      <h3>{svc.title}</h3>
                      <p className="justify" style={{ fontStyle: 'italic' }}>{svc.tagline}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--color-ink-mute)', marginTop: 4 }}>
                        <Clock size={13} />
                        <span>{svc.targetDelay}</span>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                        <Link
                          to={`/services/${svc.code}`}
                          className="btn btn-outline"
                          style={{ padding: '9px 16px', fontSize: 'var(--text-xs)' }}
                        >
                          Consulter la fiche <ArrowRight size={14} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ))}
          </>
        )}

        {/* CTA banners */}
        <div className="cta-banners-grid">
          <div style={{ background: 'var(--color-navy)', color: 'white', padding: '32px 36px', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--color-gold)', color: 'var(--color-navy-deep)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ArrowRight size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'white', fontSize: 'var(--text-lg)', marginBottom: 6 }}>Vous avez déjà déposé un dossier ?</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Consultez l'état d'avancement en saisissant votre numéro de référence.
              </p>
            </div>
            <Link to="/tracker" className="btn btn-gold" style={{ flexShrink: 0 }}>
              Suivre mon dossier <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ background: 'var(--color-cream-warm)', padding: '32px 36px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-rule)', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--color-navy)', color: 'white', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>
              ☎
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: 'var(--color-navy)', fontSize: 'var(--text-lg)', marginBottom: 6 }}>Besoin d'assistance ?</h3>
              <p style={{ color: 'var(--color-ink-soft)', margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Notre accueil vous accompagne du lundi au vendredi, de 07h30 à 15h30.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', fontWeight: 600 }}>
                +235 22<br />52 52 64
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-ink-mute)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Standard CCIAMA
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Fiche détaillée d'un service (7 rubriques)
   ──────────────────────────────────────────────────────────────────────── */
function SectionTitle({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)', margin: '36px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon}
      {children}
    </h2>
  );
}

export function ServiceDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { data: svc, isLoading, isError } = useServiceByCode(code);

  if (isLoading) {
    return (
      <>
        <PageBanner title="Fiche service" />
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80, color: 'var(--color-ink-mute)' }}>
          <RefreshCw size={24} className="animate-spin" />
        </div>
      </>
    );
  }

  if (isError || !svc) {
    return (
      <>
        <PageBanner title="Service introuvable" />
        <div className="container" style={{ padding: '48px 28px 80px', textAlign: 'center', color: 'var(--color-ink-mute)' }}>
          <p>Ce service n'existe pas ou n'est plus disponible.</p>
          <Link to="/services" className="btn btn-outline" style={{ marginTop: 16 }}>← Retour au catalogue</Link>
        </div>
      </>
    );
  }

  const s = svc as CatalogueService;
  const recap: [string, string][] = [
    ['Famille', s.family?.name || ''],
    ['Bénéficiaires', s.beneficiaries],
    ["Canaux d'accès", s.channels],
    ['Délai cible', s.targetDelay],
    ['Phase de déploiement', s.phase],
  ];

  return (
    <>
      <PageBanner title={s.title} />
      <div className="container" style={{ padding: '32px 28px 80px', maxWidth: 980 }}>
        <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)', textDecoration: 'none', marginBottom: 20 }}>
          ← Retour au catalogue
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-gold)', letterSpacing: '0.08em' }}>{s.code}</span>
          <span className="status-pill review">{phaseLabel(s.phase)}</span>
        </div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontStyle: 'italic', color: 'var(--color-navy)', marginBottom: 28 }}>
          {s.tagline}
        </p>

        {/* 1. Tableau récapitulatif */}
        <div style={{ background: 'white', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <tbody>
              {recap.map(([k, v], i) => (
                <tr key={k} style={{ borderBottom: i < recap.length - 1 ? '1px solid var(--color-rule-soft)' : 'none' }}>
                  <th style={{ textAlign: 'left', padding: '12px 18px', width: 220, background: 'var(--color-cream-warm)', fontWeight: 700, color: 'var(--color-ink-soft)', verticalAlign: 'top' }}>{k}</th>
                  <td style={{ padding: '12px 18px', color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Description */}
        <SectionTitle icon={<FileText size={18} />}>Description du service</SectionTitle>
        <p className="justify" style={{ fontSize: 'var(--text-md)', color: 'var(--color-ink-soft)', lineHeight: 1.7 }}>{s.description}</p>

        {/* 3. Processus utilisateur */}
        {s.processSteps?.length > 0 && (
          <>
            <SectionTitle>Processus utilisateur</SectionTitle>
            <ol style={{ paddingLeft: 0, listStyle: 'none', counterReset: 'step' }}>
              {s.processSteps.map((step, i) => (
                <li key={i} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--color-navy)', color: 'white', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.6, paddingTop: 3 }}>{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {/* 4. Écrans et interfaces */}
        {s.screens?.length > 0 && (
          <>
            <SectionTitle>Écrans et interfaces</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {s.screens.map((sc, i) => (
                <div key={i} style={{ border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-sm)', padding: '16px 18px', background: 'var(--color-cream)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 'var(--text-sm)', marginBottom: 6 }}>{sc.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-soft)', lineHeight: 1.5 }}>{sc.description}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 5. Données métier */}
        {s.dataFields?.length > 0 && (
          <>
            <SectionTitle>Données métier manipulées</SectionTitle>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-cream-warm)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--color-ink-soft)' }}>Donnée</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--color-ink-soft)' }}>Type</th>
                    <th style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--color-ink-soft)' }}>Source / contrôle</th>
                  </tr>
                </thead>
                <tbody>
                  {s.dataFields.map((d, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--color-rule-soft)' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-navy)' }}>{d.name}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--color-ink-soft)' }}>{d.type}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--color-ink-soft)' }}>{d.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* 6. Intégrations */}
        {s.integrations?.length > 0 && (
          <>
            <SectionTitle icon={<Building2 size={18} />}>Intégrations et systèmes connexes</SectionTitle>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
              {s.integrations.map((it, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, color: 'var(--color-gold)', marginTop: 2 }}>▪</span>
                  <span>{it.name && <strong style={{ color: 'var(--color-navy)' }}>{it.name} : </strong>}{it.description}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* 7. Indicateurs de performance */}
        {s.kpis?.length > 0 && (
          <>
            <SectionTitle>Indicateurs de performance</SectionTitle>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10 }}>
              {s.kpis.map((k, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>
                  <span style={{ flexShrink: 0, color: 'var(--color-navy)', marginTop: 2 }}>▸</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Règles métier (optionnel) */}
        {s.businessRules?.length > 0 && (
          <>
            <SectionTitle icon={<Users size={18} />}>Règles métier et contrôles</SectionTitle>
            <div style={{ background: 'var(--color-cream-warm)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-lg)', padding: '18px 24px' }}>
              <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 8 }}>
                {s.businessRules.map((r, i) => (
                  <li key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.6 }}>{r}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--color-rule)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/tracker" className="btn btn-primary">Suivre un dossier <ArrowRight size={14} /></Link>
          <Link to="/contact" className="btn btn-ghost">Demander un accompagnement</Link>
        </div>
      </div>
    </>
  );
}
