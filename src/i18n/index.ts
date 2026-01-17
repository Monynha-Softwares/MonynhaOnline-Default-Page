import type en from "./locales/en.json";

export const supportedLanguages = ["pt", "en", "fr", "es"] as const;
export type Language = (typeof supportedLanguages)[number];

export type TranslationDictionary = typeof en;
export type TranslationKey = keyof TranslationDictionary;

export const languageLabels: Record<Language, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
  es: "Español",
};

export const LANGUAGE_STORAGE_KEY = "monynha-language";
export const DEFAULT_LANGUAGE: Language = "pt";

export const loadTranslations = async (language: Language): Promise<TranslationDictionary> => {
  switch (language) {
    case "pt":
      return (await import("./locales/pt.json")).default;
    case "fr":
      return (await import("./locales/fr.json")).default;
    case "es":
      return (await import("./locales/es.json")).default;
    case "en":
    default:
      return (await import("./locales/en.json")).default;
  }
};

export const resolveLanguage = (input: string | null | undefined): Language => {
  if (!input) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = input.toLowerCase();
  const match = supportedLanguages.find((language) => normalized.startsWith(language));

  return match ?? DEFAULT_LANGUAGE;
};
