
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, MapPin, Phone, Mail, Clock, Download } from 'lucide-react';
import { LogoMark } from '@/components/icons/LogoMark';
import { useMinisterContent, useMissions, useOrganigram, useProjects, useOrganisms } from '@/hooks/useCms';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

function PageBanner({ title }: { title: string }) {
  return (
    <div className="page-banner">
      <div className="container">
        <h1>{title}</h1>
      </div>
    </div>
  );
}

export function MotMinistrePage() {
  const { data: content } = useMinisterContent();

  const title = content?.title || "Mot de l'Administrateur Provisoire";
  const name = content?.name || "Abderrahmane Gademi";
  const role = content?.role || "AdministrateProvisoire";
  const portrait = content?.portrait || "";
  const welcomeTitle = content?.welcomeTitle || "Bienvenue sur le portail institutionnel";
  const para1 = content?.para1 || "Chers acteurs du secteur privé, chers partenaires, c'est avec un profond sentiment de responsabilité que je m'adresse à vous à travers ce portail, qui se veut le reflet de notre engagement commun pour bâtir un secteur privé fort, structuré, compétitif et connecté aux opportunités.";
  const para2 = content?.para2 || "La Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat traverse une période de modernisation. L'amélioration du climat des affaires, l'accompagnement des entrepreneurs, le développement des filières stratégiques et la promotion des jeunes et des femmes constituent les piliers de cette transformation.";
  const quote = content?.quote || "Notre ambition est claire : faire de la CCIAMA un véritable levier de développement économique, au service de chaque entrepreneur.";
  const para3 = content?.para3 || "Ce portail est le vôtre. Il vous permet d'accéder aux formalités, de suivre vos démarches, de consulter les opportunités d'affaires et de vous informer sur l'action consulaire. Je vous invite à l'explorer et à rejoindre notre réseau d'acteurs économiques.";
  const bioFile = content?.bioFile || "";

  return (
    <>
      <PageBanner title={title} />
      <div className="container" style={{ padding: '48px 28px 80px' }}>
        <div className="mot-grid">
          <div>
            <div style={{
              height: 360,
              background: portrait ? `url(${portrait}) no-repeat center` : 'linear-gradient(135deg, #1B3D7C, #0E2A5E)',
              backgroundSize: 'cover',
              borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {!portrait && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>[ portrait officiel ]</span>}
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-navy)' }}>{name}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>{role}</div>
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', marginBottom: 24 }}>{welcomeTitle}</h2>
            <p className="justify" style={{ fontSize: 'var(--text-md)', color: 'var(--color-ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
              {para1}
            </p>
            <p className="justify" style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
              {para2}
            </p>
            <blockquote style={{
              borderLeft: '4px solid var(--color-gold)', padding: '20px 28px', margin: '28px 0',
              background: 'var(--color-cream-warm)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'var(--text-md)',
              color: 'var(--color-navy)', lineHeight: 1.55,
            }}>
              « {quote} »
            </blockquote>
            <p className="justify" style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-soft)', lineHeight: 1.7 }}>
              {para3}
            </p>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-rule)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline"
                disabled={!bioFile}
                onClick={() => {
                  if (bioFile) {
                    window.open(bioFile, '_blank');
                  }
                }}
              >
                <Download size={14} /> Télécharger la biographie
              </button>
              <Link to="/contact" className="btn btn-ghost">Contacter le cabinet</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function MissionsPage() {
  const { data: dbMissions } = useMissions();

  const defaultMissions = [
    { id: 'm1', num: '01', title: 'Représentation et Défense', desc: "Représenter et défendre les intérêts des commerçants, industriels, agriculteurs, miniers et artisans auprès des pouvoirs publics." },
    { id: 'm2', num: '02', title: 'Interface Publique/Privée', desc: "Servir d'interface entre l'État et les opérateurs économiques pour un dialogue constructif et permanent." },
    { id: 'm3', num: '03', title: 'Avis et Recommandations', desc: "Fournir aux pouvoirs publics des avis sur les questions économiques, sociales, juridiques, fiscales et administratives." },
    { id: 'm4', num: '04', title: 'Climat des Affaires', desc: "Contribuer activement à l'amélioration du climat des affaires et à la création d'emplois au niveau national." },
    { id: 'm5', num: '05', title: 'Développement Durable', desc: "Appuyer le développement économique durable dans les secteurs de l'agriculture, du commerce et des industries extractives." },
    { id: 'm6', num: '06', title: 'Accompagnement', desc: "Soutenir la structuration des PME/PMI, avec une attention particulière pour les femmes et les jeunes entrepreneurs." },
  ];

  const missions = dbMissions && dbMissions.length > 0 ? dbMissions : defaultMissions;

  return (
    <>
      <PageBanner title="Missions et Attributions" />
      <div className="container" style={{ padding: '48px 28px 80px' }}>
        <motion.div className="svc-grid" initial="hidden" animate="visible" variants={stagger}>
          {missions.map(m => (
            <motion.div key={m.id || m.num} className="svc-card" variants={fadeUp}>
              <span className="num">{m.num}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export function StructurePage() {
  const { data: apiNodes } = useOrganigram();
  
  const rawNodes = apiNodes && apiNodes.length > 0 ? apiNodes : [
    { id: '1', name: '130 membres élus', role: 'Assemblée Générale', parentId: null },
    { id: '2', name: '15 membres élus', role: 'Bureau Exécutif', parentId: '1' },
    { id: '3', name: 'Direction des Formalités', role: 'Direction', parentId: '2' },
    { id: '4', name: 'Direction de l\'Appui PME/PMI', role: 'Direction', parentId: '2' },
    { id: '5', name: 'Direction de la Formation (CFPP)', role: 'Direction', parentId: '2' },
    { id: '6', name: 'Direction des Projets & Études', role: 'Direction', parentId: '2' },
    { id: '7', name: 'Direction Administrative et Financière', role: 'Direction', parentId: '2' }
  ];

  const roots = rawNodes.filter(n => !n.parentId);

  const OrgTreeNode = ({ node }: { node: any }) => {
    const children = rawNodes.filter(c => c.parentId === node.id);
    return (
      <li>
        <div className={`org-node ${!node.parentId ? 'org-node-top' : children.length === 0 ? 'org-node-leaf' : ''}`}>
          <div className="org-role">{node.role}</div>
          <div className="org-name">{node.name}</div>
        </div>
        {children.length > 0 && (
          <ul>
            {children.map(child => (
              <OrgTreeNode key={child.id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <PageBanner title="Structure Organisationnelle" />
      <div className="container" style={{ padding: '48px 28px 80px' }}>
        <div className="org-tree">
          <ul>
            {roots.map(r => (
              <OrgTreeNode key={r.id} node={r} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function OrganismesPage() {
  const { data: orgData } = useOrganisms();
  const ORGANISMS = (orgData ?? []).filter(o => o.kind === 'organism');
  return (
    <>
      <PageBanner title="Organismes et Structures sous tutelle" />
      <div className="container" style={{ padding: '48px 28px 80px' }}>
        <motion.div className="org-cards-grid" initial="hidden" animate="visible" variants={stagger}>
          {ORGANISMS.map(o => (
            <motion.a key={o.short} href={o.url} className="org-card-link" variants={fadeUp}>
              <div className="org-mark"><LogoMark type={o.mark} color={o.color} size={48} /></div>
              <div className="org-card-body">
                <div className="org-short">{o.short}</div>
                <div className="org-name-full">{o.name}</div>
              </div>
              <ExternalLink size={14} className="org-arrow" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export function ProjetsPage() {
  const { data: projectsData } = useProjects();
  const PROJECTS = projectsData ?? [];
  const [filter, setFilter] = useState('all');
  const projectFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'ongoing', label: 'En cours' },
    { id: 'planned', label: 'Programmés' },
    { id: 'completed', label: 'Achevés' },
  ];
  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === filter);

  return (
    <>
      <PageBanner title="Projets et Programmes" />
      <div className="container" style={{ padding: '32px 28px 80px' }}>
        <div className="news-toolbar" style={{ marginBottom: 24 }}>
          <div className="filters" role="tablist" aria-label="Filtrer les projets">
            {projectFilters.map(f => (
              <button
                key={f.id}
                className={`chip ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
                role="tab"
                aria-selected={filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="total" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)' }}>
            {filtered.length} projet{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
        <motion.div className="projects-grid" initial="hidden" animate="visible" variants={stagger}>
          {filtered.map(p => (
            <motion.div key={p.id} className="project-card" variants={fadeUp}>
              <div className="project-head">
                <span className={`status-pill ${p.status === 'ongoing' ? 'progress' : p.status === 'completed' ? 'done' : 'review'}`}>
                  {p.statusLabel}
                </span>
                <span className="project-period">{p.period}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="project-progress">
                <div className="progress-ring" role="img" aria-label={`${p.progress}% réalisé`}>
                  <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
                    <circle className="ring-track" cx="32" cy="32" r="29" />
                    <circle
                      className="ring-fill"
                      cx="32" cy="32" r="29"
                      style={{
                        strokeDasharray: 2 * Math.PI * 29,
                        strokeDashoffset: (2 * Math.PI * 29) * (1 - Math.min(100, Math.max(0, p.progress)) / 100),
                      }}
                    />
                  </svg>
                  <span className="ring-pct">{p.progress}%</span>
                </div>
                <div className="progress-label">réalisé</div>
              </div>
              <div className="project-meta">
                <div><div className="k">Budget</div><div className="v">{p.budget}</div></div>
                <div><div className="k">Partenaire</div><div className="v">{p.partner}</div></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageBanner title="Contact" />
      <div className="container" style={{ padding: '48px 28px 80px' }}>
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Coordonnées officielles</h2>
            {([
              { icon: <MapPin size={18} />, k: 'Adresse', v: 'Avenue Karim Nassour, B.P. 458\nN\'Djamena, République du Tchad' },
              { icon: <Phone size={18} />, k: 'Téléphone', v: '+235 66 28 07 63' },
              { icon: <Mail size={18} />, k: 'Courrier électronique', v: 'info.cciama@gmail.com' },
              { icon: <Clock size={18} />, k: 'Horaires d\'ouverture', v: 'Lundi à vendredi\n07h30 — 15h30 (sauf jours fériés)' },
            ] as { icon: React.ReactElement; k: string; v: string }[]).map((c, i) => (
              <div key={i} className="ci-row">
                <div className="ic">{c.icon}</div>
                <div>
                  <div className="k">{c.k}</div>
                  <div className="v" style={{ whiteSpace: 'pre-line' }}>{c.v}</div>
                </div>
              </div>
            ))}
          </div>
          <form className="contact-form" onSubmit={e => e.preventDefault()}>
            <h2>Envoyer un message</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-mute)', margin: '0 0 4px' }}>
              Tous les champs marqués d'un astérisque (*) sont obligatoires.
            </p>
            <div className="row">
              <div className="field">
                <label htmlFor="contact-nom">Nom *</label>
                <input id="contact-nom" type="text" placeholder="Votre nom" required />
              </div>
              <div className="field">
                <label htmlFor="contact-prenom">Prénom *</label>
                <input id="contact-prenom" type="text" placeholder="Votre prénom" required />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="contact-email">Adresse e-mail *</label>
                <input id="contact-email" type="email" placeholder="vous@email.td" required />
              </div>
              <div className="field">
                <label htmlFor="contact-tel">Téléphone</label>
                <input id="contact-tel" type="tel" placeholder="+235 …" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="contact-objet">Objet de votre demande *</label>
              <select id="contact-objet" required>
                <option value="">— Sélectionner —</option>
                <option>Information générale</option>
                <option>Suivi d'un dossier</option>
                <option>Demande de rendez-vous</option>
                <option>Réclamation / Médiation</option>
                <option>Presse / Communication</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="contact-msg">Message *</label>
              <textarea id="contact-msg" placeholder="Décrivez votre demande de manière précise et concise…" required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>
              Envoyer ma demande <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
