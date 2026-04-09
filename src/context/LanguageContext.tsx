'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
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
  lang:           'en',
  t:              en,
  toggleLanguage: () => {},
});

/* ─── Provider ───────────────────────────────────────────────────────── */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggleLanguage = useCallback(
    () => setLang((l) => (l === 'en' ? 'zh' : 'en')),
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
