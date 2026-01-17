import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  Language,
  TranslationKey,
  TranslationDictionary,
  loadTranslations,
  resolveLanguage,
  supportedLanguages,
} from "@/i18n";

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    return resolveLanguage(stored);
  }

  const browserLanguages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  return resolveLanguage(browserLanguages?.[0]);
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [dictionary, setDictionary] = useState<TranslationDictionary | null>(null);
  const [fallbackDictionary, setFallbackDictionary] = useState<TranslationDictionary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadLanguage = async () => {
      setIsLoading(true);
      const [languageDictionary, englishDictionary] = await Promise.all([
        loadTranslations(currentLanguage),
        loadTranslations("en"),
      ]);

      if (isActive) {
        setDictionary(languageDictionary);
        setFallbackDictionary(englishDictionary);
        setIsLoading(false);
      }
    };

    loadLanguage();

    return () => {
      isActive = false;
    };
  }, [currentLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const t = useCallback(
    (key: TranslationKey): string => {
      return dictionary?.[key] ?? fallbackDictionary?.[key] ?? key.toString();
    },
    [dictionary, fallbackDictionary]
  );

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  const languages = useMemo(() => supportedLanguages, []);

  return {
    currentLanguage,
    changeLanguage,
    t,
    languages,
    isLoading,
  };
};
