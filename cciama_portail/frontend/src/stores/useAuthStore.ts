import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN' | 'EDITOR';

export interface User {
  id: string;
  email: string | null;
  matricule: string | null;
  role: Role;
  firstName?: string | null;
  lastName?: string | null;
  isActive?: boolean;
  /** Mot de passe provisoire : le compte doit être finalisé avant tout accès à la console. */
  mustChangePassword: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'cciama-auth',
    }
  )
);

/** « Prénom Nom », à défaut l'e-mail ou le matricule. */
export function accountName(u: Pick<User, 'firstName' | 'lastName' | 'email' | 'matricule'> | null | undefined): string {
  if (!u) return '';
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || u.matricule || 'Utilisateur';
}
