import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Marquee } from '@/components/Marquee';
import { useHomeContent, usePlatformSettings, useNews, useOrganisms, useServiceCatalogue } from '@/hooks/useCms';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export function HomePage() {
  const { data: home } = useHomeContent();
  const { data: settings } = usePlatformSettings();
  const { data: newsData } = useNews();
  const NEWS = newsData ?? [];
  const { data: orgData } = useOrganisms();
  const ORGANISMS = (orgData ?? []).filter(o => o.kind === 'organism');
  const PARTNERS = (orgData ?? []).filter(o => o.kind === 'partner');
  const { data: catalogue } = useServiceCatalogue();
  const previewServices = (catalogue ?? []).flatMap(f => f.services ?? []).slice(0, 3);

  const heroEyebrow = home?.heroEyebrow || "Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat du Tchad";
  const heroTitle = home?.heroTitle || "La voix institutionnelle du secteur privé tchadien.";
  const heroDesc = home?.heroDesc || "La CCIAMA accompagne, représente et défend les acteurs économiques du Tchad pour bâtir un secteur privé fort, structuré, compétitif et connecté aux opportunités.";
  const heroCtaText = home?.heroCtaText || "Découvrir les services";
  const heroCtaLink = home?.heroCtaLink || "/services";
  const heroImage = home?.heroImage || "";
  const missionEye = home?.missionEye || "Notre mission";
  const missionTitle = home?.missionTitle || "Représenter, Défendre et Accompagner";
  const missionDesc = home?.missionDesc || "La CCIAMA a pour mission de représenter et défendre les intérêts du secteur privé, servir d’interface avec l’État, et contribuer à l’amélioration du climat des affaires. Nous accompagnons le développement du commerce, de l'agriculture, de l'artisanat et de l'industrie.";
  const stats = home?.stats || [
    { num: '23', sup: '', label: 'Délégations en province' },
    { num: '86', sup: '', label: "Membres élus (N'Djamena)" },
    { num: '5', sup: '', label: "Secteurs d'activité" },
    { num: '15', sup: 'k+', label: 'Entreprises accompagnées' }
  ];

  const marqueeSpeed = settings?.marquee_speed || 40;
  const logoUrl = settings?.logo || "/cciama-logo.png";

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-label="Section d'accueil">
        <div className="container">
          <div className="hero-grid">
            {/* Feature card */}
            <motion.div
              className="hero-feature"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <div
                className="feature-img"
                style={heroImage ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              >
                {!heroImage && <div className="placeholder-stripe" />}
              </div>
              {!heroImage && <div className="img-tag">[ photo institutionnelle · espace à personnaliser ]</div>}
              <img className="feature-watermark" src={logoUrl} alt="" />
              <div className="hero-feature-content">
                <motion.div className="hero-eyebrow" variants={fadeUp}>
                  {heroEyebrow}
                </motion.div>
                <motion.h1 variants={fadeUp}>
                  {heroTitle}
                </motion.h1>
                <motion.p variants={fadeUp}>
                  {heroDesc}
                </motion.p>
                <motion.div className="hero-actions" variants={fadeUp}>
                  <Link to={heroCtaLink} className="btn btn-gold">
                    {heroCtaText}
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/institution" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'transparent' }}>
                    L'Institution
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* News ticker */}
            <aside className="hero-news" aria-label="Dernières actualités">
              <div className="hero-news-head">
                <h2>
                  <span className="live-pulse" />
                  Actualités
                </h2>
                <span className="meta">{NEWS.length} publications</span>
              </div>
              <div className="hero-news-list">
                {NEWS.slice(0, 4).map(n => (
                  <Link key={n.id} to={`/actualites/${n.id}`} className="news-item">
                    <div className="ni-meta">
                      <span className={`ni-cat ${n.cat}`}>{n.catLabel}</span>
                      <span>{n.date}</span>
                    </div>
                    <h3>{n.title}</h3>
                    <span className="ni-arrow">
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="hero-news-foot">
                <Link to="/actualites">
                  Toutes les actualités <ArrowRight size={12} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="container">
        <motion.div
          className="mission"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <div className="mission-left">
            <motion.div className="eyebrow" variants={fadeUp}>{missionEye}</motion.div>
            <motion.h3 variants={fadeUp}>
              {missionTitle}
            </motion.h3>
            <motion.p variants={fadeUp} className="justify">
              {missionDesc}
            </motion.p>
          </div>
          <motion.div className="mission-right" variants={stagger}>
            {stats.map((s, i) => (
              <motion.div key={i} className="mission-stat" variants={fadeUp}>
                <div className="num">{s.num}<sup>{s.sup}</sup></div>
                <div className="lbl">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Services Preview */}
      <section className="section" style={{ background: 'var(--color-cream-warm)', padding: '56px 0' }} aria-label="Services principaux">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Services aux entreprises</div>
              <h2>Des démarches simplifiées pour votre croissance</h2>
            </div>
            <Link to="/services" className="btn btn-outline">
              Tous les services <ArrowRight size={14} />
            </Link>
          </div>
          <motion.div
            className="svc-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {previewServices.map(s => (
              <motion.div key={s.id} className="svc-card" variants={fadeUp}>
                <span className="num">{s.code}</span>
                <h3>{s.title}</h3>
                <p>{s.tagline}</p>
                <Link to={`/services/${s.code}`} className="more">
                  En savoir plus <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquees */}
      <Marquee
        items={ORGANISMS}
        speed={marqueeSpeed}
        eyebrow="Écosystème institutionnel"
        label="Organismes et structures sous tutelle"
        viewAllPath="/institution/organismes"
      />
      <Marquee
        items={PARTNERS}
        speed={marqueeSpeed + 10}
        eyebrow="Coopération internationale"
        label="Partenaires et bailleurs"
      />
    </>
  );
}
