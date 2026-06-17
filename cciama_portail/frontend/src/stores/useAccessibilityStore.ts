import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Contrast = 'normal' | 'high';
type TextSize = 'base' | 'large' | 'xlarge';

interface AccessibilityState {
  contrast: Contrast;
  textSize: TextSize;
  setContrast: (c: Contrast) => void;
  setTextSize: (s: TextSize) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      contrast: 'normal',
      textSize: 'base',
      setContrast: (contrast) => {
        document.documentElement.setAttribute('data-contrast', contrast);
        set({ contrast });
      },
      setTextSize: (textSize) => {
        document.documentElement.setAttribute('data-text', textSize);
        set({ textSize });
      },
    }),
    {
      name: 'cciama-accessibility',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-contrast', state.contrast);
          document.documentElement.setAttribute('data-text', state.textSize);
        }
      },
    }
  )
);
