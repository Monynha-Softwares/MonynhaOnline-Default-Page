import en from './translations/en.json';
import {
  getLanguage,
  getSupportedLanguageCodes,
  type LanguageCode,
} from '@/flyweights/LanguageFlyweight';

export type Language = LanguageCode;
export const supportedLanguages = getSupportedLanguageCodes();
export type TranslationDictionary = typeof en;
export type TranslationKey = keyof TranslationDictionary;

export const fallbackLanguage: Language = getLanguage('en').code;
export const languageStorageKey = 'monynha-language';
