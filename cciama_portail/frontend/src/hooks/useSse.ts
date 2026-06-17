import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { usePlatformSettings } from './useCms';

export function useSse() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: settings } = usePlatformSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateReason, setUpdateReason] = useState('');

  // Check if we are in an admin/internal workspace
  const isInternal = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/agent') || 
    location.pathname.startsWith('/bi');

  useEffect(() => {
    // Determine the SSE URL
    const sseUrl = 'http://localhost:3000/api/v1/content/sse';
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { entityType } = payload;

        // Admins/agents should get cache invalidation instantly without the modal
        if (isInternal) {
          queryClient.invalidateQueries({ queryKey: getQueryKey(entityType) });
          return;
        }

        // Visitors get the modal + progress experience!
        const durationSec = settings?.modal_duration || 5;
        setUpdateReason(getReasonText(entityType));
        setProgress(0);
        setModalOpen(true);

        const startTime = Date.now();
        const endTime = startTime + durationSec * 1000;

        const interval = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          const total = endTime - startTime;
          const pct = Math.min((elapsed / total) * 100, 100);

          setProgress(pct);

          if (pct >= 100) {
            clearInterval(interval);
            // Refresh data from the backend
            queryClient.invalidateQueries();
            // Close the modal
            setTimeout(() => {
              setModalOpen(false);
            }, 500); // Small delay for smooth exit
          }
        }, 50);

        return () => clearInterval(interval);
      } catch (err) {
        console.error('Error handling SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection error. Retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, isInternal, settings?.modal_duration]);

  return { modalOpen, progress, updateReason };
}

function getQueryKey(entityType: string): string[] {
  switch (entityType) {
    case 'platform_setting':
      return ['platformSettings'];
    case 'home_page_content':
      return ['homeContent'];
    case 'minister_word_content':
      return ['ministerContent'];
    case 'institution_mission':
      return ['missions'];
    case 'organigram_node':
      return ['organigram'];
    case 'service':
    case 'service_family':
      return ['serviceCatalogue'];
    case 'news_article':
      return ['news'];
    case 'official_document':
      return ['documents'];
    case 'project':
      return ['projects'];
    case 'organism':
      return ['organisms'];
    case 'flash_info':
      return ['flash'];
    case 'quick_action':
      return ['quickActions'];
    default:
      return [];
  }
}

function getReasonText(entityType: string): string {
  switch (entityType) {
    case 'platform_setting':
      return 'Mise à jour des paramètres système et de la charte graphique…';
    case 'home_page_content':
      return "Actualisation de la page d'accueil…";
    case 'minister_word_content':
      return "Mise à jour du mot de l'administrateur…";
    case 'institution_mission':
      return 'Actualisation des missions consulaires…';
    case 'organigram_node':
      return "Mise à jour de la structure d'organigramme…";
    case 'service':
    case 'service_family':
      return 'Actualisation du catalogue des services…';
    case 'news_article':
      return 'Publication d\'une actualité…';
    case 'official_document':
      return 'Mise à jour de la documentation officielle…';
    case 'project':
      return 'Actualisation des projets et programmes…';
    case 'organism':
      return 'Mise à jour des organismes et partenaires…';
    case 'flash_info':
      return 'Mise à jour de la bande flash…';
    case 'quick_action':
      return 'Mise à jour des accès rapides…';
    default:
      return 'Actualisation du contenu en temps réel…';
  }
}
