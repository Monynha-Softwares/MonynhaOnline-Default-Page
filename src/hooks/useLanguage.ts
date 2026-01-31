import { useCallback, useEffect, useState } from 'react';
import { loadTranslations } from '@/i18n/loaders';
import {
  fallbackLanguage,
  languageStorageKey,
  type Language,
  type TranslationDictionary,
  type TranslationKey
} from '@/i18n/types';
import { getSupportedLanguageCodes } from '@/flyweights/LanguageFlyweight';

export const useLanguage = () => {
  const normalizeLanguage = (candidate: string | null): Language | null => {
    if (!candidate) return null;
    const languageCode = candidate.toLowerCase().split('-')[0];
    return getSupportedLanguageCodes().includes(languageCode as Language)
      ? (languageCode as Language)
      : null;
  };

  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return fallbackLanguage;

    const saved = normalizeLanguage(localStorage.getItem(languageStorageKey));
    if (saved) return saved;

    const documentLanguage = normalizeLanguage(document.documentElement.lang);
    if (documentLanguage) return documentLanguage;

    const browserLanguage = normalizeLanguage(navigator.language);
    if (browserLanguage) return browserLanguage;

    return fallbackLanguage;
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [dictionary, setDictionary] = useState<TranslationDictionary | null>(null);
  const [fallbackDictionary, setFallbackDictionary] =
    useState<TranslationDictionary | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(languageStorageKey, currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    let isActive = true;
    loadTranslations(fallbackLanguage)
      .then((translations) => {
        if (isActive) setFallbackDictionary(translations);
      })
      .catch(() => {
        if (isActive) setFallbackDictionary(null);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    loadTranslations(currentLanguage)
      .then((translations) => {
        if (isActive) setDictionary(translations);
      })
      .catch(() => {
        if (isActive) setDictionary(null);
      });

    return () => {
      isActive = false;
    };
  }, [currentLanguage]);

  const t = useCallback(
    (key: TranslationKey): string => {
      return dictionary?.[key] ?? fallbackDictionary?.[key] ?? key;
    },
    [dictionary, fallbackDictionary]
  );

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages: getSupportedLanguageCodes()
  };
};
