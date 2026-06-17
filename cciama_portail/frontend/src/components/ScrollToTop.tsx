import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/':                              'CCIAMA du Tchad — Portail institutionnel',
  '/services':                      'Services aux entreprises — CCIAMA',
  '/actualites':                    'Actualités & communiqués — CCIAMA',
  '/documentation':                 'Documentation officielle — CCIAMA',
  '/tracker':                       'Suivre mon dossier — CCIAMA',
  '/contact':                       'Contact — CCIAMA',
  '/institution/missions':          'Missions — CCIAMA',
  '/institution/structure':         'Gouvernance — CCIAMA',
  '/institution/organismes':        'Délégations régionales — CCIAMA',
  '/institution/projets':           'Projets & programmes — CCIAMA',
  '/institution/mot-du-ministre':   'Mot du Président — CCIAMA',
  '/admin':                         'Console d\'administration — CCIAMA',
  '/agent':                         'Espace Agent — CCIAMA',
  '/bi':                            'Tableau de bord — CCIAMA',
};

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const title =
      PAGE_TITLES[pathname] ??
      (pathname.startsWith('/actualites/') ? 'Article — CCIAMA' : 'CCIAMA du Tchad');
    document.title = title;
  }, [pathname]);

  return null;
}
