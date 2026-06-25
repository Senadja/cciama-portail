/**
 * API Client for CCIAMA Portal CMS & Media Services
 */

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface PlatformSettingsDict {
  logo: string;
  site_name: string;
  favicon: string;
  modal_duration: number;
  marquee_speed: number;
  footer_address: string;
  footer_phones: string;
  footer_email: string;
  footer_socials: Array<{ platform: string; url: string }>;
  meta_desc: string;
}

export interface PlatformSettingRaw {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'number' | 'boolean' | 'json';
  label: string;
  description?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface HomePageContent {
  id: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDesc: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImage: string;
  missionEye: string;
  missionTitle: string;
  missionDesc: string;
  stats: Array<{ num: string; sup: string; label: string }>;
  updatedBy: string;
  updatedAt: string;
}

export interface MinisterWordContent {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  name: string;
  role: string;
  portrait: string;
  welcomeTitle: string;
  para1: string;
  para2: string;
  quote: string;
  para3: string;
  bioFile: string;
  updatedBy: string;
  updatedAt: string;
}

export interface InstitutionMission {
  id: string;
  num: string;
  title: string;
  desc: string;
  orderIndex: number;
  updatedBy: string;
  updatedAt: string;
}

export interface OrganigramNode {
  id: string;
  role: string;
  name: string;
  parentId: string | null;
  orderIndex: number;
  updatedBy: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  type: 'image' | 'document' | 'logo' | 'video';
  altText: string | null;
  uploadedBy: string;
  uploadedAt: string;
  url: string; // Presigned URL
}

export interface ServiceScreen {
  name: string;
  description: string;
}

export interface ServiceDataField {
  name: string;
  type: string;
  source: string;
}

export interface ServiceIntegration {
  name: string;
  description: string;
}

export interface CatalogueService {
  id: string;
  code: string;
  title: string;
  tagline: string;
  familyId: string;
  beneficiaries: string;
  channels: string;
  targetDelay: string;
  phase: string;
  description: string;
  processSteps: string[];
  screens: ServiceScreen[];
  dataFields: ServiceDataField[];
  integrations: ServiceIntegration[];
  kpis: string[];
  businessRules: string[];
  orderIndex: number;
  published: boolean;
  updatedBy: string;
  updatedAt: string;
  family?: ServiceFamily;
}

export interface ServiceFamily {
  id: string;
  code: string;
  name: string;
  description: string;
  orderIndex: number;
  updatedBy: string;
  updatedAt: string;
  services?: CatalogueService[];
}

export type ServiceUpsert = Omit<CatalogueService, 'id' | 'updatedBy' | 'updatedAt' | 'family' | 'orderIndex' | 'published'>
  & Partial<Pick<CatalogueService, 'orderIndex' | 'published'>>;

// === Phase 2 — Contenus éditoriaux ===
interface BaseEntity {
  id: string;
  orderIndex: number;
  updatedBy: string;
  updatedAt: string;
}

export interface NewsArticle extends BaseEntity {
  cat: string;
  catLabel: string;
  date: string;
  dateShort: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  readTime: string;
  image?: string | null;
  published: boolean;
}

export interface OfficialDoc extends BaseEntity {
  type: string;
  typeLabel: string;
  ref: string;
  date: string;
  title: string;
  summary: string;
  pages: number;
  size: string;
  fileUrl?: string | null;
  published: boolean;
}

export interface ProjectItem extends BaseEntity {
  status: string;
  statusLabel: string;
  title: string;
  period: string;
  budget: string;
  partner: string;
  progress: number;
  desc: string;
  published: boolean;
}

export interface OrganismItem extends BaseEntity {
  kind: string; // 'organism' | 'partner'
  name: string;
  short: string;
  url: string;
  color: string;
  mark: string;
  published: boolean;
}

export interface FlashItem extends BaseEntity {
  severity: string;
  label: string;
  text: string;
  active: boolean;
}

export interface QuickActionItem extends BaseEntity {
  ic: string;
  title: string;
  desc: string;
  link: string;
  published: boolean;
}

export type Upsert<T extends BaseEntity> = Partial<Omit<T, 'id' | 'updatedBy' | 'updatedAt'>>;

// Helpers for API requests
async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    let errMsg = `Request failed: ${res.statusText}`;
    try {
      const parsed = JSON.parse(errText);
      errMsg = parsed.message || errMsg;
    } catch {
      // Keep statusText fallback
    }
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Public platform settings
  getPublicSettings: () => fetchJson<PlatformSettingsDict>('/settings/public'),

