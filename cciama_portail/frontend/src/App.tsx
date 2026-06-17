import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLangStore } from '@/stores/useLangStore';

// Layouts & shell components
import { GovHeader, GovFooter } from '@/layouts/PublicLayout';
import { FlashInfoBand } from '@/features/flash/FlashInfoBand';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ScrollToTop } from '@/components/ScrollToTop';
import { useSse } from '@/hooks/useSse';
import { ContentUpdateModal } from '@/components/ContentUpdateModal';

// Pages (public — eager)
import { HomePage } from '@/features/home/HomePage';
import { NewsListPage, ArticlePage } from '@/features/news/NewsPages';
import { TrackerPage } from '@/features/tracker/TrackerPage';
import { DocumentationPage } from '@/features/documentation/DocumentationPage';
import { MotMinistrePage, MissionsPage, StructurePage, OrganismesPage, ProjetsPage, ContactPage } from '@/features/institution/InstitutionPages';
import { ServicesPage, ServiceDetailPage } from '@/features/services/ServicesCatalog';
import { NotFoundPage } from '@/features/notfound/NotFoundPage';

// Workspaces (internal — lazy-loaded)
const AdminPage = lazy(() => import('@/features/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const AgentPage = lazy(() => import('@/features/agent/AgentPage').then(m => ({ default: m.AgentPage })));
const BIPage    = lazy(() => import('@/features/bi/BIPage').then(m => ({ default: m.BIPage })));
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then(m => ({ default: m.LoginPage })));

function WorkspaceFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--color-ink-mute)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
      Chargement…
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }
  return <>{children}</>;
}

function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { modalOpen, progress, updateReason } = useSse();

  return (
    <>
      <a href="#main-content" className="skip-link">Aller au contenu principal</a>
      <GovHeader onGoTo={(path) => navigate(path)} />
      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <GovFooter />
      <FlashInfoBand />
      <ChatBubble />
      <ContentUpdateModal isOpen={modalOpen} progress={progress} reason={updateReason} />
    </>
  );
}

export default function App() {
  const lang = useLangStore(s => s.lang);

  // Arabe → écriture de droite à gauche (RTL) ; autres langues → LTR.
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang.toLowerCase();
    el.dir = lang === 'AR' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public pages */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="services"                        element={<ServicesPage />} />
              <Route path="services/:code"                  element={<ServiceDetailPage />} />
              <Route path="actualites"                      element={<NewsListPage />} />
              <Route path="actualites/:id"                  element={<ArticlePage />} />
              <Route path="documentation"                   element={<DocumentationPage />} />
              <Route path="tracker"                         element={<TrackerPage />} />
              <Route path="contact"                         element={<ContactPage />} />

              {/* Institution sub-pages */}
              <Route path="institution"                     element={<Navigate to="/institution/missions" replace />} />
              <Route path="institution/mot-du-ministre"     element={<MotMinistrePage />} />
              <Route path="institution/missions"            element={<MissionsPage />} />
              <Route path="institution/structure"           element={<StructurePage />} />
              <Route path="institution/organismes"          element={<OrganismesPage />} />
              <Route path="institution/projets"             element={<ProjetsPage />} />
              {/* 404 fallback */}
              <Route path="*"                               element={<NotFoundPage />} />
            </Route>

            {/* Internal workspaces — lazy-loaded, no public layout */}
            <Route path="admin/*" element={<ProtectedRoute><Suspense fallback={<WorkspaceFallback />}><AdminPage /></Suspense></ProtectedRoute>} />
            <Route path="agent/*" element={<Suspense fallback={<WorkspaceFallback />}><AgentPage /></Suspense>} />
            <Route path="bi/*"    element={<Suspense fallback={<WorkspaceFallback />}><BIPage /></Suspense>} />
            <Route path="connexion" element={<Suspense fallback={<WorkspaceFallback />}><LoginPage /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </QueryClientProvider>
  );
}
