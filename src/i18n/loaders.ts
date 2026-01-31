import type { Language, TranslationDictionary } from './types';

type TranslationLoader = () => Promise<{ default: TranslationDictionary }>;

const translationModules = import.meta.glob<TranslationLoader>('./translations/*.json');

export const loadTranslations = async (language: Language): Promise<TranslationDictionary> => {
  const loader = translationModules[`./translations/${language}.json`];
  if (!loader) {
    throw new Error(`Missing translations for language: ${language}`);
  }
  const module = await loader();
  return module.default;
};