  // Admin platform settings
  getAdminSettings: () => fetchJson<PlatformSettingRaw[]>('/admin/settings'),
  updateSetting: (key: string, value: string) => 
    fetchJson<{ success: boolean; setting: PlatformSettingRaw }>(`/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  // Home Page Content
  getHomeContent: () => fetchJson<HomePageContent>('/content/home'),
  updateHomeContent: (data: Omit<HomePageContent, 'id' | 'updatedBy' | 'updatedAt'>) => 
    fetchJson<{ success: boolean; content: HomePageContent }>('/content/home', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Minister Content
  getMinisterContent: () => fetchJson<MinisterWordContent>('/content/minister'),
  updateMinisterContent: (data: Omit<MinisterWordContent, 'id' | 'updatedBy' | 'updatedAt'>) => 
    fetchJson<{ success: boolean; content: MinisterWordContent }>('/content/minister', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Missions CMS CRUD
  getMissions: () => fetchJson<InstitutionMission[]>('/content/missions'),
  createMission: (data: Omit<InstitutionMission, 'id' | 'updatedBy' | 'updatedAt'>) =>
    fetchJson<InstitutionMission>('/content/missions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMission: (id: string, data: Partial<Omit<InstitutionMission, 'id' | 'updatedBy' | 'updatedAt'>>) =>
    fetchJson<InstitutionMission>(`/content/missions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteMission: (id: string) =>
    fetchJson<{ success: boolean }>(`/content/missions/${id}`, {
      method: 'DELETE',
    }),
  reorderMissions: (ids: string[]) =>
    fetchJson<{ success: boolean }>('/content/missions/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    }),

  // Organigram Nodes CRUD
  getOrganigram: () => fetchJson<OrganigramNode[]>('/content/organigram'),
  getChildrenCount: (id: string) => fetchJson<{ count: number }>(`/content/organigram/${id}/children-count`),
  createOrganigramNode: (data: Omit<OrganigramNode, 'id' | 'updatedBy' | 'updatedAt'>) =>
    fetchJson<OrganigramNode>('/content/organigram', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrganigramNode: (id: string, data: Partial<Omit<OrganigramNode, 'id' | 'updatedBy' | 'updatedAt'>>) =>
    fetchJson<OrganigramNode>(`/content/organigram/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteOrganigramNode: (id: string) =>
    fetchJson<{ success: boolean; deletedChildrenCount: number }>(`/content/organigram/${id}`, {
      method: 'DELETE',
    }),

  // Services Catalogue CMS
  getServiceCatalogue: () => fetchJson<ServiceFamily[]>('/content/services'),
  getServiceFamilies: () => fetchJson<ServiceFamily[]>('/content/services/families'),
  getServiceByCode: (code: string) => fetchJson<CatalogueService>(`/content/services/code/${code}`),
  getServiceById: (id: string) => fetchJson<CatalogueService>(`/content/services/${id}`),
  createService: (data: ServiceUpsert) =>
    fetchJson<CatalogueService>('/content/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: Partial<ServiceUpsert>) =>
    fetchJson<CatalogueService>(`/content/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    fetchJson<{ success: boolean }>(`/content/services/${id}`, {
      method: 'DELETE',
    }),
  reorderServices: (ids: string[]) =>
    fetchJson<{ success: boolean }>('/content/services/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    }),
  updateServiceFamily: (id: string, data: { name?: string; description?: string; orderIndex?: number }) =>
    fetchJson<ServiceFamily>(`/content/services/families/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Media Management
  getAllMedia: (type?: string) => fetchJson<MediaAsset[]>(`/admin/media${type ? `?type=${type}` : ''}`),
  deleteMedia: (id: string) => fetchJson<{ success: boolean; message: string }>(`/admin/media/${id}`, { method: 'DELETE' }),
  uploadMedia: async (file: File, type: 'image' | 'document' | 'logo' | 'video', altText?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    let url = `${API_BASE}/admin/media/upload?type=${type}`;
    if (altText) {
      url += `&altText=${encodeURIComponent(altText)}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = `Upload failed: ${res.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        errMsg = parsed.message || errMsg;
      } catch {
        // Fallback
      }
      throw new Error(errMsg);
    }

    return res.json() as Promise<{ success: boolean; media: MediaAsset; url: string }>;
  }
};

// === Phase 2 — Générique CRUD pour les collections éditoriales ===
function crud<T extends BaseEntity>(base: string) {
  return {
    list: () => fetchJson<T[]>(base),
    create: (data: Upsert<T>) => fetchJson<T>(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Upsert<T>) => fetchJson<T>(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => fetchJson<{ success: boolean }>(`${base}/${id}`, { method: 'DELETE' }),
    reorder: (ids: string[]) => fetchJson<{ success: boolean }>(`${base}/reorder`, { method: 'PUT', body: JSON.stringify({ ids }) }),
  };
}

export const collections = {
  news: crud<NewsArticle>('/content/news'),
  documents: crud<OfficialDoc>('/content/documents'),
  projects: crud<ProjectItem>('/content/projects'),
  organisms: crud<OrganismItem>('/content/organisms'),
  flash: crud<FlashItem>('/content/flash'),
  quickActions: crud<QuickActionItem>('/content/quick-actions'),
};

export type CollectionKey = keyof typeof collections;
