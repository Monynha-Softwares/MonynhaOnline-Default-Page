import type { Language, TranslationDictionary } from './types';

const loaders: Record<Language, () => Promise<TranslationDictionary>> = {
  pt: async () => (await import('./translations/pt.json')).default,
  en: async () => (await import('./translations/en.json')).default,
  fr: async () => (await import('./translations/fr.json')).default,
  es: async () => (await import('./translations/es.json')).default
};

export const loadTranslations = (language: Language) => loaders[language]();
