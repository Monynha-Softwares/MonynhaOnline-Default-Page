import en from './translations/en.json';

export const supportedLanguages = ['pt', 'en', 'fr', 'es'] as const;
export type Language = (typeof supportedLanguages)[number];
export type TranslationDictionary = typeof en;
export type TranslationKey = keyof TranslationDictionary;

export const fallbackLanguage: Language = 'en';
export const languageStorageKey = 'monynha-language';
