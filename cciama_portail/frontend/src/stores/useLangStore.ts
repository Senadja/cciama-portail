import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyGoogleTranslation } from '@/lib/translate';

type Lang = 'FR' | 'AR' | 'EN';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: 'FR',
      setLang: (lang) => {
        if (lang === get().lang) return;
        set({ lang });
        // Traduit toute la page via le widget Google (recharge la page).
        applyGoogleTranslation(lang);
      },
    }),
    { name: 'cciama-lang' }
  )
);
