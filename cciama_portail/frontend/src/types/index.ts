export interface NewsItem {
  id: string;
  cat: string;
  catLabel: string;
  date: string;
  dateShort: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
}

export interface Service {
  n: string;
  title: string;
  desc: string;
}

export interface QuickAction {
  ic: string;
  title: string;
  desc: string;
}

export interface DossierStep {
  state: 'done' | 'current' | 'pending' | 'rejected';
  title: string;
  desc: string;
  date: string;
}

export interface Dossier {
  type: string;
  ref: string;
  deposit: string;
  service: string;
  deadline: string;
  status: 'progress' | 'review' | 'done' | 'rejected';
  statusLabel: string;
  rejectionReason?: string;
  steps: DossierStep[];
}

export interface OfficialDocument {
  id: string;
  type: string;
  typeLabel: string;
  ref: string;
  date: string;
  title: string;
  summary: string;
  pages: number;
  size: string;
}

export interface Organism {
  name: string;
  short: string;
  url: string;
  color: string;
  mark: string;
}

export interface Project {
  id: string;
  status: 'ongoing' | 'completed' | 'planned';
  statusLabel: string;
  title: string;
  period: string;
  budget: string;
  partner: string;
  progress: number;
  desc: string;
}

export interface FlashInfo {
  severity: 'info' | 'warning' | 'danger' | 'success';
  label: string;
  text: string;
}

export interface AgentDossier {
  id: string;
  type: string;
  citoyen: string;
  deposit: string;
  deadline: string;
  priority: 'normal' | 'high' | 'low';
  priorityLabel: string;
  current: string;
  daysLeft: number;
  age: number;
  flow: AgentFlowStep[];
  docs: AgentDoc[];
}

export interface AgentFlowStep {
  svc: string;
  state: 'done' | 'current' | 'pending';
  agent?: string;
  date?: string;
}

export interface AgentDoc {
  name: string;
  size: string;
  ok: boolean;
}
