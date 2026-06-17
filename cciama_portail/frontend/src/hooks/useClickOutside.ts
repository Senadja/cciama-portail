import { useEffect, useRef, type RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(handler: () => void): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [handler]);
  return ref;
}
