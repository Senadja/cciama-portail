/**
 * API Client for CCIAMA Portal CMS & Media Services
 */

// VITE_API_URL prime si elle est definie (image Docker, autre hebergeur).
// Sinon : serveur de dev local, ou chemin relatif en build de prod — le
// rewrite de vercel.json proxifie /api/v1/* vers le backend, en same-origin.
import { useAuthStore, type User } from '@/stores/useAuthStore';

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api/v1' : '/api/v1');

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
  date: string; // ISO 8601
  title: string;
  excerpt: string;
  body: string;
  author: string;
  readTime: string;
  images: string[]; // la premiere sert de vignette
  published: boolean;
}

export interface OfficialDoc extends BaseEntity {
  type: string;
  ref: string;
  date: string; // ISO 8601
  title: string;
  summary: string;
  pages: number;
  size: string;
  fileUrl?: string | null;
  published: boolean;
}

export interface ProjectItem extends BaseEntity {
  status: string;
  type: string;
  title: string;
  startYear: number;
  endYear: number | null;
  partner: string;
  progress: number;
  desc: string;
  published: boolean;
}

export interface OrganismItem extends BaseEntity {
  name: string;
  short: string;
  url: string;
  logo?: string | null;
  published: boolean;
}

export interface FlashItem extends BaseEntity {
  severity: string;
  text: string;
  startsAt: string | null; // ISO 8601, vide = des maintenant
  endsAt: string | null; // ISO 8601, vide = sans fin
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
/** En-tête d'authentification, si une session est ouverte. */
function authHeader(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Session expirée ou compte désactivé : on la ferme et on renvoie vers la connexion. */
function handleUnauthorized(res: Response, hadToken: boolean) {
  if (res.status !== 401 || !hadToken) return;
  useAuthStore.getState().logout();
  if (!window.location.pathname.startsWith('/connexion')) window.location.assign('/connexion');
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const auth = authHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...auth,
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    handleUnauthorized(res, 'Authorization' in auth);
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

    const auth = authHeader();
    const res = await fetch(url, {
      method: 'POST',
      headers: auth,
      body: formData,
    });

    if (!res.ok) {
      handleUnauthorized(res, 'Authorization' in auth);
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

// === Comptes, rôles et journal d'activité ===
export interface AuthSession {
  access_token: string;
  user: User;
}

export interface NewUser {
  lastName: string;
  firstName: string;
  matricule: string;
  role: User['role'];
  temporaryPassword: string;
}

export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  updatedBy: string;
  updatedAt: string;
}

const post = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });

export const authApi = {
  /** Connexion par e-mail ou par matricule. */
  login: (identifier: string, password: string) => fetchJson<AuthSession>('/auth/login', post({ identifier, password })),
  me: () => fetchJson<User>('/auth/me'),
  /** Première connexion : e-mail + mot de passe définitif. */
  completeAccount: (email: string, newPassword: string) =>
    fetchJson<AuthSession>('/auth/complete-account', post({ email, newPassword })),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchJson<{ success: boolean }>('/auth/change-password', post({ currentPassword, newPassword })),
};

export const usersApi = {
  list: () => fetchJson<User[]>('/admin/users'),
  create: (data: NewUser) => fetchJson<User>('/admin/users', post(data)),
  update: (id: string, data: Partial<Omit<NewUser, 'temporaryPassword'>> & { isActive?: boolean }) =>
    fetchJson<User>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  resetPassword: (id: string, temporaryPassword: string) =>
    fetchJson<{ success: boolean }>(`/admin/users/${id}/reset-password`, post({ temporaryPassword })),
  remove: (id: string) => fetchJson<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' }),
};

export const logsApi = {
  list: (page = 1, pageSize = 30) =>
    fetchJson<{ items: AuditEntry[]; total: number; page: number; pageSize: number }>(
      `/admin/logs?page=${page}&pageSize=${pageSize}`,
    ),
};
