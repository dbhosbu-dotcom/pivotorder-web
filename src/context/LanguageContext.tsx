'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang, Dict } from '@/locales/types';
import { en, zh } from '@/locales';

/* ─── Dictionaries map ───────────────────────────────────────────────── */
const DICTS: Record<Lang, Dict> = { en, zh };

/* ─── Context shape ──────────────────────────────────────────────────── */
interface LangCtx {
  lang:           Lang;
  t:              Dict;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LangCtx>({
  lang:           'zh',
  t:              zh,
  toggleLanguage: () => {},
});

/* ─── Provider ───────────────────────────────────────────────────────── */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const stored = window.localStorage.getItem('pivotorder-lang');
    if (stored === 'en' || stored === 'zh') {
      setLang(stored);
    }
  }, []);

  const toggleLanguage = useCallback(
    () =>
      setLang((current) => {
        const next = current === 'en' ? 'zh' : 'en';
        window.localStorage.setItem('pivotorder-lang', next);
        return next;
      }),
    [],
  );

  return (
    <LanguageContext.Provider value={{ lang, t: DICTS[lang], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────────────── */
export function useLanguage() {
  return useContext(LanguageContext);
}

/** Convenience alias — returns the full typed dictionary for the current language */
export function useT() {
  return useContext(LanguageContext).t;
}
