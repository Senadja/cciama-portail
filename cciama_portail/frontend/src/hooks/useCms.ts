import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, collections } from '@/lib/api';
import type { HomePageContent, MinisterWordContent, InstitutionMission, OrganigramNode, ServiceUpsert } from '@/lib/api';

export function usePlatformSettings() {
  return useQuery({
    queryKey: ['platformSettings', 'public'],
    queryFn: () => api.getPublicSettings(),
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['platformSettings', 'admin'],
    queryFn: () => api.getAdminSettings(),
  });
}

export function useUpdateSettingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => api.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platformSettings'] });
    },
  });
}

export function useHomeContent() {
  return useQuery({
    queryKey: ['homeContent'],
    queryFn: () => api.getHomeContent(),
  });
}

export function useUpdateHomeContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<HomePageContent, 'id' | 'updatedBy' | 'updatedAt'>) => api.updateHomeContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
    },
  });
}

export function useMinisterContent() {
  return useQuery({
    queryKey: ['ministerContent'],
    queryFn: () => api.getMinisterContent(),
  });
}

export function useUpdateMinisterContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MinisterWordContent, 'id' | 'updatedBy' | 'updatedAt'>) => api.updateMinisterContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministerContent'] });
    },
  });
}

export function useMissions() {
  return useQuery({
    queryKey: ['missions'],
    queryFn: () => api.getMissions(),
  });
}

export function useCreateMissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<InstitutionMission, 'id' | 'updatedBy' | 'updatedAt'>) => api.createMission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useUpdateMissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<InstitutionMission, 'id' | 'updatedBy' | 'updatedAt'>> }) =>
      api.updateMission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useDeleteMissionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteMission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useReorderMissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => api.reorderMissions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
}

export function useOrganigram() {
  return useQuery({
    queryKey: ['organigram'],
    queryFn: () => api.getOrganigram(),
  });
}

export function useCreateOrganigramNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<OrganigramNode, 'id' | 'updatedBy' | 'updatedAt'>) => api.createOrganigramNode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organigram'] });
    },
  });
}

export function useUpdateOrganigramNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<OrganigramNode, 'id' | 'updatedBy' | 'updatedAt'>> }) =>
      api.updateOrganigramNode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organigram'] });
    },
  });
}

export function useDeleteOrganigramNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteOrganigramNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organigram'] });
    },
  });
}

export function useServiceCatalogue() {
  return useQuery({
    queryKey: ['serviceCatalogue'],
    queryFn: () => api.getServiceCatalogue(),
  });
}

export function useServiceFamilies() {
  return useQuery({
    queryKey: ['serviceFamilies'],
    queryFn: () => api.getServiceFamilies(),
  });
}

export function useServiceByCode(code: string | undefined) {
  return useQuery({
    queryKey: ['service', 'code', code],
    queryFn: () => api.getServiceByCode(code as string),
    enabled: !!code,
  });
}

function invalidateServices(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['serviceCatalogue'] });
  queryClient.invalidateQueries({ queryKey: ['service'] });
}

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ServiceUpsert) => api.createService(data),
    onSuccess: () => invalidateServices(queryClient),
  });
}

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceUpsert> }) => api.updateService(id, data),
    onSuccess: () => invalidateServices(queryClient),
  });
}

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteService(id),
    onSuccess: () => invalidateServices(queryClient),
  });
}

export function useUpdateServiceFamilyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      api.updateServiceFamily(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCatalogue'] });
      queryClient.invalidateQueries({ queryKey: ['serviceFamilies'] });
    },
  });
}

// === Phase 2 — Lectures publiques des collections éditoriales ===
export const useNews = () => useQuery({ queryKey: ['news'], queryFn: collections.news.list });
export const useDocuments = () => useQuery({ queryKey: ['documents'], queryFn: collections.documents.list });
export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: collections.projects.list });
export const useOrganisms = () => useQuery({ queryKey: ['organisms'], queryFn: collections.organisms.list });
export const useFlashInfos = () => useQuery({ queryKey: ['flash'], queryFn: collections.flash.list });
export const useQuickActions = () => useQuery({ queryKey: ['quickActions'], queryFn: collections.quickActions.list });

export function useAllMedia(type?: string) {
  return useQuery({
    queryKey: ['media', type || 'all'],
    queryFn: () => api.getAllMedia(type),
  });
}

export function useUploadMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, type, altText }: { file: File; type: 'image' | 'document' | 'logo' | 'video'; altText?: string }) =>
      api.uploadMedia(file, type, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
