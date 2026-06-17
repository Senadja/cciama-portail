import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Lang = 'FR' | 'AR' | 'EN';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'FR',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'cciama-lang' }
  )
);
